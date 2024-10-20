import "./register.css";
import { database } from '../db/firebase'
import { Button, TextField } from "@mui/material";
import React, { useEffect, useState } from "react";
import { getDocs, query, collection } from "firebase/firestore";

const NotifyUser = () => {
  const [title, setTitle] = useState("");
  const [message, setMessage] = useState("");
  const [usersList, setUsersList] = useState([]);
  const [vendorsList, setVendorsList] = useState([]);

  useEffect(() => {
    sendNotificationToUsers()
  }, [])

  const sendNotificationToUsers = async () => {
    let data = await getDocs(query(collection(database, 'users')))
    let users = []
    let vendors = []
    data.forEach((item) => {
      if (item.isVendor) vendors.push(item)
      else users.push(item)
    })
    setUsersList(users)
    setVendorsList(vendors)
  }

  const sendUsersNotifications = async () => {
    for (let i = 0; i < usersList.length; i++) {
      fetch("https://exp.host/--/api/v2/push/send", {
        method: "POST",
        headers: {
          Accept: "application/json",
          "Accept-encoding": "gzip, deflate",
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          title,
          body: message,
          sound: "default",
          to: usersList[i].pushToken,
        }),
      });
      setTitle("");
      setMessage("");
    }
  };

  const sendNotificationToVendor = async () => {
    for (let i = 0; i < vendorsList.length; i++) {
      fetch("https://exp.host/--/api/v2/push/send", {
        method: "POST",
        headers: {
          Accept: "application/json",
          "Accept-encoding": "gzip, deflate",
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          title,
          body: message,
          sound: "default",
          to: vendorsList[i].expoPushToken,
        }),
      });
      setTitle("");
      setMessage("");
    }
  };

  return (
    <div>
      <div className="col-12">
        <div style={{ display: "flex", marginLeft: 20 }}>
          <h2 className="page-header">Send Notifications To All Users</h2>
        </div>
        <div className="card">
          <TextField
            fullWidth
            autoFocus
            label="Title"
            title="title"
            value={title}
            margin="normal"
            variant="outlined"
            className="formInput"
            autoComplete="title"
            onChange={(e) => setTitle(e.target.value)}
          />
          <TextField
            fullWidth
            autoFocus
            title="title"
            value={message}
            label="Message"
            margin="normal"
            variant="outlined"
            className="formInput"
            autoComplete="title"
            onChange={(e) => setMessage(e.target.value)}
          />
          <Button
            fullWidth
            type="submit"
            variant="contained"
            onClick={sendUsersNotifications}
            disabled={title.length === 0 || message.length === 0}
            style={{
              color: "white",
              height: "50px",
              marginTop: "30px",
              borderRadius: "3px",
              // backgroundColor: "#282828",
              backgroundColor: "#1BABAA",
            }}
          >
            Send Notification
          </Button>
        </div>
      </div>
      <br />
      <br />
      <br />
      <div className="col-12">
        <h2 className="page-header">Send Notifications To All Vendors</h2>
        <div className="card">
          <TextField
            fullWidth
            autoFocus
            title="title"
            value={title}
            label="Title"
            margin="normal"
            variant="outlined"
            className="formInput"
            autoComplete="title"
            onChange={(e) => setTitle(e.target.value)}
          />
          <TextField
            fullWidth
            autoFocus
            title="title"
            value={message}
            label="Message"
            margin="normal"
            variant="outlined"
            className="formInput"
            autoComplete="title"
            onChange={(e) => setMessage(e.target.value)}
          />
          <Button
            fullWidth
            type="submit"
            variant="contained"
            onClick={sendNotificationToVendor}
            disabled={title.length === 0 || message.length === 0}
            style={{
              color: "white",
              height: "50px",
              marginTop: "30px",
              borderRadius: "3px",
              // backgroundColor: "#282828",
              backgroundColor: "#1BABAA",
            }}
          >
            Send Notification
          </Button>
        </div>
      </div>
    </div>
  );
};

export default NotifyUser;
