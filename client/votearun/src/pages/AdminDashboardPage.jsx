import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import CandidateManager from '../components/CandidateManager'; // We'll create this
import LogoutButton from '../components/LogoutButton';

function AdminDashboardPage() {
    const [users, setUsers] = useState([]);
    const [results, setResults] = useState([]);
    const [newCandidateName, setNewCandidateName] = useState('');
    const [newCandidateParty, setNewCandidateParty] = useState('');
    const [error, setError] = useState('');
    const [message, setMessage] = useState('');
    const navigate = useNavigate();

    useEffect(() => {
        const role = localStorage.getItem('role');
        if (role !== 'admin') {
            navigate('/login'); // Or an unauthorized page
            return;
        }
        fetchUsers();
        fetchResults();
    }, [navigate]);

    const fetchUsers = async () => {
        try {
            const response = await fetch('/api/users'); // Updated path
            if (!response.ok) throw new Error('Failed to fetch users');
            const data = await response.json();
            setUsers(data);
        } catch (err) {
            setError(`Error fetching users: ${err.message}`);
        }
    };

    const fetchResults = async () => {
        try {
            const response = await fetch('/api/votes/results'); // Updated path
            if (!response.ok) throw new Error('Failed to fetch results');
            const data = await response.json();
            setResults(data);
        } catch (err) {
            setError(`Error fetching results: ${err.message}`);
        }
    };

    const handleAddCandidate = async (e) => {
        e.preventDefault();
        setError('');
        setMessage('');
        if (!newCandidateName.trim() || !newCandidateParty.trim()) {
            setError("Candidate name and party are required.");
            return;
        }
        try {
            const response = await fetch('/api/candidates/add', { // Updated path
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ name: newCandidateName, party: newCandidateParty }),
            });
            const data = await response.json();
            if (response.ok) {
                setMessage(`Candidate "${data.name}" added successfully!`);
                setNewCandidateName('');
                setNewCandidateParty('');
                // Optionally, refresh candidate list in CandidateManager or here if displayed directly
            } else {
                setError(data.message || 'Failed to add candidate.');
            }
        } catch (err) {
            setError('An error occurred while adding candidate.');
        }
    };


    return (
        <div className="container">
            <h2>Admin Dashboard</h2>
           
            <div className="admin-top-actions"></div>
             <LogoutButton />
            <button onClick={() => navigate('/results')}>View Public Results Page</button>
            <div className="admin-top-actions"></div>
           
        <div className="container dashboard">
            <section>
                <h3>Add New Candidate</h3>
                <form onSubmit={handleAddCandidate}>
                    <div>
                        <label htmlFor="candidateName">Candidate Name:</label>
                        <input
                            type="text"
                            id="candidateName"
                            value={newCandidateName}
                            onChange={(e) => setNewCandidateName(e.target.value)}
                            required
                        />
                    </div>
                    <div>
                        <label htmlFor="candidateParty">Candidate Party:</label>
                        <input
                            type="text"
                            id="candidateParty"
                            value={newCandidateParty}
                            onChange={(e) => setNewCandidateParty(e.target.value)}
                            required
                        />
                    </div>
                    <button type="submit">Add Candidate</button>
                </form>
            </section>

            <CandidateManager /> {/* Candidate List and Management */}

            <section>
                <h3>Voter List</h3>
                {users.length > 0 ? (
                    <table>
                        <thead>
                            <tr>
                                <th>Name</th>
                                <th>Username</th>
                                <th>Voted</th>
                            </tr>
                        </thead>
                        <tbody>
                            {users.map(user => (
                                <tr key={user._id}>
                                    <td>{user.name}</td>
                                    <td>{user.username}</td>
                                    <td>{user.hasVoted ? 'Yes' : 'No'}</td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                ) : <p>No users found or loading...</p>}
            </section>

            <section>
                <h3>Voting Results</h3>
                {results.length > 0 ? (
                     <table>
                        <thead>
                            <tr>
                                <th>Candidate</th>
                                <th>Party</th>
                                <th>Votes</th>
                            </tr>
                        </thead>
                        <tbody>
                            {results.map(result => (
                                <tr key={result.candidateId || result.name}> {/* Use unique key */}
                                    <td>{result.name}</td>
                                    <td>{result.party}</td>
                                    <td>{result.votes}</td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                ) : <p>No results yet or loading...</p>}
            </section>
            </div>
        </div>
    );
}

export default AdminDashboardPage;