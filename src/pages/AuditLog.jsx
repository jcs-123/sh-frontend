// frontend/AuditLog.jsx
import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { Table, TableBody, TableCell, TableHead, TableRow } from '@mui/material';

const AuditLog = () => {
  const [logs, setLogs] = useState([]);
  const [error, setError] = useState(null);

  useEffect(() => {
    // Fetch the audit logs when the component mounts
    axios.get('https://bookstall-server-jqrx.onrender.com/api/audit-logs') // Ensure '/api' is in the URL
      .then(response => setLogs(response.data))
      .catch(error => setError('Error fetching audit logs: ' + error.message)); // Display error message
  }, []);

  return (
    <div>
      <h1>Audit Logs</h1>
      {error && <p>{error}</p>}  {/* Show error if any */}
      <Table>
        <TableHead>
          <TableRow>
            <TableCell>Action</TableCell>
            <TableCell>Model</TableCell>
            <TableCell>Data</TableCell>
            <TableCell>Timestamp</TableCell>
            <TableCell>User</TableCell>
          </TableRow>
        </TableHead>
        <TableBody>
          {logs.map((log) => (
            <TableRow key={log._id}>
              <TableCell>{log.action}</TableCell>
              <TableCell>{log.model}</TableCell>
              <TableCell>{JSON.stringify(log.data)}</TableCell>
              <TableCell>{new Date(log.timestamp).toLocaleString()}</TableCell>
              <TableCell>{log.user}</TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </div>
  );
};

export default AuditLog;
