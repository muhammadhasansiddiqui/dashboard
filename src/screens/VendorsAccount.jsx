import React, { useState } from "react";
import {
  Box,
  Button,
  TextField,
  Radio,
  RadioGroup,
  FormControl,
  FormControlLabel,
  FormLabel,
  IconButton,
  InputAdornment,
} from "@mui/material";
import Visibility from "@mui/icons-material/Visibility";
import VisibilityOff from "@mui/icons-material/VisibilityOff";
import Swal from "sweetalert2";
import "./register.css"; // Import your custom CSS
import {
  doc,
  setDoc,
  auth,
  createUserWithEmailAndPassword,
  database,
} from "../db/firebase";

export default function VendorsAccount() {
  const [role, setRole] = useState("");
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [cnic, setCnic] = useState("");
  const [phoneNum, setPhoneNum] = useState("");
  const [password, setPassword] = useState("");
  const [showPsw, setShowPsw] = useState(false);
  const [loading, setLoading] = useState(false);
  const [limit, setLimit] = useState('50kg');

  const handleSubmit = async () => {
    if (!email || !name || !password || !phoneNum || !cnic || !limit ) {
      Swal.fire("Please fill all the fields", "", "");
      return;
    }
    setLoading(true);
    try {
      const user = await createUserWithEmailAndPassword(auth, email, password);
      await setDoc(doc(database, 'vendors', user.user.uid), {
        createdAt: Date.now(),
        email,
        role,
        name,
        phone: phoneNum,
        cnic,
        limit,
        status: 'Verified'
      });
      setRole("");
      setName("");
      setEmail("");
      setCnic("");
      setPhoneNum("");
      setPassword("");
      setLimit(""); // Clear the selected limit
      setLoading(false);
      Swal.fire("Good job!", "Vendor Request Successfully Sent! Please Wait for the approval", "success");
    } catch (error) {
      setLoading(false);
      Swal.fire("Something Went Wrong!", error.message, "error");
    }
  };

  const handleClickShowPassword = () => {
    setShowPsw(!showPsw);
  };

  const handleMouseDownPassword = (event) => {
    event.preventDefault();
  };

  return (
    <div className="col-12">
      <h2 className="page-header">Create Vendor Account</h2>
      <div className="card">
        <Box
          sx={{
            mb: 4,
            mx: 1,
            display: "flex",
            alignItems: "center",
            flexDirection: "column",
          }}
        >
          <TextField
            fullWidth
            autoFocus
            name="name"
            value={name}
            margin="normal"
            variant="outlined"
            label="Full Name"
            className="formInput"
            autoComplete="name"
            style={{ marginBottom: "20px" }}
            onChange={(e) => setName(e.target.value)}
          />
          <TextField
            fullWidth
            name="email"
            value={email}
            margin="normal"
            variant="outlined"
            placeholder="Email Address"
            className="formInput"
            autoComplete="email"
            style={{ marginBottom: "20px" }}
            onChange={(e) => setEmail(e.target.value)}
          />
          <TextField
            fullWidth
            name="phone"
            value={phoneNum}
            margin="normal"
            variant="outlined"
            placeholder="Phone Number"
            className="formInput"
            autoComplete="phone"
            style={{ marginBottom: "20px" }}
            onChange={(e) => setPhoneNum(e.target.value)}
          />
          <TextField
            fullWidth
            name="cnic"
            value={cnic}
            margin="normal"
            variant="outlined"
            placeholder="Cnic/Government Id"
            className="formInput"
            style={{ marginBottom: "20px" }}
            onChange={(e) => setCnic(e.target.value)}
          />

          <FormControl fullWidth margin="normal">
            <TextField
              fullWidth
              type={showPsw ? "text" : "password"}
              name="password"
              margin="normal"
              placeholder="Password"
              value={password}
              variant="outlined"
              className="formInput"
              autoComplete="current-password"
              style={{ marginBottom: "20px" }}
              onChange={(e) => setPassword(e.target.value)}
              InputProps={{
                endAdornment: (
                  <InputAdornment position="end">
                    <IconButton
                      aria-label="toggle password visibility"
                      onClick={handleClickShowPassword}
                      onMouseDown={handleMouseDownPassword}
                      edge="end"
                    >
                      {showPsw ? <VisibilityOff /> : <Visibility />}
                    </IconButton>
                  </InputAdornment>
                ),
              }}
            />
          </FormControl>
          <FormControl component="fieldset" fullWidth margin="normal">
            <FormLabel component="legend">Daily Pickup Limit</FormLabel>
            <RadioGroup
              style={{ display: "flex", flexDirection: "row" }}
              // aria-label="daily-pickup-limit"
              name="limit"
              value={limit}
              onChange={(e) => setLimit(e.target.value)}
            >
              <FormControlLabel
                value="50kg"
                control={<Radio />}
                label="50 kg"
                onPress={() => setLimit('50kg')}
              />
              <FormControlLabel
                value="500kg"
                control={<Radio />}
                label="500 kg"
                onPress={() => setLimit('500kg')}
              />
              <FormControlLabel
                value="1000kg"
                control={<Radio />}
                label="1000 kg"
                onPress={() => setLimit('1000kg')}
              />
            </RadioGroup>
          </FormControl>
          <Button
            fullWidth
            type="submit"
            variant="contained"
            onClick={handleSubmit}
            style={{
              color: "white",
              height: "50px",
              marginTop: "15px",
              borderRadius: "3px",
              backgroundColor: "#1BABAA",
            }}
            disabled={loading}
          >
            {loading ? "Creating Account..." : "Create Account"}
          </Button>
        </Box>
      </div>
    </div>
  );
}
