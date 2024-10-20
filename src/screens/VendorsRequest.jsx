import "./users.css";
import Swal from 'sweetalert2';
import { database } from "../db/firebase";
import Close from "@mui/icons-material/Close";
import Table from "../components/table/Table";
import React, { useEffect, useState } from "react";
import { Modal, Box, Typography, Grid, Button } from "@mui/material";
import { collection, getDocs, query, where, updateDoc, doc } from "firebase/firestore";


const style = {
  p: 4,
  top: "50%",
  width: 500,
  left: "50%",
  boxShadow: 24,
  position: "absolute",
  bgcolor: "background.paper",
  transform: "translate(-50%, -50%)",
};

const customerTableHead = [
  "Image",
  "Name",
  "Email",
  "Phone",
  "CNIC",
  "Selected Services",
  "Created Date",
];

const renderHead = (item, index) => <th key={index}>{item}</th>;

const renderBody = (item, index, handleOpen) => {
  return (
    <tr
      key={index}
      onClick={() => handleOpen(item)}
      style={{
        height: "60px",
        cursor: "pointer",
        backgroundColor: index % 2 !== 0 && "#fafafa",
      }}
    >
      <td>
        <img
          alt="user"
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
      <td>{item?.name || "-----"}</td>
      <td>{item?.email}</td>
      <td>{item?.phone || "Not Provided"}</td>
      <td>{item?.cnic || "Not Provided"}</td>
      <td>{item?.limit || "Not Selected"}</td>
      <td>{new Date(item.createdAt).toDateString()}</td>
    </tr>
  );
};

const VendorsRequest = () => {
  const [open, setOpen] = useState(false);
  const [vendor, setVendor] = useState(null);
  const [vendors, setVendorsList] = useState([]);

  useEffect(() => {
    const fetchVendors = async () => {
      const q = query(collection(database, "users"), where("isVendor", "==", true), where('isVerified', '!=', true));
      const snaps = await getDocs(q);
      const vendorsList = [];
      snaps.forEach((doc) => vendorsList.push({ ...doc.data(), id: doc.id }));
      setVendorsList(vendorsList);
    };

    fetchVendors();
  }, []);

  const handleOpen = (item) => {
    setOpen(true);
    setVendor(item);
  };

  const handleClose = () => setOpen(false);

  const handleStatusChange = async (newStatus) => {
    if (vendor) {
      const vendorRef = doc(database, "users", vendor.id);
      await updateDoc(vendorRef, { isVerified: true });
      setVendorsList(vendors);
      setOpen(false);
      if (newStatus === "Verified") {
        Swal.fire("Success!", "Vendor has been successfully accepted and is now verified.", "success");
      } else Swal.fire("Rejected", "Vendor Rejected Successfully.", "error");
    }
  };

  return (
    <div>
      <div className="row">
        <div className="col-12">
          <h2 className="page-header">Vendors</h2>
          <div className="card">
            <div className="card__body">
              <Table
                limit="10"
                headData={customerTableHead}
                renderHead={(item, index) => renderHead(item, index)}
                bodyData={vendors}
                renderBody={(item, index) =>
                  renderBody(item, index, handleOpen)
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
        <Box sx={style} id="modal-popup">
          <Grid item display="flex" justifyContent={"space-between"}></Grid>
          {vendor && (
            <Box id="vendor-wrapper">
              <Grid item id="top-modal">
                <div className="blank"></div>
                <div className="center">
                  <img
                    src={
                      vendor.userImg
                        ? vendor.userImg
                        : "https://freepngimg.com/thumb/google/66726-customer-account-google-service-button-search-logo.png"
                    }
                    style={{
                      width: "100px",
                      height: "100px",
                      objectFit: "cover",
                      borderRadius: "100px",
                    }}
                    alt="users profile"
                    id="vendor-image"
                  />
                  <Typography
                    variant="h6"
                    component="h2"
                    style={{ marginTop: 10 }}
                  >
                    {vendor.name || "- - - - - - -"}
                  </Typography>
                </div>
                <div className="blank-left">
                  <Close onClick={handleClose} style={{ cursor: "pointer" }} />
                </div>
              </Grid>
              <div id="info-section">
                <div id="info-left">
                  <Grid
                    item
                    ml={"10px"}
                    justifyContent="center"
                    display={"flex"}
                    flexDirection="column"
                  >
                    <Typography variant="h6" component="h2" id="text">
                      Email: {vendor.email}
                    </Typography>
                    {/* <Typography variant="h6" component="h2" id="text">
                      Created: {vendor.createdAt}
                    </Typography> */}
                  </Grid>
                </div>
                <div id="info-center">
                  <Grid
                    item
                    ml={"10px"}
                    justifyContent="center"
                    display={"flex"}
                    flexDirection="column"
                  >
                    <Typography variant="h6" component="h2" id="text">
                      Phone:
                    </Typography>
                    <Typography
                      variant="h6"
                      component="h2"
                      id="text"
                      style={{
                        justifyContent: "center",
                        alignContent: "center",
                        alignItems: "center",
                      }}
                    >
                      {vendor.phone}
                    </Typography>
                    <Typography variant="h6" component="h2" id="text">
                      {/* {vendor.cnic} */}
                    </Typography>
                  </Grid>
                </div>

                <div id="info-right">
                  <Grid
                    item
                    ml={"10px"}
                    justifyContent="center"
                    display={"flex"}
                    flexDirection="column"
                  >
                    <Typography variant="h6" component="h2" id="text">
                      CNIC
                    </Typography>
                    <Typography variant="h6" component="h2" id="text">
                      {vendor.cnic}
                    </Typography>
                  </Grid>
                </div>

                <div id="info-right">
                  <Grid
                    item
                    ml={"10px"}
                    justifyContent="center"
                    display={"flex"}
                    flexDirection="column"
                  >
                    <Typography variant="h6" component="h2" id="text">
                      Limit
                    </Typography>
                    <Typography variant="h6" component="h2" id="text">
                      {vendor.limit}
                    </Typography>
                  </Grid>
                </div>
                <div style={{ display: 'flex', justifyContent: 'space-between', marginTop: '20px', gap: 20 }}>
                  <Button variant="contained" className="verifiedBut" onClick={() => handleStatusChange("Verified")}>Accept</Button>
                  <Button variant="contained" className="deleteBut" onClick={() => handleStatusChange("Rejected")}>Reject</Button>
                </div>



              </div>
            </Box>
          )}

        </Box>
      </Modal>
    </div>
  );
};

export default VendorsRequest;
