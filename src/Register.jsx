import { useState, useEffect } from "react";
import { createUserWithEmailAndPassword, signInWithEmailAndPassword, updateProfile, signInWithPopup } from "firebase/auth";
import { auth, googleProvider  } from "./firebase";
import { motion } from "framer-motion";
import { useAuth } from './AuthContext';
import { useNavigate } from "react-router";
import highlogo from './assets/highlogo.svg'
import "./Register.css";
import GoogleLogo from './assets/Glogo.png'

export default function Register() {
    const [password, setPassword] = useState("");
    const [email, setEmail] = useState("");
    const [name, setName] = useState("");
  const [error, setError] = useState("");
  const navigate = useNavigate();
  const { user } = useAuth();

  
  useEffect(() => {
    if (user) {
      navigate('/dashboard');
    }
  }, [user, navigate]); 
  const getErrorMessage = (code) => {
    switch (code) {
      case "auth/invalid-email":
        return "The email address is not valid. Please check and try again.";
      case "auth/email-already-in-use":
        return "This email is already in use. Please use a different one.";
      case "auth/weak-password":
        return "Your password should be at least 6 characters long.";
      case "auth/user-not-found":
        return "No user found with this email address. Please sign up.";
      case "auth/wrong-password":
        return "The password is incorrect. Please try again.";
      case "auth/too-many-requests":
        return "Too many failed attempts. Please try again later.";
      default:
        return "An unknown error occurred. Please try again.";
    }
  };
  
  const handleSignup = async () => {
    try {
      const userCredential = await createUserWithEmailAndPassword(auth, email, password);
      const user = userCredential.user;
  
      await updateProfile(user, {
        displayName: name,
      });
  
      await user.reload();
  
      navigate('/dashboard');
    } catch (err) {
      const customError = getErrorMessage(err.code); 
      setError(customError);  
    }
  };
  

  const handleGoogleSignIn = async () => {
    try {
      const result = await signInWithPopup(auth, googleProvider);
    } catch (error) {
      console.error("Error during sign-in:", error.message);
    }
  };

  const handleTestSignin = async (type) => {
    if(type=='admin') {
      try {
        const userCredential = await signInWithEmailAndPassword(auth, 'admin@cooluser.hackclub.com', 'highseas1234');
        const idToken = await auth.currentUser.getIdToken(true);
        localStorage.setItem("authToken", idToken);
        navigate("/dashboard");
      } catch (err) {
        const customError = getErrorMessage(err.code);
        setError(customError);
      }
    } else if(type=='student') {
      try {
        await signInWithEmailAndPassword(auth, 'cristi@cristoi.ro', 'OZvjuf8BB2U9');
        const idToken = await auth.currentUser.getIdToken(true);
        localStorage.setItem("authToken", idToken);
        navigate("/dashboard");
      } catch (err) {
        const customError = getErrorMessage(err.code);
        setError(customError);
      }
    } else if(type=='teacher') {
      try {
        await signInWithEmailAndPassword(auth, 'cristi@lyrex.ro', 'IpPNw2NEnb3b');
        const idToken = await auth.currentUser.getIdToken(true);
        localStorage.setItem("authToken", idToken);
        navigate("/dashboard");
      } catch (err) {
        const customError = getErrorMessage(err.code);
        setError(customError);
      }
    }
 
  };

  
    return (
        <div className="h-screen w-screen flex items-center justify-center bg-black relative z-0">
<motion.div
  className="absolute top-0 mt-2 lg:w-[400px] bg-white rounded-xl flex items-center p-3 lg:p-4 shadow-md transition-all lg:flex-row flex-col gap-2"
  initial={{ opacity: 0, y: -20 }}
  animate={{ opacity: 1, y: 0 }}
  transition={{ duration: 0.2, delay: 1 }}
>
  <div className="lg:w-1/4 w-full flex justify-center lg:justify-start">
    <img
      src={highlogo}
      className="w-10 lg:w-16 h-auto"
      alt="High Seas Logo"
    />
  </div>
  <div className="lg:w-3/4 w-full text-black flex flex-col">
    <span className="lg:text-base text-xs mb-1 font-semibold">
      <span className="font-bold hidden lg:inline">Psst.. </span>Here from high seas?
    </span>
    <span className="lg:text-sm text-xs mb-1 font-medium">Log in to test accounts:</span>
    <div className="flex flex-row items-center gap-2">
      <button
        className="text-blue-900 font-bold cursor-pointer lg:text-sm text-xs hover:underline"
        onClick={() => handleTestSignin('admin')}
      >
        Admin
      </button>
      <button
        className="text-blue-900 font-bold cursor-pointer lg:text-sm text-xs hover:underline"
        onClick={() => handleTestSignin('teacher')}
      >
        Teacher
      </button>
      <button
        className="text-blue-900 font-bold cursor-pointer lg:text-sm text-xs hover:underline"
        onClick={() => handleTestSignin('student')}
      >
        Student
      </button>
    </div>
  </div>
</motion.div>

      
        <div
          className="w-[400px] h-auto border-beam bg-white shadow-lg rounded-2xl flex flex-col p-8 lg:mx-0 mx-3  items-center"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
        >
          <h1 className="text-gray-800 font-extrabold text-[32px] mb-2">Welcome</h1>
          <p className="text-gray-600 font-medium text-[14px] text-center mb-8">
            Please register to access <span className="text-green-500">Open Edu</span>
          </p>
  
          <input
            type="email"
            placeholder="Email Address"
            onChange={(e) => setEmail(e.target.value)}
            className="w-3/4 p-3 text-gray-800 bg-gray-100 rounded-lg mb-4 outline-none focus:ring-2 focus:ring-green-300"
          />
            <input
            type="name"
            placeholder="Name"
            onChange={(e) => setName(e.target.value)}
            className="w-3/4 p-3 text-gray-800 bg-gray-100 rounded-lg mb-4 outline-none focus:ring-2 focus:ring-green-300"
          />
          <input
            type="password"
            placeholder="Password"
            onChange={(e) => setPassword(e.target.value)}
            className="w-3/4 p-3 text-gray-800 bg-gray-100 rounded-lg mb-6 outline-none focus:ring-2 focus:ring-green-300"
          />
          
  
          <a href="/login" className="text-gray-500 text-sm mb-4 hover:underline">
            Already have an account? <span className="text-green-500">Log in</span>
          </a>

            <div className="flex flex-row w-3/4 gap-2">

          <motion.button
            onClick={handleSignup}
            className="w-3/4 bg-green-500 text-white py-3 rounded-lg font-semibold shadow-md transition-all duration-300 ease-in-out hover:bg-green-600 hover:shadow-lg"
            whileTap={{ scale: 0.95 }}
          >
            Sign Up
          </motion.button>

          <motion.button
            onClick={handleGoogleSignIn}
            className="w-1/4 bg-black text-white py-3 flex items-center justify-center rounded-lg font-semibold shadow-md transition-all duration-300 ease-in-out hover:shadow-lg"
            whileTap={{ scale: 0.95 }}
          >
            <img src={GoogleLogo} alt="G" className="h-5 w-5 " />
          </motion.button>
            </div>
  
          {error && (
            <p className="text-red-500 mt-4 text-sm text-center">{error}</p>
          )}
        </div>
      </div>
    );
}