import { GoogleAuthProvider, signInWithPopup } from 'firebase/auth';
import { useNavigate } from 'react-router-dom';
import { auth, db } from './firebase'; // Ensure Firestore is properly configured
import { collection, query, where, getDocs } from 'firebase/firestore';
import './App.css';
import logo from './assets/logo.png';
import logoname from './assets/logoname.png';
import random1 from './assets/random1.png';
import random2 from './assets/random2.png';
import random3 from './assets/random3.png';

function App() {
    const navigate = useNavigate();

    // Handle Google login
    const handleGoogleLogin = async () => {
        const provider = new GoogleAuthProvider();
        try {
            const result = await signInWithPopup(auth, provider);
            const user = result.user;

            console.log('Logged in user:', user);

            // Check if user has entries in the "interests" collection
            const interestsRef = collection(db, 'interests');
            const interestsQuery = query(interestsRef, where('userId', '==', user.uid));
            const interestsSnapshot = await getDocs(interestsQuery);

            // if (!interestsSnapshot.empty) {
            //     // Navigate to homepage if entries exist
            //     navigate('/homepage');
            // } else {
            //     // Navigate to profile setup if no entries exist
                navigate('/profile-setup');
            // }
        } catch (error) {
            console.error('Login failed:', error);
        }
    };

    return (
        <div id="app-container">
            <div className="floating-images">
                <div className="floating-image" style={{ top: '10%', left: '5%' }}>
                    <img src={random1} alt="Activity 1" />
                </div>
                <div className="floating-image" style={{ top: '50%', right: '10%' }}>
                    <img src={random2} alt="Activity 2" />
                </div>
                <div className="floating-image" style={{ bottom: '15%', left: '20%' }}>
                    <img src={random3} alt="Activity 3" />
                </div>
            </div>
            <div className="header">
                <img src={logo} className="logo" alt="ROAM Logo" />
                <img src={logoname} className="logoname" alt="ROAM Name" />
            </div>
            <div className="button-container">
                <button onClick={() => alert('Login clicked')} className="btn primary">
                    Login
                </button>
                <button onClick={() => alert('Sign in clicked')} className="btn secondary">
                    Sign Up
                </button>
                <button className="btn google" onClick={handleGoogleLogin}>
                    Log in with Google
                </button>
            </div>
        </div>
    );
}

export default App;
