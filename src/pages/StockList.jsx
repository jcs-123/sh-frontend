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
  TextField,
} from "@mui/material";
import { Edit } from "@mui/icons-material";
import axios from "axios";
import { useNavigate } from "react-router-dom";

const StockList = () => {
  const [stocks, setStocks] = useState([]);
  const [searchQuery, setSearchQuery] = useState("");
  const [snack, setSnack] = useState({ open: false, message: "", severity: "success" });

  const navigate = useNavigate();

  const fetchStocks = async () => {
    try {
      const res = await axios.get("https://shbookstall-server.onrender.com/api/stocks");
      setStocks(res.data);
    } catch (err) {
      console.error("Error fetching stocks:", err);
    }
  };

  useEffect(() => {
    fetchStocks();
  }, []);

  const filteredStocks = stocks.filter(
    (stock) =>
      stock.itemName.toLowerCase().includes(searchQuery.toLowerCase()) ||
      stock.code.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <Box sx={{ padding: 4 }}>
      <Typography variant="h4" gutterBottom>
        📋 Stock List
      </Typography>

      {/* Top Bar: Search on Left, Add Button on Right */}
      <Box
        sx={{
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
          mb: 2,
          flexWrap: "wrap",
          gap: 2,
        }}
      >
        {/* Search Box */}
        <TextField
          label="Search by Item Name or Code"
          variant="outlined"
          size="small"
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          sx={{ minWidth: 300 }}
        />

        {/* Add Stock Button */}
        <Button
          variant="contained"
          color="primary"
          onClick={() => navigate("/stock-entry")}
        >
          ➕ Add Stock
        </Button>
      </Box>

      <Paper elevation={3}>
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
              {filteredStocks.map((stock) => (
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
                  </TableCell>
                </TableRow>
              ))}
              {filteredStocks.length === 0 && (
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
