import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';

function CitySelection() {
    const navigate = useNavigate();
    const [selectedCities, setSelectedCities] = useState([]);

    const cities = [
        { name: 'Rome', image: 'https://media.istockphoto.com/id/539115110/photo/colosseum-in-rome-and-morning-sun-italy.jpg?s=612x612&w=0&k=20&c=9NtFxHI3P2IBWRY9t0NrfPZPR4iusHmVLbXg2Cjv9Fs=' }, // Replace '' with the image URL
        { name: 'Madrid', image: 'https://images.unsplash.com/photo-1539037116277-4db20889f2d4?fm=jpg&q=60&w=3000&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxzZWFyY2h8MTF8fG1hZHJpZHxlbnwwfHwwfHx8MA%3D%3D' },
        { name: 'Los Angeles', image: 'https://a.travel-assets.com/findyours-php/viewfinder/images/res40/475000/475457-Los-Angeles.jpg' },
    ];

    const toggleCity = (city) => {
        setSelectedCities((prev) =>
            prev.includes(city) ? prev.filter((c) => c !== city) : [...prev, city]
        );
    };

    const handleNext = () => {
        if (selectedCities.length > 0) {
            navigate('/activity-selection', { state: { selectedCities } });
        } else {
            alert('Please select at least one city.');
        }
    };

    return (
        <div id="root">
            <h2>Where have you been wanting to go?</h2>
            <p>This will help us customize your feed.</p>
            <div className="options">
                {cities.map((city) => (
                    <div
                        key={city.name}
                        className={`option ${selectedCities.includes(city.name) ? 'selected' : ''}`}
                        onClick={() => toggleCity(city.name)}
                    >
                        <img src={city.image} alt={city.name} />
                        <p>{city.name}</p>
                    </div>
                ))}
            </div>
            <button onClick={handleNext}>Choose your destination(s)</button>
        </div>
    );
}

export default CitySelection;
