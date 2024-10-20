import "./users.css";
import React, { useEffect, useState } from "react";
import Table from "../components/table/Table";
import MenuItem from "@mui/material/MenuItem";
import { collection, getDocs, updateDoc, doc } from "firebase/firestore";
import { database } from "../db/firebase";
import Swal from "sweetalert2";
import Select from "@mui/material/Select";

const customerTableHead = [
  { title: "Phone" },
  { title: "Address" },
  { title: "Scrap Type" },
  { title: "Zip" },
  { title: "Status" },
];

const renderHead = (item, index) => (
  <th key={index} style={{ padding: "10px", textAlign: "left" }}>
    {item.title}
  </th>
);

const PickupRequests = () => {
  const [vendors, setVendors] = useState([]);

  useEffect(() => {
    const fetchVendors = async () => {
      try {
        const querySnapshot = await getDocs(
          collection(database, "pickupRequests")
        );
        let vendorsList = querySnapshot.docs.map((doc) => ({
          id: doc.id,
          ...doc.data(),
        }));
        vendorsList = vendorsList.sort((a, b) => b.createdAt - a.createdAt);

        setVendors(vendorsList);
      } catch (error) {
        console.error("Error fetching vendors: ", error);
        Swal.fire("Error", "Failed to fetch vendors", "error");
      }
    };

    fetchVendors();
  }, []);

  const handleStatusChange = async (event, id) => {
    const newStatus = event.target.value;
    try {
      // Update the status in Firebase
      const vendorDocRef = doc(database, "pickupRequests", id);
      await updateDoc(vendorDocRef, { status: newStatus });

      // Optionally, update the local state here if needed
      setVendors(
        vendors.map((vendor) =>
          vendor.id === id ? { ...vendor, status: newStatus } : vendor
        )
      );

      Swal.fire("Success", "Status updated successfully", "success");
    } catch (error) {
      console.error("Error updating status: ", error);
      Swal.fire("Error", "Failed to update status", "error");
    }
  };

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
        <td>{item?.phone || "Not Provided"}</td>
        <td>{item?.address || "Not Provided"}</td>
        <td>{item?.scrapType || "Not Provided"}</td>
        <td>{item?.zip || "Not Provided"}</td>
        <td>
          <Select
            value={item?.status}
            onChange={(e) => handleStatusChange(e, item.id)}
          >
            {["Pending", "Confirmed", "Completed", "Cancelled"].map(
              (status) => (
                <MenuItem
                  key={status}
                  value={status}
                  disabled={status === item?.status}
                >
                  {status}
                </MenuItem>
              )
            )}
          </Select>
        </td>
      </tr>
    );
  };

  const handleOpen = (item) => {
  console.log("🚀 ~ handleOpen ~ item:", item)
  };

  return (
    <div>
      <div className="row">
        <div className="col-12">
          <h2 className="page-header">Pickup Requests</h2>
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
    </div>
  );
};

export default PickupRequests;
