import React from "react";
import ReactDOM from "react-dom";
import { BrowserRouter, Route, Switch, Redirect } from "react-router-dom";
import { Provider } from 'react-redux';
import { store } from './store/store';

import "assets/vendor/nucleo/css/nucleo.css";
import "assets/vendor/font-awesome/css/font-awesome.min.css";
import "assets/scss/argon-design-system-react.scss";

import Index from "views/Index.jsx";
import Landing from "views/examples/Landing.jsx";
import Login from "views/examples/Login.jsx";
import Profile from "views/examples/Profile.jsx";
import Register from "views/examples/Register.jsx";
import CreateRequestPage from "main-views/CreateRequestPage/CreateRequestPage.jsx";
import ApplyPaypal from "main-views/ApplyPaypal/ApplyPaypal.jsx";
import ApplyTimeline from "main-views/ApplyTimeline/ApplyTimeline.jsx";
import ViewRequestList from "main-views/ViewRequestList/ViewRequestList.jsx";
import ViewDetailRequest from "main-views/ViewDetailRequest/ViewDetailRequest.jsx";
import HistoryRequest from "main-views/HistoryRequest/HistoryRequest.jsx";
import ViewRequestNew from "main-views/ViewRequestNew/ViewRequestNew.jsx";

ReactDOM.render(
  <Provider store={store}>
  <BrowserRouter>
    <Switch>
      <Route path="/" exact render={props => <Index {...props} />} />
      
      <Route path="/login-page" exact render={props => <Login {...props} />} />
      <Route
        path="/profile-page"
        exact
        render={props => <Profile {...props} />}
      />
      <Route
        path="/register-page"
        exact
        render={props => <Register {...props} />}
      />
      <Route
        path="/create-request-page"
        exact
        render={props => <CreateRequestPage {...props} />}
      />
      <Route
        path="/view-request-list"
        exact
        render={props => <ViewRequestList {...props} />}
      />
      <Route
        path="/view-detail-request"
        exact
        render={props => <ViewDetailRequest {...props} />}
      />
      <Route
        path="/view-history-request"
        exact
        render={props => <HistoryRequest {...props} />}
      />
      <Route
        path="/view-new-request"
        exact
        render={props => <ViewRequestNew {...props} />}
      />
      <Route
        path="/apply-paypal"
        exact
        render={props => <ApplyPaypal {...props} />}
      />
      <Route
        path="/apply-timeline"
        exact
        render={props => <ApplyTimeline {...props} />}
      />
      <Redirect to="/" />
    </Switch>
  </BrowserRouter>
  </Provider>
  ,
  document.getElementById("root")
);
