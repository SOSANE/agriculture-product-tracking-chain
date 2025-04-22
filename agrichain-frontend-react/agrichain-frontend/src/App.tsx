import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { useState } from 'react';
import ProductDetail from './pages/ProductDetail';
import VerifyProduct from './pages/VerifyProduct';
import Analytics from "./pages/Analytics.tsx";
import Homepage from './pages/Homepage';
import RegulatorDashboard from './pages/RegulatorDashboard';
import FarmerDashboard from './pages/FarmerDashboard';
import ProcessorDashboard from './pages/ProcessorDashboard';
import DistributorDashboard from './pages/DistributorDashboard';
import RetailerDashboard from './pages/RetailerDashboard';
import AdministratorDashboard from "./pages/AdministratorDashboard.tsx";
import Auth from './pages/Auth';
import { UserRole } from './types';

function App() {
    const [isLoggedIn, setIsLoggedIn] = useState(false);
    const [userRole, setUserRole] = useState<UserRole | null>(null);

    const handleLogin = (role: UserRole) => {
        setIsLoggedIn(true);
        setUserRole(role);
    };

    const getDashboardForRole = () => {
        switch (userRole) {
            case 'regulator':
                return <RegulatorDashboard />;
            case 'farmer':
                return <FarmerDashboard />;
            case 'processor':
                return <ProcessorDashboard />;
            case 'distributor':
                return <DistributorDashboard />;
            case 'retailer':
                return <RetailerDashboard />;
            case 'admin':
                return <AdministratorDashboard />;
            default:
                return <Navigate to="/" />;
        }
    };

    return (
        <BrowserRouter>
            <Routes>
                <Route path="/" element={<Homepage />} />
                <Route
                    path="/auth/:role"
                    element={
                        !isLoggedIn ? (
                            <Auth onLogin={handleLogin} />
                        ) : (
                            <Navigate to="/dashboard" />
                        )
                    }
                />
                <Route
                    path="/dashboard"
                    element={isLoggedIn ? getDashboardForRole() : <Navigate to="/" />}
                />
                <Route path="/verify" element={<VerifyProduct />} />
                <Route path="/analytics" element={<Analytics />} />
                <Route path="/products/:id" element={<ProductDetail />} />
            </Routes>
        </BrowserRouter>
    );
}

export default App;