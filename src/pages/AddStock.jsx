import React, { useState, useEffect } from "react";
import {
  Box,
  Stack,
  TextField,
  Typography,
  Paper,
  Button,
  Divider,
  Snackbar,
  Alert,
} from "@mui/material";
import LogoutIcon from "@mui/icons-material/Logout";
import axios from "axios";
import { useNavigate, useLocation } from "react-router-dom";

const AddStock = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const stockToEdit = location.state?.stock;

  const [formData, setFormData] = useState({
    itemName: "",
    code: "", // now manually entered
    purchaseRate: "",
    retailRate: "",
    vendorDetails: "",
    quantity: "",
    minQuantity: "",
  });

  const [errors, setErrors] = useState({});
  const [snackOpen, setSnackOpen] = useState(false);
  const [snackMessage, setSnackMessage] = useState("");
  const [snackSeverity, setSnackSeverity] = useState("success");

  useEffect(() => {
    if (stockToEdit) {
      // Edit Mode
      setFormData({
        itemName: stockToEdit.itemName,
        code: stockToEdit.code,
        purchaseRate: stockToEdit.purchaseRate,
        retailRate: stockToEdit.retailRate,
        vendorDetails: stockToEdit.vendorDetails,
        quantity: stockToEdit.quantity,
        minQuantity: stockToEdit.minQuantity,
      });
    }
  }, [stockToEdit]);

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const validateForm = () => {
    const newErrors = {};
    for (const key in formData) {
      if (!formData[key]) newErrors[key] = "Required";
    }
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!validateForm()) return;

    const stockData = {
      ...formData,
      totalValue:
        parseFloat(formData.purchaseRate) * parseFloat(formData.quantity),
      editedBy: "Admin",
    };

    try {
      if (stockToEdit) {
        // Edit Mode
        await axios.put(
          `https://bookstall-server-jqrx.onrender.com/api/stocks/${stockToEdit._id}`,
          stockData
        );
        setSnackMessage("Stock updated successfully!");
      } else {
        // Add Mode
        await axios.post("https://bookstall-server-jqrx.onrender.com/api/stocks", stockData);
        setSnackMessage("Stock added successfully!");
      }

      setSnackSeverity("success");
      setSnackOpen(true);

      setTimeout(() => {
        navigate("/stock-list");
      }, 2000);
    } catch (err) {
      setSnackMessage(err.response?.data?.error || "Error saving stock");
      setSnackSeverity("error");
      setSnackOpen(true);
    }
  };

  const handleLogout = () => {
    localStorage.clear();
    sessionStorage.clear();
    navigate("/login");
  };

  return (
    <Box>
      {/* Header */}
      <Box
        sx={{
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
          px: 4,
          py: 2,
          background: "linear-gradient(to right, #1e3c72, #2a5298)",
          color: "white",
          boxShadow: "0 4px 12px rgba(0,0,0,0.1)",
          borderBottom: "2px solid #ccc",
        }}
      >
        <Typography
          variant="h6"
          sx={{
            fontWeight: "bold",
            letterSpacing: 1,
            display: "flex",
            alignItems: "center",
          }}
        >
          📦 Bookstall Automation –{" "}
          <span style={{ marginLeft: 8 }}>Stock Entry</span>
        </Typography>

        <Button
          variant="contained"
          onClick={handleLogout}
          sx={{
            backgroundColor: "#ffffff22",
            color: "#fff",
            borderRadius: "30px",
            px: 3,
            py: 1,
            fontWeight: "bold",
            textTransform: "none",
            boxShadow: "none",
            "&:hover": {
              backgroundColor: "#ffffff33",
            },
          }}
          startIcon={<LogoutIcon />}
        >
          Logout
        </Button>
      </Box>

      {/* Form */}
      <Box sx={{ display: "flex", justifyContent: "center", mt: 4 }}>
        <Paper
          elevation={6}
          sx={{
            padding: 5,
            width: "100%",
            maxWidth: "600px",
            backgroundColor: "#f9fafb",
          }}
        >
          <Typography variant="h4" align="center" gutterBottom>
            {stockToEdit ? "✏️ Edit Stock Item" : "➕ Add Stock Item"}
          </Typography>
          <Divider sx={{ mb: 3 }} />

          <form onSubmit={handleSubmit}>
            <Stack spacing={3}>
              <TextField
                label="Item Name"
                name="itemName"
                fullWidth
                value={formData.itemName}
                onChange={handleChange}
                error={!!errors.itemName}
                helperText={errors.itemName}
              />
              <TextField
                label="Item Code (Barcode)"
                name="code"
                fullWidth
                value={formData.code}
                onChange={handleChange}
                error={!!errors.code}
                helperText={errors.code}
              />
              <TextField
                label="Purchase Rate"
                name="purchaseRate"
                type="number"
                fullWidth
                value={formData.purchaseRate}
                onChange={handleChange}
                error={!!errors.purchaseRate}
                helperText={errors.purchaseRate}
              />
              <TextField
                label="Retail Rate"
                name="retailRate"
                type="number"
                fullWidth
                value={formData.retailRate}
                onChange={handleChange}
                error={!!errors.retailRate}
                helperText={errors.retailRate}
              />
              <TextField
                label="Vendor Details"
                name="vendorDetails"
                fullWidth
                value={formData.vendorDetails}
                onChange={handleChange}
                error={!!errors.vendorDetails}
                helperText={errors.vendorDetails}
              />
              <TextField
                label="Quantity"
                name="quantity"
                type="number"
                fullWidth
                value={formData.quantity}
                onChange={handleChange}
                error={!!errors.quantity}
                helperText={errors.quantity}
              />
              <TextField
                label="Minimum Quantity"
                name="minQuantity"
                type="number"
                fullWidth
                value={formData.minQuantity}
                onChange={handleChange}
                error={!!errors.minQuantity}
                helperText={errors.minQuantity}
              />

              <Button type="submit" variant="contained" color="primary" size="large">
                {stockToEdit ? "Update Stock" : "Add Stock"}
              </Button>
            </Stack>
          </form>
        </Paper>
      </Box>

      {/* Snackbar */}
      <Snackbar
        open={snackOpen}
        autoHideDuration={3000}
        onClose={() => setSnackOpen(false)}
        anchorOrigin={{ vertical: "bottom", horizontal: "center" }}
      >
        <Alert
          onClose={() => setSnackOpen(false)}
          severity={snackSeverity}
          sx={{ width: "100%" }}
        >
          {snackMessage}
        </Alert>
      </Snackbar>
    </Box>
  );
};

export default AddStock;
