import React, {useEffect, useState} from 'react';
import './App.css';
import {
  BrowserRouter as Router,
  Route,
  Switch,
  Redirect,
} from "react-router-dom";
import GlobalStyles from './GlobalStyles';
import PagesURL from './PagesURL';
import Navbar from './components/Navbar/Navbar';
import {AuthProvider} from "./context/AuthProvider";
import PrivateRoute from "./components/PrivateRoute/PrivateRoute";
import Footer from "./components/Footer/Footer";
import ScrollToTop from "./components/ScrollToTop";
import ScrollToTopButton from "./components/ScrollToTopButton/ScrollToTopButton";

function App() {
  return (
    <>
      <GlobalStyles/>
      <AuthProvider>
        <Router>
          <ScrollToTopButton/>
          <ScrollToTop/>
          <Navbar/>
          <Switch>
            {PagesURL.map((route) => (
              route.private ? <PrivateRoute key={route.path} path={route.path} component={route.component}/> :
                <Route exact key={route.path} path={route.path} component={route.component}/>
            ))}
            <Redirect from="*" to="/"/>
          </Switch>
          <Footer/>
        </Router>
      </AuthProvider>
    </>
  );
}

export default App;
