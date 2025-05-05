import React, { useEffect, useState } from "react";
import {
    Box,
    CircularProgress,
    Typography,
    Table,
    TableHead,
    TableBody,
    TableRow,
    TableCell,
    TableContainer,
    Paper,
    IconButton,
    Chip,
    Tooltip,
    Button,
} from "@mui/material";
import DeleteIcon from "@mui/icons-material/Delete";
import HistoryIcon from "@mui/icons-material/History";
import DownloadIcon from "@mui/icons-material/Download";
import ClearAllIcon from "@mui/icons-material/ClearAll";
import * as XLSX from "xlsx";
import { saveAs } from "file-saver";

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
            await fetch(`https://shbookstall-server.onrender.com/api/stocks/logs/${logId}`, {
                method: "DELETE",
            });
            setLogs(logs.filter((log) => log._id !== logId));
            alert("Log deleted successfully");
        } catch (error) {
            console.error("Error deleting log:", error);
            alert("Error deleting log");
        }
    };

   
    const handleExportExcel = () => {
        const exportData = logs.map((log) => ({
            Action: log.action,
            Item: log.itemName,
            Code: log.code,
            "Old Quantity": log.oldQuantity ?? "N/A",
            "Entered Quantity": log.enteredQuantity ?? "N/A",
            "Updated Quantity": log.updatedQuantity ?? "N/A",
            "Edited By": log.editedBy,
            Timestamp: log.timestamp ? new Date(log.timestamp).toLocaleString() : "N/A",
        }));

        const worksheet = XLSX.utils.json_to_sheet(exportData);
        const workbook = XLSX.utils.book_new();
        XLSX.utils.book_append_sheet(workbook, worksheet, "Audit Logs");

        const excelBuffer = XLSX.write(workbook, { bookType: "xlsx", type: "array" });
        const data = new Blob([excelBuffer], { type: "application/octet-stream" });
        saveAs(data, `AuditLogs_${new Date().toISOString().split("T")[0]}.xlsx`);
    };

    useEffect(() => {
        fetchLogs();
    }, []);

    return (
        <Box sx={{ padding: 4 }}>
            <Box display="flex" justifyContent="space-between" alignItems="center" mb={3}>
                <Box display="flex" alignItems="center" gap={2}>
                    <HistoryIcon color="primary" fontSize="large" />
                    <Typography variant="h4" fontWeight={600}>
                        Audit Log
                    </Typography>
                </Box>
                    <Button
                        variant="contained"
                        color="primary"
                        startIcon={<DownloadIcon />}
                        onClick={handleExportExcel}
                    >
                        Export Excel
                    </Button>
            </Box>

            {loading ? (
                <Box display="flex" justifyContent="center" mt={5}>
                    <CircularProgress />
                </Box>
            ) : logs.length === 0 ? (
                <Typography variant="body1" color="textSecondary">
                    No audit logs available.
                </Typography>
            ) : (
                <TableContainer component={Paper} sx={{ borderRadius: 3, boxShadow: 3 }}>
                    <Table>
                        <TableHead sx={{ backgroundColor: "#f5f5f5" }}>
                            <TableRow>
                                <TableCell><strong>Action</strong></TableCell>
                                <TableCell><strong>Item</strong></TableCell>
                                <TableCell><strong>Code</strong></TableCell>
                                <TableCell><strong>Old Qty</strong></TableCell>
                                <TableCell><strong>Entered Qty</strong></TableCell>
                                <TableCell><strong>Updated Qty</strong></TableCell>
                                <TableCell><strong>Edited By</strong></TableCell>
                                <TableCell><strong>Timestamp</strong></TableCell>
                                <TableCell align="center"><strong>Delete</strong></TableCell>
                            </TableRow>
                        </TableHead>
                        <TableBody>
                            {logs.map((log) => (
                                <TableRow key={log._id}>
                                    <TableCell>
                                        <Chip
                                            label={log.action}
                                            color={log.action === "Added" ? "success" : "warning"}
                                            size="small"
                                        />
                                    </TableCell>
                                    <TableCell>{log.itemName}</TableCell>
                                    <TableCell>{log.code}</TableCell>
                                    <TableCell>{log.oldQuantity ?? "N/A"}</TableCell>
                                    <TableCell>{log.enteredQuantity ?? "N/A"}</TableCell>
                                    <TableCell>{log.updatedQuantity ?? "N/A"}</TableCell>
                                    <TableCell>{log.editedBy}</TableCell>
                                    <TableCell>
                                        {log.timestamp
                                            ? new Date(log.timestamp).toLocaleString()
                                            : "N/A"}
                                    </TableCell>
                                    <TableCell align="center">
                                        <Tooltip title="Delete Log">
                                            <IconButton
                                                color="error"
                                                onClick={() => handleDelete(log._id)}
                                            >
                                                <DeleteIcon />
                                            </IconButton>
                                        </Tooltip>
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
