import React, {useState} from "react"
import Recipes from "./components/Recipes";
import {BrowserRouter as Router, Routes, Route, Navigate} from "react-router-dom";
import {ToastContainer, Slide} from 'react-toastify';
import Home from "./pages/Home";
import SingleRecipe from "./pages/SingleRecipe";
import Navbar from "./components/Navbar";
import SignUp from "./pages/SignUp";
import SignIn from "./pages/SignIn";
import {getAuth} from "firebase/auth";
import Cook from "./pages/Cook";
import Profile from "./pages/Profile";
import PrivateRoute from "./components/PrivateRoute";
import ForgotPassword from "./pages/ForgotPassword";
import UserRecipes from "./pages/UserRecipes";

function App() {
  const auth = getAuth();

  return (
    <>
      <Router>
        <Navbar auth={auth}/>
        <Routes>
          <Route path="/" element={<Navigate to="/recipes"/>}/>
          <Route path="/recipes" element={<Home/>}/>
          <Route path="/sign-up" element={<SignUp/>}/>
          <Route path="/sign-in" element={<SignIn/>}/>
          <Route path="/profile" element={<PrivateRoute/>}>
            <Route path="/profile" element={<Profile/>}/>
          </Route>
          <Route path="/my-recipes" element={<PrivateRoute/>}>
            <Route path="/my-recipes" element={<UserRecipes/>}/>
          </Route>
          <Route path="/liked-recipes" element={<PrivateRoute/>}>
            <Route path="/liked-recipes" element={<UserRecipes/>}/>
          </Route>
          <Route path="/forgot-password" element={<ForgotPassword/>}/>
          <Route path="/recipes/:id" element={<SingleRecipe/>}/>
          <Route path="/recipes/:id/cook" element={<Cook/>}/>
        </Routes>
      </Router>
      <ToastContainer
        position="top-right"
        autoClose={3000}
        hideProgressBar
        transition={Slide}
      />
    </>
  );
}

export default App;
