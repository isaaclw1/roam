import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { db } from './firebase'; // Ensure Firebase is properly configured
import { collection, addDoc } from 'firebase/firestore';
import { auth } from './firebase'; // Firebase Auth
import './CitySelection.css';

function CitySelection() {
    const navigate = useNavigate();
    const [selectedCities, setSelectedCities] = useState([]);

    const cities = [
        { name: 'Rome', image: 'https://media.istockphoto.com/id/539115110/photo/colosseum-in-rome-and-morning-sun-italy.jpg?s=612x612&w=0&k=20&c=9NtFxHI3P2IBWRY9t0NrfPZPR4iusHmVLbXg2Cjv9Fs=' },
        { name: 'Madrid', image: 'https://images.unsplash.com/photo-1539037116277-4db20889f2d4?fm=jpg&q=60&w=3000&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxzZWFyY2h8MTF8fG1hZHJpZHxlbnwwfHwwfHx8MA%3D%3D' },
        { name: 'Los Angeles', image: 'https://a.travel-assets.com/findyours-php/viewfinder/images/res40/475000/475457-Los-Angeles.jpg' },
    ];

    const toggleCity = (city) => {
        setSelectedCities((prev) =>
            prev.includes(city) ? prev.filter((c) => c !== city) : [...prev, city]
        );
    };

    const handleNext = async () => {
        if (selectedCities.length > 0) {
            try {
                const currentUser = auth.currentUser;

                if (!currentUser) {
                    alert('Please log in to proceed.');
                    navigate('/login');
                    return;
                }

                const citySelectionRef = collection(db, 'cityselection');
                await addDoc(citySelectionRef, {
                    userId: currentUser.uid,
                    selectedCities,
                    timestamp: new Date(), // Add a timestamp for record keeping
                });

                navigate('/activity-selection', { state: { selectedCities } });
            } catch (error) {
                console.error('Error saving selected cities:', error);
                alert('Failed to save selected cities. Please try again.');
            }
        } else {
            alert('Please select at least one city.');
        }
    };

    return (
        <div className="city-selection">
            <div className="city-selection-container">
                <h2>Where have you been wanting to go?</h2>
                <p>This will help us customize your feed.</p>
                <div className="city-selection-options">
                    {cities.map((city) => (
                        <div
                            key={city.name}
                            className={`city-selection-option ${selectedCities.includes(city.name) ? 'selected' : ''}`}
                            onClick={() => toggleCity(city.name)}
                        >
                            <img src={city.image} alt={city.name} />
                            <p>{city.name}</p>
                        </div>
                    ))}
                </div>
                <button className="city-selection-button" onClick={handleNext}>
                    Choose your destination(s)
                </button>
            </div>
        </div>
    );
}

export default CitySelection;
