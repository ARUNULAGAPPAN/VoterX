import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';

function ResultsPage() {
    const [results, setResults] = useState([]);
    const [error, setError] = useState('');
    const [totalVotes, setTotalVotes] = useState(0);

    useEffect(() => {
        const fetchResults = async () => {
            try {
                const response = await fetch('/api/votes/results'); 
                if (!response.ok) throw new Error('Failed to fetch results');
                const data = await response.json();
                setResults(data);
                
                const sumVotes = data.reduce((acc, curr) => acc + curr.votes, 0);
                setTotalVotes(sumVotes);
            } catch (err) {
                setError(err.message);
            }
        };
        fetchResults();
       
        const intervalId = setInterval(fetchResults, 5000); 
        return () => clearInterval(intervalId); 
    }, []);

    const role = localStorage.getItem('role');
    const isLoggedIn = localStorage.getItem('isLoggedIn') === 'true';

    return (
        <div className="container">
            <h2>Live Voting Results</h2>
            {error && <p className="error-message">{error}</p>}
            
            {results.length > 0 ? (
                <>
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
                                <tr key={result.candidateId || result.name}>
                                    <td>{result.name}</td>
                                    <td>{result.party}</td>
                                    <td>{result.votes}</td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                    <h3 style={{marginTop: "30px"}}>Vote Distribution (Total Votes: {totalVotes})</h3>
                    {results.map(result => (
                        <div key={`bar-${result.candidateId || result.name}`} className="result-bar-container">
                            <strong>{result.name} ({result.votes} votes)</strong>
                            <div 
                                className="result-bar" 
                                style={{ width: totalVotes > 0 ? `${(result.votes / totalVotes) * 100}%` : '0%' }}
                            >
                                {totalVotes > 0 ? `${((result.votes / totalVotes) * 100).toFixed(1)}%` : '0%'}
                            </div>
                        </div>
                    ))}
                </>
            ) : <p>No results yet or loading...</p>}

            <div style={{ marginTop: '20px' }}>
                {isLoggedIn ? (
                    role === 'admin' ? (
                        <Link to="/admin"><button>Back to Admin Dashboard</button></Link>
                    ) : (
                        <Link to="/vote"><button>Back to Voting Page</button></Link>
                    )
                ) : (
                    <Link to="/login"><button>Back to Login</button></Link>
                )}
            </div>
        </div>
    );
}

export default ResultsPage;