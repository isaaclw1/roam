import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { doc, getDoc } from 'firebase/firestore';
import { db } from './firebase';
import { ArrowLeft, MapPin, Calendar } from 'lucide-react';
import './ViewActivity.css';

function ViewActivity() {
    const { activityId } = useParams();
    const navigate = useNavigate();
    const [activity, setActivity] = useState(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchActivity = async () => {
            try {
                const docRef = doc(db, 'activities', activityId);
                const docSnap = await getDoc(docRef);

                if (docSnap.exists()) {
                    setActivity({
                        id: docSnap.id,
                        ...docSnap.data()
                    });
                } else {
                    console.log('No such activity!');
                }
            } catch (error) {
                console.error('Error fetching activity:', error);
            } finally {
                setLoading(false);
            }
        };

        fetchActivity();
    }, [activityId]);

    if (loading) {
        return (
            <div className="loading-container">
                <div className="loading-spinner"></div>
            </div>
        );
    }

    if (!activity) {
        return <div className="error-message">Activity not found</div>;
    }

    const handleBack = () => {
        navigate(-1);
    };

    const formatDate = (dateString) => {
        const date = new Date(dateString);
        return date.toLocaleDateString('en-US', {
            year: 'numeric',
            month: 'long',
            day: 'numeric'
        });
    };

    return (
        <div className="view-activity">
            <div className="header">
                <button className="back-button" onClick={handleBack}>
                    <ArrowLeft size={24} />
                    Back
                </button>
            </div>

            <div className="activity-container">
                <div className="image-container">
                    <img src={activity.image} alt={activity.name} className="activity-image" />
                </div>

                <div className="activity-content">
                    <h1 className="activity-title">{activity.name}</h1>

                    <div className="activity-meta">
                        <div className="meta-item">
                            <MapPin size={20} />
                            <span>{activity.city}</span>
                        </div>
                        <div className="meta-item">
                            <Calendar size={20} />
                            <span>Added on {formatDate(activity.createdAt)}</span>
                        </div>
                    </div>

                    <div className="tags-container">
                        {activity.type.map((tag, index) => (
                            <span key={index} className="tag">
                                {tag}
                            </span>
                        ))}
                    </div>

                    <div className="description-container">
                        <h2>About this activity</h2>
                        <p className="activity-description">{activity.description}</p>
                    </div>
                </div>
            </div>
        </div>
    );
}

export default ViewActivity;