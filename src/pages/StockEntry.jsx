import { useEffect, useState } from "react";
import EditStock from "./EditStock";
import MinimumQuantityReport from "./MinimumQuantityReport";
import DamageReturn from "./DamageReturn";
import AddStock from "./AddStock";
import Reports from "./StockReports";
import axios from "axios";
import "./StockEntry.css";
import DaybookReport from "./DaybookReport";
import PurchaseHistory from "./PurchaseHistory"; // ✅ Add this import



function StockEntry() {
    const [activeTab, setActiveTab] = useState("addStock");
    const [hasLowStock, setHasLowStock] = useState(false);

    // ⏱️ Auto-refresh every 2 minutes
    useEffect(() => {
        fetchLowStockStatus(); // initial check

        const interval = setInterval(() => {
            fetchLowStockStatus();
        }, 2 * 60 * 1000); // 2 minutes

        return () => clearInterval(interval);
    }, []);

    const fetchLowStockStatus = async () => {
        try {
            const res = await axios.get("https://bookstall-server-jqrx.onrender.com/api/stocks");
            const lowStockItems = res.data.filter(
                (item) => parseInt(item.quantity) < parseInt(item.minQuantity)
            );
            setHasLowStock(lowStockItems.length > 0);
        } catch (err) {
            console.error("Error checking low stock:", err.message);
        }
    };

    return (
        <div className="stock-container">
            {/* Sidebar Navigation */}
            <nav className="sidebar">
                <h2>Stock Dashboard</h2>
                <ul>
                    <li onClick={() => setActiveTab("addStock")} className={activeTab === "addStock" ? "active" : ""}>
                        📦 Add Stock
                    </li>
                    <li onClick={() => setActiveTab("editStock")} className={activeTab === "editStock" ? "active" : ""}>
                        ✏️ Edit Stock
                    </li>
                    <li onClick={() => setActiveTab("minQuantity")} className={activeTab === "minQuantity" ? "active" : ""}>
                        ⚠️ Min Quantity{" "}
                        {hasLowStock && <span className="red-dot blink" />}
                    </li>
                    <li onClick={() => setActiveTab("damageReturn")} className={activeTab === "damageReturn" ? "active" : ""}>
                        🔄 Damage Return
                    </li>
                    <li onClick={() => setActiveTab("Stockreports")} className={activeTab === "Stockreports" ? "active" : ""}>
                        📊 Stock Reports
                    </li>
                    <li onClick={() => setActiveTab("daybook")} className={activeTab === "daybook" ? "active" : ""}>
                        📅 Daybook Report
                    </li>
                    <li onClick={() => setActiveTab("purchaseHistory")} className={activeTab === "purchaseHistory" ? "active" : ""}>
                        📘 Purchase History
                    </li>


                </ul>
            </nav>

            {/* Main Content */}
            <div className="content">
                {activeTab === "addStock" && <AddStock />}
                {activeTab === "editStock" && <EditStock />}
                {activeTab === "minQuantity" && <MinimumQuantityReport />}
                {activeTab === "damageReturn" && <DamageReturn />}
                {activeTab === "Stockreports" && <Reports />}
                {activeTab === "daybook" && <DaybookReport />}
                {activeTab === "purchaseHistory" && <PurchaseHistory />}

            </div>
        </div>
    );
}

export default StockEntry;
