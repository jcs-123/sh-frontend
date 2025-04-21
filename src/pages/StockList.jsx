import React, { useEffect, useState } from "react";
import {
  Box,
  Typography,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
  IconButton,
  Snackbar,
  Alert,
  Button,
} from "@mui/material";
import { Edit, Delete } from "@mui/icons-material";
import axios from "axios";
import { useNavigate } from "react-router-dom";

const StockList = () => {
  const [stocks, setStocks] = useState([]);
  const [snack, setSnack] = useState({ open: false, message: "", severity: "success" });

  const navigate = useNavigate();

  const fetchStocks = async () => {
    try {
      const res = await axios.get("https://bookstall-server-jqrx.onrender.com/api/stocks");
      setStocks(res.data);
    } catch (err) {
      console.error("Error fetching stocks:", err);
    }
  };

  useEffect(() => {
    fetchStocks();
  }, []);

  const handleDelete = async (id) => {
    try {
      await axios.delete(`https://bookstall-server-jqrx.onrender.com/api/stocks/${id}`);
      setSnack({ open: true, message: "Stock deleted successfully", severity: "success" });
      fetchStocks();
    } catch (err) {
      setSnack({ open: true, message: "Error deleting stock", severity: "error" });
    }
  };

  return (
    <Box sx={{ padding: 4 }}>
      <Box
        sx={{
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
        }}
      >
        <Typography variant="h4" gutterBottom>
          📋 Stock List
        </Typography>
        <Button
          variant="contained"
          color="primary"
          onClick={() => navigate("/stock-entry")} // ✅ updated route to match your Add Stock Item page
        >
          ➕ Add Stock
        </Button>
      </Box>

      <Paper elevation={3} sx={{ mt: 3 }}>
        <TableContainer>
          <Table>
            <TableHead sx={{ backgroundColor: "#f0f0f0" }}>
              <TableRow>
                <TableCell><b>Item Name</b></TableCell>
                <TableCell><b>Code</b></TableCell>
                <TableCell><b>Purchase Rate</b></TableCell>
                <TableCell><b>Retail Rate</b></TableCell>
                <TableCell><b>Quantity</b></TableCell>
                <TableCell><b>Min Quantity</b></TableCell>
                <TableCell><b>Total Value</b></TableCell>
                <TableCell align="center"><b>Actions</b></TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {stocks.map((stock) => (
                <TableRow key={stock._id}>
                  <TableCell>{stock.itemName}</TableCell>
                  <TableCell>{stock.code}</TableCell>
                  <TableCell>₹{stock.purchaseRate}</TableCell>
                  <TableCell>₹{stock.retailRate}</TableCell>
                  <TableCell>{stock.quantity}</TableCell>
                  <TableCell>{stock.minQuantity}</TableCell>
                  <TableCell>₹{stock.totalValue}</TableCell>
                  <TableCell align="center">
                    <IconButton color="primary" onClick={() => navigate(`/edit-stock/${stock._id}`)}>
                      <Edit />
                    </IconButton>
                    <IconButton color="error" onClick={() => handleDelete(stock._id)}>
                      <Delete />
                    </IconButton>
                  </TableCell>
                </TableRow>
              ))}
              {stocks.length === 0 && (
                <TableRow>
                  <TableCell colSpan={8} align="center">
                    No stock records found.
                  </TableCell>
                </TableRow>
              )}
            </TableBody>
          </Table>
        </TableContainer>
      </Paper>

      <Snackbar
        open={snack.open}
        autoHideDuration={3000}
        onClose={() => setSnack({ ...snack, open: false })}
        anchorOrigin={{ vertical: "bottom", horizontal: "center" }}
      >
        <Alert severity={snack.severity}>{snack.message}</Alert>
      </Snackbar>
    </Box>
  );
};

export default StockList;
