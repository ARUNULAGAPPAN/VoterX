import React from 'react';
import { Link, useLocation } from 'react-router-dom';

function ErrorPage() {
    const location = useLocation();
    const message = location.state?.message || '404 - Page Not Found';
    const showLoginButton = location.state?.showLoginButton !== false; // Default to true

    return (
        <div className="container">
            <h2>Error</h2>
            <p className="error-message">{message}</p>
            {showLoginButton && (
                <Link to="/login">
                    <button>Go back to Login</button>
                </Link>
            )}
             <Link to="/">
                <button style={{backgroundColor: "#6c757d"}}>Go to Home</button>
            </Link>
        </div>
    );
}

export default ErrorPage;