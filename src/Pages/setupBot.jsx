import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import LoginCTA from '../components/LoginCTA';
import qrCode from '../assets/qrcode.jpeg';
import './setupBot.css';

const API_BASE_URL = 'https://api.allchinafinds.com';

const SetupBot = ({ isLoggedIn }) => {
    const navigate = useNavigate();
    const [socialLinks, setSocialLinks] = useState([]);
    const [formData, setFormData] = useState({
        channelId: '',
        affiliateCode: '',
        selectedAgent: '',
    });
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(null);
    const [botCount, setBotCount] = useState(0);

    useEffect(() => {
        const token = localStorage.getItem('jwtToken');
        const username = localStorage.getItem('username');
        console.log('Token on SetupBot:', token);
        console.log('Username:', username);

        if (isLoggedIn && token && username) {
            checkBotCount();
        }
    }, [isLoggedIn, navigate]);

    const checkBotCount = async () => {
        try {
            const response = await fetch(`${API_BASE_URL}/api/bots`, {
                headers: {
                    'Authorization': `Bearer ${localStorage.getItem('jwtToken')}`,
                }
            });

            if (!response.ok) {
                throw new Error('Failed to fetch bots');
            }

            const data = await response.json();
            const userBots = data.bots?.filter(bot => 
                bot.username === localStorage.getItem('username')
            ) || [];

            setBotCount(userBots.length);
        } catch (error) {
            console.error('Error checking bot count:', error);
            setError('Failed to check bot count');
        }
    };

    const handleInputChange = (e) => {
        const { name, value } = e.target;
        setFormData(prev => ({
            ...prev,
            [name]: value
        }));
    };

    const addSocialLink = () => {
        setSocialLinks(prev => [...prev, { platform: '', link: '' }]);
    };

    const handleSocialLinkChange = (index, e) => {
        const { name, value } = e.target;
        setSocialLinks(prev => {
            const updated = [...prev];
            updated[index] = { ...updated[index], [name]: value };
            return updated;
        });
    };

    const removeSocialLink = (index) => {
        setSocialLinks(prev => prev.filter((_, i) => i !== index));
    };

    const handleLogout = () => {
        localStorage.removeItem('jwtToken');
        localStorage.removeItem('username');
        navigate('/');
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        const { channelId, affiliateCode, selectedAgent } = formData;

        if (!isLoggedIn) {
            navigate('/login');
            return;
        }

        if (!channelId || !affiliateCode || !selectedAgent) {
            setError('Please fill in all required fields');
            return;
        }

        if (botCount >= 2) {
            setError('You have reached the maximum limit of 2 bots');
            return;
        }

        try {
            setLoading(true);
            setError(null);

            const socials = {};
            socialLinks.forEach(link => {
                if (link.platform && link.link) {
                    socials[link.platform.toLowerCase()] = link.link;
                }
            });

            const botConfig = {
                username: localStorage.getItem('username'),
                channel: channelId,
                affiliate_code: affiliateCode,
                agent: selectedAgent.toLowerCase(),
                socials: socials,
                created_at: new Date().toISOString(),
                status: 'active'
            };

            const response = await fetch(`${API_BASE_URL}/api/bots`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${localStorage.getItem('jwtToken')}`,
                },
                body: JSON.stringify(botConfig),
            });

            if (!response.ok) {
                throw new Error('Failed to create bot');
            }

            alert('Bot created successfully!');
            navigate('/home');
        } catch (error) {
            console.error('Error creating bot:', error);
            setError(`Error creating bot: ${error.message}`);
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="content-wrapper">
            <div className="content-header">
                <h1>Setup your Telegram Bot</h1>
            </div>

            {!isLoggedIn && <LoginCTA />}

            <div className="welcome-section">
                <h2>Automate your affiliate links with my Telegram Bot</h2>
                <p>Setup your bot in just a few minutes and start earning passive income</p>
            </div>

            <div className="setup-container">
                <div className="section-container">
                    <h2>1. Add Bot to Channel</h2>
                    <div className="instructions-container">
                        <div className="instructions-content">
                            <div className="instructions-text">
                                <h3>Follow these steps:</h3>
                                <ol>
                                    <li>Follow the link, or scan our QR code: <a href="https://t.me/AllChinaFinds_bot" target="_blank" rel="noopener noreferrer">@AllChinaFinds_bot</a></li>
                                    <li>Add the bot as a contact, from the bots profile page you can add it to a channel</li>
                                    <li>Add the bot as an admin to your Telegram channel (This only works for channels not groups)</li>
                                    <li>Once added, fill out the form below to complete setup</li>
                                </ol>
                                <p>Make sure to add our bot as an admin to your channel, otherwise it will not work. This bot will send a random product every 4 hours with the affiliate code you provide.</p>
                                <p>You are allowed 2 bots at a time, you are able to pause or delete them at any time.</p>
                            </div>
                            <div className="qr-code">
                                <img src={qrCode} alt="Telegram Bot QR Code" />
                                <p>Scan to add</p>
                            </div>
                        </div>
                    </div>
                </div>

                <div className="section-container">
                    <h2>2. Configure Bot Settings</h2>
                    <div className="setup-form-container">
                        {error && <div className="error-message">{error}</div>}
                        <form id="botSetupForm" onSubmit={handleSubmit}>
                            <div className="form-group">
                                <label htmlFor="channelId">Telegram Channel ID</label>
                                <input
                                    type="text"
                                    id="channelId"
                                    name="channelId"
                                    placeholder="@channelid"
                                    required={isLoggedIn}
                                    value={formData.channelId}
                                    onChange={handleInputChange}
                                    disabled={!isLoggedIn && loading}
                                />
                                <small>Make sure to add the bot as an admin to your channel, include the "@" in this</small>
                            </div>

                            <div className="form-group">
                                <label htmlFor="affiliateCode">Affiliate Code</label>
                                <input
                                    type="text"
                                    id="affiliateCode"
                                    name="affiliateCode"
                                    placeholder="Your affiliate code"
                                    required={isLoggedIn}
                                    value={formData.affiliateCode}
                                    onChange={handleInputChange}
                                    disabled={!isLoggedIn && loading}
                                />
                                <small>Only add the affiliate code, no "ref=" only the numbers/letters after this</small>
                            </div>

                            <div className="form-group">
                                <label htmlFor="agentSelect">Select Agent</label>
                                <select
                                    id="agentSelect"
                                    name="selectedAgent"
                                    required={isLoggedIn}
                                    value={formData.selectedAgent}
                                    onChange={handleInputChange}
                                    disabled={!isLoggedIn && loading}
                                >
                                    <option value="">Select an agent...</option>
                                    <option value="Allchinabuy">Allchinabuy</option>
                                    <option value="AcBuy">AcBuy</option>
                                    <option value="Cnfans">Cnfans</option>
                                    <option value="Joyabuy">Joyabuy</option>
                                    <option value="Mulebuy">Mulebuy</option>
                                </select>
                                <small>Choose the agent you want to use for your affiliate links</small>
                            </div>

                            <div className="form-group">
                                <label>Social Media Links (Optional)</label>
                                <div id="socialLinksContainer">
                                    {socialLinks.map((link, index) => (
                                        <div key={index} className="social-link-entry">
                                            <div className="social-link-inputs">
                                                <input
                                                    type="text"
                                                    placeholder="Platform (e.g. Discord)"
                                                    name="platform"
                                                    value={link.platform}
                                                    onChange={(e) => handleSocialLinkChange(index, e)}
                                                    disabled={!isLoggedIn && loading}
                                                />
                                                <input
                                                    type="text"
                                                    placeholder="Link (e.g. https://discord.gg/...)"
                                                    name="link"
                                                    value={link.link}
                                                    onChange={(e) => handleSocialLinkChange(index, e)}
                                                    disabled={!isLoggedIn && loading}
                                                />
                                            </div>
                                            <button 
                                                type="button" 
                                                className="remove-link"
                                                onClick={() => removeSocialLink(index)}
                                                disabled={!isLoggedIn && loading}
                                            >
                                                <i className="fas fa-times"></i>
                                            </button>
                                        </div>
                                    ))}
                                </div>
                                <button 
                                    type="button" 
                                    className="secondary-button"
                                    onClick={addSocialLink}
                                    disabled={!isLoggedIn && loading}
                                >
                                    <i className="fas fa-plus"></i> Add Social Media
                                </button>
                            </div>

                            <div className="form-actions">
                                {isLoggedIn ? (
                                    <button 
                                        type="submit" 
                                        className="primary-button" 
                                        disabled={loading || botCount >= 2}
                                        title={botCount >= 2 ? 'Maximum bot limit reached' : ''}
                                    >
                                        {loading ? 'Creating Bot...' : botCount >= 2 ? 'Bot Limit Reached' : 'Create Bot'}
                                    </button>
                                ) : (
                                    <button 
                                        type="button" 
                                        className="primary-button login-button"
                                        onClick={() => navigate('/login')}
                                    >
                                        Log In to Create Bot
                                    </button>
                                )}
                                <button 
                                    type="button" 
                                    className="secondary-button"
                                    onClick={() => navigate('/')}
                                    disabled={loading}
                                >
                                    Cancel
                                </button>
                            </div>
                        </form>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default SetupBot;