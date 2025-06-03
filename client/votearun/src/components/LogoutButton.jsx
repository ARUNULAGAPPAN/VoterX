import React from 'react';
import { useNavigate } from 'react-router-dom';

function LogoutButton() {
    const navigate = useNavigate();

    const handleLogout = () => {
        localStorage.removeItem('isLoggedIn');
        localStorage.removeItem('role');
        localStorage.removeItem('username');
        localStorage.removeItem('userId');
        localStorage.removeItem('hasVoted');
        // Any other localStorage items to clear
        alert('You have been logged out.');
        navigate('/login');
    };

    return (
        <button onClick={handleLogout} className="logout-button" style={{float: 'right', marginBottom: '10px'}}>
            Logout
        </button>
    );
}

export default LogoutButton;