import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import myqrcode from './assets/myqrcode.jpeg';
import './Home.css';

const API_BASE_URL = 'https://api.allchinafinds.com';

const Home = () => {
    const navigate = useNavigate();
    const [userBots, setUserBots] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [botCount, setBotCount] = useState(0);

    useEffect(() => {
        const token = localStorage.getItem('jwtToken');
        const username = localStorage.getItem('username');
        console.log('Token:', token);
        console.log('Username:', username);

        if (!token || !username) {
            console.log('No token or username found, redirecting to login');
            navigate('/');
            return;
        }

        initializePage();
    }, [navigate]);

    const initializePage = async () => {
        try {
            setLoading(true);
            const response = await fetch(`${API_BASE_URL}/api/bots`, {
                headers: {
                    'Authorization': `Bearer ${localStorage.getItem('jwtToken')}`,
                }
            });

            if (!response.ok) {
                throw new Error(`HTTP error! status: ${response.status}`);
            }

            const data = await response.json();
            console.log('Received data:', data);
            
            const botsArray = data.bots || [];
            const userBots = botsArray.filter(bot => 
                bot.username === localStorage.getItem('username')
            );
            setUserBots(userBots);
            setBotCount(userBots.length);
            setError(null);
        } catch (error) {
            console.error('Error fetching bots:', error);
            setError('Failed to fetch bots. Please try again later.');
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="content-body">
            <div className="content-header">
                <h1>Telegram Bot Dashboard</h1>
            </div>

            <div className="welcome-section">
                <p>Automate content creation for your Telegram channel, please contact me with any bug issues or help setting up your bot.</p>
            </div>

            {loading && <div className="loading">Loading...</div>}
            {error && <div className="error-message">{error}</div>}
            
            {!loading && !error && (
                <div className="dashboard-grid">
                    {/* Bot Stats Card */}
                    <div className="dashboard-card">
                        <div className="card-header">
                            <i className="fas fa-robot"></i>
                            <h3>Your Bots</h3>
                        </div>
                        <div className="card-content">
                            <div className="stat-number">
                                <span id="botCount">{botCount}</span>
                                <span className="stat-label">/2 Active Bots</span>
                            </div>

                            <div className="card-actions">
                                <button 
                                    onClick={() => navigate('/setup-bot')} 
                                    className="card-action-btn"
                                    disabled={botCount >= 2}
                                    style={{ opacity: botCount >= 2 ? 0.5 : 1 }}
                                >
                                    Create Bot
                                    <i className="fas fa-arrow-right"></i>
                                </button>
                                <button onClick={() => navigate('/manage-bots')} className="card-action-btn secondary">
                                    Manage Bots
                                    <i className="fas fa-cog"></i>
                                </button>
                            </div>
                        </div>
                    </div>

                    {/* Feedback Card */}
                    <div className="dashboard-card">
                        <div className="card-header">
                            <i className="fas fa-comments"></i>
                            <h3>Provide Feedback</h3>
                        </div>
                        <div className="card-content feedback-content">
                            <p>Need help or have suggestions? This is a new project built for the users, so I would love to hear your feedback!</p>
                            <div className="qr-container">
                                <img src={myqrcode} alt="Support QR Code" />
                            </div>
                            <a href="https://t.me/acb_finds" target="_blank" rel="noopener noreferrer" className="card-action-btn">
                                Open in Telegram
                                <i className="fas fa-external-link-alt"></i>
                            </a>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
};

export default Home;