import React, {useState} from "react"
import {Link, useNavigate} from "react-router-dom";
import { toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import {useRecipeContext} from "../contexts/RecipeContextProvider";
import {signInWithEmailAndPassword, getAuth} from "firebase/auth";
import showIcon from "../assets/show.svg";
import hideIcon from "../assets/hide.svg";

function SignIn() {
  const {signUp} = useRecipeContext()
  const [formData, setFormData] = useState({})
  const [showPassword, setShowPassword] = useState(false)

  const navigate = useNavigate();

  const updateRecipe = (e) => {
    setFormData(prev => ({
      ...formData,
      [e.target.id]: e.target.value
    }))
  }

  const handleSubmit = (e) => {
    e.preventDefault()
    console.log(formData)
    const auth = getAuth()
    signInWithEmailAndPassword(auth, formData.email, formData.password)
      .then(async (userCredential) => {
        const user = userCredential.user;
        console.log(user)
        navigate("/recipes")
      })
      .catch(() => {
        toast.error("Incorrect email or password", {
          position: "top-right",
          autoClose: 3000,
          hideProgressBar: true,
          progress: undefined,
        })
      });
  }

  return (
    <div className="page">
      <div className="narrow-container">
        <h1 className="auth-title">Log In</h1>
        <form onSubmit={(e) => handleSubmit(e)} className="auth-form">
          <div className="fields">
            <div className="auth-input-group">
              <label htmlFor="email">Email:</label>
              <input type="email" id="email" onChange={(e) => updateRecipe(e)}/>
            </div>
            <div className="auth-input-group">
              <label htmlFor="password">Password:</label>
              <div className="password-input-div">
                <input type={showPassword ? "text" : "password"} id="password" onChange={(e) => updateRecipe(e)}/>
                <img src={showPassword ? showIcon : hideIcon} alt={showPassword ? "Password visible" : "Password invisible"}
                    onClick={() => setShowPassword(prev => !prev)} className="password-icon"
                />
              </div>
            </div>
          </div>
          <div className="bottom-link-container">
            <Link className="bottom-link" to="/sign-up" >
              Sign Up
            </Link>
            <Link className="bottom-link" to="/forgot-password" >
              Forgot Password
            </Link>
          </div>
          <button className="border-button auth-button" type="submit">Log In</button>
        </form>
      </div>
    </div>
  );
}

export default SignIn;