import React from 'react';
import { CheckCircle, MapPin, Clock, Thermometer, Truck, Factory, Home, ShoppingBag, Sprout } from 'lucide-react';
import { SupplyChainStep } from '../../types';

interface SupplyChainTimelineProps {
    steps: SupplyChainStep[];
}

const SupplyChainTimeline: React.FC<SupplyChainTimelineProps> = ({ steps }) => {
    const getStepIcon = (action: string) => {
        switch (action.toLowerCase()) {
            case 'planted':
            case 'seeded':
            case 'cultivated':
                return <Sprout className="h-5 w-5" />;
            case 'harvested':
                return <Home className="h-5 w-5" />;
            case 'processed':
                return <Factory className="h-5 w-5" />;
            case 'packaged':
                return <ShoppingBag className="h-5 w-5" />;
            case 'shipped':
            case 'in transit':
                return <Truck className="h-5 w-5" />;
            default:
                return <Clock className="h-5 w-5" />;
        }
    };

    const getStepColor = (verified: boolean) => {
        return verified ? 'bg-primary text-white' : 'bg-neutral-200 text-neutral-500';
    };

    return (
        <div className="product-timeline relative pl-10 py-4 space-y-6">
            {steps.map((step, index) => (
                <div key={step.id} className="supply-chain-stage animate-fade-in" style={{ animationDelay: `${index * 100}ms` }}>
                    <div className={`timeline-dot ${getStepColor(step.verified)}`}>
                        {getStepIcon(step.action)}
                    </div>

                    {index < steps.length - 1 && <div className="stage-connector"></div>}

                    <div className="ml-6 -mt-9">
                        <div className="flex items-center justify-between">
                            <h3 className="text-lg font-medium capitalize mb-1">
                                {step.action}
                                {step.verified && (
                                    <CheckCircle className="inline-block ml-2 h-4 w-4 text-success" />
                                )}
                            </h3>
                            <span className="text-sm text-neutral-500">
                {new Date(step.timestamp).toLocaleString()}
              </span>
                        </div>

                        <p className="text-neutral-600 mb-2">{step.description}</p>

                        <div className="flex flex-wrap gap-4 mt-3">
                            <div className="flex items-center text-sm text-neutral-600">
                                <MapPin className="h-4 w-4 mr-1 text-primary" />
                                <span>{step.location.name}</span>
                            </div>

                            {step.temperature && (
                                <div className="flex items-center text-sm text-neutral-600">
                                    <Thermometer className="h-4 w-4 mr-1 text-primary" />
                                    <span>{step.temperature}°C</span>
                                </div>
                            )}

                            <div className="flex items-center text-sm text-neutral-600">
                                <span className="font-medium">{step.performedBy.name}</span>
                                <span className="mx-1">•</span>
                                <span className="capitalize">{step.performedBy.role}</span>
                            </div>
                        </div>

                        {step.certificates && step.certificates.length > 0 && (
                            <div className="mt-2 flex flex-wrap gap-2">
                                {step.certificates.map((cert) => (
                                    <span
                                        key={cert.id}
                                        className="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-primary bg-opacity-10 text-primary"
                                    >
                    <CheckCircle className="h-3 w-3 mr-1" />
                                        {cert.name}
                  </span>
                                ))}
                            </div>
                        )}
                    </div>
                </div>
            ))}
        </div>
    );
};

export default SupplyChainTimeline;