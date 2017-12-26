import React from 'react';
import { BrowserRouter, Switch, Route, Redirect } from 'react-router-dom';
import decode from 'jwt-decode';

import Home from './home';
import Register from './register';
import Login from './login';
import CreateTeam from './createTeam';
import ViewTeam from './viewTeam';
import DirectMessages from './directMessage';

const isAuthenticated = () => {
  const token = localStorage.getItem('token');
  const refreshToken = localStorage.getItem('refreshToken');
  try {
    decode(token);
    decode(refreshToken);
  } catch (err) {
    return false;
  }

  return true;
};

const PrivateRoute = ({ component: Component, ...rest }) => (
  <Route
    {...rest}
    render={props =>
      (isAuthenticated() ? (
        <Component {...props} />
      ) : (
        <Redirect
          to={{
            pathname: '/login',
          }}
        />
      ))
    }
  />
);

export default () => (
  <BrowserRouter>
    <Switch>
      <Route path="/" exact component={Home} />
      <Route path="/register" exact component={Register} />
      <Route path="/login" exact component={Login} />
      <PrivateRoute path="/view-team/user/:teamId/:userId" exact component={DirectMessages} />
      <Route path="/teams/:teamId?/:channelId?" exact component={ViewTeam} />
      <PrivateRoute path="/create-team" exact component={CreateTeam} />
    </Switch>
  </BrowserRouter>
);
