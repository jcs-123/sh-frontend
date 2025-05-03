import React, { useState, useCallback, useMemo } from "react";
import {
  AppBar, Toolbar, Typography, IconButton, Button, Box, Paper,
  Grid, Menu, MenuItem, Divider, Tooltip
} from "@mui/material";
import LogoutIcon from "@mui/icons-material/Logout";
import AssessmentIcon from "@mui/icons-material/Assessment";
import InventoryIcon from "@mui/icons-material/Inventory";
import ReceiptIcon from "@mui/icons-material/Receipt";
import LocalMallIcon from "@mui/icons-material/LocalMall";
import ShoppingCartCheckoutIcon from "@mui/icons-material/ShoppingCartCheckout";
import TrendingUpIcon from "@mui/icons-material/TrendingUp";
import { useNavigate } from "react-router-dom";

const AdminDashboard = () => {
  const navigate = useNavigate();
  const [anchorEl, setAnchorEl] = useState(null);
  const open = Boolean(anchorEl);

  const handleClick = useCallback((event) => {
    setAnchorEl(event.currentTarget);
  }, []);

  const handleClose = useCallback(() => {
    setAnchorEl(null);
  }, []);

  const handleReportNavigation = useCallback((path) => {
    navigate(path);
  }, [navigate]);

  const handleLogout = () => {
    // Clear user session and navigate to login
    localStorage.clear();
    navigate("/login");
  };

  const menuItems = useMemo(() => [
    { label: "Stock Report", action: () => handleReportNavigation("/stock-report") },
    { label: "Day Book Report", action: () => handleReportNavigation("/daybook-report") },
  ], [handleReportNavigation]);

  return (
    <Box>
      {/* Top App Bar */}
      <AppBar position="static" sx={{ backgroundColor: "#2c387e" }}>
        <Toolbar>
          <Typography variant="h6" sx={{ flexGrow: 1, fontWeight: "bold" }}>
            📊 Admin Dashboard
          </Typography>
          <Tooltip title="Logout" arrow>
            <IconButton color="inherit" onClick={handleLogout}>
              <LogoutIcon />
            </IconButton>
          </Tooltip>
        </Toolbar>
      </AppBar>

      {/* Main Content */}
      <Paper sx={{ p: 4, mt: 4, mx: "auto", maxWidth: "1200px", borderRadius: 4, boxShadow: 4 }}>
        <Typography variant="h4" fontWeight="bold" gutterBottom align="center" color="primary">
          Welcome to Admin Panel
        </Typography>
        <Divider sx={{ mb: 3 }} />

        {/* Horizontal Button Row */}
        <Box sx={{
          display: "flex",
          flexWrap: "wrap",
          gap: 2,
          justifyContent: "center",
          overflowX: "auto",
          pb: 2
        }}>
          <Tooltip title="Manage your stock inventory" arrow>
            <Button
              variant="contained"
              color="success"
              startIcon={<InventoryIcon />}
              onClick={() => navigate("/edit-stock")}
            >
              Manage Stock
            </Button>
          </Tooltip>

          <Tooltip title="View your billing records" arrow>
            <Button
              variant="contained"
              color="info"
              startIcon={<ReceiptIcon />}
              onClick={() => navigate("/billing-records")}
            >
              Billing Records
            </Button>
          </Tooltip>

          <Tooltip title="View and generate reports" arrow>
            <Button
              variant="contained"
              color="warning"
              startIcon={<AssessmentIcon />}
              onClick={handleClick}
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

          {/* New Button for Minimum Quantity Report */}
          <Tooltip title="View Minimum Quantity Report" arrow>
            <Button
              variant="contained"
              color="primary"
              startIcon={<LocalMallIcon />}
              onClick={() => navigate("/minQuantity")}
            >
              Minimum Quantity Report
            </Button>
          </Tooltip>

          <Tooltip title="Damage Returns" arrow>
            <Button
              variant="contained"
              color="secondary"
              startIcon={<ShoppingCartCheckoutIcon />}
              onClick={() => navigate("/damage-return")}
            >
              Damage Return
            </Button>
          </Tooltip>

          <Tooltip title="Summary Overview" arrow>
            <Button
              variant="contained"
              sx={{ backgroundColor: "#6a1b9a", color: "#fff", "&:hover": { backgroundColor: "#4a148c" } }}
              startIcon={<TrendingUpIcon />}
              onClick={() => navigate("/admin-summary")}
            >
              View Summary
            </Button>
          </Tooltip>
        </Box>
      </Paper>
    </Box>
  );
};

export default AdminDashboard;
