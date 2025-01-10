import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import logo from './assets/allchinafinds.png';
import qrCode from './assets/qrcode.jpeg';
import './sideBar.css';
import './setupBot.css';

const API_BASE_URL = 'https://api.allchinafinds.com';

const SetupBot = () => {
    const navigate = useNavigate();
    const [socialLinks, setSocialLinks] = useState([]);
    const [formData, setFormData] = useState({
        channelId: '',
        affiliateCode: '',
        selectedAgent: '',
    });
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(null);
    const [sidebarActive, setSidebarActive] = useState(false);
    const [botCount, setBotCount] = useState(0);

    useEffect(() => {
        const token = localStorage.getItem('jwtToken');
        const username = localStorage.getItem('username');
        
        if (!token || !username) {
            navigate('/');
            return;
        }

        checkBotCount();

        // Cleanup function to remove overlay when component unmounts
        return () => {
            const overlay = document.querySelector('.sidebar-overlay');
            if (overlay) {
                overlay.remove();
            }
        };
    }, [navigate]);

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

    const toggleSidebar = () => {
        setSidebarActive(!sidebarActive);
        const overlay = document.querySelector('.sidebar-overlay');
        if (overlay) {
            overlay.classList.toggle('active');
        }
        // Toggle menu icon
        const icon = document.querySelector('.menu-toggle i');
        if (icon) {
            icon.classList.toggle('fa-bars');
            icon.classList.toggle('fa-times');
        }
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        const { channelId, affiliateCode, selectedAgent } = formData;

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
        <div className="layout">
            <div className={`sidebar ${sidebarActive ? 'active' : ''}`}>
                <div className="sidebar-header">
                    <img src={logo} alt="Logo" className="logo" />
                </div>
                <nav className="sidebar-nav">
                    <button onClick={() => navigate('/home')} className="nav-button">
                        <i className="fas fa-home"></i> Home
                    </button>
                    <button onClick={() => navigate('/setup-bot')} className="nav-button active">
                        <i className="fas fa-plus"></i> Create Bot
                    </button>
                    <button onClick={() => navigate('/manage-bots')} className="nav-button">
                        <i className="fas fa-cog"></i> Manage Bots
                    </button>
                    <button onClick={handleLogout} className="nav-button">
                        <i className="fas fa-sign-out-alt"></i> Logout
                    </button>
                </nav>
            </div>

            <div className="sidebar-overlay" onClick={toggleSidebar}></div>

            <div className="main-content">
                <div className="content-wrapper">
                    <div className="content-header">
                        <button className="menu-toggle" onClick={toggleSidebar}>
                            <i className="fas fa-bars"></i>
                        </button>
                        <h1>Setup your Telegram Bot</h1>
                    </div>

                    {/* Rest of your existing content remains exactly the same */}
                    <div className="welcome-section">
                        <h2>Automate your affiliate links with my Telegram Bot</h2>
                        <p>Setup your bot in just a few minutes and start earning passive income</p>
                    </div>

                    <div className="setup-container">
                        {/* Your existing setup container content remains exactly the same */}
                        {/* ... */}
                        {/* All the form sections remain unchanged */}
                    </div>
                </div>
            </div>
        </div>
    );
};

export default SetupBot;