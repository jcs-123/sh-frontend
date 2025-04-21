import React, { useState } from "react";
import {
  Box,
  Container,
  Typography,
  TextField,
  Button,
  Paper,
  Table,
  TableHead,
  TableBody,
  TableRow,
  TableCell,
  CircularProgress,
} from "@mui/material";
import {
  Download as DownloadIcon,
  Assessment as ChartIcon,
} from "@mui/icons-material";
import dayjs from "dayjs";
import axios from "axios";
import * as XLSX from "xlsx";
import { saveAs } from "file-saver";
import "jspdf-autotable";
import LogoutIcon from "@mui/icons-material/Logout";
import { useNavigate } from 'react-router-dom';


import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  PieChart,
  Pie,
  Cell,
  ResponsiveContainer,
  Legend,
} from "recharts";

const COLORS = ["#0088FE", "#00C49F", "#FFBB28", "#FF8042", "#AA00FF", "#D50000"];

const Reports = () => {
  const [fromDate, setFromDate] = useState("");
  const [toDate, setToDate] = useState("");
  const [reportData, setReportData] = useState([]);
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate(); // <-- Initialize navigate


  const fetchReportData = async () => {
    if (!fromDate || !toDate) return alert("Please select both dates");
    setLoading(true);
    try {
      const response = await axios.get("https://bookstall-server-jqrx.onrender.com/api/stocks/count-report", {
        params: { from: fromDate, to: toDate },
      });
      setReportData(response.data);
    } catch (err) {
      console.error("Failed to fetch report data:", err);
    } finally {
      setLoading(false);
    }
  };

  const handleExportExcel = () => {
    const exportData = reportData.map((r) => ({
      ID: r._id,
      Date: dayjs(r.createdAt).format("YYYY-MM-DD"),
      "Item Name": r.itemName,
      Code: r.code,
      "Total Count": r.totalCount,
      "Remaining": r.remainingCount,
      "Purchase Amount": r.purchaseAmount,
      "Retail Amount": r.retailAmount,
      Profit: r.profit,
    }));
    const worksheet = XLSX.utils.json_to_sheet(exportData);
    const workbook = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(workbook, worksheet, "Count_Report");
    const excelBuffer = XLSX.write(workbook, { bookType: "xlsx", type: "array" });
    saveAs(new Blob([excelBuffer]), "Count_Report.xlsx");
  };

  // const handleExportPDF = () => {
  //   const doc = new jsPDF();
  //   const tableColumn = [
  //     "ID",
  //     "Date",
  //     "Item",
  //     "Code",
  //     "Qty",
  //     "Remain",
  //     "Purchase ₹",
  //     "Retail ₹",
  //     "Profit ₹",
  //   ];
  //   const tableRows = reportData.map((r) => [
  //     r._id.slice(0, 6) + "...",
  //     dayjs(r.createdAt).format("YYYY-MM-DD"),
  //     r.itemName,
  //     r.code,
  //     r.totalCount,
  //     r.remainingCount,
  //     r.purchaseAmount,
  //     r.retailAmount,
  //     r.profit,
  //   ]);
  //   doc.autoTable({ head: [tableColumn], body: tableRows });
  //   doc.save("Count_Report.pdf");
  // };

  return (
    <Container maxWidth="xl" sx={{ mt: 4 }}>
      <Box
        display="flex"
        justifyContent="space-between"
        alignItems="center"
        sx={{ mb: 3 }}
      >
        <Typography variant="h4" fontWeight="bold">
        📊 Count Report Dashboard
        </Typography>

        <Button
          variant="outlined"
          color="primary"
          size="small"
          startIcon={<LogoutIcon />}
          onClick={() => {
            localStorage.removeItem("token");
            navigate("/login");
          }}
        >
          Logout
        </Button>

      </Box>
     

      <Box display="flex" gap={2} mb={3}>
        <TextField
          type="date"
          label="From"
          InputLabelProps={{ shrink: true }}
          value={fromDate}
          onChange={(e) => setFromDate(e.target.value)}
        />
        <TextField
          type="date"
          label="To"
          InputLabelProps={{ shrink: true }}
          value={toDate}
          onChange={(e) => setToDate(e.target.value)}
        />
        <Button variant="contained" onClick={fetchReportData} startIcon={<ChartIcon />}>
          Generate Report
        </Button>
      </Box>

      {loading ? (
        <Box display="flex" justifyContent="center" mt={4}>
          <CircularProgress />
        </Box>
      ) : (
        <>
          {reportData.length > 0 && (
            <>
              <Box display="flex" gap={4} flexWrap="wrap" mb={4}>
                <Paper sx={{ p: 2, flex: 1 }}>
                  <Typography variant="h6">📦 Total Quantity by Product</Typography>
                  <ResponsiveContainer width="100%" height={300}>
                    <BarChart data={reportData}>
                      <XAxis dataKey="itemName" />
                      <YAxis />
                      <Tooltip />
                      <Bar dataKey="totalCount" fill="#1976d2" />
                    </BarChart>
                  </ResponsiveContainer>
                </Paper>

                <Paper sx={{ p: 2, flex: 1 }}>
                  <Typography variant="h6">💰 Profit Distribution</Typography>
                  <ResponsiveContainer width="100%" height={300}>
                    <PieChart>
                      <Pie
                        data={reportData}
                        dataKey="profit"
                        nameKey="itemName"
                        cx="50%"
                        cy="50%"
                        outerRadius={100}
                        label
                      >
                        {reportData.map((_, index) => (
                          <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                        ))}
                      </Pie>
                      <Tooltip />
                      <Legend />
                    </PieChart>
                  </ResponsiveContainer>
                </Paper>
              </Box>

              <Box display="flex" gap={2} mb={2}>
                <Button variant="outlined" onClick={handleExportExcel} startIcon={<DownloadIcon />}>
                  Export to Excel
                </Button>
                
              </Box>

              <Paper elevation={3} sx={{ p: 2 }}>
                <Table>
                  <TableHead>
                    <TableRow sx={{ backgroundColor: "#f5f5f5" }}>
                      <TableCell>ID</TableCell>
                      <TableCell>Date</TableCell>
                      <TableCell>Item Name</TableCell>
                      <TableCell>Code</TableCell>
                      <TableCell>Total Count</TableCell>
                      {/* <TableCell>Remaining</TableCell> */}
                      <TableCell>Purchase ₹</TableCell>
                      <TableCell>Retail ₹</TableCell>
                      <TableCell>Profit ₹</TableCell>
                    </TableRow>
                  </TableHead>
                  <TableBody>
                    {reportData.map((r) => (
                      <TableRow key={r._id} hover>
                        <TableCell>{r._id.slice(0, 6)}...</TableCell>
                        <TableCell>{dayjs(r.createdAt).format("YYYY-MM-DD")}</TableCell>
                        <TableCell>{r.itemName}</TableCell>
                        <TableCell>{r.code}</TableCell>
                        <TableCell>{r.totalCount}</TableCell>
                        {/* <TableCell>{r.remainingCount}</TableCell> */}
                        <TableCell>{r.purchaseAmount}</TableCell>
                        <TableCell>{r.retailAmount}</TableCell>
                        <TableCell>{r.profit}</TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </Paper>
            </>
          )}
        </>
      )}
    </Container>
  );
};

export default Reports;