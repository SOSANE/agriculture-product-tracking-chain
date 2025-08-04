import {useUserProfile} from "./useUserProfile.ts";
import {useNavigate} from "react-router-dom";
import {useEffect, useState} from "react";
import {Certificate} from "../types";

export const useCertificates = () => {
    const { user, loading } = useUserProfile();
    const navigate = useNavigate();
    const [certificates, setCertificates] = useState<Certificate[]>([]);
    const [certificatesLoading, setCertificatesLoading] = useState(true);

    useEffect(() => {
        if (!loading && !user) {
            navigate('/');
        } else if (user) {
            loadCertificates();
        }
    }, [user, loading, navigate]);

    const loadCertificates = async () => {
        try {
            setCertificatesLoading(true);

            const url = '/api/certificates';

            const response = await fetch(url, {
                credentials: 'include'
            });

            if (!response.ok) throw new Error('Failed to fetch certificates.');

            const data = await response.json();
            setCertificates(data);
        } catch (err) {
            console.error('Error fetching certificates:', err);
        } finally {
            setCertificatesLoading(false);
        }
    };

    return {certificates, certificatesLoading};
}