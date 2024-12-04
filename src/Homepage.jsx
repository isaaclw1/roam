import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { db } from './firebase';
import { collection, query, getDocs } from 'firebase/firestore';
import { auth } from './firebase';
import './Homepage.css';
import logo from './assets/logo.png';

function Homepage() {
    const navigate = useNavigate();
    const [activities, setActivities] = useState([]);
    const [selectedCities, setSelectedCities] = useState([]);
    const [selectedInterests, setSelectedInterests] = useState([]);
    const [selectedActivity, setSelectedActivity] = useState(null);
    const [filteredActivities, setFilteredActivities] = useState([]);

    useEffect(() => {
        const fetchData = async () => {
            try {
                const currentUser = auth.currentUser;

                if (!currentUser) {
                    alert('Please log in to view activities.');
                    navigate('/');
                    return;
                }

                // Fetch user's selected cities
                const citiesRef = collection(db, 'cityselection');
                const citiesSnapshot = await getDocs(query(citiesRef));
                const userCitiesDoc = citiesSnapshot.docs.find(doc => doc.data().userId === currentUser.uid);
                const citiesData = userCitiesDoc ? userCitiesDoc.data().selectedCities : [];
                setSelectedCities(citiesData);

                // Fetch user's interests
                const interestsRef = collection(db, 'interests');
                const interestsSnapshot = await getDocs(query(interestsRef));
                const userInterestsDoc = interestsSnapshot.docs.find(doc => doc.data().userId === currentUser.uid);
                const interestsData = userInterestsDoc ? userInterestsDoc.data().selectedActivities : [];
                setSelectedInterests(interestsData);

                // Fetch ALL activities
                const activitiesRef = collection(db, 'activities');
                const activitiesSnapshot = await getDocs(query(activitiesRef));
                const activitiesData = activitiesSnapshot.docs.map(doc => ({
                    id: doc.id,
                    ...doc.data(),
                }));

                setActivities(activitiesData);
            } catch (error) {
                console.error('Error fetching data:', error);
            }
        };

        fetchData();
    }, [navigate]);

    // Filter activities whenever the activities list or user preferences change
    useEffect(() => {
        const filterActivities = () => {
            const filtered = activities.filter(activity => {
                const cityMatch = selectedCities.includes(activity.city);
                const interestMatch = activity.type.some(type =>
                    selectedInterests.includes(type)
                );
                return cityMatch && interestMatch;
            });

            filtered.sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));
            setFilteredActivities(filtered);
        };

        filterActivities();
    }, [activities, selectedCities, selectedInterests]);

    const handleAddActivity = () => {
        navigate('/add-activity');
    };

    const handleDeleteActivity = async (activityId) => {
        // Only allow deletion if the activity belongs to the current user
        const currentUser = auth.currentUser;
        const activityToDelete = activities.find(a => a.id === activityId);

        if (activityToDelete?.userId !== currentUser.uid) {
            alert('You can only delete activities that you created.');
            return;
        }

        try {
            await deleteDoc(doc(db, 'activities', activityId));
            setActivities(prev => prev.filter(activity => activity.id !== activityId));
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

                {/* Matched Activities Section */}
                <h2>Matching Activities</h2>
                {filteredActivities.length === 0 ? (
                    <div className="no-activities-message">
                        No activities found matching your cities and interests.
                    </div>
                ) : (
                    <div className="activity-selection-options">
                        {filteredActivities.map((activity) => (
                            <div
                                key={activity.id}
                                id={activity.id}
                                className="activity-selection-option"
                                onClick={() => handleActivityClick(activity)}
                            >
                                <img src={activity.image || ''} alt={activity.name} />
                                <p>{activity.name}</p>
                            </div>
                        ))}
                    </div>
                )}
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
                        <p>
                            <strong>Added by:</strong> {selectedActivity.userId === auth.currentUser?.uid ? 'You' : 'Another user'}
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