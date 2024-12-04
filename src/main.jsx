import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import App from './App.jsx';
import ProfileSetup from './ProfileSetup.jsx';
import CitySelection from './CitySelection.jsx';
import ActivitySelection from './ActivitySelection.jsx';
import Homepage from './Homepage.jsx';
import AddActivity from "./AddActivity.jsx";
import ViewActivity from "./ViewActivity.jsx";


createRoot(document.getElementById('root')).render(
    <StrictMode>
        <Router>
            <Routes>
                <Route path="/" element={<App />} />
                <Route path="/profile-setup" element={<ProfileSetup />} />
                <Route path="/city-selection" element={<CitySelection />} />
                <Route path="/activity-selection" element={<ActivitySelection />} />
                <Route path="/homepage" element={<Homepage />} />
                <Route path="/view-activity/:activityId" element={<ViewActivity />} />
                <Route path="/add-activity" element={<AddActivity />} />
            </Routes>
        </Router>
    </StrictMode>
);
