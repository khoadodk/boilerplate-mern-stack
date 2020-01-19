import React from 'react';
import { BrowserRouter as Router, Route, Switch } from 'react-router-dom';

import Navbar from './components/Navbar/Navbar';
import Home from './components/Home/Home';
import Signup from './components/Signup/Signup';
import Signin from './components/Signin/Signin';
import Activate from './components/Activate/Activate';
import PrivatePage from './components/PrivatePage/PrivatePage';
import PrivateRoute from './utils/PrivateRoute';
import AdminPage from './components/AdminPage/AdminPage';
import AdminRoute from './utils/AdminRoute';
import ForgotPage from './components/ForgotPage/ForgotPage';
import ResetPage from './components/ResetPage/ResetPage';

const App = () => {
  return (
    <>
      <Router>
        <Navbar />
        <Switch>
          <Route exact path="/" component={Home} />
          <Route exact path="/signup" component={Signup} />
          <Route exact path="/signin" component={Signin} />
          <Route exact path="/auth/activate/:token" component={Activate} />
          <PrivateRoute exact path="/private" component={PrivatePage} />
          <AdminRoute exact path="/admin" component={AdminPage} />
          <Route exact path="/auth/password/forgot" component={ForgotPage} />
          <Route
            exact
            path="/auth/password/reset/:token"
            component={ResetPage}
          />
        </Switch>
      </Router>
    </>
  );
};

export default App;
