import React, { useState, useEffect } from "react";
import {
  Box,
  Paper,
  Typography,
  TextField,
  Stack,
  Button,
  MenuItem,
  Table,
  TableHead,
  TableRow,
  TableCell,
  TableBody,
  Divider,
  IconButton,
  Tooltip,
} from "@mui/material";
import DeleteIcon from "@mui/icons-material/Delete";
import axios from "axios";
import * as XLSX from "xlsx";
import "jspdf-autotable";
import LogoutIcon from "@mui/icons-material/Logout";
import { useNavigate } from 'react-router-dom'; // <-- Import useNavigate


const DamageReturn = () => {
  const [formData, setFormData] = useState({
    itemName: "",
    code: "",
    quantity: "",
    damageType: "",
    description: "",
  });

  const [damageHistory, setDamageHistory] = useState([]);
  const damageTypes = ["Perished", "Return to Vendor", "Add-on"];
  const navigate = useNavigate(); // <-- Initialize navigate

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  // Export to Excel
  const handleExportExcel = () => {
    const exportData = damageHistory.map((item) => ({
      "Item Name": item.itemName,
      "Code": item.code,
      "Quantity": item.quantity,
      "Type": item.actionType,
      "Description": item.reason,
      "Date": new Date(item.date).toLocaleDateString(),
      "Handled By": item.user,
    }));

    const worksheet = XLSX.utils.json_to_sheet(exportData);
    const workbook = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(workbook, worksheet, "Damage History");

    XLSX.writeFile(workbook, "Damage_History.xlsx");
  };

  // Auto-fill item name from stock by code
  useEffect(() => {
    const fetchItemName = async () => {
      if (formData.code.trim()) {
        try {
          const res = await axios.get(`https://bookstall-server-jqrx.onrender.com/api/stocks/get-by-code/${formData.code}`);
          setFormData((prev) => ({ ...prev, itemName: res.data?.itemName || "" }));
        } catch (err) {
          setFormData((prev) => ({ ...prev, itemName: "" }));
        }
      }
    };

    fetchItemName();
  }, [formData.code]);

  const fetchDamageHistory = async () => {
    try {
      const res = await axios.get("https://bookstall-server-jqrx.onrender.com/api/damage-return/history");
      setDamageHistory(res.data);
    } catch (err) {
      console.error("Error fetching damage history", err);
    }
  };

  useEffect(() => {
    fetchDamageHistory();
  }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();

    const payload = {
      code: formData.code,
      actionType: formData.damageType,
      quantity: Number(formData.quantity),
      reason: formData.description,
      user: "Admin",
    };

    try {
      const res = await axios.post("https://bookstall-server-jqrx.onrender.com/api/damage-return/add", payload);
      alert(res.data.message);
      setFormData({ itemName: "", code: "", quantity: "", damageType: "", description: "" });
      fetchDamageHistory();
    } catch (err) {
      alert(err.response?.data?.message || "Something went wrong!");
    }
  };

  const handleDelete = async (id) => {
    if (window.confirm("Are you sure you want to delete this record?")) {
      try {
        await axios.delete(`https://bookstall-server-jqrx.onrender.com/api/damage-return/delete/${id}`);
        fetchDamageHistory();
      } catch (err) {
        alert("Failed to delete the record.");
      }
    }
  };

  return (
    <Box sx={{ p: 4 }}>
      <Box
        display="flex"
        justifyContent="space-between"
        alignItems="center"
        sx={{ mb: 3 }}
      >
        <Typography variant="h4" fontWeight="bold">
        🔧 Damage Return Management
        </Typography>

        <Button
          variant="outlined"
          color="primary"
          size="small"
          startIcon={<LogoutIcon />}
          onClick={() => {
            localStorage.removeItem("token");
            navigate("/login");
          }}
        >
          Logout
        </Button>

      </Box>

     
      <Paper elevation={3} sx={{ p: 3, mb: 5 }}>
        <Typography variant="h6" gutterBottom>Report Damaged Item</Typography>
        <form onSubmit={handleSubmit}>
          <Stack spacing={2}>
            <TextField label="Item Name (Auto-filled)" name="itemName" fullWidth value={formData.itemName} onChange={handleChange} disabled />
            <TextField label="Item Code" name="code" fullWidth value={formData.code} onChange={handleChange} required />
            <TextField label={formData.damageType === "Add-on" ? "Damaged Count" : "Quantity"} name="quantity" type="number" fullWidth value={formData.quantity} onChange={handleChange} required />
            <TextField label="Damage Type" name="damageType" select fullWidth value={formData.damageType} onChange={handleChange} required>
              {damageTypes.map((type) => <MenuItem key={type} value={type}>{type}</MenuItem>)}
            </TextField>
            <TextField label="Description / Reason" name="description" fullWidth multiline rows={3} value={formData.description} onChange={handleChange} />
            <Button type="submit" variant="contained" color="primary">➕ Submit Damage Report</Button>
          </Stack>
        </form>
      </Paper>

      <Paper elevation={2} sx={{ p: 2 }}>
        <Typography variant="h6" gutterBottom>📋 Damage History</Typography>
        {damageHistory.length === 0 ? (
          <Typography color="text.secondary">No damage records yet.</Typography>
        ) : (
          <>
          <Box sx={{ display: "flex", justifyContent: "flex-end", mb: 2 }}>
            <Button variant="outlined" color="success" onClick={handleExportExcel}>
              📥 Export to Excel
            </Button>
          </Box>
    
          <Table>
            
            <TableHead>
              <TableRow>
                <TableCell><strong>Item</strong></TableCell>
                <TableCell><strong>Code</strong></TableCell>
                <TableCell><strong>Qty</strong></TableCell>
                <TableCell><strong>Type</strong></TableCell>
                <TableCell><strong>Description</strong></TableCell>
                <TableCell><strong>Date</strong></TableCell>
                <TableCell><strong>Handled By</strong></TableCell>
                <TableCell><strong>Action</strong></TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {damageHistory.map((entry) => (
                <TableRow key={entry._id}>
                  <TableCell>{entry.itemName}</TableCell>
                  <TableCell>{entry.code}</TableCell>
                  <TableCell>{entry.quantity}</TableCell>
                  <TableCell>{entry.actionType}</TableCell>
                  <TableCell>{entry.reason}</TableCell>
                  <TableCell>{new Date(entry.date).toLocaleDateString()}</TableCell>
                  <TableCell>{entry.user}</TableCell>
                  <TableCell>
                    <Tooltip title="Delete">
                      <IconButton color="error" onClick={() => handleDelete(entry._id)}>
                        <DeleteIcon />
                      </IconButton>
                    </Tooltip>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
          </>
        )}
      </Paper>
    </Box>
  );
};

export default DamageReturn;
