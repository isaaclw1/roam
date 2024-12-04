import React, { useState } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { db } from './firebase'; // Ensure Firebase is properly configured
import { collection, addDoc } from 'firebase/firestore';
import { auth } from './firebase'; // Import Firebase Auth
import './ActivitySelection.css';

function ActivitySelection() {
    const navigate = useNavigate();
    const location = useLocation();
    const { selectedCities } = location.state || {}; // Cities from the previous step

    const [selectedActivities, setSelectedActivities] = useState([]);

    const activities = [
        { name: 'Museums', image: 'https://media.architecturaldigest.com/photos/55e76762cd709ad62e8e8d4e/master/pass/dam-images-architecture-2015-09-university-art-museums-university-art-museums-01.jpg' },
        { name: 'Nature', image: 'https://media.istockphoto.com/id/517188688/photo/mountain-landscape.jpg?s=612x612&w=0&k=20&c=A63koPKaCyIwQWOTFBRWXj_PwCrR4cEoOw2S9Q7yVl8=' },
        { name: 'Relax', image: 'https://www.cathaypacific.com/content/dam/focal-point/cx/inspiration/2024/04/How_to_actually_relax_on_vacation-woman_relaxing_in_hammock-Peera_Sathawirawong-Gettyimages-HERO.renditionimage.900.600.jpg' },
        { name: 'Nightlife', image: 'https://www.discoverlosangeles.com/sites/default/files/images/2019-02/exchange.jpg' },
        { name: 'Sightseeing', image: 'https://media.tacdn.com/media/attractions-splice-spp-674x446/12/2e/16/f8.jpg' },
        { name: 'Eating', image: 'https://i.pinimg.com/originals/9f/d6/c1/9fd6c1243d7c1bdc303491b3bb0a3fbc.jpg' },
    ];

    const toggleActivity = (activity) => {
        setSelectedActivities((prev) =>
            prev.includes(activity) ? prev.filter((a) => a !== activity) : [...prev, activity]
        );
    };

    const handleNext = async () => {
        if (selectedActivities.length >= 3) {
            try {
                const currentUser = auth.currentUser;

                if (!currentUser) {
                    alert('Please log in to save your interests.');
                    navigate('/login');
                    return;
                }

                const interestsRef = collection(db, 'interests');
                await addDoc(interestsRef, {
                    userId: currentUser.uid,
                    selectedCities,
                    selectedActivities,
                    timestamp: new Date(), // Add a timestamp for record keeping
                });

                navigate('/homepage', { state: { selectedCities, selectedActivities } });
            } catch (error) {
                console.error('Error saving selected activities:', error);
                alert('Failed to save selected activities. Please try again.');
            }
        } else {
            alert('Please select at least 3 activities.');
        }
    };

    return (
        <div className="activity-selection">
            <div className="activity-selection-container">
                <h2>What are you interested in?</h2>
                <p>This will help us customize your feed.</p>
                <div className="activity-selection-options">
                    {activities.map((activity) => (
                        <div
                            key={activity.name}
                            className={`activity-selection-option ${selectedActivities.includes(activity.name) ? 'selected' : ''}`}
                            onClick={() => toggleActivity(activity.name)}
                        >
                            <img src={activity.image} alt={activity.name} />
                            <p>{activity.name}</p>
                        </div>
                    ))}
                </div>
                <button className="activity-selection-button" onClick={handleNext}>
                    Choose at least 3
                </button>
            </div>
        </div>
    );
}

export default ActivitySelection;
