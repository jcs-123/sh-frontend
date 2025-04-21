import React, { useEffect, useState } from "react";
import {
  Box,
  Container,
  Typography,
  Table,
  TableHead,
  TableRow,
  TableCell,
  TableBody,
  Paper,
  Checkbox,
  Button,
  CircularProgress,
  Stack,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  TextField,
} from "@mui/material";
import axios from "axios";
import * as XLSX from "xlsx";
import { saveAs } from "file-saver";
import LogoutIcon from "@mui/icons-material/Logout";
import { useNavigate } from 'react-router-dom'; // <-- Import useNavigate


const MinimumQuantityReport = () => {
  const [stocks, setStocks] = useState([]);
  const [loading, setLoading] = useState(true);
  const [notedItems, setNotedItems] = useState({});
  const [editDialogOpen, setEditDialogOpen] = useState(false);
  const [editItem, setEditItem] = useState(null);
  const navigate = useNavigate(); // <-- Initialize navigate

  useEffect(() => {
    fetchStocks();
  }, []);

  const fetchStocks = async () => {
    try {
      const res = await axios.get("http://localhost:5000/api/stocks");
      const lowStockItems = res.data.filter(
        (item) => parseInt(item.quantity) < parseInt(item.minQuantity)
      );
      setStocks(lowStockItems);
    } catch (error) {
      console.error("Failed to fetch stock:", error.message);
    } finally {
      setLoading(false);
    }
  };

  const handleCheckboxChange = (id) => {
    setNotedItems((prev) => ({ ...prev, [id]: !prev[id] }));
  };

  const handleEditClick = (item) => {
    setEditItem({ ...item });
    setEditDialogOpen(true);
  };

  const handleEditChange = (e) => {
    const { name, value } = e.target;
    setEditItem((prev) => ({ ...prev, [name]: value }));
  };

  const handleEditSave = async () => {
    try {
      await axios.put(`http://localhost:5000/api/stocks/${editItem._id}`, {
        quantity: editItem.quantity,
        minQuantity: editItem.minQuantity,
      });
      fetchStocks(); // Refresh list
      setEditDialogOpen(false);
    } catch (error) {
      console.error("Update failed:", error.message);
    }
  };

  const handleExportExcel = () => {
    const exportData = stocks.map((item) => ({
      "Item Name": item.itemName,
      "Code": item.code,
      "Current Quantity": item.quantity,
      "Minimum Quantity": item.minQuantity,
      "Noted": notedItems[item._id] ? "Yes" : "No",
    }));
  
    const worksheet = XLSX.utils.json_to_sheet(exportData);
    const workbook = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(workbook, worksheet, "Low Stock Report");
  
    const excelBuffer = XLSX.write(workbook, { bookType: "xlsx", type: "array" });
    const data = new Blob([excelBuffer], { type: "application/octet-stream" });
    saveAs(data, `Minimum_Quantity_Report_${new Date().toISOString().split("T")[0]}.xlsx`);
  };
  
  

  

  return (
    <Container maxWidth="lg" sx={{ mt: 6 }}>
       <Box
        display="flex"
        justifyContent="space-between"
        alignItems="center"
        sx={{ mb: 3 }}
      >
        <Typography variant="h4" fontWeight="bold">
        ⚠️ Minimum Quantity Report
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

      
      

      {loading ? (
        <Box display="flex" justifyContent="center" mt={4}>
          <CircularProgress />
        </Box>
      ) : (
        <Paper elevation={3} sx={{ p: 2 }}>
          <Stack direction="row" spacing={2} justifyContent="flex-end" mb={2}>
            <Button variant="outlined" onClick={handleExportExcel}>
              📥 Export to Excel
            </Button>
      
          </Stack>

          <Table>
            <TableHead>
              <TableRow>
                <TableCell><strong>Item Name</strong></TableCell>
                <TableCell><strong>Code</strong></TableCell>
                <TableCell><strong>Current Quantity</strong></TableCell>
                <TableCell><strong>Minimum Quantity</strong></TableCell>
                <TableCell><strong>Noted</strong></TableCell>
                <TableCell><strong>Edit</strong></TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {stocks.map((item) => (
                <TableRow key={item._id}>
                  <TableCell>{item.itemName}</TableCell>
                  <TableCell>{item.code}</TableCell>
                  <TableCell>{item.quantity}</TableCell>
                  <TableCell>{item.minQuantity}</TableCell>
                  <TableCell>
                    <Checkbox
                      checked={!!notedItems[item._id]}
                      onChange={() => handleCheckboxChange(item._id)}
                    />
                  </TableCell>
                  <TableCell>
                    <Button
                      variant="outlined"
                      size="small"
                      onClick={() => handleEditClick(item)}
                    >
                      ✏️ Edit
                    </Button>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </Paper>
      )}

      {/* Edit Dialog */}
      <Dialog open={editDialogOpen} onClose={() => setEditDialogOpen(false)}>
        <DialogTitle>Edit Stock Item</DialogTitle>
        <DialogContent sx={{ mt: 1 }}>
          <TextField
            margin="dense"
            label="Quantity"
            type="number"
            name="quantity"
            fullWidth
            value={editItem?.quantity || ""}
            onChange={handleEditChange}
          />
          <TextField
            margin="dense"
            label="Minimum Quantity"
            type="number"
            name="minQuantity"
            fullWidth
            value={editItem?.minQuantity || ""}
            onChange={handleEditChange}
          />
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setEditDialogOpen(false)}>Cancel</Button>
          <Button onClick={handleEditSave} variant="contained">
            Save
          </Button>
        </DialogActions>
      </Dialog>
    </Container>
  );
};

export default MinimumQuantityReport;
