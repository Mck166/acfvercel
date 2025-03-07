import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import LoginCTA from '../components/LoginCTA';
import './manageBot.css';

const API_BASE_URL = 'https://api.allchinafinds.com';

const ManageBot = ({ isLoggedIn }) => {
    const navigate = useNavigate();
    const [userBots, setUserBots] = useState([]);
    const [botCount, setBotCount] = useState('0/2');
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const loggedInUsername = localStorage.getItem('username');

    useEffect(() => {
        if (isLoggedIn) {
            fetchBots();
        } else {
            setLoading(false);
        }
    }, [isLoggedIn]);

    const fetchBots = async () => {
        const token = localStorage.getItem('jwtToken');
        if (!token) {
            navigate('/login');
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

    const toggleBotStatus = async (channel, currentStatus) => {
        if (!isLoggedIn) {
            navigate('/login');
            return;
        }

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

            if (!response.ok) {
                throw new Error('Failed to update bot status');
            }

            // Update local state
            setUserBots(userBots.map(bot => 
                bot.channel === channel ? { ...bot, status: newStatus } : bot
            ));
        } catch (error) {
            console.error('Error updating bot status:', error);
            setError('Failed to update bot status. Please try again.');
        }
    };

    const deleteBot = async (channel) => {
        if (!isLoggedIn) {
            navigate('/login');
            return;
        }

        if (!window.confirm(`Are you sure you want to delete the bot for channel ${channel}?`)) {
            return;
        }

        try {
            const response = await fetch(`${API_BASE_URL}/api/bots/${channel}`, {
                method: 'DELETE',
                headers: {
                    'Authorization': `Bearer ${localStorage.getItem('jwtToken')}`,
                },
            });

            if (!response.ok) {
                throw new Error('Failed to delete bot');
            }

            // Update local state
            setUserBots(userBots.filter(bot => bot.channel !== channel));
            setBotCount(`${userBots.length - 1}/2`);
        } catch (error) {
            console.error('Error deleting bot:', error);
            setError('Failed to delete bot. Please try again.');
        }
    };

    return (
        <div className="manage-bots-container">
            <div className="content-header">
                <h1>Manage Bots</h1>
                {isLoggedIn && <div className="bot-count">{botCount} Bots</div>}
            </div>
            
            {!isLoggedIn && <LoginCTA />}

            {isLoggedIn ? (
                <div className="dashboard">
                    {loading ? (
                        <div className="loading-spinner">Loading your bots...</div>
                    ) : error ? (
                        <div className="error-message">{error}</div>
                    ) : (
                        userBots.length > 0 ? (
                            <>
                                <div className="bot-actions-header">
                                    <button 
                                        onClick={() => navigate('/setup-bot')}
                                        className="create-bot-button"
                                        disabled={userBots.length >= 2}
                                    >
                                        <i className="fas fa-plus"></i> Create New Bot
                                    </button>
                                </div>
                                
                                {userBots.map(bot => (
                                    <div key={bot.channel} className="bot-card">
                                        <div className="bot-header">
                                            <h3>@{bot.channel}</h3>
                                            <span className={`status-badge ${bot.status || 'active'}`}>
                                                {bot.status === 'paused' ? 'Paused' : 'Active'}
                                            </span>
                                        </div>
                                        <div className="bot-details">
                                            <p>
                                                <strong>Channel:</strong>
                                                <span className="value">{bot.channel}</span>
                                            </p>
                                            <p>
                                                <strong>Affiliate Code:</strong>
                                                <span className="value">{bot.affiliate_code}</span>
                                            </p>
                                            <p>
                                                <strong>Agent:</strong>
                                                <span className="value">{bot.agent || 'Not specified'}</span>
                                            </p>
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
            ) : (
                <div className="dashboard">
                    <div className="placeholder-bots">
                        <div className="placeholder-card">
                            <div className="placeholder-header"></div>
                            <div className="placeholder-content"></div>
                            <div className="placeholder-actions"></div>
                        </div>
                        <div className="placeholder-card">
                            <div className="placeholder-header"></div>
                            <div className="placeholder-content"></div>
                            <div className="placeholder-actions"></div>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
};

export default ManageBot;