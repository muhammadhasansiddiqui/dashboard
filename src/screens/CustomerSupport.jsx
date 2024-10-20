import {
  doc,
  query,
  where,
  addDoc,
  getDocs,
  database,
  Timestamp,
  updateDoc,
  onSnapshot,
  collection,
} from "../db/firebase";
import "./chat.css";
import moment from "moment";
import { TextField, Button } from "@mui/material";
import React, { useEffect, useState, useRef } from "react";
import DraftsIcon from "@mui/icons-material/DraftsOutlined";
import MarkunreadIcon from "@mui/icons-material/Markunread";

const uri =
  "https://freepngimg.com/thumb/google/66726-customer-account-google-service-button-search-logo.png";

export default function Chat() {
  const [msg, setMsg] = useState("");
  const [users, setUsers] = useState([]);
  const [messages, setMessages] = useState([]);
  const [selectedChat, setSelectedChat] = useState(null);

  const messagesEndRef = useRef(null); // For scrolling to bottom
  useEffect(() => {
    if (messagesEndRef.current) {
      messagesEndRef.current.scrollIntoView({ behavior: "smooth" });
    }
  }, [messages]);

  useEffect(() => {
    const getChatUsers = async () => {
      const q = await getDocs(
        query(collection(database, "users"), where("chatAdmin", "==", true))
      );
      let arry = q.docs.map((doc) => ({ ...doc.data(), uid: doc.id }));
      setUsers(arry);
    };
    getChatUsers();
  }, []);

  const getSelectChatMsg = (user) => {
    let ar = [...users];
    let index = ar.findIndex((e) => e.uid === user.uid);
    ar[index].adminMsgUnread = false;
    setUsers(ar);
    setMessages([]);
    updateDoc(doc(database, "users", user.uid), { adminMsgUnread: false });
    setSelectedChat(user);
  };

  useEffect(() => {
    if (selectedChat?.uid) {
      const q = query(
        collection(database, "customerSupport"),
        where(selectedChat.uid, "==", true),
      );
      const unsubscribe = onSnapshot(q, (snap) => {
        let list = snap.docs.map((doc) => ({ ...doc.data() }));
        list = list.sort((a, b) => a.createdAt - b.createdAt);
        setMessages(list);
      });
      return unsubscribe;
    }
  }, [selectedChat]);

  const generateRandomId = () => {
    const randomNumber = Math.random();
    return randomNumber.toString(36).substring(2, 9); // Generates a string of 9 characters
  };

  const onSend = () => {
    if (selectedChat?.uid) {
      let avatar =
        "https://freepngimg.com/thumb/google/66726-customer-account-google-service-button-search-logo.png";

      const obj = {
        text: msg,
        _id: generateRandomId(),
        [selectedChat.uid]: true,
        createdAt: Timestamp.now(),
        user: { _id: "admin", avatar },
      };
      setMessages((prev) => [...prev, obj]);
      let ar = [...users];
      let index = ar.findIndex((e) => e.uid === selectedChat.uid);
      ar[index].msgTime = Date.now();
      setUsers([ar[index], ...ar.slice(0, index), ...ar.slice(index + 1)]);
      addDoc(collection(database, "customerSupport"), obj);
      updateDoc(doc(database, "users", selectedChat.uid), {
        msgTime: Date.now(),
        adminMsgUnread: true
      });
      fetch("https://exp.host/--/api/v2/push/send", {
        method: "POST",
        headers: {
          Accept: "application/json",
          "Accept-encoding": "gzip, deflate",
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ title: 'Customer Support', body: msg, sound: "default", to: selectedChat.expoPushToken }),
      });
      setMsg("");
    }
  };

  return (
    <div className="card-user">
      <h2 className="page-header">Customer Support</h2>
      <div>
        <div className="chatRow">
          <div className="usersDiv">
            {users?.map((e, i) => (
              <div
                key={i}
                className="userBox"
                onClick={() => getSelectChatMsg(e)}
              >
                <div className="userImgBox">
                  <img
                    src={e.image || uri}
                    className={`userImg ${!!e.adminMsgUnread && "unreadImg"}`}
                    alt="userImg"
                  />
                </div>
                <div>
                  <p className="userName">{e.name}</p>
                  <p className="userEmail">{e.email}</p>
                </div>
                <div>
                  {e.msgTime && (
                    <>
                      {moment(e.msgTime).isSame(moment(), "day") && (
                        <p className={`lstMsgTime ${e.adminMsgUnread ? "unread" : ""}`}>
                          {moment(e.msgTime).format("hh:mm A")}
                        </p>
                      )}
                      {moment(e.msgTime).isSame(
                        moment().subtract(1, "days"),
                        "day"
                      ) && (
                          <p className={`lstMsgTime ${e.adminMsgUnread ? "unread" : ""}`}>
                            Yesterday
                          </p>
                        )}
                      {!moment(e.msgTime).isSame(moment(), "day") &&
                        !moment(e.msgTime).isSame(
                          moment().subtract(1, "days"),
                          "day"
                        ) && (
                          <p
                            className={`lstMsgTime ${e.adminMsgUnread ? "unread" : ""}`}
                          >
                            {moment(e.msgTime).format("DD/MM/YYYY")}
                          </p>
                        )}
                    </>
                  )}
                  {e.adminMsgUnread ? (
                    <MarkunreadIcon
                      className={`msgIcon ${e.adminMsgUnread ? "unread" : ""}`}
                    />
                  ) : (
                    <DraftsIcon
                      className={`msgIcon ${e.adminMsgUnread ? "unread" : ""}`}
                    />
                  )}
                </div>
              </div>
            ))}
          </div>
          {selectedChat ? (
            <div className="chatDiv">
              <div className="userBox">
                <div className="userImgBox">
                  <img
                    src={selectedChat.image || uri}
                    className="userImg"
                    alt="userImg"
                  />
                </div>
                <h3
                  style={{ marginBlock: "auto", fontWeight: "500", fontSize: "18px" }}
                  className="userName"
                >
                  {selectedChat.name}
                </h3>
              </div>

              <div className="messages">
                {messages.length > 0 ? (
                  messages.map((e, i) => {
                    let isAdmin = e.user._id === "admin";
                    return (
                      <div
                        key={i}
                        className={isAdmin ? "align-right" : "align-left"}
                      >
                        <div
                          className="msgBox"
                          ref={messagesEndRef} // For scrolling to bottom
                          style={{
                            backgroundColor: isAdmin
                              ? "#50ACFF"
                              : "rgb(0, 0, 0, 0.05)",
                            color: isAdmin ? "white" : "black",
                            borderBottomRightRadius: isAdmin ? "0" : "20",
                            borderBottomLeftRadius: isAdmin ? "20" : "0",
                          }}
                        >
                          <p>{e.text}</p>
                          <p
                            className={`msgTime ${isAdmin ? "adminTimestamp" : "userTimestamp"
                              }`}
                          >
                            {e?.createdAt?.nanoseconds &&
                              e?.createdAt?.seconds &&
                              e?.createdAt?.toDate()?.toLocaleTimeString([], {
                                hour: "numeric",
                                minute: "numeric",
                                hour12: true,
                              })}
                          </p>
                        </div>
                      </div>
                    );
                  })
                ) : (
                  <div className="emptyChatDiv" style={{ border: "none" }}>
                    <h1>No Messages</h1>
                  </div>
                )}
              </div>

              <div style={{ display: "flex", margin: "1vh 0vh" }}>
                <TextField
                  fullWidth
                  value={msg}
                  variant="outlined"
                  className="chatBox"
                  label="Type Your Message"
                  onChange={(e) => setMsg(e.target.value)}
                  onKeyPress={(event) => {
                    if (event.key === "Enter") {
                      onSend(event);
                    }
                  }}
                />
                <Button
                  onClick={onSend}
                  variant="contained"
                  disabled={msg.trim() === ""}
                  style={{ width: "100px", marginLeft: "10px" }}
                >
                  Send
                </Button>
              </div>
            </div>
          ) : (
            <div className="emptyChatDiv">
              <h1>No Chat Selected</h1>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}