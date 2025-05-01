import React from "react";
import { useUserProfile } from '../../hooks/useUserProfile.ts';
import Layout from '../layout/Layout';
import Spinner from 'react-bootstrap/Spinner';
import Alert from 'react-bootstrap/Alert';
import {Navigate} from "react-router-dom";

interface DashboardLayoutProps {
    children?: React.ReactNode;
}

export const DashboardLayout = ({ children }: DashboardLayoutProps) => {
    const { user, loading, error } = useUserProfile();

    if (loading) {
        return (
            <div className="d-flex justify-content-center mt-5">
                <Spinner animation="border" role="output">
                    <span className="visually-hidden">Loading...</span>
                </Spinner>
            </div>
        );
    }

    if (error) {
        return (
            <div className="container mt-5">
                <Alert variant="danger">
                    <Alert.Heading>Profile Load Error</Alert.Heading>
                    <p>{error.message}</p>
                    <p className="mb-0">Please refresh or try again later.</p>
                </Alert>
            </div>
        );
    }

    if (!user) return <Navigate to="/" />;

    return (
        <Layout user={user}>
            {children}
        </Layout>
    );
};