import React, { useEffect, useState } from "react";
import axios from "axios";
import { Container, Typography, CircularProgress, Table, TableBody, TableCell, TableContainer, TableHead, TableRow, Paper } from "@mui/material";
import "./AuditLog.css";

const AuditLog = () => {
  const [logs, setLogs] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // Fetch audit logs when the component is mounted
  useEffect(() => {
    const fetchAuditLogs = async () => {
      try {
        const response = await axios.get("https://bookstall-server-jqrx.onrender.com/api/audit-log");
        setLogs(response.data);
        setLoading(false);
      } catch (err) {
        setError("Error fetching audit logs");
        setLoading(false);
        console.error("Error fetching audit logs:", err);
      }
    };

    fetchAuditLogs();
  }, []);

  if (loading) {
    return (
      <Container>
        <CircularProgress />
        <Typography variant="h6" gutterBottom>Loading audit logs...</Typography>
      </Container>
    );
  }

  if (error) {
    return (
      <Container>
        <Typography variant="h6" color="error" gutterBottom>{error}</Typography>
      </Container>
    );
  }

  return (
    <Container>
      <Typography variant="h4" gutterBottom>Audit Logs</Typography>
      <TableContainer component={Paper}>
        <Table aria-label="Audit Logs">
          <TableHead>
            <TableRow>
              <TableCell>Action</TableCell>
              <TableCell>Item Name</TableCell>
              <TableCell>Stock ID</TableCell>
              <TableCell>User</TableCell>
              <TableCell>Details</TableCell>
              <TableCell>Timestamp</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {logs.map((log) => (
              <TableRow key={log._id}>
                <TableCell>{log.action}</TableCell>
                <TableCell>{log.itemName}</TableCell>
                <TableCell>{log.stockId}</TableCell>
                <TableCell>{log.user}</TableCell>
                <TableCell>{JSON.stringify(log.details)}</TableCell>
                <TableCell>{new Date(log.timestamp).toLocaleString()}</TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </TableContainer>
    </Container>
  );
};

export default AuditLog;
