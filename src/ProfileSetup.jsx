import React from 'react';
import { useNavigate } from 'react-router-dom';
import { db, auth } from './firebase'; // Ensure Firebase is properly configured
import { collection, query, where, getDocs, deleteDoc } from 'firebase/firestore';
import './ProfileSetup.css'; // Updated CSS file

function ProfileSetup() {
    const navigate = useNavigate();

    const deleteUserData = async (collectionName) => {
        try {
            const currentUser = auth.currentUser;

            if (!currentUser) {
                alert('Please log in to start setup.');
                navigate('/');
                return;
            }

            const ref = collection(db, collectionName);
            const q = query(ref, where('userId', '==', currentUser.uid));
            const snapshot = await getDocs(q);

            const deletePromises = snapshot.docs.map((doc) => deleteDoc(doc.ref));
            await Promise.all(deletePromises);

            console.log(`Deleted all documents from ${collectionName} for user ${currentUser.uid}`);
        } catch (error) {
            console.error(`Error deleting data from ${collectionName}:`, error);
            alert(`Failed to delete data from ${collectionName}. Please try again.`);
        }
    };

    const handleNext = async () => {
        try {
            // Delete user data from relevant collections
            await deleteUserData('activities');
            await deleteUserData('interests');
            await deleteUserData('cityselection');

            // Navigate to the next step
            navigate('/city-selection');
        } catch (error) {
            console.error('Error during profile setup:', error);
            alert('Failed to reset profile setup. Please try again.');
        }
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
