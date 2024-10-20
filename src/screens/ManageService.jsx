import {
  doc,
  addDoc,
  getDocs,
  database,
  deleteDoc,
  collection,
} from "../db/firebase";
import {
  List,
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
import DeleteIcon from "@mui/icons-material/Delete";
import { updateDoc, arrayUnion } from "firebase/firestore";

const ManageCategory = () => {
  const [title, setTitle] = React.useState("");
  const [services, setServices] = React.useState([]);
  const [category, setCategory] = React.useState('');
  const [categoryTitle, setCategoryTitle] = React.useState("");

  React.useEffect(() => {
    const fetchData = async () => {
      const snap = await getDocs(collection(database, "categories"));
      const list = snap.docs.map((doc) => ({ ...doc.data(), id: doc.id }));
      setServices(list);
    };
    fetchData();
  }, []);

  const handleSubmit = async () => {
    if (!title || !category) {
      alert("Please fill all the fields");
    } else {
      await updateDoc(doc(database, "categories", category), { subCategories: arrayUnion(title) });
      let list = services.map((cat) => {
        if (cat.id === category) {
          return ({ ...cat, subCategories: [...cat.subCategories, title] })
        } else return cat;
      });
      setServices(list);
      setTitle("");
      setCategory('');
      Swal.fire("Good job!", "Subcategory Added Successfully!", "success");
    }
  };

  const handleCategorySubmit = async () => {
    if (!categoryTitle) {
      alert("Category Title and Image are required");
    } else {
      let obj = { title: categoryTitle };
      setServices((prev) => [...prev, obj]);
      addDoc(collection(database, "categories"), obj)
        .then(() => {
          setCategoryTitle("");
          Swal.fire("Good job!", "Category Added Successfully!", "success");
        })
        .catch((error) => {
          Swal.fire("Something Went Wrong!", error, "error");
        });
    }
  };

  const handleDeleteCard = async (item) => {
    Swal.fire({
      title: "Are you sure?",
      text: "You won't be able to revert this!",
      icon: "warning",
      showCancelButton: true,
      confirmButtonColor: "#3085d6",
      cancelButtonColor: "#d33",
      confirmButtonText: "Yes, delete it!",
    }).then((result) => {
      if (result.isConfirmed) {
        let subCategories = services.filter((el) => el.id !== item.id);
        setServices(subCategories);
        deleteDoc(doc(database, "categories", item.id))
        Swal.fire("Deleted!", "Your file has been deleted.", "success");
      }
    });
  };

  const handleDeleteSubCategory = async (id, subcategory) => {
    let list = []
    for (let idx = 0; idx < services.length; idx++) {
      if (services[idx].id === id) {
        let subCat = services[idx]?.subCategories?.filter(e => e !== subcategory)
        list.push({ ...services[idx], subCategories: subCat })
      } else list.push(services[idx])
    }
    let data = list.find((el) => el.id === id);
    updateDoc(doc(database, "categories", id), { subCategories: data.subCategories });
    setServices(list);
  };

  return (
    <div className="col-12">
      <h2 className="page-header">Manage Services</h2>
      <div className="card col-12">
        <Typography variant="h6">Add Category</Typography>

        <div style={{ display: "flex", alignItems: "center", gap: '10px', marginTop: '10px' }}>
          <TextField
            fullWidth
            label="Category"
            value={categoryTitle}
            onChange={(e) => setCategoryTitle(e.target.value)}
          />

          <Button
            type="submit"
            disabled={categoryTitle === ''}
            onClick={handleCategorySubmit}
            style={{ color: "white", height: "54px", width: "150px", borderRadius: "3px", backgroundColor: categoryTitle == '' ? 'silver' : "#1BABAA" }}
          >
            Add
          </Button>
        </div>
      </div>

      <div style={{ display: "flex", justifyContent: "space-between" }}>
        <div className="card col-12">
          <Typography variant="h6">Add Sub Category</Typography>
          <div style={{ display: "flex", justifyContent: "space-between", alignItems: 'center', gap: '10px', marginTop: '10px' }}>
            <TextField
              fullWidth
              value={title}
              label="Sub Category"
              onChange={(e) => setTitle(e.target.value)}
            />
            <TextField
              select
              fullWidth
              label="Select Category"
              SelectProps={{ native: true }}
              onChange={(e) => setCategory(e.target.value)}
            >
              <option value="">Select Category</option>
              {services.length &&
                services.map((option, index) => (
                  <option key={index} value={option.id}>{option.title}</option>
                ))}
            </TextField>

            <Button
              type="submit"
              onClick={handleSubmit}
              disabled={title == '' || category == ''}
              style={{
                color: "white",
                height: "54px",
                borderRadius: "3px",
                backgroundColor: title == '' || category == '' ? 'silver' : "#1BABAA",
              }}
            >
              Add
            </Button>
          </div>
        </div>
      </div>

      <List>
        {!!services.length ? (services.map((ele, index) => {
          return (
            <ListItem key={index} style={{ borderRadius: 3, marginTop: '10px', backgroundColor: "white", justifyContent: 'space-between' }}>
              <div>
                <ListItemText primary={ele.title} />
                <div style={{ display: 'flex', flexWrap: 'wrap' }}>
                  {ele?.subCategories?.map((subcategory, subIndex) => (
                    <div key={subIndex} style={{ display: "flex", alignItems: 'center', borderBottom: '1px solid gainsboro', borderRadius: '7px', paddingLeft: '10px', marginRight: '5px' }}>
                      <span style={{ fontSize: '12px' }}>{subcategory}</span>
                      <IconButton
                        onClick={() => handleDeleteSubCategory(ele.id, subcategory)}
                        aria-label={`delete ${subcategory}`}
                      >
                        <DeleteIcon style={{ fontSize: '13px' }} />
                      </IconButton>
                    </div>
                  ))}
                </div>
              </div>
              <IconButton onClick={() => handleDeleteCard(ele)}>
                <DeleteIcon style={{ fontSize: '18px' }} />
              </IconButton>
            </ListItem>
          );
        })
        ) : (
          <div style={{ height: "100px", display: "flex", alignItems: "center", justifyContent: "center" }}>
            <h1 className="text">No Services Found!</h1>
          </div>
        )}
      </List>
    </div >
  );
};

export default ManageCategory;
