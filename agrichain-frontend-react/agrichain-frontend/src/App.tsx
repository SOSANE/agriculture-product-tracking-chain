import {BrowserRouter, Routes, Route, Navigate, Outlet, useNavigate} from 'react-router-dom';
import ProductDetail from './pages/ProductDetail';
import VerifyProduct from './pages/VerifyProduct';
import Homepage from './pages/Homepage';
import RegulatorDashboard from './pages/dashboards/RegulatorDashboard.tsx';
import FarmerDashboard from './pages/dashboards/FarmerDashboard.tsx';
import ProcessorDashboard from './pages/dashboards/ProcessorDashboard.tsx';
import DistributorDashboard from './pages/dashboards/DistributorDashboard.tsx';
import RetailerDashboard from './pages/dashboards/RetailerDashboard.tsx';
import AdministratorDashboard from "./pages/dashboards/AdministratorDashboard.tsx";
import Auth from './pages/Auth';
import AddAccount from "./pages/admin/AddAccount.tsx";
import CertificationRequest from "./pages/regulator/CertificationRequests.tsx";
import Spinner from "react-bootstrap/Spinner";
import {useUserProfile} from "./hooks/useUserProfile.ts";
import {useEffect} from "react";
import {UserRole} from "./types";
import ManageAccounts from "./pages/admin/ManageAccounts.tsx";
import AddProduct from "./pages/farmer/AddProduct.tsx";
import {Profile} from "./pages/shared/Profile.tsx";
import Products from "./pages/shared/Products.tsx";

const AuthWrapper = () => {
    const { user, loading } = useUserProfile();

    if (loading) return <Spinner animation="border" />;

    return user ? <Outlet /> : <Navigate to="/" />;
};

const RoleRoute = ({ allowedRoles }: { allowedRoles: UserRole[] }) => {
    const { user, loading } = useUserProfile();
    const navigate = useNavigate();

    useEffect(() => {
        if (!loading && !user) {
            navigate('/');
        }
    }, [user, loading, navigate]);

    if (loading) return <Spinner animation="border" />;
    if (!user) return <Navigate to="/" />;
    return allowedRoles.includes(user.role) ? <Outlet /> : <Navigate to="/dashboard" />;
};

const DashboardRedirect = () => {
    const { user, loading } = useUserProfile();
    const navigate = useNavigate();

    useEffect(() => {
        if (!loading && !user) {
            navigate('/');
        }
    }, [user, loading, navigate]);

    if (loading) return <Spinner animation="border" />;
    if (!user) return <Navigate to="/" />;

    switch (user.role) {
        case 'admin':
            return <AdministratorDashboard />;
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
        default:
            return <Navigate to="/" />;
    }
};

function App() {

    return (
        <BrowserRouter>
            <Routes>
                {/* Public Routes */}
                <Route path="/" element={<Homepage />} />
                <Route path="/login" element={<Auth />} />
                <Route path="/verify" element={<VerifyProduct />} />
                <Route path="/products/:id" element={<ProductDetail />}/>
                <Route path="/products" element={<Products />}/>
                <Route path="/profile" element={<Profile />}/>

                {/* Protected Routes */}
                <Route element={<AuthWrapper />}>
                    {/* Main Dashboard (based on role) */}
                    <Route path="/dashboard" element={<DashboardRedirect />} />

                    {/* Role-Specific Routes */}
                    <Route element={<RoleRoute allowedRoles={['admin']} />}>
                        <Route path="/add-account" element={<AddAccount />} />
                        <Route path="/users" element={<ManageAccounts />} />
                    </Route>

                    <Route element={<RoleRoute allowedRoles={['regulator']} />}>
                        <Route path="/certification-request" element={<CertificationRequest />} />
                    </Route>

                    <Route element={<RoleRoute allowedRoles={['farmer']} />}>
                        <Route path="/add-product" element={<AddProduct />} />
                    </Route>

                </Route>
            </Routes>
        </BrowserRouter>
    );
}

export default App;