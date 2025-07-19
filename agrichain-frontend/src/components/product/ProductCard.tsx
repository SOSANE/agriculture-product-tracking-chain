import React from 'react';
import { CheckCircle, MapPin, Calendar } from 'lucide-react';
import { Link } from 'react-router-dom';
import { Product } from '../../types';

interface ProductCardProps {
    product: Product;
}

const ProductCard: React.FC<ProductCardProps> = ({ product }) => {
    const { id, name, type, imageUrl, status, farmer, currentLocation, createdAt, certificates } = product;

    const getStatusColor = () => {
        switch (status) {
            case 'planted':
                return 'bg-primary-light';
            case 'growing':
                return 'bg-success';
            case 'harvested':
                return 'bg-warning';
            case 'processed':
                return 'bg-accent';
            case 'packaged':
                return 'bg-secondary';
            case 'shipped':
                return 'bg-primary';
            case 'delivered':
                return 'bg-accent-dark';
            case 'received':
                return 'bg-warning';
            case 'sold':
                return 'bg-accent';
            default:
                return 'bg-neutral-500';
        }
    };

    return (
        <Link to={`/products/${id}`} className="block">
            <div className="card card-hover h-full">
                <div className="relative">
                    <img
                        src={imageUrl || "https://images.pexels.com/photos/2255935/pexels-photo-2255935.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750"}
                        alt={name}
                        className="w-full h-48 object-cover rounded-t-lg mb-4"
                    />
                    <div className={`absolute top-3 right-3 ${getStatusColor()} text-white px-2 py-1 rounded-full text-xs font-medium capitalize`}>
                        {status}
                    </div>
                </div>
                <h3 className="text-lg font-semibold mb-1">{name}</h3>
                <p className="text-neutral-600 text-sm mb-4">Type: {type}</p>

                <div className="flex items-center text-sm text-neutral-500 mb-2">
                    <MapPin className="h-4 w-4 mr-1" />
                    <span>{currentLocation.name}</span>
                </div>

                <div className="flex items-center text-sm text-neutral-500 mb-4">
                    <Calendar className="h-4 w-4 mr-1" />
                    <span>{new Date(createdAt).toLocaleDateString()}</span>
                </div>

                <div className="flex justify-between items-center pt-4 border-t border-neutral-100">
                    <div className="text-sm">
                        <span className="block text-neutral-500">Producer</span>
                        <span className="font-medium">{farmer.name}</span>
                    </div>

                    {certificates.length > 0 && (
                        <div className="flex items-center text-success">
                            <CheckCircle className="h-4 w-4 mr-1" />
                            <span className="text-sm font-medium">Certified</span>
                        </div>
                    )}
                </div>
            </div>
        </Link>
    );
};

export default ProductCard;