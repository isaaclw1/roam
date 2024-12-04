import React from 'react';
import { useNavigate } from 'react-router-dom';

function ProfileSetup() {
    const navigate = useNavigate();

    const handleNext = () => {
        // Navigate to CitySelection page
        navigate('/city-selection');
    };

    return (
        <div id="root">
            <h1>Welcome to ROAM!</h1>
            <p>Let's get started by customizing your experience.</p>
            <button onClick={handleNext}>Start Setup</button>
        </div>
    );
}

export default ProfileSetup;
