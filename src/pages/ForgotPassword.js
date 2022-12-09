import React, {useEffect, useState, useRef} from "react";
import {Link} from "react-router-dom";
import {getAuth, sendPasswordResetEmail} from "firebase/auth";
import {toast} from "react-toastify";


export default function ForgotPassword() {
  const [email, setEmail] = useState("")

  const onChange = e => {
    setEmail(e.target.value);
  }

  const onSubmit = async e => {
    e.preventDefault()
    const auth = getAuth()
    try {
      await sendPasswordResetEmail(auth, email)
      toast.success("Email was sent")
    } catch (e) {
      toast.error("Please verify the email address")
    }
  }

  return (
    <div className="page">
      <div className="narrow-container">
      <h1 className="auth-title">Forgot password</h1>
        <form className="auth-form" onSubmit={onSubmit}>
          <div className="auth-input-group">
            <label htmlFor="forget-password-email">Email:</label>
            <input type="text" className="forget-password-email" id="forget-password-email" value={email}
                    onChange={(e) => onChange(e)}
            />
          </div>
          <div className="bottom-link-container">
            <Link className="bottom-link" to="/sign-in" >
              Log In
            </Link>
            <Link className="bottom-link" to="/sign-up" >
              Sign Up
            </Link>
          </div>
          <button className="border-button auth-button">Send reset link</button>
        </form>
      </div>
    </div>
  )
}