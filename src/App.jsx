import { GoogleAuthProvider, signInWithPopup } from 'firebase/auth';
import { useNavigate } from 'react-router-dom';
import { auth } from './firebase';
import './App.css';
import logo from './assets/logo.png';
import logoname from './assets/logoname.png';

function App() {
    const navigate = useNavigate();

    // Handle Google login
    const handleGoogleLogin = async () => {
        const provider = new GoogleAuthProvider();
        try {
            const result = await signInWithPopup(auth, provider);
            const user = result.user;
            console.log('Logged in user:', user);
            navigate('/profile-setup'); // Redirect to ProfileSetup
        } catch (error) {
            console.error('Login failed:', error);
        }
    };

    return (
        <div id="root">
            <img src={logo} className="logo" alt="ROAM Logo" />
            <img src={logoname} className="logoname" alt="ROAM Name" />
            <button onClick={() => alert('Login clicked')}>Login</button>
            <button onClick={() => alert('Sign in clicked')}>Sign In</button>
            <button className="google" onClick={handleGoogleLogin}>
                Log in with Google
            </button>
        </div>
    );
}

export default App;
