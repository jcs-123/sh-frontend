import React, { useEffect, useState } from "react";
import {
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
  IconButton,
  Typography,
  CircularProgress,
  Box,
  Button,
} from "@mui/material";
import DeleteIcon from "@mui/icons-material/Delete";
import * as XLSX from "xlsx";

const AuditLog = () => {
  const [logs, setLogs] = useState([]);
  const [loading, setLoading] = useState(true);

  const fetchLogs = async () => {
    setLoading(true);
    try {
      const response = await fetch("https://shbookstall-server.onrender.com/api/stocks/logs");
      const result = await response.json();
      const logsArray = Array.isArray(result) ? result : result.logs || [];
      setLogs(logsArray);
    } catch (error) {
      console.error("Error fetching logs:", error);
      setLogs([]);
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (logId) => {
    try {
      await fetch(`https://shbookstall-server.onrender.com/stocks/logs/${logId}`, {
        method: "DELETE",
      });
      setLogs(logs.filter((log) => log._id !== logId));
      alert("Log deleted successfully");
    } catch (error) {
      console.error("Error deleting log:", error);
      alert("Error deleting log");
    }
  };

  // 🟩 Export logs to Excel
  const handleExportToExcel = () => {
    const exportData = logs.map((log) => ({
      Action: log.action,
      "Item Name": log.itemName,
      Code: log.code,
      "Updated Item": log.updatedItemName || "N/A",
      "Updated Quantity": log.updatedQuantity || "N/A",
      "Entered Quantity": log.enteredQuantity || "N/A",
      "Edited By": log.editedBy || "Unknown",
      Timestamp: new Date(log.timestamp).toLocaleString(),
    }));

    const worksheet = XLSX.utils.json_to_sheet(exportData);
    const workbook = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(workbook, worksheet, "Audit Logs");

    XLSX.writeFile(workbook, "AuditLog_Report.xlsx");
  };

  useEffect(() => {
    fetchLogs();
  }, []);

  return (
    <Box sx={{ padding: 2 }}>
      <Typography variant="h5" gutterBottom>
        Audit Log
      </Typography>

      {/* Export button aligned to top-right */}
      <Box sx={{ display: "flex", justifyContent: "flex-end", mb: 2 }}>
        <Button variant="outlined" onClick={handleExportToExcel}>
          Export to Excel
        </Button>
      </Box>

      {loading ? (
        <CircularProgress />
      ) : logs.length === 0 ? (
        <Typography>No audit logs available.</Typography>
      ) : (
        <TableContainer component={Paper}>
          <Table aria-label="audit log table">
            <TableHead>
              <TableRow>
                <TableCell>Action</TableCell>
                <TableCell>Item</TableCell>
                <TableCell>Code</TableCell>
                <TableCell>Updated Item</TableCell>
                <TableCell>Updated Quantity</TableCell>
                <TableCell>Entered Quantity</TableCell>
                <TableCell>Edited By</TableCell>
                <TableCell>Timestamp</TableCell>
                <TableCell>Action</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {logs.map((log) => (
                <TableRow key={log._id}>
                  <TableCell>{log.action}</TableCell>
                  <TableCell>{log.itemName}</TableCell>
                  <TableCell>{log.code}</TableCell>
                  <TableCell>{log.updatedItemName || "N/A"}</TableCell>
                  <TableCell>{log.updatedQuantity || "N/A"}</TableCell>
                  <TableCell>{log.enteredQuantity || "N/A"}</TableCell>
                  <TableCell>{log.editedBy || "Unknown"}</TableCell>
                  <TableCell>{new Date(log.timestamp).toLocaleString()}</TableCell>
                  <TableCell>
                    <IconButton color="secondary" onClick={() => handleDelete(log._id)}>
                      <DeleteIcon />
                    </IconButton>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </TableContainer>
      )}
    </Box>
  );
};

export default AuditLog;
