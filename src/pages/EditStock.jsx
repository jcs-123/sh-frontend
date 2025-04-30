import React, { useEffect, useState } from "react";
import {
  Container,
  Typography,
  Table,
  TableHead,
  TableRow,
  TableCell,
  TableBody,
  IconButton,
  Paper,
  CircularProgress,
  Box,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogContentText,
  DialogActions,
  Button,
  Snackbar,
  Alert,
  TextField
} from "@mui/material";
import { Edit, Delete } from "@mui/icons-material";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import * as XLSX from "xlsx";
import { saveAs } from "file-saver";
import LogoutIcon from "@mui/icons-material/Logout";

const EditStock = () => {
  const navigate = useNavigate();
  const [stocks, setStocks] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedStock, setSelectedStock] = useState(null);
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const [snack, setSnack] = useState({ open: false, message: "", severity: "success" });
  const [searchTerm, setSearchTerm] = useState("");

  const handleExportToExcel = () => {
    const formattedData = stocks.map(stock => ({
      "Item Name": stock.itemName,
      "Code": stock.code,
      "Purchase Rate": stock.purchaseRate,
      "Retail Rate": stock.retailRate,
      "Vendor": stock.vendorDetails,
      "Quantity": stock.quantity,
      "Min Quantity": stock.minQuantity,
    }));

    const worksheet = XLSX.utils.json_to_sheet(formattedData);
    const workbook = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(workbook, worksheet, "StockData");

    const excelBuffer = XLSX.write(workbook, {
      bookType: "xlsx",
      type: "array"
    });

    const data = new Blob([excelBuffer], { type: "application/octet-stream" });
    saveAs(data, `StockData_${new Date().toISOString().slice(0, 10)}.xlsx`);
  };

  const fetchStocks = async () => {
    try {
      const res = await axios.get("https://shbookstall-server.onrender.com/api/stocks");
      if (Array.isArray(res.data)) {
        setStocks(res.data);
      } else {
        setStocks([]);
        console.error("Stock data is not in array format.");
      }
    } catch (err) {
      console.error("Failed to fetch stocks:", err.message);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchStocks();
  }, []);

  const handleDelete = async () => {
    try {
      await axios.delete(`https://shbookstall-server.onrender.com/api/stocks/${selectedStock._id}`);
      setSnack({ open: true, message: "Stock item deleted successfully.", severity: "success" });
      setDeleteDialogOpen(false);
      fetchStocks(); // Refresh list
    } catch (error) {
      setSnack({ open: true, message: "Failed to delete stock item.", severity: "error" });
    }
  };

  // Filter stocks based on search term
  const filteredStocks = stocks.filter((stock) =>
    stock.itemName.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <Container maxWidth="lg" sx={{ mt: 6 }}>
      <Box display="flex" justifyContent="space-between" alignItems="center" sx={{ mb: 3 }}>
        <Typography variant="h4" fontWeight="bold">
          📋 Edit Stock
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

      <Paper elevation={3} sx={{ p: 2 }}>
        <Box display="flex" justifyContent="space-between" alignItems="center" mb={2}>
          <TextField
            label="Search by Item Name"
            variant="outlined"
            size="small"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
          <Button variant="outlined" onClick={handleExportToExcel}>
            Export to Excel
          </Button>
        </Box>
        {loading ? (
          <Box display="flex" justifyContent="center" alignItems="center" mt={4}>
            <CircularProgress />
          </Box>
        ) : (
          <Table>
            <TableHead>
              <TableRow>
                <TableCell><strong>Item Name</strong></TableCell>
                <TableCell><strong>Code</strong></TableCell>
                <TableCell><strong>Purchase Rate</strong></TableCell>
                <TableCell><strong>Retail Rate</strong></TableCell>
                <TableCell><strong>Vendor</strong></TableCell>
                <TableCell><strong>Quantity</strong></TableCell>
                <TableCell><strong>Min Qty</strong></TableCell>
                <TableCell><strong>Actions</strong></TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {filteredStocks.map((stock) => (
                <TableRow key={stock._id}>
                  <TableCell>{stock.itemName}</TableCell>
                  <TableCell>{stock.code}</TableCell>
                  <TableCell>{stock.purchaseRate}</TableCell>
                  <TableCell>{stock.retailRate}</TableCell>
                  <TableCell>{stock.vendorDetails}</TableCell>
                  <TableCell>{stock.quantity}</TableCell>
                  <TableCell>{stock.minQuantity}</TableCell>
                  <TableCell>
                    <IconButton
                      color="primary"
                      onClick={() => navigate("/add-stock", { state: { stock } })}
                    >
                      <Edit />
                    </IconButton>
                    <IconButton
                      color="error"
                      onClick={() => {
                        setSelectedStock(stock);
                        setDeleteDialogOpen(true);
                      }}
                    >
                      <Delete />
                    </IconButton>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        )}
      </Paper>

      {/* Delete Confirmation Dialog */}
      <Dialog
        open={deleteDialogOpen}
        onClose={() => setDeleteDialogOpen(false)}
      >
        <DialogTitle>Confirm Deletion</DialogTitle>
        <DialogContent>
          <DialogContentText>
            Are you sure you want to delete stock item: <strong>{selectedStock?.itemName}</strong>?
          </DialogContentText>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setDeleteDialogOpen(false)}>Cancel</Button>
          <Button color="error" onClick={handleDelete}>Delete</Button>
        </DialogActions>
      </Dialog>

      {/* Snackbar Notification */}
      <Snackbar
        open={snack.open}
        autoHideDuration={3000}
        onClose={() => setSnack({ ...snack, open: false })}
        anchorOrigin={{ vertical: "bottom", horizontal: "center" }}
      >
        <Alert
          onClose={() => setSnack({ ...snack, open: false })}
          severity={snack.severity}
          sx={{ width: "100%" }}
        >
          {snack.message}
        </Alert>
      </Snackbar>
    </Container>
  );
};

export default EditStock;
