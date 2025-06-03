import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import LogoutButton from '../components/LogoutButton';

function VotingPage() {
    const [candidates, setCandidates] = useState([]);
    const [selectedCandidate, setSelectedCandidate] = useState('');
    const [hasVoted, setHasVoted] = useState(localStorage.getItem('hasVoted') === 'true');
    const [error, setError] = useState('');
    const [message, setMessage] = useState('');
    const navigate = useNavigate();

    useEffect(() => {
        // Check if user is logged in as voter
        const isLoggedIn = localStorage.getItem('isLoggedIn') === 'true';
        const role = localStorage.getItem('role');
        if (!isLoggedIn || role !== 'voter') {
            navigate('/login');
            return;
        }

        const fetchCandidates = async () => {
            try {
                const response = await fetch('/api/candidates'); // Updated path
                if (!response.ok) throw new Error('Failed to fetch candidates');
                const data = await response.json();
                setCandidates(data);
            } catch (err) {
                setError(err.message);
            }
        };

        if (!hasVoted) {
            fetchCandidates();
        }
    }, [navigate, hasVoted]);

    const handleVote = async (candidateId) => {
        if (hasVoted) {
            setMessage('You have already voted.');
            return;
        }
        const userId = localStorage.getItem('userId');
        const username = localStorage.getItem('username');

        if (!userId || !username) {
            setError('User information not found. Please log in again.');
            navigate('/login');
            return;
        }

        try {
            const response = await fetch('/api/votes/vote', { // Updated path
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ candidateId, userId, username }),
            });
            const data = await response.json();

            if (response.ok) {
                setHasVoted(true);
                localStorage.setItem('hasVoted', 'true');
                setMessage('Thank you, you have successfully voted!');
                // No need to navigate immediately, show message on this page.
                // Could navigate to a thank you page after a delay or on button click
                 setTimeout(() => navigate('/thank-you'), 2000);
            } else {
                setError(data.message || 'Failed to cast vote.');
            }
        } catch (err) {
            setError('An error occurred while voting.');
        }
    };
    
    if (hasVoted) {
        return (
            <div className="container">
                <h2>Voting</h2>
                <p className="success-message">{message || 'Thank you, you have already voted.'}</p>
                <LogoutButton />
                <button onClick={() => navigate('/results')}>View Results</button>
            </div>
        );
    }

    return (
        <div className="container">
            <h2>Cast Your Vote</h2>
            <LogoutButton />
            {error && <p className="error-message">{error}</p>}
            {message && <p className="success-message">{message}</p>}
            
            {!hasVoted && candidates.length > 0 && (
                <div>
                    <h3>Candidates:</h3>
                    {candidates.map((candidate) => (
                        <div key={candidate._id} className="candidate-item">
                            <h4>{candidate.name}</h4>
                            <p>Party: {candidate.party}</p>
                            <button onClick={() => handleVote(candidate._id)} disabled={hasVoted}>
                                Vote for {candidate.name}
                            </button>
                        </div>
                    ))}
                </div>
            )}
            {!hasVoted && candidates.length === 0 && !error && <p>Loading candidates...</p>}
            {hasVoted && <button onClick={() => navigate('/results')}>View Results</button>}
        </div>
    );
}

export default VotingPage;