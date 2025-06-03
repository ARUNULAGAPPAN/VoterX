import React, { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';

function HomePageRedirect() {
    const navigate = useNavigate();

    useEffect(() => {
        const isLoggedIn = localStorage.getItem('isLoggedIn') === 'true';
        const role = localStorage.getItem('role');

        if (isLoggedIn) {
            if (role === 'admin') {
                navigate('/admin');
            } else if (role === 'voter') {
                navigate('/vote');
            } else {
                // Fallback if role is not set or unknown, though login should handle this
                navigate('/login');
            }
        } else {
            navigate('/login');
        }
    }, [navigate]);

    return <div className="container">Loading...</div>; // Or a spinner component
}

export default HomePageRedirect;