import React, { Fragment, useEffect } from 'react';
import {BrowserRouter as Router, Route, Switch} from 'react-router-dom';
import { Provider } from 'react-redux';
import Navbar from './components/layouts/Navbar';
import Landing from './components/layouts/Landing';
import Login from './components/auth/Login';
import Register from './components/auth/Register';
import Alert from './components/layouts/Alert';
import './App.css';
//Redux
import store from './store';
import setAuthToken from './utils/setAuthToken';
import {loadUser} from './actions/auth'

if(localStorage.token){
  setAuthToken(localStorage.token);
}
const  App = ()=>{
  useEffect(()=>{
    store.dispatch(loadUser());
  }, []);//run once hence passed [] as 2nd arg.

  return (
    <Provider store= { store }>
          <Router>
      <Fragment>
        <Navbar/>
        <Route exact path="/" component= { Landing } />
        <section className="container">{/** for register and login page */}
          <Alert/>
          <Switch>
            <Route exact path="/register" component={Register}/>
            <Route exact path="/login" component={Login}/>
          </Switch>
        </section>
      </Fragment>   
    </Router>
    </Provider>


  )
}

export default App;