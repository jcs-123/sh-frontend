import { BrowserRouter as Router, Routes, Route, Navigate } from "react-router-dom";
import Login from "./pages/Login";
import StockEntry from "./pages/StockEntry";
import Billing from "./pages/Billing";
import AdminDashboard from "./pages/AdminDashboard";
import StockList from "./pages/StockList";
import AddStock from "./pages/AddStock";
import EditStock from "./pages/EditStock"
import DamageReturn from "./pages/DamageReturn";
import Report from "./pages/StockReports";
import DaybookReport from "./pages/DaybookReport";
import BillingRecords from "./pages/BillingRecords";
import AdminSummary from "./pages/AdminSummary";
import UpdateStock from "./pages/UpdateStock";


const PrivateRoute = ({ role, children }) => {
    const userRole = localStorage.getItem("role");
    return userRole === role ? children : <Navigate to="/login" />;
};

function App() {
    return (
        <Router>
            <Routes>
                <Route path="/login" element={<Login />} />
                <Route path="/stock-entry" element={<PrivateRoute role="accountant"><StockEntry /></PrivateRoute>} />
                <Route path="/billing" element={<PrivateRoute role="billing"><Billing /></PrivateRoute>} />
                <Route path="/admin-dashboard" element={<PrivateRoute role="admin"><AdminDashboard /></PrivateRoute>} />
                <Route path="/" element={<Navigate to="/login" />} />
                <Route path="/stock-list" element={<StockList />} />
                <Route path="/add-stock" element={<AddStock />} />
                <Route path="/edit-stock" element={<EditStock />} />
                <Route path="/damage-return" element={<DamageReturn />} />
                <Route path="/stock-report" element={<Report />} />
                <Route path="/edit-stock/:id" element={<EditStock />} />
                <Route path="/update-stock" element={<UpdateStock />} />
                <Route path="/daybook-report" element={<DaybookReport />} />
                <Route path="/billing-records" element={<BillingRecords />} />
                <Route path="/admin-summary" element={<AdminSummary />} />

              

        
                
        
            </Routes>
        </Router>
    );
}

export default App;
