// Required Packages
import React, { useEffect } from 'react';
import ReactDOM from 'react-dom';
import { BrowserRouter as Router, Switch, Route, withRouter } from "react-router-dom";
import { Provider, connect } from "react-redux";
import * as serviceWorker from './serviceWorker';

// Custom Components
import App from './App';
import Register from "./components/Auth/Register/Register";
import Login from "./components/Auth/Login/Login";
import firebase from "./server/firebase";

// Redux
import { setUser } from "./store/actions/creator";
import { AppLoader } from "./components/AppLoader/AppLoader";
import { store } from "./store/store"

// CSS
import "semantic-ui-css/semantic.min.css"



const Index = (props) => {

  useEffect(() => {
    firebase.auth().onAuthStateChanged((user) => {
      if (user) {
        props.setUser(user);
        props.history.push("/");
      } else {
        props.setUser(null);
        props.history.push("/login");
      }
    })
  }, []);

  return (<>
    <AppLoader loading={props.loading && props.location.pathname === "/"} />
    <Switch>
      <Route path="/login" component={Login} />
      <Route path="/register" component={Register} />
      <Route path="/" component={App} />
    </Switch></>)
}

const mapStateToProps = (state) => {
  return {
    currentUser: state.user.currentUser,
    loading: state.channel.loading
  }
}

const mapDispatchToProps = (dispatch) => {
  return {
    setUser: (user) => { dispatch(setUser(user)) }
  }
}

const IndexWithRouter = withRouter(connect(mapStateToProps, mapDispatchToProps)(Index));

ReactDOM.render(
  <React.StrictMode>
    <Provider store={store}>
      <Router>
        <IndexWithRouter />
      </Router>
    </Provider>
  </React.StrictMode>,
  document.getElementById('root')
);

// If you want your app to work offline and load faster, you can change
// unregister() to register() below. Note this comes with some pitfalls.
// Learn more about service workers: https://bit.ly/CRA-PWA
serviceWorker.unregister();
