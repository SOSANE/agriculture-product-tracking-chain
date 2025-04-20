import React from 'react';
import { DashboardMetric } from '../../types';

interface DashboardMetricCardProps {
    metric: DashboardMetric;
}

const DashboardMetricCard: React.FC<DashboardMetricCardProps> = ({ metric }) => {
    const { title, value, change, changeType, icon } = metric;

    const getChangeColor = () => {
        switch (changeType) {
            case 'positive':
                return 'text-success';
            case 'negative':
                return 'text-error';
            default:
                return 'text-neutral-500';
        }
    };

    return (
        <div className="card card-hover bg-white transition-all h-full">
            <div className="flex items-start justify-between">
                <div>
                    <h3 className="text-neutral-500 font-normal text-sm mb-1">{title}</h3>
                    <p className="text-2xl font-semibold">{value}</p>
                    <div className={`text-sm mt-1 ${getChangeColor()}`}>
                        {changeType === 'positive' && '↑ '}
                        {changeType === 'negative' && '↓ '}
                        {change}%
                    </div>
                </div>
                <div className="bg-primary bg-opacity-10 p-3 rounded-lg">
                    <span className="text-primary" dangerouslySetInnerHTML={{ __html: icon }} />
                </div>
            </div>
        </div>
    );
};

export default DashboardMetricCard;