import React, { useState, useEffect } from 'react';

function CandidateManager() {
    const [candidates, setCandidates] = useState([]);
    const [editingCandidate, setEditingCandidate] = useState(null); // { _id, name, party }
    const [error, setError] = useState('');
    const [message, setMessage] = useState('');

    const fetchCandidates = async () => {
        try {
            const response = await fetch('/api/candidates'); // Updated path
            if (!response.ok) throw new Error('Failed to fetch candidates');
            const data = await response.json();
            setCandidates(data);
        } catch (err) {
            setError(`Error fetching candidates: ${err.message}`);
        }
    };

    useEffect(() => {
        fetchCandidates();
    }, []);

    const handleDelete = async (candidateId) => {
        if (!window.confirm("Are you sure you want to delete this candidate?")) return;
        try {
            const response = await fetch(`/api/candidates/${candidateId}`, { method: 'DELETE' }); // Updated path
            if (response.ok) {
                setMessage('Candidate deleted successfully.');
                fetchCandidates(); // Refresh list
            } else {
                const data = await response.json();
                setError(data.message || 'Failed to delete candidate.');
            }
        } catch (err) {
            setError('An error occurred while deleting candidate.');
        }
    };

    const handleEdit = (candidate) => {
        setEditingCandidate({ ...candidate }); // Clone to avoid direct state mutation
    };

    const handleUpdateChange = (e) => {
        setEditingCandidate({
            ...editingCandidate,
            [e.target.name]: e.target.value
        });
    };

    const handleUpdateSubmit = async (e) => {
        e.preventDefault();
        if (!editingCandidate || !editingCandidate.name || !editingCandidate.party) {
            setError("Name and Party are required for update.");
            return;
        }
        try {
            const response = await fetch(`/api/candidates/${editingCandidate._id}`, { // Updated path
                method: 'PUT',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ name: editingCandidate.name, party: editingCandidate.party }),
            });
            if (response.ok) {
                setMessage('Candidate updated successfully.');
                setEditingCandidate(null);
                fetchCandidates(); // Refresh list
            } else {
                const data = await response.json();
                setError(data.message || 'Failed to update candidate.');
            }
        } catch (err) {
            setError('An error occurred while updating candidate.');
        }
    };

    return (
        <section>
            <h3>Manage Candidates</h3>
            {error && <p className="error-message">{error}</p>}
            {message && <p className="success-message">{message}</p>}

            {editingCandidate && (
                <form onSubmit={handleUpdateSubmit} style={{ border: '1px solid #ccc', padding: '15px', marginBottom: '15px' }}>
                    <h4>Edit Candidate</h4>
                    <div>
                        <label htmlFor="editName">Name:</label>
                        <input
                            type="text"
                            id="editName"
                            name="name"
                            value={editingCandidate.name}
                            onChange={handleUpdateChange}
                        />
                    </div>
                    <div>
                        <label htmlFor="editParty">Party:</label>
                        <input
                            type="text"
                            id="editParty"
                            name="party"
                            value={editingCandidate.party}
                            onChange={handleUpdateChange}
                        />
                    </div>
                    <button type="submit">Update Candidate</button>
                    <button type="button" onClick={() => setEditingCandidate(null)}>Cancel</button>
                </form>
            )}

            {candidates.length > 0 ? (
                <table>
                    <thead>
                        <tr>
                            <th>Name</th>
                            <th>Party</th>
                            <th>Actions</th>
                        </tr>
                    </thead>
                    <tbody>
                        {candidates.map(candidate => (
                            <tr key={candidate._id}>
                                <td>{candidate.name}</td>
                                <td>{candidate.party}</td>
                                <td>
                                     <div className="action-buttons">
                                    <button onClick={() => handleEdit(candidate)}>Edit</button>
                                    <button onClick={() => handleDelete(candidate._id)} className="logout-button">Delete</button>
                                    </div>
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            ) : <p>No candidates found or loading...</p>}
        </section>
    );
}

export default CandidateManager;