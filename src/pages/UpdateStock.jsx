import React, { useState, useEffect } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import {
  TextField,
  Button,
  Snackbar,
  Alert,
  Typography,
  Box,
  MenuItem,
  Select,
  InputLabel,
  FormControl,
} from "@mui/material";
import AddCircleOutlineIcon from "@mui/icons-material/AddCircleOutline";

const UpdateStock = () => {
  const [formData, setFormData] = useState({
    _id: "",
    itemName: "",
    code: "",
    purchaseRate: "",
    retailRate: "",
    existingQuantity: "",
    quantityToAdd: "",
    minQuantity: "",
    vendorDetails: "",
  });

  const [allStocks, setAllStocks] = useState([]);
  const [errors, setErrors] = useState({});
  const [snackMessage, setSnackMessage] = useState("");
  const [snackSeverity, setSnackSeverity] = useState("success");
  const [snackOpen, setSnackOpen] = useState(false);

  const navigate = useNavigate();

  useEffect(() => {
    const fetchStocks = async () => {
      try {
        const response = await axios.get(
          "https://shbookstall-server.onrender.com/api/stocks"
        );
        setAllStocks(response.data);
      } catch (err) {
        console.error("Error fetching stocks: ", err);
      }
    };

    fetchStocks();
  }, []);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleItemNameChange = (e) => {
    const selectedItemName = e.target.value;
    const selectedItem = allStocks.find(
      (item) => item.itemName === selectedItemName
    );
    if (selectedItem) {
      setFormData({
        _id: selectedItem._id,
        itemName: selectedItem.itemName,
        code: selectedItem.code,
        purchaseRate: selectedItem.purchaseRate,
        retailRate: selectedItem.retailRate,
        vendorDetails: selectedItem.vendorDetails || "",
        minQuantity: selectedItem.minQuantity || "",
        existingQuantity: selectedItem.quantity || 0,
        quantityToAdd: "",
      });
    }
  };

  const validateForm = () => {
    const newErrors = {};
    if (!formData.itemName) newErrors.itemName = "Item Name is required";
    if (!formData.quantityToAdd) newErrors.quantityToAdd = "Quantity to Add is required";
    if (!formData.purchaseRate) newErrors.purchaseRate = "Purchase Rate is required";
    if (!formData.retailRate) newErrors.retailRate = "Retail Rate is required";
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!validateForm()) return;

    const { __v, ...updatedStock } = formData;
    updatedStock.editedBy = "Admin";

    try {
      const existingStock = allStocks.find(
        (item) => item._id === formData._id
      );

      if (existingStock) {
        // Update the quantity by adding the new quantity
        updatedStock.enteredQuantity = parseFloat(formData.quantityToAdd);
        updatedStock.quantity =
          parseFloat(existingStock.quantity) + parseFloat(formData.quantityToAdd);
        
      }

      // Calculate new total value: purchaseRate * updated quantity
      updatedStock.totalValue =
        parseFloat(updatedStock.purchaseRate) * parseFloat(updatedStock.quantity);

      await axios.put(
        `https://shbookstall-server.onrender.com/api/stocks/${formData._id}`,
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
    <Box
      maxWidth="600px"
      mx="auto"
      mt={5}
      p={3}
      boxShadow={3}
      borderRadius={2}
      bgcolor="#fff"
    >
      <Box textAlign="center" mb={3}>
        <Typography variant="h5" fontWeight="bold">
          <AddCircleOutlineIcon
            color="primary"
            sx={{ verticalAlign: "middle", mr: 1 }}
          />
          Update Stock Item
        </Typography>
      </Box>
      <form onSubmit={handleSubmit}>
        <FormControl fullWidth margin="normal" required error={!!errors.itemName}>
          <InputLabel>Item Name</InputLabel>
          <Select
            name="itemName"
            value={formData.itemName}
            label="Item Name"
            onChange={handleItemNameChange}
          >
            {allStocks.map((stock) => (
              <MenuItem key={stock._id} value={stock.itemName}>
                {stock.itemName}
              </MenuItem>
            ))}
          </Select>
        </FormControl>

        <TextField
          label="Item Code (Barcode)"
          name="code"
          value={formData.code}
          onChange={handleChange}
          fullWidth
          margin="normal"
        />

        <TextField
          label="Purchase Rate"
          name="purchaseRate"
          type="number"
          value={formData.purchaseRate}
          onChange={handleChange}
          fullWidth
          margin="normal"
          required
          error={!!errors.purchaseRate}
          helperText={errors.purchaseRate}
        />

        <TextField
          label="Retail Rate"
          name="retailRate"
          type="number"
          value={formData.retailRate}
          onChange={handleChange}
          fullWidth
          margin="normal"
          required
          error={!!errors.retailRate}
          helperText={errors.retailRate}
        />

        <TextField
          label="Vendor Details"
          name="vendorDetails"
          value={formData.vendorDetails}
          onChange={handleChange}
          fullWidth
          margin="normal"
        />

        {/* Existing Quantity */}
        <TextField
          label="Existing Quantity"
          name="existingQuantity"
          value={formData.existingQuantity}
          fullWidth
          margin="normal"
          InputProps={{
            readOnly: true,
          }}
        />

        {/* Quantity To Add */}
        <TextField
          label="Quantity To Add"
          name="quantityToAdd"
          type="number"
          value={formData.quantityToAdd}
          onChange={handleChange}
          fullWidth
          margin="normal"
          required
          error={!!errors.quantityToAdd}
          helperText={errors.quantityToAdd}
        />

        <TextField
          label="Minimum Quantity"
          name="minQuantity"
          type="number"
          value={formData.minQuantity}
          onChange={handleChange}
          fullWidth
          margin="normal"
        />

        <Button
          type="submit"
          variant="contained"
          color="primary"
          fullWidth
          sx={{ mt: 2 }}
        >
          Update Stock
        </Button>
      </form>

      <Snackbar
        open={snackOpen}
        autoHideDuration={2000}
        onClose={() => setSnackOpen(false)}
      >
        <Alert onClose={() => setSnackOpen(false)} severity={snackSeverity}>
          {snackMessage}
        </Alert>
      </Snackbar>
    </Box>
  );
};

export default UpdateStock;
