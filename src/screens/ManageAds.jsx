import "./register.css";
import Swal from "sweetalert2";
import * as React from "react";
import DeleteIcon from "@mui/icons-material/Delete";
import { List, ListItem, ListItemText, IconButton } from "@mui/material";
import { database, collection, getDocs, doc, deleteDoc } from "../db/firebase";

const ManageAds = () => {
    const [ads, setAds] = React.useState([]);

    React.useEffect(() => {
        const fetchData = async () => {
            const list = [];
            const adsData = await getDocs(collection(database, "ads"));
            adsData.forEach((doc) => list.push({ ...doc.data(), id: doc.id }));
            setAds(list)
        };

        fetchData();
    }, []);

    const handleDelete = async (id) => {
        await deleteDoc(doc(database, "ads", id));
        setAds(ads.filter(pkg => pkg.id !== id));
        Swal.fire("Done", "Deleted Successfully!", "success");
    };

    return (
        <div className="col-12">
            <h2 className="page-header">Manage Ads</h2>

            <List style={{ display: 'flex', flexWrap: 'wrap', justifyContent: 'space-between' }}>
                {!!ads.length && ads.map((pkg) => (
                    <ListItem key={pkg.id} style={{ borderRadius: 1, marginTop: "10px", backgroundColor: "white", width: '49%', border: '1px solid #e0e0e0' }}>
                        <img src={pkg.image} height='50px' width='50px' style={{ marginRight: '10px', borderRadius: 5 }} />
                        <ListItemText primary={pkg.title} secondary={`Rs.${pkg.demand}`} />
                        <IconButton edge="end" aria-label="delete" onClick={() => handleDelete(pkg.id)} style={{color: '#1BABAA'}}>
                            <DeleteIcon />
                        </IconButton>
                    </ListItem>
                ))}
            </List>
        </div>
    );
};

export default ManageAds;
