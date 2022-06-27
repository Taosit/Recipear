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
    <div className="forgot-password-container">
      <div className="container">
        <div className="forgot-password-page">
          <h2 className="forget-password-title">Forgot password</h2>
          <form className="forget-password-form" onSubmit={onSubmit}>
            <div className="forget-password-input-group">
              <label htmlFor="forget-password-email">Email:</label>
              <input type="text" className="forget-password-email" id="forget-password-email" value={email}
                     onChange={(e) => onChange(e)}
              />
            </div>
            <hr/>
            <button className="link">Send reset link</button>
          </form>
        </div>
      </div>
    </div>
  )
}