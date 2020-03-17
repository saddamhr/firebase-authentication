import React, { useState } from 'react';
import logo from './logo.svg';
import './App.css';
import * as firebase from "firebase/app";
import "firebase/auth";
import firebaseConfig from './firebase.config';

firebase.initializeApp(firebaseConfig)

function App() {

  const [user, setUser] = useState({
    isSignIn: false,
    name: '',
    email: '',
    photo: ''
  })

  const provider = new firebase.auth.GoogleAuthProvider();
  const handleSignIn = () => {
    firebase.auth().signInWithPopup(provider).then(res => {
      const {displayName, photoURL, email} = res.user;
      const signedInUser ={
        isSignedIn: true,
        name: displayName,
        email: email,
        photo: photoURL
      }
      setUser(signedInUser)

    })
    .catch(err => {
      console.log(err);
      console.log(err.message);
    })
  }
  
  const handleSignOut = () => {
    firebase.auth().signOut().then(res => {
      const signOutUser = {
        isSignedIn: false,
        name: '',
        photo: '',
        email: '',
        password: '',
        error: '',
        isValid: false,
        existingUser: false
      }
      setUser(signOutUser)
    })
    .catch(err => {

    })
  }

  const isValidEmail = email => /(.+)@(.+){2,}\.(.+){2,}/.test(email);
  const hasNumber = input => /\d/.test(input);
  const switchForm = e => {
    const createdUser = {...user};
    createdUser.existingUser = e.target.checked;
    setUser(createdUser);
  }

  const handleChange = e => {
    // console.log(event.target.value);
    const newUserInfo = {
      ...user 
    };

    let isValid = true;
    if(e.target.name === 'email') {
      isValid = isValidEmail(e.target.value);
    }
    if(e.target.name === 'password') {
      isValid = e.target.value.length > 8 && hasNumber(e.target.value);
    }
    newUserInfo[e.target.name] = e.target.value;
    newUserInfo.isValid = isValid;
    setUser(newUserInfo);
  }

  const createAccount = (event) => {
    
      if(user.isValid) {
        firebase.auth().createUserWithEmailAndPassword(user.email, user.password).then(res => {
          console.log(res);
          const createdUser = {...user};
          createdUser.isSignedIn = true;
          createdUser.error = '';
          setUser(createdUser);
        })
        .catch(err => {
          console.log(err.message)
          const createdUser = {...user};
          createdUser.isSignedIn = false;
          createdUser.error = err.message;
          setUser(createdUser);
        })
      }
    event.preventDefault();
    event.target.reset()
  }

  const signInUser = event => {
    if(user.isValid) {
      firebase.auth().signInWithEmailAndPassword(user.email, user.password).then(res => {
        console.log(res);
        const createdUser = {...user};
        createdUser.isSignedIn = true;
        createdUser.error = '';
        setUser(createdUser);
      })
      .catch(err => {
        console.log(err.message)
        const createdUser = {...user};
        createdUser.isSignedIn = false;
        createdUser.error = err.message;
        setUser(createdUser);
      })
    }
    event.preventDefault();
    event.target.reset();
  }

  return (
    <div className="App">
      {
        user.isSignedIn ? <button onClick={handleSignOut}>Sign Out</button> : 
        <button onClick={handleSignIn}>Sign In</button>
      }
      {
        user.isSignedIn && <div>
          <p>Welcome, {user.name}</p>
          <p>Your email: {user.email}</p>
          <img src={user.photo} alt=""/>
        </div>
      }
      <h1>Our Own Authentication</h1>
      <input type="checkbox" name="switchForm" onChange={switchForm} id='switchForm'/>
      <label htmlFor="switchForm">Returning User</label>
      <form style={{display:user.existingUser ? 'block': 'none'}} onSubmit={signInUser}>
        <input type="text" onBlur={handleChange} name='email' placeholder='your email' required/>
        <br/>
        <input type="password" onBlur={handleChange} name='password' placeholder='your password' required/>
        <br/>
        <input type="submit" value="Sign In"/>
      </form>

      <form style={{display:user.existingUser ? 'none': 'block'}} onSubmit={createAccount}>
        <input type="text" onBlur={handleChange} name='name' placeholder='your name' required/>
        <br/>
        <input type="text" onBlur={handleChange} name='email' placeholder='your email' required/>
        <br/>
        <input type="password" onBlur={handleChange} name='password' placeholder='your password' required/>
        <br/>
        <input type="submit" value="Create Account"/>
      </form>
      {
        user.error && <p style={{color:'red'}}>{user.error}</p>
      }
    </div>
  );
}

export default App;
