import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { db } from './firebase';
import { collection, query, where, getDocs, deleteDoc, doc } from 'firebase/firestore';
import { auth } from './firebase';
import './Homepage.css';
import logo from './assets/logo.png'; // Import the logo

function Homepage() {
    const navigate = useNavigate();
    const [activities, setActivities] = useState([]);
    const [selectedCities, setSelectedCities] = useState([]);
    const [selectedInterests, setSelectedInterests] = useState([]);
    const [selectedActivity, setSelectedActivity] = useState(null); // Track the selected activity for the popup

    useEffect(() => {
        const fetchUserData = async () => {
            try {
                const currentUser = auth.currentUser;

                if (!currentUser) {
                    alert('Please log in to view your data.');
                    navigate('/');
                    return;
                }

                // Fetch Activities
                const activitiesRef = collection(db, 'activities');
                const activitiesQuery = query(activitiesRef, where('userId', '==', currentUser.uid));
                const activitiesSnapshot = await getDocs(activitiesQuery);

                const activitiesData = activitiesSnapshot.docs.map((doc) => ({
                    id: doc.id,
                    ...doc.data(),
                }));

                activitiesData.sort((a, b) =>
                    new Date(b.createdAt) - new Date(a.createdAt)
                );

                setActivities(activitiesData);

                // Fetch Selected Cities
                const citiesRef = collection(db, 'cityselection');
                const citiesQuery = query(citiesRef, where('userId', '==', currentUser.uid));
                const citiesSnapshot = await getDocs(citiesQuery);

                const citiesData = Array.from(
                    new Set(
                        citiesSnapshot.docs
                            .map((doc) => doc.data().selectedCities)
                            .flat()
                    )
                );

                setSelectedCities(citiesData);

                // Fetch Selected Interests
                const interestsRef = collection(db, 'interests');
                const interestsQuery = query(interestsRef, where('userId', '==', currentUser.uid));
                const interestsSnapshot = await getDocs(interestsQuery);

                const interestsData = interestsSnapshot.docs
                    .flatMap((doc) => doc.data().selectedActivities)
                    .filter((interest, index, self) => self.indexOf(interest) === index);

                setSelectedInterests(interestsData);
            } catch (error) {
                console.error('Error fetching data:', error);
            }
        };

        fetchUserData();
    }, [navigate]);

    const handleAddActivity = () => {
        navigate('/add-activity');
    };

    const handleDeleteActivity = async (activityId) => {
        try {
            await deleteDoc(doc(db, 'activities', activityId));
            setActivities((prev) => prev.filter((activity) => activity.id !== activityId));
            alert('Activity deleted successfully.');
        } catch (error) {
            console.error('Error deleting activity:', error);
            alert('Failed to delete activity. Please try again.');
        }
    };

    const handleActivityClick = (activity) => {
        setSelectedActivity(activity);
    };

    const closeModal = () => {
        setSelectedActivity(null);
    };

    return (
        <div className="homepage">
            <div className="homepage-container">
                <div className="header">
                    <img src={logo} alt="Logo" className="logo" />
                </div>

                {/* Selected Cities Section */}
                <h2>Your Selected Cities</h2>
                {selectedCities.length === 0 ? (
                    <div className="no-cities-message">You currently don't have any selected cities!</div>
                ) : (
                    <div className="selection-list">
                        {selectedCities.map((city, index) => (
                            <div key={index} className="selection-item">
                                <p>{city}</p>
                            </div>
                        ))}
                    </div>
                )}

                {/* Selected Interests Section */}
                <h2>Your Selected Interests</h2>
                {selectedInterests.length === 0 ? (
                    <div className="no-interests-message">You currently don't have any selected interests!</div>
                ) : (
                    <div className="selection-list">
                        {selectedInterests.map((interest, index) => (
                            <div key={index} className="selection-item">
                                <p>{interest}</p>
                            </div>
                        ))}
                    </div>
                )}

                {/* Activities Section */}
                <h2>Your Activities</h2>
                <div className="activity-selection-options">
                    {activities.map((activity) => (
                        <div
                            key={activity.id}
                            id={activity.id}
                            className="activity-selection-option"
                            onClick={() => handleActivityClick(activity)}
                        >
                            <img src={activity.image || ''} alt={activity.name} />
                            <p>{activity.name}</p>
                            <button
                                className="delete-button"
                                onClick={(e) => {
                                    e.stopPropagation();
                                    handleDeleteActivity(activity.id);
                                }}
                            >
                                Delete
                            </button>
                        </div>
                    ))}
                </div>
                <button className="homepage-button" onClick={handleAddActivity}>
                    Add Activity
                </button>
            </div>

            {/* Modal for displaying activity details */}
            {selectedActivity && (
                <div className="modal-overlay" onClick={closeModal}>
                    <div className="modal-content" onClick={(e) => e.stopPropagation()}>
                        <h2>{selectedActivity.name}</h2>
                        <p>
                            <strong>Location:</strong> {selectedActivity.city}
                        </p>
                        <p>
                            <strong>Description:</strong> {selectedActivity.description}
                        </p>
                        <p>
                            <strong>Tags:</strong> {selectedActivity.type.join(', ')}
                        </p>
                        <p>
                            <strong>Estimated Cost:</strong> ${selectedActivity.estimatedCost}
                        </p>
                        <img src={selectedActivity.image || ''} alt={selectedActivity.name} />
                        <button onClick={closeModal} className="modal-close-button">
                            Close
                        </button>
                    </div>
                </div>
            )}
        </div>
    );
}

export default Homepage;
