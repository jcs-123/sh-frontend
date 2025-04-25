import { useEffect, useState } from "react";
import axios from "axios";
import "./AuditLog.css";

function AuditLog() {
    const [logs, setLogs] = useState([]);

    useEffect(() => {
        const fetchAuditLogs = async () => {
            try {
                const response = await axios.get("https://bookstall-server-jqrx.onrender.com/api/audit-log");
                setLogs(response.data);
            } catch (error) {
                console.error("Error fetching audit logs:", error);
            }
        };

        fetchAuditLogs();
    }, []);

    return (
        <div className="audit-log-container">
            <h2>Audit Log</h2>
            <table className="audit-log-table">
                <thead>
                    <tr>
                        <th>ID</th>
                        <th>Action</th>
                        <th>User</th>
                        <th>Date</th>
                    </tr>
                </thead>
                <tbody>
                    {logs.map((log, index) => (
                        <tr key={index}>
                            <td>{index + 1}</td>
                            <td>{log.action}</td>
                            <td>{log.user}</td>
                            <td>{new Date(log.timestamp).toLocaleString()}</td>
                        </tr>
                    ))}
                </tbody>
            </table>
        </div>
    );
}

export default AuditLog;
