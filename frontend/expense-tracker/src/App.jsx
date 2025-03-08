import React from 'react'
import{
  BrowserRouter as Router,
  Routes,
  Route, 
  Navigate
} from "react-router-dom";

import Login from './pages/Auth/Login';
import SignUp from './pages/Auth/SignUp';
import Home from './pages/Dashboard/Home';
import Income from './pages/Dashboard/Income';
import Expense from './pages/Dashboard/Expense';
import UserProvider from './context/userContext';
import {Toaster} from 'react-hot-toast';
import UserProfile from './pages/Dashboard/UserProfile';

const App = () => {
  return (
    <UserProvider>
    <div>
      <Router>
        <Routes>
          <Route path="/" element={<Root />} />
          <Route path="/login" exact element={<Login />} />
          <Route path="/signUp" exact element={<SignUp />} />
          <Route path="/dashboard" exact element={<Home />} />
          <Route path="/income" exact element={<Income />} />
          <Route path="/expense" exact element={<Expense />} />
          <Route path="/user-profile" exact element={<UserProfile />} />
        </Routes>
      </Router>
    </div>

    <Toaster
        toastOptions={{
          className: "",
          style: {
            fontSize: '13px'
          },
        }}
    />

    </UserProvider>
  )
}

export default App

//Check if token exists in local storage

const Root = () => {
  const isAuthenticated = !!localStorage.getItem("token");

  //Redirect to dashboard if auth, otherwise to login
  return isAuthenticated ? (
    <Navigate to="/dashboard"/>
  ): (
    <Navigate to="/login"/>
  );
};