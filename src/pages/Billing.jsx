import React, { useState, useEffect, useRef } from "react";
import axios from "axios";
import "./Billing.css";
import {
  Box, Button, TextField, Typography, Table, TableBody, TableCell,
  TableContainer, TableHead, TableRow, Paper, Divider, Grid, Stack, IconButton,
  Snackbar, Alert
} from "@mui/material";
import { Delete, Edit, Save, Logout } from "@mui/icons-material";
import { useNavigate, useLocation } from "react-router-dom";

const Billing = () => {
  const [stocks, setStocks] = useState([]);
  const [buyerName, setBuyerName] = useState("");
  const [particulars, setParticulars] = useState([]);
  const [searchCode, setSearchCode] = useState("");
  const [quantity, setQuantity] = useState('');
  const [payment, setPayment] = useState('');
  const [receipt, setReceipt] = useState(null);
  const [editingIndex, setEditingIndex] = useState(-1);
  const [editQty, setEditQty] = useState(1);

  const [openAlert, setOpenAlert] = useState(false);
  const [alertType, setAlertType] = useState("info");
  const [alertMessage, setAlertMessage] = useState("");

  const showAlert = (type, message) => {
    setAlertType(type);
    setAlertMessage(message);
    setOpenAlert(true);
  };

  const inputRef = useRef(null);
  const receiptRef = useRef(null);



  useEffect(() => {
    inputRef.current?.focus();
  }, []);

  useEffect(() => {
    axios.get("https://bookstall-server-jqrx.onrender.com/api/stocks")
      .then((res) => setStocks(res.data))
      .catch((err) => {
        console.error("Stock fetch error:", err);
        showAlert("error", "Error fetching stock data.");
      });
  }, []);

  const handleAddItem = (codeInput) => {
    const code = codeInput.trim();
    if (!code || quantity < 1) {
      showAlert("warning", "Enter valid code and quantity.");
      return;
    }

    const found = stocks.find((item) => item.code === code || item.barcode === code);
    if (!found) {
      showAlert("error", "Item not found.");
      return;
    }

    // 👇 Calculate total quantity including already added
    const alreadyAddedQty = particulars.find(p => p.code === found.code)?.quantity || 0;
    const totalUsedQty = alreadyAddedQty + quantity;

    const remainingQty = found.quantity - totalUsedQty;

    if (remainingQty < found.minQuantity) {
      showAlert("warning", `⚠️ Warning: '${found.itemName}' stock will drop below minimum (${found.minQuantity})! Remaining after billing: ${remainingQty}`);
    }

    const exists = particulars.find((p) => p.code === found.code);
    if (exists) {
      setParticulars((prev) =>
        prev.map((item) =>
          item.code === found.code
            ? {
              ...item,
              quantity: item.quantity + quantity,
              amount: (item.quantity + quantity) * item.retailRate,
            }
            : item
        )
      );
    } else {
      setParticulars((prev) => [
        ...prev,
        {
          code: found.code,
          itemName: found.itemName,
          quantity,
          retailRate: found.retailRate,
          amount: found.retailRate * quantity,
        },
      ]);
    }

    setSearchCode("");
    setQuantity(1);
    inputRef.current?.focus();
  };


  const handleEditItem = (index) => {
    setEditingIndex(index);
    setEditQty(particulars[index].quantity);
  };

  const handleSaveEdit = (index) => {
    if (editQty < 1) return showAlert("warning", "Quantity must be at least 1");

    const updatedItem = { ...particulars[index] };
    updatedItem.quantity = editQty;
    updatedItem.amount = updatedItem.retailRate * editQty;

    const updatedList = [...particulars];
    updatedList[index] = updatedItem;

    setParticulars(updatedList);
    setEditingIndex(-1);
    setEditQty(1);
    showAlert("success", "Item updated successfully.");
  };

  const handleRemoveItem = (index) => {
    const updated = particulars.filter((_, i) => i !== index);
    setParticulars(updated);
    showAlert("info", "Item removed.");
  };

  const totalAmount = particulars.reduce((sum, item) => sum + item.amount, 0);
  const balance = payment - totalAmount;

  const handleSubmitAndPrint = async () => {
    if (!buyerName.trim() || particulars.length === 0) {
      return showAlert("warning", "Buyer and items required.");
    }

    const transformedItems = particulars.map((item) => ({
      code: item.code,
      qty: item.quantity,
    }));

    try {
      const res = await axios.post("https://bookstall-server-jqrx.onrender.com/api/bills", {
        buyerName,
        items: transformedItems,
        payment,
        totalAmount, // 👈 Add this to save total amount in DB
      });


      setReceipt({
        ...res.data,
        items: particulars,
        total: totalAmount,
        balance,
        payment,
        buyerName,
      });

      setBuyerName("");
      setParticulars([]);
      setPayment(0);
      showAlert("success", "Bill submitted successfully!");

      setTimeout(() => window.print(), 500);
    } catch (err) {
      console.error("Billing error:", err.response?.data || err.message);
      showAlert("error", "Failed to submit bill.");
    }
  };

  const handleReprint = () => {
    if (!receipt) return showAlert("info", "No receipt to reprint.");
    showAlert("info", "Reprinting...");
    setTimeout(() => window.print(), 500);
  };

  const handleLogout = () => {
    localStorage.clear();
    sessionStorage.clear();
    navigate("/login");
  };

  return (
    <Box sx={{ maxWidth: 1200, mx: "auto", p: 4 }}>
      <Typography variant="h4" gutterBottom color="primary">🧾 Bookstall Billing</Typography>

      {/* Buyer Info */}
      <Paper sx={{ p: 3, mb: 3 }} elevation={3}>
        <Typography variant="h6">Buyer Information</Typography>
        <TextField
          fullWidth
          label="Buyer Name"
          value={buyerName}
          onChange={(e) => setBuyerName(e.target.value)}
        />
      </Paper>

      {/* Add Item */}
      <Paper sx={{ p: 3, mb: 3 }} elevation={3}>
        <Typography variant="h6">Add Item (Manual or Scanner Input)</Typography>
        <Grid container spacing={2} alignItems="center">
          <Grid>
            <TextField
              inputRef={inputRef}
              fullWidth
              label="Code / Barcode"
              value={searchCode}
              onChange={(e) => setSearchCode(e.target.value)}
              onKeyDown={(e) => e.key === "Enter" && handleAddItem(searchCode)}
            />
          </Grid>
          <Grid >
            <TextField
              type="number"
              label="Qty"
              value={quantity}
              onChange={(e) => setQuantity(e.target.value)}
              sx={{ width: "100px", mr: 2 }}
              inputProps={{ min: 1 }}
              placeholder="Enter Qty"
            />
          </Grid>
          <Grid >
            <Button fullWidth variant="contained" onClick={() => handleAddItem(searchCode)}>
              ➕ Add
            </Button>
          </Grid>
        </Grid>
      </Paper>

      {/* Item Table */}
      {particulars.length > 0 && (
        <TableContainer component={Paper} sx={{ mb: 3 }}>
          <Table>
            <TableHead>
              <TableRow>
                <TableCell><strong>Code</strong></TableCell>
                <TableCell><strong>Name</strong></TableCell>
                <TableCell><strong>Qty</strong></TableCell>
                <TableCell><strong>Rate</strong></TableCell>
                <TableCell><strong>Amount</strong></TableCell>
                <TableCell align="center"><strong>Actions</strong></TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {particulars.map((item, idx) => (
                <TableRow key={idx}>
                  <TableCell>{item.code}</TableCell>
                  <TableCell>{item.itemName}</TableCell>
                  <TableCell>
                    {editingIndex === idx ? (
                      <TextField
                        type="number"
                        size="small"
                        value={editQty}
                        onChange={(e) => setEditQty(Number(e.target.value))}
                        inputProps={{ min: 1 }}
                      />
                    ) : (
                      item.quantity
                    )}
                  </TableCell>
                  <TableCell>₹{item.retailRate}</TableCell>
                  <TableCell>₹{item.amount.toFixed(2)}</TableCell>
                  <TableCell align="center">
                    {editingIndex === idx ? (
                      <IconButton onClick={() => handleSaveEdit(idx)}><Save /></IconButton>
                    ) : (
                      <IconButton onClick={() => handleEditItem(idx)}><Edit /></IconButton>
                    )}
                    <IconButton color="error" onClick={() => handleRemoveItem(idx)}>
                      <Delete />
                    </IconButton>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </TableContainer>
      )}

      {/* Payment Section */}
      <Paper sx={{ p: 3, mb: 3 }} elevation={3}>
        <Typography variant="h6">Payment</Typography>
        <Stack spacing={2}>
          <Typography>Total: ₹{totalAmount.toFixed(2)}</Typography>
          <TextField
            label="Payment Amount"
            value={payment}
            onChange={(e) => setPayment(e.target.value)}
            fullWidth
            placeholder="Enter amount paid"
          />
          <Typography>Balance: ₹{balance.toFixed(2)}</Typography>
        </Stack>
      </Paper>

      {/* Action Buttons */}
      <Stack direction="row" spacing={2} sx={{ mb: 3 }}>
        <Button variant="contained" color="primary" onClick={handleSubmitAndPrint}>
          ✅ Submit & Print
        </Button>
        <Button variant="outlined" onClick={handleReprint}>
          🔁 Reprint Last Bill
        </Button>
        <Button variant="outlined" color="secondary" startIcon={<Logout />} onClick={handleLogout}>
          Logout
        </Button>
      </Stack>

      {/* Receipt */}
      <div ref={receiptRef} className="receipt-layout">
        {receipt && (
          <Box sx={{ p: 2 }}>
            <Typography variant="h5" align="center">📚 Bookstall Receipt</Typography>
            <Divider sx={{ my: 1 }} />
            <Typography>Date: {new Date(receipt.date || Date.now()).toLocaleString()}</Typography>
            <Typography><strong>Receipt #:</strong> {receipt.receiptNumber}</Typography>
            <Typography>Buyer: {receipt.buyerName}</Typography>
            <Divider sx={{ my: 1 }} />
            <Table size="small">
              <TableHead>
                <TableRow>
                  <TableCell><strong>Code</strong></TableCell>
                  <TableCell><strong>Item</strong></TableCell>
                  <TableCell><strong>Qty</strong></TableCell>
                  <TableCell><strong>Rate</strong></TableCell>
                  <TableCell><strong>Amount</strong></TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {receipt.items.map((item, i) => (
                  <TableRow key={i}>
                    <TableCell>{item.code}</TableCell>
                    <TableCell>{item.itemName}</TableCell>
                    <TableCell>{item.quantity}</TableCell>
                    <TableCell>₹{item.retailRate}</TableCell>
                    <TableCell>₹{item.amount.toFixed(2)}</TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
            <Divider sx={{ my: 1 }} />
            <Typography>Total: ₹{receipt.total.toFixed(2)}</Typography>
            <Typography>Payment: ₹{receipt.payment}</Typography>
            <Typography>Balance: ₹{receipt.balance.toFixed(2)}</Typography>
            <Typography align="center">Thank you for shopping with us!</Typography>
          </Box>
        )}
      </div>

      {/* Snackbar for Alerts */}
      <Snackbar
        open={openAlert}
        autoHideDuration={3000}
        onClose={() => setOpenAlert(false)}
        anchorOrigin={{ vertical: "top", horizontal: "right" }}
      >
        <Alert onClose={() => setOpenAlert(false)} severity={alertType} sx={{ width: "100%" }}>
          {alertMessage}
        </Alert>
      </Snackbar>
    </Box>
  );
};

export default Billing;
