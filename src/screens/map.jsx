import "./map.css";
import GoogleMapReact from "google-map-react";
import RoomIcon from "@mui/icons-material/Room";
import React, { useState, useEffect } from "react";
import { collection, database, getDocs } from "../db/firebase";

const AnyReactComponent = ({ key }) => (
  <RoomIcon key={key} style={{ color: "red" }} />
);

function Map() {
  const [users, setUsers] = useState("");
  const defaultProps = { center: { lat: 34.12834, lng: -117.20865 }, zoom: 9 };

  useEffect(() => {
    const array = [];
    getDocs(collection(database, "users")).then((docSnap) => {
      docSnap.forEach((doc) => {
        if (doc.data()?.location) array.push(doc.data().location);
      });
      setUsers(array);
    });
  }, []);

  return (
    <div>
      <h2 className="page-header">View Users</h2>
      <div className="card" style={{ height: "90vh", width: "100%" }}>
        <GoogleMapReact
          defaultZoom={defaultProps.zoom}
          defaultCenter={defaultProps.center}
          bootstrapURLKeys={{ key: "AIzaSyBeoDwIofUJph_Mwdi6GvX7PuLVOVzM9oc" }}
        >
          {users?.length &&
            users?.map((e, index) => (
              <AnyReactComponent
                key={index}
                lat={e.latitude}
                lng={e.longitude}
              />
            ))}
        </GoogleMapReact>
      </div>
    </div>
  );
}

export default Map;
