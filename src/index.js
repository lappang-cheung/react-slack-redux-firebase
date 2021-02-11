// Packages
import React, { useEffect } from 'react'
import ReactDOM from 'react-dom'
import { BrowserRouter as Router, Switch, Route, withRouter } from 'react-router-dom'
import { Provider, connect } from 'react-redux'
import { createStore } from 'redux'

// Custom components
import App from './App'
import Login from './components/Auth/Login/Login'
import Register from './components/Auth/Register/Register'
import firebase from './server/firebase'
import reportWebVitals from './reportWebVitals'

// Redux
import { setUser } from './store/actions/actionCreator'
import { combinedReducers } from './store/reducers/reducers'

// CSS
import 'semantic-ui-css/semantic.min.css'

const store = createStore(combinedReducers)

const Index = (props) => {
  useEffect(() => {
    firebase.auth().onAuthStateChanged(user => {
      if(user) {
        props.setUser(user)
        props.history.push("/")
      } else {
        props.setUser(null)
        props.history.push("/login")
      }
    })
  }, []) 
  
  return (
    <Switch>
      <Route path="/login" component={Login} />
      <Route path="/register" component={Register} />
      <Route path="/" component={App} />
    </Switch>
  )
}

const mapStateToProps = state => {
  return {
    currentUser: state.user.currentUser
  }
}

const mapDispatchToProps = dispatch => {
  return {
    setUser: (user) => {dispatch(setUser(user))}
  }
}

const IndexWithRouter = withRouter(connect(mapStateToProps, mapDispatchToProps)(Index))

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

// If you want to start measuring performance in your app, pass a function
// to log results (for example: reportWebVitals(console.log))
// or send to an analytics endpoint. Learn more: https://bit.ly/CRA-vitals
reportWebVitals();
