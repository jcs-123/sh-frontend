import React, { useState, useEffect, useCallback, useMemo } from "react";
import {
  Button, Box, Typography, Paper, Grid, Menu, MenuItem, Divider, Tooltip,
  CircularProgress, Card, CardContent
} from "@mui/material";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import AssessmentIcon from "@mui/icons-material/Assessment";
import InventoryIcon from "@mui/icons-material/Inventory";
import ReceiptIcon from "@mui/icons-material/Receipt";
import PersonIcon from "@mui/icons-material/Person";
import TrendingUpIcon from '@mui/icons-material/TrendingUp';
import LocalMallIcon from '@mui/icons-material/LocalMall';
import ShoppingCartCheckoutIcon from '@mui/icons-material/ShoppingCartCheckout';
import AccountBalanceWalletIcon from '@mui/icons-material/AccountBalanceWallet';
import DescriptionIcon from '@mui/icons-material/Description';

const AdminDashboard = () => {
  const navigate = useNavigate();

  const [anchorEl, setAnchorEl] = useState(null);
  const [loading, setLoading] = useState(false);
  const open = Boolean(anchorEl);

  const [summary, setSummary] = useState(null);

  const handleClick = useCallback((event) => {
    setAnchorEl(event.currentTarget);
  }, []);

  const handleClose = useCallback(() => {
    setAnchorEl(null);
  }, []);

  const handleReportNavigation = useCallback((path) => {
    setLoading(true);
    navigate(path);
    setLoading(false);
  }, [navigate]);

  const menuItems = useMemo(() => [
    { label: "Stock Report", action: () => handleReportNavigation("/stock-report") },
    { label: "Day Book Report", action: () => handleReportNavigation("/daybook-report") },
  ], [handleReportNavigation]);

  // ✅ Fetch dashboard summary on mount
  useEffect(() => {
    const fetchSummary = async () => {
      try {
        const res = await axios.get("/api/dashboard/summary");
        setSummary(res.data);
      } catch (err) {
        console.error("Failed to load dashboard summary", err);
      }
    };
    fetchSummary();
  }, []);

  return (
    <Paper sx={{ p: 4, mt: 4, mx: "auto", maxWidth: "1000px", borderRadius: 3, boxShadow: 6 }}>
      <Typography variant="h3" fontWeight="bold" gutterBottom align="center" color="primary.main">
        🛠️ Admin Dashboard
      </Typography>
      <Divider sx={{ mb: 3 }} />

      {/* 🧾 Dashboard Summary */}
      <Typography variant="h5" fontWeight="bold" gutterBottom color="text.secondary">
        📊 Overview Summary
      </Typography>
      <Grid container spacing={2} mb={3}>
        <Grid item xs={12} sm={6} md={4}>
          <Card>
            <CardContent>
              <Typography variant="h6"><InventoryIcon /> Total Stock Items</Typography>
              <Typography variant="h5" color="primary">{summary?.totalStockItems ?? "..."}</Typography>
            </CardContent>
          </Card>
        </Grid>

        <Grid item xs={12} sm={6} md={4}>
          <Card>
            <CardContent>
              <Typography variant="h6"><ReceiptIcon /> Total Bills</Typography>
              <Typography variant="h5" color="primary">{summary?.totalBills ?? "..."}</Typography>
            </CardContent>
          </Card>
        </Grid>

        <Grid item xs={12} sm={6} md={4}>
          <Card>
            <CardContent>
              <Typography variant="h6"><LocalMallIcon /> Total Sales</Typography>
              <Typography variant="h5" color="green">{summary?.totalSales?.toFixed(2) ?? "..."}</Typography>
            </CardContent>
          </Card>
        </Grid>

        <Grid item xs={12} sm={6} md={4}>
          <Card>
            <CardContent>
              <Typography variant="h6"><ShoppingCartCheckoutIcon /> Total Purchase</Typography>
              <Typography variant="h5" color="orange">{summary?.totalPurchase?.toFixed(2) ?? "..."}</Typography>
            </CardContent>
          </Card>
        </Grid>

        <Grid item xs={12} sm={6} md={4}>
          <Card>
            <CardContent>
              <Typography variant="h6"><TrendingUpIcon /> Total Profit</Typography>
              <Typography variant="h5" color="green">{summary?.totalProfit?.toFixed(2) ?? "..."}</Typography>
            </CardContent>
          </Card>
        </Grid>
      </Grid>

      {/* Main Actions */}
      <Grid container spacing={3} justifyContent="center">
        <Grid>
          <Tooltip title="Manage your stock inventory" arrow>
            <Button
              variant="contained"
              sx={{ backgroundColor: "success.main", '&:hover': { backgroundColor: "success.dark" } }}
              onClick={() => navigate("/edit-stock")}
              startIcon={<InventoryIcon sx={{ fontSize: 30 }} />}
            >
              Manage Stock
            </Button>
          </Tooltip>
        </Grid>

        <Grid>
          <Tooltip title="View your billing records" arrow>
            <Button
              variant="contained"
              sx={{ backgroundColor: "info.main", '&:hover': { backgroundColor: "info.dark" } }}
              onClick={() => navigate("/billing-records")}
              startIcon={<ReceiptIcon sx={{ fontSize: 30 }} />}
            >
              Billing Records
            </Button>
          </Tooltip>
        </Grid>

        <Grid>
          <Tooltip title="View and generate reports" arrow>
            <Button
              variant="contained"
              sx={{ backgroundColor: "warning.main", '&:hover': { backgroundColor: "warning.dark" } }}
              onClick={handleClick}
              startIcon={<AssessmentIcon sx={{ fontSize: 30 }} />}
            >
              View Reports
            </Button>
          </Tooltip>

          <Menu anchorEl={anchorEl} open={open} onClose={handleClose}>
            {menuItems.map((item, index) => (
              <MenuItem key={index} onClick={item.action}>
                {item.label}
              </MenuItem>
            ))}
          </Menu>
        </Grid>

        <Grid>
          <Tooltip title="Manage your users and roles" arrow>
            <Button
              variant="contained"
              sx={{ backgroundColor: "primary.main", '&:hover': { backgroundColor: "primary.dark" } }}
              onClick={() => navigate("/user-management")}
              startIcon={<PersonIcon sx={{ fontSize: 30 }} />}
            >
              Manage Users
            </Button>
          </Tooltip>
        </Grid>
      </Grid>

      {loading && (
        <Box sx={{ display: "flex", justifyContent: "center", mt: 3 }}>
          <CircularProgress color="primary" />
        </Box>
      )}
    </Paper>
  );
};

export default AdminDashboard;
