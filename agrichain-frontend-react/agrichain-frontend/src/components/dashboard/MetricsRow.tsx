import React from 'react';
import DashboardMetricCard from './DashboardMetricCard';
import { DashboardMetric } from '../../types';

interface MetricsRowProps {
    metrics: DashboardMetric[];
}

const MetricsRow: React.FC<MetricsRowProps> = ({ metrics }) => {
    return (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
            {metrics.map((metric) => (
                <DashboardMetricCard key={metric.id} metric={metric} />
            ))}
        </div>
    );
};

export default MetricsRow;