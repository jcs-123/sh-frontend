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
  MenuItem,
} from "@mui/material";
import { useNavigate, useLocation } from "react-router-dom";
import axios from "axios";

const UpdateStock = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const stockToEdit = location.state?.stock;

  const [formData, setFormData] = useState({
    itemName: "",
    code: "",
    purchaseRate: "",
    retailRate: "",
    vendorDetails: "",
    quantity: "",
    minQuantity: "",
  });

  const [allStocks, setAllStocks] = useState([]);
  const [errors, setErrors] = useState({});
  const [snackOpen, setSnackOpen] = useState(false);
  const [snackMessage, setSnackMessage] = useState("");
  const [snackSeverity, setSnackSeverity] = useState("success");

  useEffect(() => {
    const fetchStocks = async () => {
      try {
        const res = await axios.get("https://bookstall-server-jqrx.onrender.com/api/stocks");
        setAllStocks(res.data);
      } catch (error) {
        console.error("Error fetching stock data:", error);
      }
    };
    fetchStocks();
  }, []);

  useEffect(() => {
    if (stockToEdit) {
      setFormData(stockToEdit);
    }
  }, [stockToEdit]);

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleItemNameChange = (e) => {
    const selectedItem = allStocks.find(item => item.itemName === e.target.value);
    if (selectedItem) {
      setFormData({
        ...selectedItem,
        minQuantity: selectedItem.minQuantity || "", // keep editable
        quantity: selectedItem.quantity || ""
      });
    }
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

    const updatedStock = {
      ...formData,
      totalValue: parseFloat(formData.purchaseRate) * parseFloat(formData.quantity),
      editedBy: "Admin",
    };

    try {
      await axios.put(
        `https://bookstall-server-jqrx.onrender.com/api/stocks/${formData._id}`,
        updatedStock
      );
      setSnackMessage("Stock updated successfully!");
      setSnackSeverity("success");
      setSnackOpen(true);
      setTimeout(() => {
        navigate("/stock-list");
      }, 2000);
    } catch (err) {
      setSnackMessage(err.response?.data?.error || "Update failed");
      setSnackSeverity("error");
      setSnackOpen(true);
    }
  };

  return (
    <Box sx={{ display: "flex", justifyContent: "center", mt: 4 }}>
      <Paper elevation={4} sx={{ padding: 5, maxWidth: "600px", width: "100%" }}>
        <Typography variant="h4" align="center" gutterBottom>
          ✏️ Update Stock Item
        </Typography>
        <Divider sx={{ mb: 3 }} />

        <form onSubmit={handleSubmit}>
          <Stack spacing={3}>
            {/* Item Name Dropdown */}
            <TextField
              select
              label="Item Name"
              name="itemName"
              fullWidth
              value={formData.itemName}
              onChange={handleItemNameChange}
              error={!!errors.itemName}
              helperText={errors.itemName}
            >
              {allStocks.map((stock) => (
                <MenuItem key={stock._id} value={stock.itemName}>
                  {stock.itemName}
                </MenuItem>
              ))}
            </TextField>

            {/* Other fields */}
            <TextField
              label="Item Code"
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
              Save Updates
            </Button>
            <Button
              variant="contained"
              color="primary"
              onClick={() => navigate("/stock-entry")}
            >
              ➕ Add Stock
            </Button>
          </Stack>
        </form>
      </Paper>

      <Snackbar
        open={snackOpen}
        autoHideDuration={3000}
        onClose={() => setSnackOpen(false)}
        anchorOrigin={{ vertical: "bottom", horizontal: "center" }}
      >
        <Alert severity={snackSeverity} sx={{ width: "100%" }}>
          {snackMessage}
        </Alert>
      </Snackbar>
    </Box>
  );
};

export default UpdateStock;
