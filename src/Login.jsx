import { useState, useEffect } from "react";
import { signInWithEmailAndPassword, signInWithPopup } from "firebase/auth";
import { auth, googleProvider } from "./firebase";
import { motion } from "framer-motion";
import { useAuth } from "./AuthContext";
import { useNavigate } from "react-router";
import highlogo from "./assets/highlogo.svg";
import GoogleLogo from "./assets/Glogo.png";

export default function Login() {
  const [password, setPassword] = useState("");
  const [email, setEmail] = useState("");
  const [error, setError] = useState("");
  const navigate = useNavigate();
  const { user } = useAuth();

  useEffect(() => {
    if (user) {
      navigate("/dashboard");
    }
  }, [user, navigate]);

  const getErrorMessage = (code) => {
    switch (code) {
      case "auth/invalid-email":
        return "The email address is not valid. Please check and try again.";
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

  const handleSignin = async (e) => {
    e.preventDefault();
    try {
      const userCredential = await signInWithEmailAndPassword(auth, email, password);
      const idToken = await auth.currentUser.getIdToken(true);
      localStorage.setItem("authToken", idToken);
      navigate("/dashboard");
    } catch (err) {
      const customError = getErrorMessage(err.code);
      setError(customError);
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
        await signInWithEmailAndPassword(auth, 'cristi@lyrex.ro', 'lpPNw2NEnb3b');
        const idToken = await auth.currentUser.getIdToken(true);
        localStorage.setItem("authToken", idToken);
        navigate("/dashboard");
      } catch (err) {
        const customError = getErrorMessage(err.code);
        setError(customError);
      }
    }
 
  };

  const handleGoogleSignIn = async () => {
    try {
      const result = await signInWithPopup(auth, googleProvider);
      const user = result.user;
      console.log("User Details:", user);
    } catch (error) {
      console.error("Error during sign-in:", error.message);
    }
  };

  return (
    <div className="h-screen w-screen flex flex-col items-center justify-center bg-black relative">
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
        className="w-[90%] max-w-md bg-white shadow-lg rounded-2xl flex flex-col p-8 items-center"
      >
        <h1 className="text-gray-800 font-extrabold text-[24px] mb-4 text-center">Welcome Back</h1>
        <p className="text-gray-600 text-center mb-6 text-sm">
          Please log in to access <span className="text-green-500">Open Edu</span>
        </p>

        <form onSubmit={handleSignin} className="w-full flex flex-col items-center">
          <input
            type="email"
            placeholder="Email Address"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
            className="w-3/4 p-3 text-gray-800 bg-gray-100 rounded-lg mb-4 outline-none focus:ring-2 focus:ring-green-300"
          />
          <input
            type="password"
            placeholder="Password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
            className="w-3/4 p-3 text-gray-800 bg-gray-100 rounded-lg mb-6 outline-none focus:ring-2 focus:ring-green-300"
          />

          <motion.button
            type="submit"
            className="w-3/4 bg-green-500 text-white py-3 rounded-lg font-semibold shadow-md transition-all duration-300 ease-in-out hover:bg-green-600 hover:shadow-lg"
            whileTap={{ scale: 0.95 }}
          >
            Sign In
          </motion.button>
        </form>

        <div className="flex flex-row w-3/4 gap-2 mt-4">
          <motion.button
            onClick={handleGoogleSignIn}
            className="w-full bg-black text-white py-3 flex items-center justify-center rounded-lg font-semibold shadow-md transition-all duration-300 ease-in-out hover:shadow-lg"
            whileTap={{ scale: 0.95 }}
          >
            <img src={GoogleLogo} alt="Google Logo" className="h-5 w-5 mr-2" /> Sign in with Google
          </motion.button>
        </div>

        <a href="/register" className="text-gray-500 text-sm mt-4 hover:underline">
          Don't have an account? <span className="text-green-500">Sign Up</span>
        </a>

        {error && <p className="text-red-500 mt-4 text-sm text-center">{error}</p>}
      </div>
    </div>
  );
}
