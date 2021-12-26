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

function App() {
  return (
    <>
      <GlobalStyles>
        <Router>
          {/* <Header/> */}
          <Switch>
            {PagesURL.map((route) => (
              <Route path={route.path} exact component={route.component}/>
            ))}
            <Redirect from="*" to="/"/>
          </Switch>
        </Router>
      </GlobalStyles>
    </>
  );
}

export default App;
