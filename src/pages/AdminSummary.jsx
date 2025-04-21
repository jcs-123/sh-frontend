import React, { useEffect, useState } from "react";
import axios from "axios";
import { Card, CardContent, Typography, Grid } from "@mui/material";
import { Store, Receipt, ShoppingCart, ShoppingBag, TrendingUp } from "@mui/icons-material";

const AdminSummary = () => {
  const [summary, setSummary] = useState({
    totalStockItems: 0,
    totalBills: 0,
    totalSales: 0,
    totalPurchase: 0,
    totalProfit: 0,
  });

  useEffect(() => {
    const fetchSummary = async () => {
      try {
        const res = await axios.get("/api/dashboard/summary");
        setSummary(res.data);
      } catch (err) {
        console.error("Error fetching summary:", err);
      }
    };

    fetchSummary();
  }, []);

  const items = [
    { label: "Total Stock Items", value: summary.totalStockItems, icon: <Store fontSize="large" color="primary" /> },
    { label: "Total Bills", value: summary.totalBills, icon: <Receipt fontSize="large" color="primary" /> },
    { label: "Total Sales", value: `₹${summary.totalSales}`, icon: <ShoppingBag fontSize="large" color="success" /> },
    { label: "Total Purchase", value: `₹${summary.totalPurchase}`, icon: <ShoppingCart fontSize="large" color="warning" /> },
    { label: "Total Profit", value: `₹${summary.totalProfit}`, icon: <TrendingUp fontSize="large" color="error" /> },
  ];

  return (
    <div style={{ padding: 20 }}>
      <Typography variant="h4" align="center" gutterBottom>
        📊 Admin Summary Report
      </Typography>
      <Grid container spacing={3} justifyContent="center">
        {items.map((item, index) => (
          <Grid item xs={10} sm={4} md={2} key={index}>
            <Card elevation={3} style={{ textAlign: "center" }}>
              <CardContent>
                <div>{item.icon}</div>
                <Typography variant="h6">{item.label}</Typography>
                <Typography variant="body1">{item.value}</Typography>
              </CardContent>
            </Card>
          </Grid>
        ))}
      </Grid>
    </div>
  );
};

export default AdminSummary;
