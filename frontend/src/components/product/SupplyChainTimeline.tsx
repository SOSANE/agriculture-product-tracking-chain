import React from "react";
import {
  CheckCircle,
  MapPin,
  Clock,
  Thermometer,
  Truck,
  Factory,
  Home,
  ShoppingBag,
  Sprout,
  Trees,
  Flower,
  Package2,
  Scan,
} from "lucide-react";
import { SupplyChainStep } from "../../types";

interface SupplyChainTimelineProps {
  steps: SupplyChainStep[];
}

const SupplyChainTimeline: React.FC<SupplyChainTimelineProps> = ({ steps }) => {
  const getStepIcon = (action: string) => {
    switch (action.toLowerCase()) {
      case "planted":
        return <Trees className="h-5 w-5" />;
      case "seeded":
        return <Flower className="h-5 w-5" />;
      case "cultivated":
        return <Sprout className="h-5 w-5" />;
      case "harvested":
        return <Home className="h-5 w-5" />;
      case "processed":
        return <Factory className="h-5 w-5" />;
      case "packaged":
        return <ShoppingBag className="h-5 w-5" />;
      case "shipped":
        return <Truck className="h-5 w-5" />;
      case "delivered":
        return <Package2 className="h-5 w-5" />;
      case "received":
        return <Scan className="h-5 w-5" />;
      default:
        return <Clock className="h-5 w-5" />;
    }
  };

  const getStepColor = (verified: boolean) => {
    return verified
      ? "bg-primary text-white"
      : "bg-neutral-200 text-neutral-500";
  };

  return (
    <div className="product-timeline relative pl-10 py-4 space-y-8">
      {steps.map((step, index) => (
        <div key={step.id} className="supply-chain-stage relative">
          <div className="flex items-start gap-4">
            <div className="flex flex-col items-center">
              <div className={`timeline-dot ${getStepColor(step.verified)}`}>
                {getStepIcon(step.action)}
              </div>
              {index < steps.length - 1 && (
                <div className="stage-connector h-full w-0.5 bg-primary-light mt-2"></div>
              )}
            </div>

            <div className="flex-1 pt-1">
              <div className="flex items-center justify-between">
                <h3 className="text-base font-medium capitalize">
                  {step.action}
                  {step.verified && (
                    <CheckCircle className="inline-block ml-2 h-4 w-4 text-success" />
                  )}
                </h3>
                <span className="text-xs text-neutral-500">
                  {new Date(step.timestamp).toLocaleString()}
                </span>
              </div>

              {step.description && (
                <p className="text-sm text-neutral-600 mt-1 mb-2">
                  {step.description}
                </p>
              )}

              <div className="flex flex-wrap gap-3 mt-2">
                {step.location?.name && (
                  <div className="flex items-center text-xs text-neutral-600">
                    <MapPin className="h-3.5 w-3.5 mr-1 text-primary" />
                    <span>{step.location.name}</span>
                  </div>
                )}

                {step.temperature && (
                  <div className="flex items-center text-xs text-neutral-600">
                    <Thermometer className="h-3.5 w-3.5 mr-1 text-primary" />
                    <span>{step.temperature}°C</span>
                  </div>
                )}

                {step.performedBy?.name && (
                  <div className="flex items-center text-xs text-neutral-600">
                    <span className="font-medium">{step.performedBy.name}</span>
                    {step.performedBy.role && (
                      <>
                        <span className="mx-1">•</span>
                        <span className="capitalize">
                          {step.performedBy.role}
                        </span>
                      </>
                    )}
                  </div>
                )}
              </div>

              {step.certificates && step.certificates.length > 0 && (
                <div className="mt-2 flex flex-wrap gap-1">
                  {step.certificates.map((cert) => (
                    <span
                      key={cert.id}
                      className="inline-flex items-center px-2 py-0.5 rounded-full text-xs font-medium bg-primary bg-opacity-10 text-primary"
                    >
                      <CheckCircle className="h-3 w-3 mr-1" />
                      {cert.name}
                    </span>
                  ))}
                </div>
              )}
            </div>
          </div>
        </div>
      ))}
    </div>
  );
};

export default SupplyChainTimeline;
