import React, { useState } from 'react';
import { QrCode, X } from 'lucide-react';
// import {ethers} from "ethers";
// import { QrReader } from 'react-qr-reader';

interface QRScannerProps {
    onScan: (data: string) => void;
    onClose: () => void;
}

const QRScanner: React.FC<QRScannerProps> = ({ onScan, onClose }) => {
    const [isScanning, setIsScanning] = useState(false);

    // For demo purposes
    const startScanning = () => {
        setIsScanning(true);

        // DEMO : Simulate a successful scan after 2 seconds
        setTimeout(() => {
            setIsScanning(false);
            // DEMO : Generate a random product ID for demo purposes
            const mockProductId = `PROD-${Math.floor(Math.random() * 1000)}-${Math.floor(Math.random() * 1000)}`;
            onScan(mockProductId);
        }, 2000);
    };

    // function validateQrData(qrData) { // Validate function
    //     const [address, productId] = qrData.split('|');
    //     return ethers.isAddress(address) && productId.match(/^PROD-[A-Z0-9]+$/);
    // }

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
                    <div className="scanner-frame mb-4">
                        {isScanning && <div className="scanner-line"></div>}
                        <QrCode className="h-20 w-20 text-neutral-300" />
                    </div>

                    <p className="text-center text-neutral-600 mb-6">
                        {isScanning
                            ? "Scanning... Hold your device steady"
                            : "Position the QR code inside the frame to scan"}
                    </p>

                    <button
                        onClick={startScanning}
                        disabled={isScanning}
                        className="btn btn-primary w-full"
                    >
                        {isScanning ? "Scanning..." : "Start Scanning"}
                    </button>

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