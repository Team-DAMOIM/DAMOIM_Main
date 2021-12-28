import React from 'react';
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

function App() {
    return (
        <>
            <GlobalStyles/>
            <AuthProvider>
                <Router>
                    <Navbar/>
                    <Switch>
                        {PagesURL.map((route) => (
                            <Route key={route.path} path={route.path} exact component={route.component}/>
                        ))}
                        <Redirect from="*" to="/"/>
                    </Switch>
                </Router>
            </AuthProvider>
        </>
    );
}

export default App;
