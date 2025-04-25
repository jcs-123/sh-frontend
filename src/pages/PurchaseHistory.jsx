import React, { useEffect, useState } from "react";
import axios from "axios";
import {
  Box,
  Typography,
  Paper,
  Table,
  TableHead,
  TableRow,
  TableCell,
  TableBody,
  Button,
} from "@mui/material";

const PurchaseHistory = () => {
  const [stocks, setStocks] = useState([]);
  const [error, setError] = useState(null);

  // Fetch all stocks on mount
  useEffect(() => {
    axios
      .get("https://bookstall-server-jqrx.onrender.com/api/stocks")
      .then((res) => setStocks(res.data))
      .catch((err) => {
        console.error("Error fetching stocks:", err);
        setError("Failed to fetch stocks");
      });
  }, []);

  // ✅ Delete a specific purchaseHistory entry
  const deletePurchaseHistory = async (stockId, historyId) => {
    try {
      const res = await axios.delete(`https://bookstall-server-jqrx.onrender.com/api/stocks/${stockId}/delete-history`, {
        data: { historyId }, // ✅ only send historyId
        headers: {
          "Content-Type": "application/json",
        }
      });
  
      // Update frontend state
      setStocks(stocks.map(stock =>
        stock._id === stockId
          ? { ...stock, purchaseHistory: stock.purchaseHistory.filter(hist => hist._id !== historyId) }
          : stock
      ));
    } catch (err) {
      console.error("Error deleting purchase history:", err);
    }
  };
  

  return (
    <Box sx={{ p: 3 }}>
      <Typography variant="h4" gutterBottom>
        📜 Purchase History
      </Typography>

      {error && (
        <Typography color="error" sx={{ mb: 2 }}>
          {error}
        </Typography>
      )}

      <Paper>
        <Table>
          <TableHead>
            <TableRow>
              <TableCell>Item Name</TableCell>
              <TableCell>Date</TableCell>
              <TableCell>Quantity Added</TableCell>
              <TableCell>Vendor</TableCell>
              <TableCell>Edited By</TableCell>
              <TableCell>Actions</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {stocks.length === 0 ? (
              <TableRow>
                <TableCell colSpan={6} align="center">
                  No purchase history available.
                </TableCell>
              </TableRow>
            ) : (
              stocks.map((stock) =>
                stock.purchaseHistory && stock.purchaseHistory.length > 0
                  ? stock.purchaseHistory.map((hist) => (
                      <TableRow key={hist._id}>
                        <TableCell>{stock.itemName}</TableCell>
                        <TableCell>
                          {new Date(hist.date).toLocaleString()}
                        </TableCell>
                        <TableCell>{hist.quantityAdded}</TableCell>
                        <TableCell>{hist.vendorDetails}</TableCell>
                        <TableCell>{hist.editedBy}</TableCell>
                        <TableCell>
                          <Button
                            variant="outlined"
                            color="error"
                            onClick={() =>
                              deletePurchaseHistory(stock._id, hist._id)
                            }
                          >
                            Delete
                          </Button>
                        </TableCell>
                      </TableRow>
                    ))
                  : null
              )
            )}
          </TableBody>
        </Table>
      </Paper>
    </Box>
  );
};

export default PurchaseHistory;
