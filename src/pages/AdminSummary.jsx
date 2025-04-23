import React, { useEffect, useState } from "react";
import axios from "axios";
import { Card, CardContent, Typography, Box, Grid } from "@mui/material";
import MonetizationOnIcon from "@mui/icons-material/MonetizationOn";
import Inventory2Icon from "@mui/icons-material/Inventory2";
import ReceiptIcon from "@mui/icons-material/Receipt";
import AttachMoneyIcon from "@mui/icons-material/AttachMoney";  // Icon for total sales
import TrendingUpIcon from "@mui/icons-material/TrendingUp";  // Icon for total profit

const AdminSummary = () => {
  const [totalPurchase, setTotalPurchase] = useState(0);
  const [totalStockItems, setTotalStockItems] = useState(0);
  const [totalBills, setTotalBills] = useState(0);
  const [totalSales, setTotalSales] = useState(0);
  const [totalProfit, setTotalProfit] = useState(0);  // State to hold total profit

  useEffect(() => {
    const fetchSummary = async () => {
      try {
        const response = await axios.get("https://bookstall-server-jqrx.onrender.com/api/dashboard/totalpurchase");
        setTotalPurchase(response.data.totalPurchase);
        setTotalStockItems(response.data.totalStockItems);
        setTotalBills(response.data.totalBills);
        setTotalSales(response.data.totalSales);
        setTotalProfit(response.data.totalProfit);  // Set the total profit
      } catch (error) {
        console.error("Error fetching data:", error.message);
      }
    };

    fetchSummary();
  }, []);

  return (
    <Card sx={{
      maxWidth: 800,
      m: 3,
      boxShadow: 5,
      borderRadius: 3,
      backgroundColor: "#f0f4f7",
      padding: 2,
      display: 'flex',
      flexDirection: 'column',
      alignItems: 'center',
    }}>
      <CardContent sx={{ width: '100%' }}>
        <Typography variant="h4" fontWeight="bold" color="primary" gutterBottom align="center">
          Admin Dashboard Summary
        </Typography>
        <Grid container spacing={3} justifyContent="center">
          {/* Total Purchase */}
          <Grid item xs={12} sm={6} md={3}>
            <Box display="flex" flexDirection="column" alignItems="center" justifyContent="center" sx={{ backgroundColor: "#e3f2fd", padding: 3, borderRadius: 2, boxShadow: 2 }}>
              <MonetizationOnIcon color="primary" sx={{ fontSize: 48, marginBottom: 2 }} />
              <Typography variant="subtitle1" color="textSecondary">
                Total Purchase
              </Typography>
              <Typography variant="h5" color="primary" fontWeight="bold">
                ₹ {totalPurchase.toFixed(2)}
              </Typography>
            </Box>
          </Grid>

          {/* Total Stock Entries */}
          <Grid item xs={12} sm={6} md={3}>
            <Box display="flex" flexDirection="column" alignItems="center" justifyContent="center" sx={{ backgroundColor: "#e8f5e9", padding: 3, borderRadius: 2, boxShadow: 2 }}>
              <Inventory2Icon color="secondary" sx={{ fontSize: 48, marginBottom: 2 }} />
              <Typography variant="subtitle1" color="textSecondary">
                Total Stock Entries
              </Typography>
              <Typography variant="h5" color="secondary" fontWeight="bold">
                {totalStockItems}
              </Typography>
            </Box>
          </Grid>

          {/* Total Bills */}
          <Grid item xs={12} sm={6} md={3}>
            <Box display="flex" flexDirection="column" alignItems="center" justifyContent="center" sx={{ backgroundColor: "#c8e6c9", padding: 3, borderRadius: 2, boxShadow: 2 }}>
              <ReceiptIcon color="success" sx={{ fontSize: 48, marginBottom: 2 }} />
              <Typography variant="subtitle1" color="textSecondary">
                Total Bills
              </Typography>
              <Typography variant="h5" color="success" fontWeight="bold">
                {totalBills}
              </Typography>
            </Box>
          </Grid>

          {/* Total Sales */}
          <Grid item xs={12} sm={6} md={3}>
            <Box display="flex" flexDirection="column" alignItems="center" justifyContent="center" sx={{ backgroundColor: "#fff9c4", padding: 3, borderRadius: 2, boxShadow: 2 }}>
              <AttachMoneyIcon color="warning" sx={{ fontSize: 48, marginBottom: 2 }} />
              <Typography variant="subtitle1" color="textSecondary">
                Total Sales
              </Typography>
              <Typography variant="h5" color="warning" fontWeight="bold">
                ₹ {totalSales.toFixed(2)}
              </Typography>
            </Box>
          </Grid>

          {/* Total Profit */}
          <Grid item xs={12} sm={6} md={3}>
            <Box display="flex" flexDirection="column" alignItems="center" justifyContent="center" sx={{ backgroundColor: "#dcedc8", padding: 3, borderRadius: 2, boxShadow: 2 }}>
              <TrendingUpIcon color="success" sx={{ fontSize: 48, marginBottom: 2 }} />
              <Typography variant="subtitle1" color="textSecondary">
                Total Profit
              </Typography>
              <Typography variant="h5" color="success" fontWeight="bold">
                ₹ {totalProfit.toFixed(2)}
              </Typography>
            </Box>
          </Grid>
        </Grid>
      </CardContent>
    </Card>
  );
};

export default AdminSummary;
