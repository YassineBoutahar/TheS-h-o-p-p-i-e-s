import React from 'react';
import { BrowserRouter as Router, Switch, Route } from "react-router-dom";
import Home from './containers/Home';
import Share from './containers/Share';

const App = () => {

  return (
    <Router>
      <Switch>
        <Route path="/share">
          <Share />
        </Route>
        <Route>
          <Home />
        </Route>
      </Switch>
    </Router>
  )
}

export default App;