import React, {useState, useEffect, useRef} from "react"
import {Link, useNavigate} from "react-router-dom";
import {getAuth, onAuthStateChanged, signOut} from "firebase/auth";
import {doc, getDoc} from "firebase/firestore";
import {db} from "../firebase.config";

function Navbar({auth}) {
  const [user, setUser] = useState(null);
  const [showDropdownOptions, setShowDropdownOptions] = useState(false)

  const profileNameRef = useRef()
  const navigate = useNavigate()

  useEffect(() => {
    onAuthStateChanged(auth, async (user) => {
      if (user) {
        const uid = user.uid;
        const docSnap = await getDoc(doc(db, "users", uid));
        if (docSnap.exists()) {
          const loggedInUser = {
            id: uid,
            name: docSnap.data().name,
            email: docSnap.data().email
          }
          setUser(loggedInUser)
          console.log(loggedInUser)
        }
      } else {
        setUser(null);
      }
    });
  }, [])


  const logOutUser = () => {
    console.log("logging user out")
    navigate("/recipes")
    auth.signOut();
  }

  const checkLeaveProfileName = (e) => {
    const leftEdge = profileNameRef.current.getBoundingClientRect().x;
    const rightEdge = leftEdge + profileNameRef.current.getBoundingClientRect().width;
    if (e.clientX < leftEdge || e.clientX > rightEdge) setShowDropdownOptions(false)
  }

  const navigateTo = (url) => {
    navigate(url);
    setShowDropdownOptions(false)
  }

  console.log(showDropdownOptions)

  return (
    <div className="nav-container">
      <div className="container">
        <nav className="nav">
      <Link className="nav-link" to="/recipes">
        <h3 className="title">Recipes</h3>
      </Link>
      {user? (
        <div className="nav-right">
          <div className="profile-dropdown">
            <div className="nav-item-container profile-name-container" ref={profileNameRef}
                 onMouseLeave={(e) => checkLeaveProfileName(e)}
            >
              <h3 className="user" onMouseEnter={() => setShowDropdownOptions(true)}
                  onClick={() => showDropdownOptions ? navigateTo("/profile") : setShowDropdownOptions(true)}
              >{user.name}</h3>
            </div>
            <div className={showDropdownOptions? "show-dropdown" : "hide-dropdown"}
                 onMouseLeave={() => setShowDropdownOptions(false)}
            >
              <div className="dropdown-option-container">
                <span className="dropdown-option" onClick={() => navigateTo("/profile")}>Profile</span>
              </div>
              <div className="dropdown-option-container">
                <span className="dropdown-option" onClick={() => navigateTo("/my-recipes")}>My Recipes</span>
              </div>
              <div className="dropdown-option-container">
                <span className="dropdown-option" onClick={() => navigateTo("/liked-recipes")}>Liked Recipes</span>
              </div>
            </div>
          </div>
          <div className="nav-item-container">
            <a className="log-out-button" type="button" onClick={logOutUser}>Log Out</a>
          </div>
        </div>
      ): (
        <div className="nav-right">
          <Link className="nav-link" to="/sign-up">
            <h3 >Sign Up</h3>
          </Link>
          <Link className="nav-link" to="/sign-in">
            <h3>Sign In</h3>
          </Link>
        </div>
      )}
        </nav>
      </div>
    </div>
  );
}

export default Navbar;