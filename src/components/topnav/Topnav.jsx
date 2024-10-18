import React, { useEffect } from "react";
import MenuBar from "../sidebar/MenuBar";
import { useNavigate } from "react-router-dom";

const Topnav = (props) => {
  const navigate = useNavigate();

  useEffect(() => {
    const getUserData = async () => {
      const uid = localStorage.getItem("uid");
      if (!uid) {
        navigate("/admin/dashboard")
        // window.location.reload();
      }
    };

    getUserData();
  }, [props.history, navigate]);

  return (
    <div style={{ position: "absolute", left: 20, top: '27px' }}>
      <MenuBar />
    </div>
  );
};

export default Topnav;
