import React, { useEffect, useState } from "react";
import {
    Box, Button, Container, Table, TableBody, TableCell,
    TableContainer, TableHead, TableRow, TextField, Typography,
    Paper, IconButton, Dialog, DialogActions, DialogContent, DialogTitle,
    Grid
} from "@mui/material";
import axios from "axios";
import { DatePicker } from "@mui/x-date-pickers";
import { AdapterDayjs } from "@mui/x-date-pickers/AdapterDayjs";
import { LocalizationProvider } from "@mui/x-date-pickers/LocalizationProvider";
import dayjs from "dayjs";
import DeleteIcon from "@mui/icons-material/Delete";
import FileDownloadIcon from "@mui/icons-material/FileDownload";
import * as XLSX from "xlsx";

const BillingRecords = () => {
    const [bills, setBills] = useState([]);
    const [search, setSearch] = useState("");
    const [fromDate, setFromDate] = useState(null);
    const [toDate, setToDate] = useState(null);
    const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
    const [selectedBillId, setSelectedBillId] = useState(null);

    const fetchBills = async () => {
        try {
            const query = new URLSearchParams();
            if (search) query.append("search", search);
            if (fromDate && toDate) {
                query.append("from", dayjs(fromDate).format("YYYY-MM-DD"));
                query.append("to", dayjs(toDate).format("YYYY-MM-DD"));
            }
            const res = await axios.get(`https://bookstall-server-jqrx.onrender.com/api/bills?${query.toString()}`);
            setBills(res.data);
        } catch (error) {
            console.error("Error fetching bills:", error.message);
        }
    };

    const handleDelete = async () => {
        try {
            await axios.delete(`https://bookstall-server-jqrx.onrender.com/api/bills/${selectedBillId}`);
            setBills((prevBills) => prevBills.filter(bill => bill._id !== selectedBillId));
            setDeleteDialogOpen(false);
            setSelectedBillId(null);
        } catch (error) {
            console.error("Error deleting bill:", error.message);
        }
    };

    const handleExport = () => {
        const worksheetData = bills.map(bill => ({
            Date: dayjs(bill.date).format("YYYY-MM-DD"),
            "Receipt Number": bill.receiptNumber,
            "Buyer Name": bill.buyerName,
            "Total Amount": bill.totalAmount?.toFixed(2) || "0.00",
            Payment: bill.payment?.toFixed(2) || "0.00",
            Balance: bill.balance?.toFixed(2) || "0.00",
        }));

        const worksheet = XLSX.utils.json_to_sheet(worksheetData);
        const workbook = XLSX.utils.book_new();
        XLSX.utils.book_append_sheet(workbook, worksheet, "Billing Records");

        XLSX.writeFile(workbook, "billing_records.xlsx");
    };

    useEffect(() => {
        fetchBills();
    }, [search, fromDate, toDate]);

    return (
        <Container maxWidth="lg">
            <Box mt={5} mb={4}>
                <Typography variant="h4" color="primary" fontWeight={600}>
                    Billing Records
                </Typography>
            </Box>

            <Paper elevation={3} sx={{ padding: 3, mb: 4 }}>
  <Box display="flex" flexWrap="wrap" alignItems="center" justifyContent="space-between" gap={2}>
    <Grid container spacing={2} sx={{ flex: 1 }}>
      <Grid item xs={12} md={4}>
        <TextField
          label="Search by Buyer or Receipt"
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          fullWidth
        />
      </Grid>
      <Grid item xs={6} md={2}>
        <LocalizationProvider dateAdapter={AdapterDayjs}>
          <DatePicker
            label="From Date"
            value={fromDate}
            onChange={(newValue) => setFromDate(newValue)}
            slotProps={{ textField: { fullWidth: true } }}
          />
        </LocalizationProvider>
      </Grid>
      <Grid item xs={6} md={2}>
        <LocalizationProvider dateAdapter={AdapterDayjs}>
          <DatePicker
            label="To Date"
            value={toDate}
            onChange={(newValue) => setToDate(newValue)}
            slotProps={{ textField: { fullWidth: true } }}
          />
        </LocalizationProvider>
      </Grid>
    </Grid>

    <Box>
      <Button variant="contained" color="primary" onClick={handleExport}>
        EXCEL ഡൗൺലോഡ് ഓപ്ഷൻ
      </Button>
    </Box>
  </Box>
</Paper>


            <TableContainer component={Paper} elevation={2}>
                <Table>
                    <TableHead sx={{ backgroundColor: "#1976d2" }}>
                        <TableRow>
                            {["Date", "Receipt No.", "Buyer", "Total", "Payment", "Balance", "Actions"].map((header) => (
                                <TableCell key={header} sx={{ color: "#fff", fontWeight: 600 }}>
                                    {header}
                                </TableCell>
                            ))}
                        </TableRow>
                    </TableHead>
                    <TableBody>
                        {bills.length === 0 ? (
                            <TableRow>
                                <TableCell colSpan={7} align="center">
                                    No billing records found.
                                </TableCell>
                            </TableRow>
                        ) : (
                            bills.map((bill, index) => (
                                <TableRow key={bill._id} sx={{ backgroundColor: index % 2 === 0 ? "#fafafa" : "#fff" }}>
                                    <TableCell>{dayjs(bill.date).format("YYYY-MM-DD")}</TableCell>
                                    <TableCell>{bill.receiptNumber}</TableCell>
                                    <TableCell>{bill.buyerName}</TableCell>
                                    <TableCell>₹ {bill.totalAmount?.toFixed(2)}</TableCell>
                                    <TableCell>₹ {bill.payment?.toFixed(2)}</TableCell>
                                    <TableCell>₹ {bill.balance?.toFixed(2)}</TableCell>
                                    <TableCell>
                                        <IconButton
                                            color="error"
                                            onClick={() => {
                                                setSelectedBillId(bill._id);
                                                setDeleteDialogOpen(true);
                                            }}
                                        >
                                            <DeleteIcon />
                                        </IconButton>
                                    </TableCell>
                                </TableRow>
                            ))
                        )}
                    </TableBody>
                </Table>
            </TableContainer>

            <Dialog
                open={deleteDialogOpen}
                onClose={() => setDeleteDialogOpen(false)}
            >
                <DialogTitle>Confirm Deletion</DialogTitle>
                <DialogContent>
                    <Typography>Are you sure you want to delete this bill?</Typography>
                </DialogContent>
                <DialogActions>
                    <Button onClick={() => setDeleteDialogOpen(false)} color="primary">
                        Cancel
                    </Button>
                    <Button onClick={handleDelete} color="error" variant="contained">
                        Delete
                    </Button>
                </DialogActions>
            </Dialog>
        </Container>
    );
};

export default BillingRecords;
