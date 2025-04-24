import React, { useEffect, useState } from "react";
import axios from "axios";
import {
  Box, Typography, Paper, Table, TableHead, TableRow,
  TableCell, TableBody
} from "@mui/material";

const PurchaseHistory = () => {
  const [stocks, setStocks] = useState([]);

  useEffect(() => {
    axios.get("https://bookstall-server-jqrx.onrender.com/api/stocks")
      .then(res => setStocks(res.data))
      .catch(err => console.error(err));
  }, []);

  return (
    <Box sx={{ p: 3 }}>
      <Typography variant="h4" gutterBottom>📜 Purchase History</Typography>
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
            {stocks.flatMap(stock =>
              stock.purchaseHistory?.map((hist, idx) => (
                <TableRow key={stock._id + idx}>
                  <TableCell>{stock.itemName}</TableCell>
                  <TableCell>{new Date(hist.date).toLocaleString()}</TableCell>
                  <TableCell>{hist.quantityAdded}</TableCell>
                  <TableCell>{hist.vendorDetails}</TableCell>
                  <TableCell>{hist.editedBy}</TableCell>
                </TableRow>
              ))
            )}
          </TableBody>
        </Table>
      </Paper>
    </Box>
  );
};

export default PurchaseHistory;
