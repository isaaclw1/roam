import React from 'react';
import { useNavigate } from 'react-router-dom';
import './ProfileSetup.css'; // Updated CSS file

function ProfileSetup() {
    const navigate = useNavigate();

    const handleNext = () => {
        navigate('/city-selection');
    };

    return (
        <div className="profile-setup-wrapper">
            <div className="profile-setup-card">
                <h1 className="profile-setup-header">Welcome to ROAM!</h1>
                <p className="profile-setup-text">Let's get started by customizing your experience.</p>
                <button className="profile-setup-button" onClick={handleNext}>
                    Start Setup
                </button>
            </div>
        </div>
    );
}

export default ProfileSetup;
