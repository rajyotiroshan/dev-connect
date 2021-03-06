import React, { Fragment, useState } from 'react';
import { Link, Redirect } from 'react-router-dom';
import {connect} from 'react-redux';
import {login} from '../../actions/auth';
import PropTypes from 'prop-types';

//import axios from 'axios';
const Login = ({ login, isAuthenticated }) => {
  
  const [formData, setFormData] = useState({
    email: '',
    password: ''
  });

  const {email, password} = formData;

  //in login input change.
  const onChange = e => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  //callback for login form submit
  const onSubmit = async e => {
    e.preventDefault();
    //call login action creator.
    login(email, password);
  };

  //redirect if logged in
  if(isAuthenticated) {
    return <Redirect to="/dashboard" />;
  }
  return (
    <Fragment>
      <section className='container'>
        <h1 className='large text-primary'>Sign In</h1>
        <p className='lead'>
          <i className='fas fa-user'></i> Sign into Your Account
        </p>
        <form className='form' onSubmit= {(e)=> onSubmit(e)}>
          <div className='form-group'>
            <input
              type='email'
              placeholder='Email Address'
              name='email'
              value={email}
              onChange={(e)=>onChange(e)}
              required
            />
          </div>
          <div className='form-group'>
            <input type='password' placeholder='Password' name='password' value={password} onChange={(e)=>onChange(e)} />
          </div>
          <input type='submit' className='btn btn-primary' value='Login' />
        </form>
        <p className='my-1'>
          Don't have an account? <Link to='/register'>Sign Up</Link>
        </p>
      </section>
    </Fragment>
  );
};

Login.propTypes = {
  login: PropTypes.func.isRequired,
  isAuthenticated: PropTypes.bool
}

//pass auth.isAuthenticated as props to the Login component.
const mapStateToProps = state => ({
  isAuthenticated: state.auth.isAuthenticated
})
//connect with redux store.
export default connect(mapStateToProps, { login })(Login);
