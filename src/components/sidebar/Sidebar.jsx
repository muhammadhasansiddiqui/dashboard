import "./sidebar.css";
import React, { useState, useRef } from "react";
import { Link, useNavigate } from "react-router-dom";
import logo from "../../assets/images/scrapCart-logo.png";
import sidebar_items from "../../assets/JsonData/sidebar_routes.json";

const SidebarItem = (props) => {
  const active = props.active ? "active" : "";
  return (
    <div
      className="sidebar_item"
      onClick={() => {
        if (props.title === "Chat") {
          props.setCount(0);
        }
      }}
    >
      <div className={`sidebar__item-inner ${active}`}>
        <i className={props.icon}></i>
        <span>{props.title}</span>
        {props.title === "Chat" && props.count > 0 && (
          <div className="sidebar__item-badge">
            <span>{props.count}</span>
          </div>
        )}
      </div>
    </div>
  );
};

const Sidebar = ({ isVisible, toggleSidebar }) => {
  const [count, setCount] = useState(0);
  const sidebarRef = useRef(null);
  const navigate = useNavigate();

  const activeItem = sidebar_items.findIndex(
    (item) => item.route === window.location.pathname
  );

  const logout = () => {
    localStorage.removeItem("uid");
    navigate("/auth/login")
    window.location.reload();
  };

  return (
    <div className={`sidebar ${isVisible ? "show" : ""}`} ref={sidebarRef}>
      {/* Close icon */}
      {isVisible && (
        <div className="sidebar__close" style={{ display: 'none' }} onClick={toggleSidebar}>
          <i className="bx bx-x"></i>
        </div>
      )}
      <div className="sidebar__logo">
        <img src={logo} alt="company logo" />
      </div>
      {sidebar_items.map((item, index) => (
        <Link to={item.route} key={index} onClick={toggleSidebar}>
          <SidebarItem
            count={count}
            icon={item.icon}
            setCount={setCount}
            title={item.display_name}
            active={index === activeItem}
          />
        </Link>
      ))}
      <div onClick={logout} style={{ cursor: "pointer" }}>
        <SidebarItem icon="bx bx-log-out" title="Logout" />
      </div>
    </div>
  );
};

export default Sidebar;
