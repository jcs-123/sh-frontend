import React, { useEffect, useState } from "react";
import axios from "axios";
import { Box, Typography, Paper, Table, TableHead, TableRow, TableCell, TableBody } from "@mui/material";

const PurchaseHistory = () => {
  const [stocks, setStocks] = useState([]);
  const [error, setError] = useState(null);

  // Fetch stocks on mount
  useEffect(() => {
    // Fetch all stocks data from the backend
    axios.get("https://bookstall-server-jqrx.onrender.com/api/stocks")
      .then(res => {
        console.log(res.data);  // Log the response to see the structure
        setStocks(res.data);
      })
      .catch(err => {
        console.error("Error fetching stocks:", err);
        setError("Failed to fetch stocks");
      });
  }, []);

  // Function to update purchase history
  const updatePurchaseHistory = (stockId, newHistory) => {
    // Send PUT request to update purchase history
    axios.put(`https://bookstall-server-jqrx.onrender.com/api/stocks/${stockId}`, {
      // Assuming purchaseHistory is an array and we are adding new history to it
      $push: { purchaseHistory: newHistory },  // Use MongoDB's $push to add to the array
    })
      .then(res => {
        // Update stocks state with the updated stock data
        setStocks(stocks.map(stock => stock._id === stockId ? res.data.stock : stock));
      })
      .catch(err => console.error("Error updating purchase history:", err));
  };

  return (
    <Box sx={{ p: 3 }}>
      <Typography variant="h4" gutterBottom>📜 Purchase History</Typography>
      
      {error && <Typography color="error">{error}</Typography>}
      
      <Paper>
        <Table>
          <TableHead>
            <TableRow>
              <TableCell>Item Name</TableCell>
              <TableCell>Date</TableCell>
              <TableCell>Quantity Added</TableCell>
              <TableCell>Vendor</TableCell>
              <TableCell>Edited By</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {/* Loop through all stocks and their purchase history */}
            {stocks.length === 0 ? (
              <TableRow>
                <TableCell colSpan={5} align="center">
                  No purchase history available.
                </TableCell>
              </TableRow>
            ) : (
              stocks.map(stock => 
                stock.purchaseHistory && stock.purchaseHistory.length > 0 ? 
                stock.purchaseHistory.map((hist, idx) => (
                  <TableRow key={stock._id + idx}>
                    <TableCell>{stock.itemName}</TableCell>
                    <TableCell>{new Date(hist.date).toLocaleString()}</TableCell>
                    <TableCell>{hist.quantityAdded}</TableCell>
                    <TableCell>{hist.vendorDetails}</TableCell>
                    <TableCell>{hist.editedBy}</TableCell>
                  </TableRow>
                )) : null
              )
            )}
          </TableBody>
        </Table>
      </Paper>
    </Box>
  );
};

export default PurchaseHistory;
