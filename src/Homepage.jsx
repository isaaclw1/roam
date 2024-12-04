import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { db } from './firebase';
import { collection, query, where, getDocs, deleteDoc, doc } from 'firebase/firestore';
import { auth } from './firebase'; // Import Firebase Auth
import './Homepage.css';
import logo from './assets/logo.png'; // Import the logo

function Homepage() {
    const navigate = useNavigate();
    const [activities, setActivities] = useState([]);

    useEffect(() => {
        const fetchUserActivities = async () => {
            try {
                const currentUser = auth.currentUser;

                if (!currentUser) {
                    alert('Please log in to view your activities.');
                    navigate('/login');
                    return;
                }

                const activitiesRef = collection(db, 'activities');
                const q = query(activitiesRef, where('userId', '==', currentUser.uid)); // Filter by userId

                const querySnapshot = await getDocs(q);
                const activitiesData = querySnapshot.docs.map((doc) => ({
                    id: doc.id,
                    ...doc.data(),
                }));

                activitiesData.sort((a, b) =>
                    new Date(b.createdAt) - new Date(a.createdAt)
                );

                setActivities(activitiesData);
            } catch (error) {
                console.error('Error fetching activities:', error);
            }
        };

        fetchUserActivities();
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

    return (
        <div className="homepage">
            <div className="homepage-container">
                <div className="header">
                    <img src={logo} alt="Logo" className="logo" />
                </div>
                <h2>Your Activities</h2>
                {activities.length === 0 ? (
                    <div className="no-activities-message">
                        You currently don't have any activities added!
                    </div>
                ) : (
                    <div className="activity-selection-options">
                        {activities.map((activity) => (
                            <div
                                key={activity.id}
                                id={activity.id}
                                className="activity-selection-option"
                            >
                                <img src={activity.image || ''} alt={activity.name} />
                                <p>{activity.name}</p>
                                <button
                                    className="delete-button"
                                    onClick={() => handleDeleteActivity(activity.id)}
                                >
                                    Delete
                                </button>
                            </div>
                        ))}
                    </div>
                )}
                <button className="homepage-button" onClick={handleAddActivity}>
                    Add Activity
                </button>
            </div>
        </div>
    );
}

export default Homepage;
