import { useState } from "react";
import { Container, TextField, Button, Typography, Box, Paper, IconButton, InputAdornment } from "@mui/material";
import { Visibility, VisibilityOff } from "@mui/icons-material";
import axios from "axios";
import { useNavigate } from "react-router-dom";

const Login = () => {
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [error, setError] = useState("");
    const [showPassword, setShowPassword] = useState(false); // State to toggle password visibility
    const navigate = useNavigate();

    const handleLogin = async (e) => {
        e.preventDefault();
        setError("");

        try {
            const res = await axios.post("https://bookstall-server-jqrx.onrender.com/api/auth/login", { email, password });
            localStorage.setItem("token", res.data.token);
            localStorage.setItem("role", res.data.role);

            if (res.data.role === "accountant") {
                navigate("/stock-entry"); // Accountant → Stock Entry Form
            } else if (res.data.role === "billing") {
                navigate("/billing"); // Cashier → Billing Form
            } else if (res.data.role === "admin") {
                navigate("/admin-dashboard"); // Admin → Dashboard
            } else {
                setError("Unauthorized Role"); // If role doesn't match
            }
        } catch (err) {
            setError(err.response?.data?.error || "Login failed");
        }
    };

    return (
        <Container component="main" maxWidth="xs" sx={{ height: "100vh", display: "flex", justifyContent: "center", alignItems: "center", backgroundColor: "#f4f7fb" }}>
            <Paper elevation={6} sx={{ padding: 4, width: "100%", maxWidth: 400, borderRadius: 2, boxShadow: "0px 6px 20px rgba(0, 0, 0, 0.1)" }}>
                <Typography variant="h4" sx={{ fontWeight: 600, textAlign: "center", color: "#333", marginBottom: 2 }}>
                    SACRED HEART SHRINE
                </Typography>
                <Typography variant="h6" sx={{ textAlign: "center", color: "#555", marginBottom: 4 }}>
                     LOGIN
                </Typography>

                {error && (
                    <Typography color="error" sx={{ mb: 2, textAlign: "center", fontWeight: 500 }}>
                        {error}
                    </Typography>
                )}

                <Box component="form" onSubmit={handleLogin} sx={{ display: "flex", flexDirection: "column", gap: 2 }}>
                    <TextField
                        label="Email"
                        type="email"
                        fullWidth
                        variant="outlined"
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        autoComplete="email"
                        required
                        sx={{
                            "& .MuiOutlinedInput-root": {
                                borderRadius: "8px",
                                "& fieldset": { borderColor: "#ccc" },
                                "&:hover fieldset": { borderColor: "#3f51b5" },
                            },
                        }}
                    />
                    <TextField
                        label="Password"
                        type={showPassword ? "text" : "password"} // Toggle password visibility
                        fullWidth
                        variant="outlined"
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                        autoComplete="current-password"
                        required
                        InputProps={{
                            endAdornment: (
                                <InputAdornment position="end">
                                    <IconButton
                                        onClick={() => setShowPassword(!showPassword)}
                                        edge="end"
                                        sx={{
                                            color: "#3f51b5",
                                            "&:hover": {
                                                backgroundColor: "rgba(63, 81, 181, 0.1)",
                                                borderRadius: "50%",
                                            },
                                        }}
                                    >
                                        {showPassword ? <VisibilityOff /> : <Visibility />}
                                    </IconButton>
                                </InputAdornment>
                            ),
                        }}
                        sx={{
                            "& .MuiOutlinedInput-root": {
                                borderRadius: "8px",
                                "& fieldset": { borderColor: "#ccc" },
                                "&:hover fieldset": { borderColor: "#3f51b5" },
                            },
                        }}
                    />
                    <Button
                        type="submit"
                        variant="contained"
                        color="primary"
                        fullWidth
                        sx={{
                            borderRadius: "8px",
                            padding: "10px",
                            textTransform: "none",
                            fontSize: "16px",
                            "&:hover": {
                                backgroundColor: "#3f51b5",
                                boxShadow: "0px 6px 15px rgba(63, 81, 181, 0.2)",
                            },
                        }}
                    >
                        Login
                    </Button>
                </Box>
            </Paper>
        </Container>
    );
};

export default Login;


// import { useState } from "react";
// import { Container, TextField, Button, Typography, Box, Paper } from "@mui/material";
// import axios from "axios";
// import { useNavigate } from "react-router-dom";

// const Login = () => {
//     const [email, setEmail] = useState("");
//     const [password, setPassword] = useState("");
//     const [error, setError] = useState("");
//     const navigate = useNavigate();

//     const handleLogin = async (e) => {
//         e.preventDefault();
//         setError("");
    
//         try {
//             const res = await axios.post("https://bookstall-server-jqrx.onrender.com/api/auth/login", { email, password });
//             localStorage.setItem("token", res.data.token);
//             localStorage.setItem("role", res.data.role);
    
//             if (res.data.role === "accountant") {
//                 navigate("/stock-entry"); // Accountant → Stock Entry Form
//             } else if (res.data.role === "billing") {
//                 navigate("/billing"); // Cashier → Billing Form
//             } else if (res.data.role === "admin") {
//                 navigate("/admin-dashboard"); // Admin → Dashboard
//             } else {
//                 setError("Unauthorized Role"); // If role doesn't match
//             }
//         } catch (err) {
//             setError(err.response?.data?.error || "Login failed");
//         }
//     };

//     return (
        
//         <Container component="main" maxWidth="xs">
            
//             <Paper elevation={3} sx={{ padding: 4, mt: 8, textAlign: "center" }}>
                
//                 <Typography variant="h5" fontWeight="bold" gutterBottom>
//                     Login
//                 </Typography>
//                 {error && (
//                     <Typography color="error" sx={{ mb: 2 }}>
//                         {error}
//                     </Typography>
//                 )}
//                 <Box component="form" onSubmit={handleLogin} sx={{ display: "flex", flexDirection: "column", gap: 2 }}>
//                     <TextField
//                         label="Email"
//                         type="email"
//                         fullWidth
//                         variant="outlined"
//                         value={email}
//                         onChange={(e) => setEmail(e.target.value)}
//                         autoComplete="email"
//                         required
//                     />
//                     <TextField
//                         label="Password"
//                         type="password"
//                         fullWidth
//                         variant="outlined"
//                         value={password}
//                         onChange={(e) => setPassword(e.target.value)}
//                         autoComplete="current-password"
//                         required
//                     />
//                     <Button type="submit" variant="contained" color="primary" fullWidth>
//                         Login
//                     </Button>
//                 </Box>
//             </Paper>
//         </Container>
//     );
// };

// export default Login;
