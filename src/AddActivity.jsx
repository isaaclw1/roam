import React, { useState } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { db } from './firebase';
import { collection, addDoc } from 'firebase/firestore';
import './AddActivity.css';

function AddActivity() {
    const navigate = useNavigate();
    const location = useLocation();
    const { selectedCities, selectedActivities } = location.state || {};

    const [activityName, setActivityName] = useState('');
    const [activityLocation, setActivityLocation] = useState('');
    const [description, setDescription] = useState('');
    const [selectedTag, setSelectedTag] = useState('');
    const [imageUrl, setImageUrl] = useState('');

    const cities = ['Madrid', 'Rome', 'Los Angeles'];
    const tags = ['Museums', 'Nature', 'Relax', 'Nightlife', 'Sightseeing', 'Eating'];

    const handleSubmit = async (e) => {
        e.preventDefault();

        // Debug logging
        console.log({
            activityName,
            activityLocation,
            description,
            selectedTag,
            imageUrl,
        });

        // More specific validation
        const missingFields = [];
        if (!activityName) missingFields.push('Activity Name');
        if (!activityLocation) missingFields.push('Location');
        if (!description) missingFields.push('Description');
        if (!selectedTag) missingFields.push('Tag');
        if (!imageUrl.trim()) missingFields.push('Image URL');

        if (missingFields.length > 0) {
            alert(`Please fill in the following fields: ${missingFields.join(', ')}`);
            return;
        }

        try {
            // Add activity to Firestore
            const activityData = {
                name: activityName,
                city: activityLocation,
                description: description,
                type: [selectedTag],
                image: imageUrl.trim(),
                createdAt: new Date().toISOString()
            };

            const docRef = await addDoc(collection(db, 'activities'), activityData);

            // Navigate back to homepage with filters
            navigate('/homepage', {
                state: {
                    selectedCities: selectedCities || [activityLocation],
                    selectedActivities: selectedActivities || [selectedTag],
                    newActivityId: docRef.id
                }
            });
        } catch (error) {
            console.error('Error adding activity:', error);
            alert('Failed to add activity. Please try again.');
        }
    };

    const handleImageUrlChange = (e) => {
        const url = e.target.value.trim();
        setImageUrl(url);
    };

    return (
        <div id="root" className="add-activity">
            <div className="breadcrumb">
                <span>Home</span> / <span>Add Activity</span>
            </div>

            <h2>Add an Activity</h2>

            <form onSubmit={handleSubmit}>
                <div className="form-group">
                    <input
                        type="text"
                        placeholder="Activity Name"
                        value={activityName}
                        onChange={(e) => setActivityName(e.target.value)}
                        className="input-field"
                        required
                    />
                </div>

                <div className="form-group">
                    <select
                        value={activityLocation}
                        onChange={(e) => setActivityLocation(e.target.value)}
                        className="select-field"
                        required
                    >
                        <option value="">Select Location</option>
                        {cities.map((city) => (
                            <option key={city} value={city}>{city}</option>
                        ))}
                    </select>
                </div>

                <div className="form-group">
                    <textarea
                        placeholder="Tell people a bit about your activity!"
                        value={description}
                        onChange={(e) => setDescription(e.target.value)}
                        className="textarea-field"
                        required
                    />
                </div>

                <div className="form-group">
                    <select
                        value={selectedTag}
                        onChange={(e) => setSelectedTag(e.target.value)}
                        className="select-field"
                        required
                    >
                        <option value="">Select Tag</option>
                        {tags.map((tag) => (
                            <option key={tag} value={tag}>{tag}</option>
                        ))}
                    </select>
                </div>

                <div className="form-group">
                    <input
                        type="url"
                        placeholder="Enter Image URL"
                        value={imageUrl}
                        onChange={handleImageUrlChange}
                        className="input-field"
                        required
                    />
                    {imageUrl && (
                        <div className="image-preview-container">
                            <img
                                src={imageUrl}
                                alt="Preview"
                                className="image-preview"
                                onError={(e) => {
                                    e.target.onerror = null;
                                    e.target.style.display = 'none';
                                    alert('Invalid image URL. Please enter a valid image URL.');
                                    setImageUrl('');
                                }}
                            />
                        </div>
                    )}
                </div>

                <button type="submit" className="submit-button">
                    Add Activity
                </button>
            </form>
        </div>
    );
}

export default AddActivity;