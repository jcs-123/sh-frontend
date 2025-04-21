import React, { useState } from "react";
import axios from "axios";
import {
  Container,
  Typography,
  TextField,
  Button,
  Table,
  TableHead,
  TableBody,
  TableRow,
  TableCell,
  Paper,
  Grid,
  CircularProgress,
} from "@mui/material";
import * as XLSX from "xlsx";
import { saveAs } from "file-saver";


const DaybookReport = () => {
  const [fromDate, setFromDate] = useState("");
  const [toDate, setToDate] = useState("");
  const [entries, setEntries] = useState([]);
  const [loading, setLoading] = useState(false);

  const fetchEntries = async () => {
    if (!fromDate || !toDate) return;

    setLoading(true);
    try {
      const res = await axios.get(
        `http://localhost:5000/api/daybook?from=${fromDate}&to=${toDate}`
      );
      console.log(res);
      
      if (Array.isArray(res.data)) {
        setEntries(res.data);
      } else {
        setEntries([]);
      }
    } catch (err) {
      console.error("Fetch Error:", err);
      setEntries([]);
    }
    setLoading(false);
  };

  const exportToExcel = () => {
    const data = entries.map((entry) => ({
      Date: new Date(entry.date).toLocaleDateString(),
      Type: entry.type,
      Particulars: entry.particulars,
      Receipt: entry.receipt,
      Payment: entry.payment,
    }));

    const worksheet = XLSX.utils.json_to_sheet(data);
    const workbook = XLSX.utils.book_new();

    XLSX.utils.book_append_sheet(workbook, worksheet, "Daybook Report");

    const excelBuffer = XLSX.write(workbook, {
      bookType: "xlsx",
      type: "array",
    });

    const file = new Blob([excelBuffer], { type: "application/octet-stream" });
    saveAs(file, "Daybook_Report.xlsx");
  };

  const totalReceipt = entries.reduce((acc, cur) => acc + (cur.receipt || 0), 0);
  const totalPayment = entries.reduce((acc, cur) => acc + (cur.payment || 0), 0);

  return (
    <Container maxWidth="lg" sx={{ mt: 4 }}>
      <Typography variant="h4" gutterBottom>
        📘 Daybook Report
      </Typography>
      

      <Paper sx={{ p: 2, mb: 4 }}>
        <Grid container spacing={2} alignItems="center">
          <Grid item xs={12} sm={4}>
            <TextField
              label="From Date"
              type="date"
              fullWidth
              value={fromDate}
              onChange={(e) => setFromDate(e.target.value)}
              InputLabelProps={{ shrink: true }}
            />
          </Grid>
          <Grid item xs={12} sm={4}>
            <TextField
              label="To Date"
              type="date"
              fullWidth
              value={toDate}
              onChange={(e) => setToDate(e.target.value)}
              InputLabelProps={{ shrink: true }}
            />
          </Grid>
          <Grid item xs={12} sm={4} textAlign="center">
            <Button
              variant="contained"
              onClick={fetchEntries}
              disabled={loading}
              sx={{ mr: 2 }}
            >
              {loading ? <CircularProgress size={24} /> : "Generate Report"}
            </Button>
            <Button
              variant="outlined"
              onClick={exportToExcel}
              disabled={entries.length === 0}
            >
              Export to Excel
            </Button>
          </Grid>
        </Grid>
      </Paper>

      {entries.length === 0 ? (
        <Typography variant="body1" color="textSecondary">
          No records found for selected dates.
        </Typography>
      ) : (
        <Paper sx={{ overflow: "auto", p: 2 }}>
          <Table size="small">
            <TableHead>
              <TableRow>
                <TableCell sx={{ fontWeight: "bold" }}>Date</TableCell>
                <TableCell sx={{ fontWeight: "bold" }}>Type</TableCell>
                <TableCell sx={{ fontWeight: "bold" }}>Particulars</TableCell>
                <TableCell sx={{ fontWeight: "bold" }}>Receipt (₹)</TableCell>
                <TableCell sx={{ fontWeight: "bold" }}>Payment (₹)</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {entries.map((entry, index) => (
                <TableRow key={index}>
                  <TableCell>{new Date(entry.date).toLocaleDateString()}</TableCell>
                  <TableCell>{entry.type}</TableCell>
                  <TableCell>{entry.particulars}</TableCell>
                  <TableCell>{entry.receipt}</TableCell>
                  <TableCell>{entry.payment}</TableCell>
                </TableRow>
              ))}
              {/* Totals Row */}
              <TableRow sx={{ backgroundColor: "#f0f0f0", fontWeight: "bold" }}>
                <TableCell colSpan={3} align="right">
                  <b>Total:</b>
                </TableCell>
                <TableCell>
                  <b>₹{totalReceipt}</b>
                </TableCell>
                <TableCell>
                  <b>₹{totalPayment}</b>
                </TableCell>
              </TableRow>
            </TableBody>
          </Table>
        </Paper>
      )}
    </Container>
  );
};

export default DaybookReport;
