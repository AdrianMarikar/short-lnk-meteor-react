import { Meteor } from 'meteor/meteor';
import React from 'react';
import {Router, Route, Switch} from 'react-router-dom';
import createBrowserHistory from 'history/createBrowserHistory';

import Signup from './../ui/Signup';
import Link from './../ui/Link';
import NotFound from './../ui/NotFound';
import Login from './../ui/Login';

const customHistory = createBrowserHistory();
// Authentication pages
const unauthenticatedPages = ['/', '/login', '/signup'];
const authenticatedPages = ['/links'];

export const onAuthChangeRedirect = () => {
const pathname = customHistory.location.pathname;
const isAuthenticated = !!Meteor.userId();
const isUnauthenticatedPage = unauthenticatedPages.includes(pathname);
const isAuthenticatedPage = authenticatedPages.includes(pathname);

// Check for redirect based on some consts use replace instead of push to replace and not stack to the history
  if(isUnauthenticatedPage && isAuthenticated) {
    customHistory.replace('/links');
  } else if(isAuthenticatedPage && !isAuthenticated || pathname === '/') {
      customHistory.replace('/');
    }
};

export const routes = (
  <Router history={customHistory}>
    <Switch>
      <Route exact path="/" component={Login}/>
      <Route path="/signup" component={Signup}/>
      <Route path="/links" component={Link}/>
      <Route component={NotFound}/>
    </Switch>
  </Router>
);
