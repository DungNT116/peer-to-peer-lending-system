import React from "react";
import ReactDOM from "react-dom";
import { BrowserRouter, Route, Switch, Redirect } from "react-router-dom";
import { Provider } from 'react-redux';
import { store } from './store/store'; 

import "assets/vendor/nucleo/css/nucleo.css";
import "assets/vendor/font-awesome/css/font-awesome.min.css";
import "assets/scss/argon-design-system-react.scss";

import Index from "views/Index.jsx";
import Login from "main-views/Login/Login.jsx";
import Profile from "main-views/Profile/Profile.jsx";
import Register from "main-views/Register/Register.jsx";
import CreateRequestPage from "main-views/CreateRequestPage/CreateRequestPage.jsx";
import ApplyPaypal from "main-views/ApplyPaypal/ApplyPaypal.jsx";
import ApplyTimeline from "main-views/ApplyTimeline/ApplyTimeline.jsx";
import ViewRequestList from "main-views/ViewRequestList/ViewRequestList.jsx";
import ViewDetailRequest from "main-views/ViewDetailRequest/ViewDetailRequest.jsx";
import HistoryRequest from "main-views/HistoryRequest/HistoryRequest.jsx";
import ViewRequestNew from "main-views/ViewRequestNew/ViewRequestNew.jsx";
import ViewRequestTrading from "main-views/ViewRequestTrading/ViewRequestTrading";
import ViewOwnTransaction from "main-views/ViewOwnTransaction/ViewOwnTransaction";

ReactDOM.render(
  <Provider store={store}>
    <BrowserRouter>
      <Switch>
        <Route path="/" exact render={props => (localStorage.getItem("isLoggedIn")) ? <ViewRequestNew {...props} /> : < Index {...props} />} />
        {/* <Route
          path="/landing-page"
          exact
          render={props => <Landing {...props} />}
        /> */}
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
        <Route
          path="/view-request-trading"
          exact
          render={props => <ViewRequestTrading {...props} />}
        />
        <Route
          path="/view-own-transactions"
          exact
          render={props => <ViewOwnTransaction {...props} />}
        />
        <Redirect to="/" />
      </Switch>
    </BrowserRouter>
  </Provider>
  ,
  document.getElementById("root")
);
