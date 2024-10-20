import "./users.css";
import { Button } from "@mui/material";
import Table from "../components/table/Table";
import React, { useEffect, useState } from "react";
import {
  collection,
  getDocs,
  getDoc,
  query,
  updateDoc,
  doc,
  where,
} from "firebase/firestore";
import Swal from "sweetalert2";
import { database } from "../db/firebase";

const customerTableHead = [
  "Name",
  "Account Number",
  "Account Title",
  "Bank",
  "Amount",
  "Action",
];

const renderHead = (item, index) => <th key={index}>{item}</th>;

const renderBody = (item, index, handleAccept, handleReject) => {
  return (
    <tr
      key={index}
      className="table-row"
      style={{
        height: "60px",
        cursor: "pointer",
        backgroundColor: index % 2 !== 0 && "#fafafa",
      }}
    >
      <td>{item?.name}</td>
      <td>{item?.accNumber}</td>
      <td>{item?.accTitle}</td>
      <td>{item?.bank}</td>
      <td>{item?.amount || '---'}</td>
      <td>
        <div
          style={{
            display: "flex",
            justifyContent: "center",
            gap: 20,
          }}
        >
          <Button
            variant="contained"
            className="verifiedBut"
            onClick={() => handleAccept(item)}
          >
            Paid
          </Button>
          <Button
            variant="contained"
            className="deleteBut"
            onClick={() => handleReject(item)}
          >
            Reject
          </Button>
        </div>
      </td>
    </tr>
  );
};

const WithdrawalRequest = () => {
  const [withdrawalList, setWithdrawalList] = useState([]);

  /* 
  // Commented out modal-related state
  const [open, setOpen] = useState(false);
  const [withdrawalRequest, setWithdrawalRequest] = useState(null);
  */

  useEffect(() => {
    const fetchWithdrawRequests = async () => {
      const q = query(
        collection(database, "withdrawRequests"),
        where("status", "==", "Pending")
      );
      const querySnapshot = await getDocs(q);
      const withdrawalList = [];
      querySnapshot.forEach((doc) => {
        withdrawalList.push({ ...doc.data(), id: doc.id });
      });
      setWithdrawalList(withdrawalList);
    };

    fetchWithdrawRequests();
  }, []);

  const handleAccept = async (item) => {
    const withdrawalRequestRef = doc(database, "withdrawRequests", item.id);

    try {
      // Update withdraw request status to "Paid" and set points to 0
      await updateDoc(withdrawalRequestRef, { status: "Paid", points: 0 });

      // Update state
      setWithdrawalList(
        withdrawalList.map((withdrawalRequestItem) =>
          withdrawalRequestItem.id === item.id ? { ...withdrawalRequestItem, status: "Paid", points: 0 } : withdrawalRequestItem
        )
      );

      Swal.fire(
        "Success!",
        "The withdrawal request has been marked as Paid, and the points have been set to 0.",
        "success"
      );
    } catch (error) {
      console.error("Error updating status:", error);
      Swal.fire("Error", "Failed to update the status.", "error");
    }
  };

  const handleReject = async (item) => {
    const withdrawalRequestRef = doc(database, "withdrawRequests", item.id);
    const userRef = doc(database, "users", item.uid);

    try {
      const withdrawDoc = await getDoc(withdrawalRequestRef);
      const pointsToRestore = withdrawDoc.exists() ? withdrawDoc.data().points : 0;
      await updateDoc(withdrawalRequestRef, { status: "Rejected", points: 0 });
      await updateDoc(userRef, { points: pointsToRestore });
      setWithdrawalList(
        withdrawalList.map((withdrawalRequestItem) =>
          withdrawalRequestItem.id === item.id ? { ...withdrawalRequestItem, status: "Rejected" } : withdrawalRequestItem
        )
      );
      Swal.fire("Rejected", "The withdrawal request has been rejected, and the points have been restored.", "error");
    } catch (error) {
      console.error("Error updating status:", error);
      Swal.fire("Error", "Failed to update the status.", "error");
    }
  };

  /*
  // Commented-out code related to modal and state management
  const handleOpen = (item) => {
    setOpen(true);
    setWithdrawalRequest(item);
  };

  const handleClose = () => setOpen(false);
  */

  return (
    <div>
      <div className="row">
        <div className="col-12">
          <h2 className="page-header">Withdrawal Requests</h2>
          <div className="card">
            <div className="card__body">
              <Table
                className="table-heading"
                limit="10"
                headData={customerTableHead}
                renderHead={(item, index) => renderHead(item, index)}
                bodyData={withdrawalList}
                renderBody={(item, index) =>
                  renderBody(item, index, handleAccept, handleReject)
                }
              />
            </div>
          </div>
        </div>
      </div>

      {/* 
      // Commented-out modal rendering code
      <Modal
        open={open}
        onClose={handleClose}
        aria-labelledby="modal-modal-title"
        aria-describedby="modal-modal-description"
      >
        <Box sx={style} id="modal-popup" style={{ width: "500px" }}>
          <Grid item display="flex" justifyContent={"space-between"}></Grid>
          {withdrawalRequest && (
            <Box id="vendor-wrapper">
              <Grid item id="top-modal">
                <div className="blank"></div>
                <div className="center">
                  <Typography
                    variant="h6"
                    component="h2"
                    style={{ marginTop: 10 }}
                  >
                    Points: {withdrawalRequest.amount || "- - - - - - -"}
                  </Typography>
                </div>
                <div className="blank-left">
                  <Close onClick={handleClose} style={{ cursor: "pointer" }} />
                </div>
              </Grid>
              <div id="info-section">
                {withdrawalRequest.status === "Pending" ? (
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
                      onClick={() => handleAccept(withdrawalRequest, "Released")}
                    >
                      Release
                    </Button>
                    <Button
                      variant="contained"
                      className="deleteBut"
                      onClick={() => handleReject(withdrawalRequest, "Rejected")}
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
                    Status: {withdrawalRequest.status || "- - - - - - -"}
                  </Typography>
                )}
              </div>
            </Box>
          )}
        </Box>
      </Modal>
      */}
    </div>
  );
};

export default WithdrawalRequest;
