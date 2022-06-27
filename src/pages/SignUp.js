import React, {useState} from "react"
import {Link, useNavigate} from "react-router-dom";
import { toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import {useRecipeContext} from "../contexts/RecipeContextProvider";
import {createUserWithEmailAndPassword, getAuth, updateProfile} from "firebase/auth";
import {doc, setDoc} from "firebase/firestore";
import {db} from "../firebase.config";
import showIcon from "../assets/show.png"
import hideIcon from "../assets/hide.png"

function SignUp() {
  const {signUp} = useRecipeContext()
  const [formData, setFormData] = useState({})
  const [showPassword, setShowPassword] = useState(false)

  const navigate = useNavigate();

  const handleChange = (e) => {
    setFormData(prev => ({
      ...formData,
      [e.target.id]: e.target.value
    }))
  }

  const handleSubmit = (e) => {
    e.preventDefault()
    const auth = getAuth()
    createUserWithEmailAndPassword(auth, formData.email, formData.password)
      .then(async (userCredential) => {
        const user = userCredential.user;
        await updateProfile(auth.currentUser, {
          displayName: formData.name,
        })
        console.log(user)
        await setDoc(doc(db, "users", user.uid), {
          id: user.uid,
          name: formData.name,
          email: user.email,
          createdRecipes: [],
          likedRecipes: [],
        })
        navigate("/recipes")
      })
      .catch((error) => {
        toast.error("Could not sign up user", {
          position: "top-right",
          autoClose: 3000,
          hideProgressBar: true,
          progress: undefined,
        })
      });
  }

  return (
    <form onSubmit={(e) => handleSubmit(e)} className="auth-form">
      <h2>Sign Up</h2>
      <div className="fields">
        <div className="auth-input-group">
          <label htmlFor="name">Name:</label>
          <input type="text" id="name" onChange={(e) => handleChange(e)}/>
        </div>
        <div className="auth-input-group">
          <label htmlFor="email">Email:</label>
          <input type="text" id="email" onChange={(e) => handleChange(e)}/>
        </div>
        <div className="auth-input-group">
          <label htmlFor="password">Password:</label>
          <div className="password-input-div">
            <input type={showPassword ? "text" : "password"} id="password" onChange={(e) => handleChange(e)}/>
            <img src={showPassword ? showIcon : hideIcon} alt={showPassword ? "Password visible" : "Password invisible"}
                 onClick={() => setShowPassword(prev => !prev)} className="password-icon"
            />
          </div>
        </div>
      </div>
      <hr/>
      <button className="button-orange" type="submit">Sign Up</button>
      <hr/>
      <Link className="link" to="/sign-in" >
        Sign In Instead
      </Link>
    </form>
  );
}

export default SignUp;