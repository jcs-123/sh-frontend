import React, { useEffect, useState } from "react";
import axios from "axios";
import { Card, CardContent, Typography, Box, Grid, Container } from "@mui/material";
import MonetizationOnIcon from "@mui/icons-material/MonetizationOn";
import Inventory2Icon from "@mui/icons-material/Inventory2";
import ReceiptIcon from "@mui/icons-material/Receipt";
import AttachMoneyIcon from "@mui/icons-material/AttachMoney";
import TrendingUpIcon from "@mui/icons-material/TrendingUp";

const AdminSummary = () => {
  const [totalPurchase, setTotalPurchase] = useState(0);
  const [totalStockItems, setTotalStockItems] = useState(0);
  const [totalBills, setTotalBills] = useState(0);
  const [totalSales, setTotalSales] = useState(0);
  const [totalProfit, setTotalProfit] = useState(0);

  useEffect(() => {
    const fetchSummary = async () => {
      try {
        const response = await axios.get("https://shbookstall-server.onrender.com/api/dashboard/totalpurchase");
        setTotalPurchase(response.data.totalPurchase);
        setTotalStockItems(response.data.totalStockItems);
        setTotalBills(response.data.totalBills);
        setTotalSales(response.data.totalSales);
        setTotalProfit(response.data.totalProfit);
      } catch (error) {
        console.error("Error fetching data:", error.message);
      }
    };

    fetchSummary();
  }, []);

  const summaryData = [
    {
      title: "Total Purchase",
      value: `₹ ${totalPurchase.toFixed(2)}`,
      icon: <MonetizationOnIcon color="primary" sx={{ fontSize: 48 }} />,
      bgColor: "#e3f2fd",
    },
    {
      title: "Total Stock Entries",
      value: totalStockItems,
      icon: <Inventory2Icon color="secondary" sx={{ fontSize: 48 }} />,
      bgColor: "#e8f5e9",
    },
    {
      title: "Total Bills",
      value: totalBills,
      icon: <ReceiptIcon color="success" sx={{ fontSize: 48 }} />,
      bgColor: "#c8e6c9",
    },
    {
      title: "Total Sales",
      value: `₹ ${totalSales.toFixed(2)}`,
      icon: <AttachMoneyIcon color="warning" sx={{ fontSize: 48 }} />,
      bgColor: "#fff9c4",
    },
    {
        title: "Total Profit",
        value: `₹ ${Math.abs(totalProfit).toFixed(2)}`,
        icon: <TrendingUpIcon color="success" sx={{ fontSize: 48 }} />,
        bgColor: "#dcedc8",
      }
      
  ];

  return (
    <Container maxWidth="lg">
      <Card
        sx={{
          mt: 4,
          boxShadow: 4,
          borderRadius: 4,
          backgroundColor: "#f0f4f7",
          px: 4,
          py: 5,
        }}
      >
        <CardContent>
          <Typography
            variant="h4"
            fontWeight="bold"
            color="primary"
            align="center"
            gutterBottom
          >
            Admin Dashboard Summary
          </Typography>
          <Grid container spacing={4} justifyContent="center">
            {summaryData.map((item, index) => (
              <Grid key={index} item xs={12} sm={6} md={4} lg={3}>
                <Box
                  display="flex"
                  flexDirection="column"
                  alignItems="center"
                  justifyContent="center"
                  sx={{
                    backgroundColor: item.bgColor,
                    padding: 3,
                    borderRadius: 3,
                    boxShadow: 2,
                    textAlign: "center",
                    height: "100%",
                  }}
                >
                  {item.icon}
                  <Typography variant="subtitle1" color="textSecondary" mt={1}>
                    {item.title}
                  </Typography>
                  <Typography variant="h5" fontWeight="bold" mt={1}>
                    {item.value}
                  </Typography>
                </Box>
              </Grid>
            ))}
          </Grid>
        </CardContent>
      </Card>
    </Container>
  );
};

export default AdminSummary;
