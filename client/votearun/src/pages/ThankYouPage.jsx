import React from 'react';
import { Link } from 'react-router-dom';
import LogoutButton from '../components/LogoutButton';

function ThankYouPage() {
    return (
        <div className="container">
            <h2>Vote Submitted!</h2>
            <p className="success-message">Thank you for participating in the election.</p>
            <p>Your vote has been successfully recorded.</p>
            <LogoutButton />
        </div>
    );
}

export default ThankYouPage;