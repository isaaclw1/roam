import React, { useState } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { db } from './firebase';
import { collection, addDoc } from 'firebase/firestore';
import { auth } from './firebase'; // Import Firebase Auth
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
    const [estimatedCost, setEstimatedCost] = useState('');
    const [isImageValid, setIsImageValid] = useState(true);

    const cities = ['Madrid', 'Rome', 'Los Angeles'];
    const tags = ['Museums', 'Nature', 'Relax', 'Nightlife', 'Sightseeing', 'Eating'];

    const handleSubmit = async (e) => {
        e.preventDefault();

        if (!isImageValid) {
            alert('Please provide a valid image URL.');
            return;
        }

        if (
            !activityName.trim() ||
            !activityLocation ||
            !description.trim() ||
            !selectedTag ||
            !imageUrl.trim() ||
            !estimatedCost.trim()
        ) {
            alert('Please fill out all fields before submitting.');
            return;
        }

        try {
            // Get the currently logged-in user
            const currentUser = auth.currentUser;
            if (!currentUser) {
                alert('User not logged in. Please log in to add an activity.');
                return;
            }

            // Prepare activity data
            const activityData = {
                name: activityName,
                city: activityLocation,
                description: description,
                type: [selectedTag],
                image: imageUrl.trim(),
                estimatedCost,
                createdAt: new Date().toISOString(),
                userId: currentUser.uid, // Store the user ID
                userName: currentUser.displayName || 'Anonymous', // Optionally store the user's name
            };

            // Add to Firestore
            const docRef = await addDoc(collection(db, 'activities'), activityData);

            navigate('/homepage', {
                state: {
                    selectedCities: selectedCities || [activityLocation],
                    selectedActivities: selectedActivities || [selectedTag],
                    newActivityId: docRef.id,
                },
            });
        } catch (error) {
            console.error('Error adding activity:', error);
            alert('Failed to add activity. Please try again.');
        }
    };

    const handleImageUrlBlur = () => {
        if (imageUrl.trim()) {
            const img = new Image();
            img.onload = () => setIsImageValid(true);
            img.onerror = () => {
                setIsImageValid(false);
                alert('Invalid image URL. Please enter a valid image URL.');
            };
            img.src = imageUrl.trim();
        }
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
                            <option key={city} value={city}>
                                {city}
                            </option>
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
                            <option key={tag} value={tag}>
                                {tag}
                            </option>
                        ))}
                    </select>
                </div>

                <div className="form-group">
                    <input
                        type="url"
                        placeholder="Enter Image URL"
                        value={imageUrl}
                        onChange={(e) => setImageUrl(e.target.value)}
                        onBlur={handleImageUrlBlur}
                        className={`input-field ${isImageValid ? '' : 'invalid'}`}
                        required
                    />
                    {imageUrl && isImageValid && (
                        <div className="image-preview-container">
                            <img src={imageUrl} alt="Preview" className="image-preview" />
                        </div>
                    )}
                </div>

                <div className="form-group">
                    <input
                        type="text"
                        placeholder="Estimated Cost ($)"
                        value={estimatedCost}
                        onChange={(e) => setEstimatedCost(e.target.value)}
                        className="input-field"
                        required
                    />
                </div>

                <button type="submit" className="submit-button">
                    Add Activity
                </button>
            </form>
        </div>
    );
}

export default AddActivity;
