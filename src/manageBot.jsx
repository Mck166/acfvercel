import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import './manageBot.css';

const API_BASE_URL = 'https://api.allchinafinds.com';

const ManageBot = () => {
    const navigate = useNavigate();
    const [userBots, setUserBots] = useState([]);
    const [botCount, setBotCount] = useState('0/2');
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const loggedInUsername = localStorage.getItem('username');

    useEffect(() => {
        const fetchBots = async () => {
            const token = localStorage.getItem('jwtToken');
            if (!token) {
                navigate('/');
                return;
            }

            try {
                setLoading(true);
                const response = await fetch(`${API_BASE_URL}/api/bots`, {
                    headers: {
                        'Authorization': `Bearer ${token}`,
                    }
                });

                if (!response.ok) {
                    throw new Error('Failed to fetch bots');
                }

                const data = await response.json();
                const userBots = data.bots.filter(bot => 
                    bot.username.toLowerCase() === loggedInUsername.toLowerCase()
                );
                setUserBots(userBots);
                setBotCount(`${userBots.length}/2`);
            } catch (error) {
                console.error('Error fetching bots:', error);
                setError('Error loading bots. Please try again later.');
            } finally {
                setLoading(false);
            }
        };

        fetchBots();
    }, [navigate, loggedInUsername]);

    const toggleBotStatus = async (channel, currentStatus) => {
        try {
            const newStatus = currentStatus === 'active' ? 'paused' : 'active';

            const response = await fetch(`${API_BASE_URL}/api/bots/${channel}`, {
                method: 'PUT',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${localStorage.getItem('jwtToken')}`,
                },
                body: JSON.stringify({ status: newStatus }),
            });

            if (response.ok) {
                setUserBots(prevBots => 
                    prevBots.map(bot => 
                        bot.channel === channel 
                            ? {...bot, status: newStatus}
                            : bot
                    )
                );
            } else {
                throw new Error('Failed to update bot status');
            }
        } catch (error) {
            console.error('Error updating bot status:', error);
            alert('Failed to update bot status. Please try again.');
        }
    };

    const deleteBot = async (channel) => {
        if (!window.confirm('Are you sure you want to delete this bot?')) {
            return;
        }

        try {
            const response = await fetch(`${API_BASE_URL}/api/bots/${channel}`, {
                method: 'DELETE',
                headers: {
                    'Authorization': `Bearer ${localStorage.getItem('jwtToken')}`,
                }
            });

            if (response.ok) {
                setUserBots(prevBots => prevBots.filter(bot => bot.channel !== channel));
                setBotCount(prev => `${parseInt(prev) - 1}/2`);
            } else {
                throw new Error('Failed to delete bot');
            }
        } catch (error) {
            console.error('Error deleting bot:', error);
            alert('Failed to delete bot. Please try again.');
        }
    };

    const handleLogout = () => {
        localStorage.clear();
        navigate('/');
    };

    return (
        <div className="content-body">
            <div className="content-header">
                <div className="header-left">
                    <div className="bot-counter">
                        <i className="fas fa-robot"></i>
                        <span>{botCount}</span>
                    </div>
                    <h1>Active Bots</h1>
                </div>
            </div>

            <div className="welcome-section">
                <h2>View all of your bots below</h2>
                <p>Delete or pause your bots from here, you can also create a new bot from the setup bot page</p>
            </div>

            {loading && <div className="loading">Loading...</div>}
            {error && <div className="error-message">{error}</div>}

            <div className="dashboard">
                {loading && <div className="loading">Loading...</div>}
                {error && <div className="error-message">{error}</div>}
                
                {!loading && !error && (
                    userBots.length > 0 ? (
                        <>
                            {userBots.map(bot => (
                                <div className="bot-card" key={bot.created_at}>
                                    <div className="bot-header">
                                        <h3>Bot Details</h3>
                                        <span className={`status ${bot.status || 'active'}`}>
                                            {bot.status || 'active'}
                                        </span>
                                    </div>
                                    <div className="bot-info">
                                        <p><strong>Channel:</strong> {bot.channel}</p>
                                        <p><strong>Affiliate Code:</strong> {bot.affiliate_code}</p>
                                        <p><strong>Created:</strong> {new Date(bot.created_at).toLocaleDateString()}</p>
                                    </div>
                                    <div className="bot-actions">
                                        <button 
                                            className={`toggle-btn ${bot.status || 'active'}`}
                                            onClick={() => toggleBotStatus(bot.channel, bot.status || 'active')}
                                        >
                                            <i className={`fas ${bot.status === 'paused' ? 'fa-play' : 'fa-pause'}`}></i>
                                            {bot.status === 'paused' ? 'Start Bot' : 'Pause Bot'}
                                        </button>
                                        <button 
                                            className="delete-btn"
                                            onClick={() => deleteBot(bot.channel)}
                                        >
                                            <i className="fas fa-trash"></i>
                                            Delete Bot
                                        </button>
                                    </div>
                                </div>
                            ))}
                        </>
                    ) : (
                        <div className="no-bots">
                            <p>No active bots found for your account.</p>
                            <button 
                                onClick={() => navigate('/setup-bot')}
                                className="create-bot-button"
                            >
                                Create New Bot
                            </button>
                        </div>
                    )
                )}
            </div>
        </div>
    );
};

export default ManageBot;