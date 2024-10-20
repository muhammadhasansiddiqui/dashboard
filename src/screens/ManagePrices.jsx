import {
  Box,
  Grid,
  List,
  Modal,
  Button,
  ListItem,
  TextField,
  Typography,
  IconButton,
  ListItemText,
} from "@mui/material";
import "./register.css";
import Swal from "sweetalert2";
import * as React from "react";
import EditIcon from "@mui/icons-material/Edit";
import DeleteIcon from "@mui/icons-material/Delete";
import { addDoc, database, collection, getDocs, doc, updateDoc, deleteDoc } from "../db/firebase";

const style = {
  p: 4,
  width: 500,
  top: "50%",
  left: "50%",
  boxShadow: 24,
  position: "absolute",
  bgcolor: "background.paper",
  transform: "translate(-50%, -50%)",
};

const ManagePrices = () => {
  const [name, setName] = React.useState("");
  const [price, setPrice] = React.useState("");
  const [open, setOpen] = React.useState(false);
  const [packages, setPackages] = React.useState([]);
  const [loading, setLoading] = React.useState(false);
  const [editOpen, setEditOpen] = React.useState(false);
  const [selectedPackage, setSelectedPackage] = React.useState(null);

  React.useEffect(() => {
    const fetchData = async () => {
      const packagesArr = [];
      const packagesSnapshot = await getDocs(collection(database, "scrapp-prices"));
      packagesSnapshot.forEach((doc) => packagesArr.push({ ...doc.data(), id: doc.id }));
      setPackages(packagesArr);
    };

    fetchData();
  }, []);

  const handleSubmit = async () => {
    if (name === '' || price === '') {
      alert("Please fill all the fields");
      return;
    }

    setLoading(true);
    const newPackage = { price, name };

    try {
      await addDoc(collection(database, "scrapp-prices"), newPackage);
      setPackages([...packages, newPackage]);
      setName("");
      setPrice("");
      setOpen(false);
      setLoading(false);
      Swal.fire("Good job!", "Price Added Successfully!", "success");
    } catch (error) {
      setLoading(false);
      Swal.fire("Something Went Wrong!", error.message, "error");
    }
  };

  const addPackage = () => {
    setOpen(true);
  };

  const handleClose = () => {
    setOpen(false);
    setEditOpen(false);
    setSelectedPackage(null);
  };

  const handleEdit = (pkg) => {
    setSelectedPackage(pkg);
    setName(pkg.name);
    setPrice(pkg.price);
    setEditOpen(true);
  };

  const handleEditSubmit = async () => {
    if (!selectedPackage || name === '' || price === '') {
      alert("Please fill all the fields");
      return;
    }

    setLoading(true);
    const updatedPackage = { ...selectedPackage, price, name };
    const docRef = doc(database, "scrapp-prices", selectedPackage.id);
    await updateDoc(docRef, updatedPackage);

    const updatedPackages = packages.map(pkg => pkg.id === selectedPackage.id ? updatedPackage : pkg);
    setPackages(updatedPackages);
    setName("");
    setPrice("");
    setEditOpen(false);
    setLoading(false);
    Swal.fire("Good job!", "Price Updated Successfully!", "success");
  };

  const handleDelete = async (id) => {
    setLoading(true);
    await deleteDoc(doc(database, "scrapp-prices", id));
    const updatedPackages = packages.filter(pkg => pkg.id !== id);
    setPackages(updatedPackages);
    setLoading(false);
    Swal.fire("Good job!", "Price Deleted Successfully!", "success");
  };

  return (
    <div className="col-12">
      <div style={{ display: "flex", alignItems: "center", marginBottom: "10px", justifyContent: "space-between" }}>
        <Typography variant="h4" style={{ fontSize: "25px", fontWeight: "bold" }}>
          Scrap Prices
        </Typography>
        <Button
          type="submit"
          variant="contained"
          onClick={addPackage}
          style={{ color: "white", height: "50px", padding: "0 30px", fontWeight: "bold", borderRadius: "3px", backgroundColor: "#1BABAA" }}
        >
          Add New Scrap Price
        </Button>
      </div>

      <List style={{ display: 'flex', flexWrap: 'wrap', justifyContent: 'space-between' }}>
        {!!packages.length && packages.map((pkg) => (
          <ListItem key={pkg.id} style={{ marginTop: "15px", backgroundColor: "white", width: '49%', border: '1px solid #e0e0e0' }}>
            <ListItemText primary={pkg.name} secondary={`Rs.${pkg.price}`} />
            <IconButton edge="start" aria-label="edit" onClick={() => handleEdit(pkg)} style={{color: '#1BABAA'}}>
              <EditIcon />
            </IconButton>
            <IconButton edge="end" aria-label="delete" onClick={() => handleDelete(pkg.id)} style={{color: '#1BABAA'}}>
              <DeleteIcon />
            </IconButton>
          </ListItem>
        ))}
      </List>

      <Modal open={open || editOpen} onClose={handleClose} aria-labelledby="modal-modal-title" aria-describedby="modal-modal-description">
        <Box id="modal-popup" sx={style}>
          <Grid style={{ width: "100%" }}>
            <Typography variant="h4" style={{ fontSize: "22px", fontWeight: "500", textAlign: "center" }}>
              {editOpen ? "Edit Scrap" : "Add New Scrap"}
            </Typography>
            <Box sx={{ mx: 1, my: 4 }}>
              <TextField
                fullWidth
                autoFocus
                title="title"
                value={name}
                label="Title"
                margin="normal"
                variant="outlined"
                className="formInput"
                autoComplete="title"
                onChange={(e) => setName(e.target.value)}
              />
              <TextField
                fullWidth
                title="price"
                label="Price"
                value={price}
                margin="normal"
                variant="outlined"
                autoComplete="price"
                className="formInput"
                onChange={(e) => setPrice(e.target.value)}
              />
              <div style={{ display: 'flex', gap: '20px', marginTop: '20px', }}>
                <Button
                  onClick={handleClose}
                  style={{ height: "50px", color: "white", fontSize: '16px', borderRadius: "3px", backgroundColor: "gray", padding: '0 40px' }}
                >
                  Cancel
                </Button>
                <Button
                  fullWidth
                  type="submit"
                  loading={loading}
                  disabled={loading}
                  onClick={editOpen ? handleEditSubmit : handleSubmit}
                  style={{ height: "50px", color: "white", fontSize: '16px', borderRadius: "3px", backgroundColor: "#349eff" }}
                >
                  {editOpen ? "Update Scrap" : "Add Scrap"}
                </Button>
              </div>
            </Box>
          </Grid>
        </Box>
      </Modal>
    </div>
  );
};

export default ManagePrices;
