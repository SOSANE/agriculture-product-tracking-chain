import React from "react";
import { DashboardLayout } from "../components/layout/DashboardLayout";
import { Link } from "react-router-dom";

export const LoadingComponent: React.FC = () => {
  return (
    <DashboardLayout>
      <div className="container mx-auto px-4 py-8">
        <div className="flex justify-center items-center h-64">
          <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-primary"></div>
        </div>
      </div>
    </DashboardLayout>
  );
};

export const ErrorComponent = ({error}: {error: string}) => {
  return (
    <DashboardLayout>
      <div className="container mx-auto px-4 py-8">
        <div className="alert alert-error">
          <div className="flex-1">
            <label>{error}</label>
          </div>
        </div>
        <Link to="/dashboard" className="btn btn-primary mt-4">
          Back to Dashboard
        </Link>
      </div>
    </DashboardLayout>
  );
};

export const NoDataComponent = ({noDataMessage}: {noDataMessage: string}) => {
  return (
    <DashboardLayout>
      <div className="container mx-auto px-4 py-8">
        <div className="alert alert-warning">
          <div className="flex-1">
            <label>{noDataMessage}</label>
          </div>
        </div>
        <Link to="/dashboard" className="btn btn-primary mt-4">
          Back to Dashboard
        </Link>
      </div>
    </DashboardLayout>
  );
};