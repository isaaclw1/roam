import React, { useState, useEffect } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { db } from './firebase';
import { collection, query, where, getDocs } from 'firebase/firestore';
import './Homepage.css';

function Homepage() {
    const navigate = useNavigate();
    const location = useLocation();
    const { selectedCities, selectedActivities, newActivityId } = location.state || {};
    const [activities, setActivities] = useState([]);

    useEffect(() => {
        const fetchActivities = async () => {
            try {
                const activitiesRef = collection(db, 'activities');
                let q = query(
                    activitiesRef,
                    where('city', 'in', selectedCities || []),
                    where('type', 'array-contains-any', selectedActivities || [])
                );

                const querySnapshot = await getDocs(q);
                const activitiesData = querySnapshot.docs.map(doc => ({
                    id: doc.id,
                    ...doc.data()
                }));

                // Sort activities to show newest first
                activitiesData.sort((a, b) =>
                    new Date(b.createdAt) - new Date(a.createdAt)
                );

                setActivities(activitiesData);

                // If there's a new activity, scroll it into view
                if (newActivityId) {
                    setTimeout(() => {
                        const element = document.getElementById(newActivityId);
                        if (element) {
                            element.scrollIntoView({ behavior: 'smooth' });
                        }
                    }, 100);
                }
            } catch (error) {
                console.error('Error fetching activities:', error);
            }
        };

        if (selectedCities?.length && selectedActivities?.length) {
            fetchActivities();
        }
    }, [selectedCities, selectedActivities, newActivityId]);

    const handleViewActivity = (activityId) => {
        navigate(`/view-activity/${activityId}`);
    };

    const handleAddActivity = () => {
        navigate('/add-activity', {
            state: { selectedCities, selectedActivities }
        });
    };

    return (
        <div id="root">
            <div className="header">
                <img src="" alt="Logo" className="logo" />
                <img src="" alt="Profile" className="profile-photo" />
            </div>
            <div className="activities">
                {activities.map((activity) => (
                    <div
                        key={activity.id}
                        id={activity.id}
                        className={`activity-card ${activity.id === newActivityId ? 'highlight' : ''}`}
                        onClick={() => handleViewActivity(activity.id)}
                    >
                        <img src={activity.image || ''} alt={activity.name} />
                        <div className="activity-info">
                            <h3>{activity.name}</h3>
                            <div className="tags">
                                {activity.type.map((tag, index) => (
                                    <span key={index} className="tag">
                                        {tag}
                                    </span>
                                ))}
                            </div>
                            <p className="location">{activity.city}</p>
                        </div>
                    </div>
                ))}
            </div>
            <button className="add-activity-button" onClick={handleAddActivity}>
                Add Activity
            </button>
        </div>
    );
}

export default Homepage;