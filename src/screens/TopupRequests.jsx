import "./users.css";
import React, { useEffect, useState } from "react";
import Close from "@mui/icons-material/Close";
import Table from "../components/table/Table";
import { Modal, Box, Typography, Grid, Button } from "@mui/material";
import {
  collection,
  getDocs,
  getDoc,
  query,
  updateDoc,
  doc,
  where,
} from "firebase/firestore";
import { database } from "../db/firebase";
import Swal from "sweetalert2";

const style = {
  p: 4,
  top: "50%",
  width: 100,
  left: "50%",
  boxShadow: 24,
  position: "absolute",
  bgcolor: "background.paper",
  transform: "translate(-50%, -50%)",
};

const customerTableHead = [
  "Image",
  "Created Date",
  "Email",
  "Amount",
  "Status",
  "Action"
];

const renderHead = (item, index) => <th key={index}>{item}</th>;

const renderBody = (item, index, handleOpen, handleAccept, handleReject, handleClose, open,) => {
  return (
    <tr
      key={index}
      className="table-row"
      style={{ height: "60px", cursor: "pointer", backgroundColor: index % 2 !== 0 && "#fafafa" }}
    >
      <td open={open} onClose={handleClose}>
        <img
          alt="user"
          onClick={() => handleOpen(item)}
          width={40}
          height={40}
          style={{
            borderRadius: "100px",
            marginTop: "10px",
            marginLeft: "10px",
          }}
          src={
            item.userImg ||
            item.image ||
            "https://freepngimg.com/thumb/google/66726-customer-account-google-service-button-search-logo.png"
          }
        />
      </td>
      <td>{new Date(item.createdAt).toDateString()}</td>
      <td>{item?.email}</td>
      <td>{item?.amount}</td>
      <td>{item?.status}</td>
        {item?.status === 'Pending' ? (
      <td>
          <div style={{
            display: "flex",
            justifyContent: "center",
            marginTop: "20px",
            gap: 20,
          }}>
            <Button
              variant="contained"
              className="verifiedBut"
              onClick={() => handleAccept(item, "Released")}
            >
              Release
            </Button>
            <Button
              variant="contained"
              className="deleteBut"
              onClick={() => handleReject(item, "Rejected")}
            >
              Reject
            </Button>
          </div>
      </td>
        ) : (
        <td>{item?.status}</td>
        )}
    </tr>
  );
};

const TopupRequests = () => {
  const [open, setOpen] = useState(false);
  const [topup, setTopup] = useState(null);
  const [topupList, setTopupList] = useState([]);

  useEffect(() => {
    const fetchTopup = async () => {
      const q = query(collection(database, "topups"), where('status', '==', 'Pending'));
      const querySnapshot = await getDocs(q);
      const topupListList = [];
      querySnapshot.forEach((doc) => {
        topupListList.push({ ...doc.data(), id: doc.id });
      });
      setTopupList(topupListList);
    };

    fetchTopup();
  }, []);

  const handleOpen = (item) => {
    setOpen(true);
    setTopup(item);
  };

  const handleClose = () => setOpen(false);

  const handleAccept = async (item) => {
    console.log("🚀 ~ handleAccept ~ item:", item)
    const topupRef = doc(database, "topups", item.id);
    const userRef = doc(database, "users", item.uid);
  
    try {
      await updateDoc(topupRef, { status: "Released" });
  
      const userDoc = await getDoc(userRef);
      if (userDoc.exists()) {
        const userData = userDoc.data();
        const currentPoints = userData.points || 0;
        const newPoints = currentPoints + (item.amount || 0);
  
        await updateDoc(userRef, { points: newPoints });
      } else {
        throw new Error("User not found");
      }

      setTopupList(topupList.map((topupItem) =>
        topupItem.id === item.id ? { ...topupItem, status: "Released" } : topupItem
      ));
  
      setOpen(false);
      Swal.fire("Success!", "Topup has been successfully accepted and is now Released.", "success");
    } catch (error) {
      console.error("Error updating status:", error);
      Swal.fire("Error", "Failed to update status.", "error");
    }
  };
  
  const handleReject = async (item) => {
    const topupRef = doc(database, "topups", item.id);
  
    try {
      await updateDoc(topupRef, { status: "Rejected" });
  
      setTopupList(topupList.map((topupItem) =>
        topupItem.id === item.id ? { ...topupItem, status: "Rejected" } : topupItem
      ));
  
      setOpen(false);
      Swal.fire("Rejected", "Topup has been rejected successfully.", "error");
    } catch (error) {
      console.error("Error updating status:", error);
      Swal.fire("Error", "Failed to update status.", "error");
    }
  };
  
  return (
    <div>
      <div className="row">
        <div className="col-12">
          <h2 className="page-header">Topup Requests</h2>
          <div className="card">
            <div className="card__body">
              <Table
                limit="10"
                headData={customerTableHead}
                renderHead={(item, index) => renderHead(item, index)}
                bodyData={topupList}
                renderBody={(item, index) =>
                  renderBody(item, index, handleOpen, handleAccept, handleReject)
                }
              />
            </div>
          </div>
        </div>
      </div>
      <Modal
        open={open}
        onClose={handleClose}
        aria-labelledby="modal-modal-title"
        aria-describedby="modal-modal-description"
      >
        <Box sx={style} id="modal-popup" style={{width: '500px'}}>
          <Grid item display="flex" justifyContent={"space-between"}></Grid>
          {topup && (
            <Box id="vendor-wrapper">
              <Grid item id="top-modal">
                <div className="blank"></div>
                <div className="center">
                  <img
                    src={
                      topup.image ||
                      "https://freepngimg.com/thumb/google/66726-customer-account-google-service-button-search-logo.png"
                    }
                    style={{
                      width: "250px",
                      height: "350px",
                      objectFit: "contain",
                      borderRadius: "10px",
                    }}
                    alt="users profile"
                    id="topup-image"
                  />
                  <Typography
                    variant="h6"
                    component="h2"
                    style={{ marginTop: 10 }}
                  >
                    Points: {topup.amount || "- - - - - - -"}
                  </Typography>
                </div>
                <div className="blank-left">
                  <Close onClick={handleClose} style={{ cursor: "pointer" }} />
                </div>
              </Grid>
              <div id="info-section">
                {topup.status === 'Pending' ? (
                  <div
                    style={{
                      display: "flex",
                      justifyContent: "space-between",
                      marginTop: "20px",
                      gap: 20,
                    }}
                  >
                    <Button
                      variant="contained"
                      className="verifiedBut"
                      onClick={() => handleAccept(topup, "Released")}
                    >
                      Release
                    </Button>
                    <Button
                      variant="contained"
                      className="deleteBut"
                      onClick={() => handleReject(topup, "Rejected")}
                    >
                      Reject
                    </Button>
                  </div>
                ) : (
                  <Typography
                    variant="h6"
                    component="h2"
                    style={{ marginTop: 10 }}
                  >
                    Status: {topup.status || "- - - - - - -"}
                  </Typography>
                )}
              </div>
            </Box>
          )}
        </Box>
      </Modal>
    </div>
  );
};

export default TopupRequests;
