import React from "react";
import {
  GoogleAuthProvider,
  GithubAuthProvider,
  getAuth,
  signInWithPopup,
  signOut,
} from "firebase/auth";
import { ToastContainer, toast } from "react-toastify";
import { useDispatch, useSelector } from "react-redux";
import { addUser, removeUser } from "../redux/bazarSlice";
import { useNavigate } from "react-router-dom";
import { githubLogo, googleLogo } from "../assets";
import axios from "axios";

const Login = () => {
  const userInfo = useSelector((state) => state.bazar.userInfo);
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const auth = getAuth();
  const googleProvider = new GoogleAuthProvider();
  const githubProvider = new GithubAuthProvider();

  const handleLogin = (provider) => {
    signInWithPopup(auth, provider.setCustomParameters({ prompt: "select_account" }))
      .then((result) => {
        const user = result.user;
        dispatch(
          addUser({
            _id: user.uid,
            name: user.displayName,
            email: user.email,
            image: user.photoURL,
          })
        );
        axios.post('http://localhost:3000/customers', {
          _id: user.uid,
          name: user.displayName,
          email: user.email,
          image: user.photoURL,
        }).catch((error) => {
          console.error('Error storing customer data:', error);
        });
        toast.success("Login Successful!");
        setTimeout(() => {
          navigate("/");
        }, 1500);
      })
      .catch((error) => {
        console.log(error);
        toast.error("Login Failed!");
      });
  };

  const handleSignOut = () => {
    signOut(auth)
      .then(() => {
        toast.success("Log Out Successfully!");
        dispatch(removeUser());
      })
      .catch((error) => {
        console.log(error);
      });
  };

  return (
    <div className="w-full flex flex-col items-center justify-center gap-10 py-20">
      {!userInfo ? (
        <>
          <div className="w-full flex items-center justify-center gap-10">
            <div
              onClick={() => handleLogin(googleProvider)}
              className="text-base w-60 h-12 tracking-wide border-[1px] border-gray-400 rounded-md flex items-center justify-center gap-2 hover:border-blue-600 cursor-pointer duration-300"
            >
              <img className="w-8" src={googleLogo} alt="googleLogo" />
              <span className="text-sm text-gray-900"> Sign in with Google</span>
            </div>
          </div>
          <div className="w-full flex items-center justify-center gap-10">
            <div
              onClick={() => handleLogin(githubProvider)}
              className="text-base w-60 h-12 tracking-wide border-[1px] border-gray-400 rounded-md flex items-center justify-center gap-2 hover:border-blue-600 cursor-pointer duration-300"
            >
              <img className="w-8" src={githubLogo} alt="githubLogo" />
              <span className="text-sm text-gray-900"> Sign in with Github</span>
            </div>
          </div>
        </>
      ) : (
        <button
          onClick={handleSignOut}
          className="bg-black text-white text-base py-3 px-8 tracking-wide rounded-md hover:bg-gray-800 duration-300"
        >
          Sign Out
        </button>
      )}
      <ToastContainer
        position="top-left"
        autoClose={2000}
        hideProgressBar={false}
        newestOnTop={false}
        closeOnClick
        rtl={false}
        pauseOnFocusLoss
        draggable
        pauseOnHover
        theme="dark"
      />
    </div>
  );
};

export default Login;