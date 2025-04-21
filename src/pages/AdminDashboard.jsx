import React, { useState, useEffect, useCallback, useMemo } from "react";
import {
  Button, Box, Typography, Paper, Grid, Menu, MenuItem, Divider, Tooltip,
  CircularProgress
} from "@mui/material";
import { useNavigate } from "react-router-dom";
import AssessmentIcon from "@mui/icons-material/Assessment";
import InventoryIcon from "@mui/icons-material/Inventory";
import ReceiptIcon from "@mui/icons-material/Receipt";
import LocalMallIcon from "@mui/icons-material/LocalMall";
import ShoppingCartCheckoutIcon from "@mui/icons-material/ShoppingCartCheckout";
import TrendingUpIcon from "@mui/icons-material/TrendingUp";

const AdminDashboard = () => {
  const navigate = useNavigate();

  const [anchorEl, setAnchorEl] = useState(null);
  const [loading, setLoading] = useState(false);
  const open = Boolean(anchorEl);

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

  const handleViewSummary = () => {
    navigate("/summary");
  };

  return (
    <Paper sx={{ p: 4, mt: 4, mx: "auto", maxWidth: "1000px", borderRadius: 3, boxShadow: 6 }}>
      <Typography variant="h3" fontWeight="bold" gutterBottom align="center" color="primary.main">
        🛠️ Admin Dashboard
      </Typography>
      <Divider sx={{ mb: 3 }} />

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
          <Tooltip title="Damage Returns" arrow>
            <Button
              variant="contained"
              color="warning"
              onClick={() => navigate("/damage-return")}
              startIcon={<ShoppingCartCheckoutIcon sx={{ fontSize: 30 }} />}
            >
              Damage Return
            </Button>
          </Tooltip>
        </Grid>

        <Grid>
          <Tooltip title="Summary Overview" arrow>
            <Button
              variant="contained"
              sx={{ backgroundColor: "secondary.main", '&:hover': { backgroundColor: "secondary.dark" } }}
              onClick={() => navigate("/admin-summary")}
              startIcon={<TrendingUpIcon sx={{ fontSize: 30 }} />}
            >
              View Summary
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
