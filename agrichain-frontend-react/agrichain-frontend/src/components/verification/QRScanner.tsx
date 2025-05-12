import React from 'react';
import { X } from 'lucide-react';
import { Scanner  } from '@yudiel/react-qr-scanner';

interface QRScannerProps {
    onScan: (data: string | any) => void;
    onClose: () => void;
}

const QRScanner: React.FC<QRScannerProps> = ({ onScan, onClose }) => {

    return (
        <div className="qr-scanner-overlay">
            <div className="bg-white rounded-lg w-full max-w-md p-6 relative">
                <button
                    onClick={onClose}
                    className="absolute top-3 right-3 p-1 rounded-full hover:bg-neutral-100"
                >
                    <X className="h-5 w-5" />
                </button>

                <h2 className="text-xl font-semibold mb-4 text-center">Scan Product QR Code</h2>

                <div className="flex flex-col items-center">
                    <div style={{width:'100%', height:'100%'}}>
                    <Scanner
                        onScan={(result) => {
                            onScan(result);
                            onClose();
                        }}
                        onError={(error) => {
                            console.error('QR Scanner Error:', error);
                        }}
                        constraints={{ facingMode: 'environment' }}
                        />
                    </div>

                    <div className="mt-4 text-center text-sm text-neutral-500">
                        You can also enter the product ID manually below
                    </div>

                    <div className="mt-4 w-full">
                        <input
                            type="text"
                            placeholder="Enter product ID"
                            className="input"
                        />
                        <button className="btn btn-outline w-full mt-2">
                            Verify Product
                        </button>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default QRScanner;