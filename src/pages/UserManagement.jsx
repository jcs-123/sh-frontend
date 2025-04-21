import React, { useEffect, useState } from "react";
import axios from "../api/axios"; // ✅ relative path to your axios.js

import {
    Box, Typography, Button, TextField, Dialog, DialogTitle,
    DialogContent, DialogActions, Table, TableBody, TableCell,
    TableContainer, TableHead, TableRow, Paper, Select, MenuItem
} from "@mui/material";

const UserManagement = () => {
    const [users, setUsers] = useState([]); // ✅ Must be an array
    const [openDialog, setOpenDialog] = useState(false);
    const [editingUser, setEditingUser] = useState(null);
    const [formData, setFormData] = useState({
        username: "", email: "", password: "", role: "accountant"
    });

    const fetchUsers = async () => {
        try {
          const res = await axios.get("/api/users");
          console.log("Fetched users →", res.data); // 🐞 DEBUG LINE
          setUsers(res.data);
        } catch (error) {
          console.error("Error fetching users:", error);
          setUsers([]); // fallback to empty array
        }
      };
    const handleOpen = (user = null) => {
        setEditingUser(user);
        setFormData(user || { username: "", email: "", password: "", role: "accountant" });
        setOpenDialog(true);
    };

    const handleClose = () => {
        setOpenDialog(false);
        setEditingUser(null);
    };

    const handleChange = (e) => {
        setFormData(prev => ({ ...prev, [e.target.name]: e.target.value }));
    };

    const handleSubmit = async () => {
        if (editingUser) {
            await axios.put(`/api/users/${editingUser._id}`, formData);
        } else {
            await axios.post("/api/users", formData);
        }
        handleClose();
        fetchUsers();
    };

    const handleDelete = async (id) => {
        if (window.confirm("Are you sure?")) {
            await axios.delete(`/api/users/${id}`);
            fetchUsers();
        }
    };

    return (
        <Box sx={{ p: 4 }}>
            <Typography variant="h4" fontWeight="bold" gutterBottom>
                👥 User Management
            </Typography>

            <Button variant="contained" onClick={() => handleOpen()} sx={{ mb: 2 }}>
                Add New User
            </Button>

            <TableContainer component={Paper}>
                <Table>
                    <TableHead>
                        <TableRow>
                            <TableCell><b>Username</b></TableCell>
                            <TableCell><b>Email</b></TableCell>
                            <TableCell><b>Role</b></TableCell>
                            <TableCell align="right"><b>Actions</b></TableCell>
                        </TableRow>
                    </TableHead>
                    <TableBody>
                        {users.map((user) => (
                            <TableRow key={user._id}>
                                <TableCell>{user.username}</TableCell>
                                <TableCell>{user.email}</TableCell>
                                <TableCell>{user.role}</TableCell>
                                <TableCell align="right">
                                    <Button variant="outlined" onClick={() => handleOpen(user)} sx={{ mr: 1 }}>Edit</Button>
                                    <Button variant="outlined" color="error" onClick={() => handleDelete(user._id)}>Delete</Button>
                                </TableCell>
                            </TableRow>
                        ))}
                    </TableBody>
                </Table>
            </TableContainer>

            {/* Dialog for Add/Edit User */}
            <Dialog open={openDialog} onClose={handleClose}>
                <DialogTitle>{editingUser ? "Edit User" : "Add User"}</DialogTitle>
                <DialogContent>
                    <TextField label="Username" name="username" value={formData.username} onChange={handleChange} fullWidth margin="normal" />
                    <TextField label="Email" name="email" value={formData.email} onChange={handleChange} fullWidth margin="normal" />
                    <TextField label="Password" name="password" value={formData.password} onChange={handleChange} type="password" fullWidth margin="normal" />
                    <Select name="role" value={formData.role} onChange={handleChange} fullWidth margin="normal">
                        <MenuItem value="admin">Admin</MenuItem>
                        <MenuItem value="accountant">Accountant</MenuItem>
                        <MenuItem value="billing">Billing</MenuItem>
                    </Select>
                </DialogContent>
                <DialogActions>
                    <Button onClick={handleClose}>Cancel</Button>
                    <Button variant="contained" onClick={handleSubmit}>Save</Button>
                </DialogActions>
            </Dialog>
        </Box>
    );
};

export default UserManagement;
