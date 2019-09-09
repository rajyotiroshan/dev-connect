import React, { Fragment } from 'react';
import { Link } from 'react-router-dom';
import { connect } from 'react-redux';
import PropTypes from 'prop-types';
import { logout } from '../../actions/auth';

const Navbar = ({ logout, auth: { isAuthenticated, loading } }) => {
  const authLinks = (
    <ul>
      <li>
        {' '}
        <Link to='/profiles'>
          <i className='fa fa-user'>
            <span className='hide-sm'>Developers</span>
          </i>
        </Link>
      </li>
      <li>
        {' '}
        <Link to='/posts'>
          <i className='fa fa-user'>
            <span className='hide-sm'>Posts</span>
          </i>
        </Link>
      </li>
      <li>
        {' '}
        <Link to='/dashboard'>
          <i className='fa fa-user'>
            <span className='hide-sm'>Dashboard</span>
          </i>
        </Link>
      </li>
      <li>
        <a onClick={logout} href='#!'>
          <i className=' fas fa-sign-out-alt'>
            {' '}
            <span className='hide-sm'>Logout</span>
          </i>
        </a>
      </li>
    </ul>
  );

  const guestLinks = (
    <ul>
      <li>
        {' '}
        <Link to='/profiles'>
          <i className='fa fa-user'>
            <span className='hide-sm'>Developers</span>
          </i>
        </Link>
      </li>
      <li>
        <Link to='/register'>Register</Link>
      </li>
      <li>
        <Link to='/login'>Login</Link>
      </li>
    </ul>
  );
  return (
    <nav className='navbar bg-dark'>
      <h1>
        <Link to='/'>
          <i className='fas fa-code'></i> DevConnector
        </Link>
      </h1>
      {!loading && (
        <Fragment>{isAuthenticated ? authLinks : guestLinks}</Fragment>
      )}
    </nav>
  );
};

//required prop types for Navbar
Navbar.propTypes = {
  logout: PropTypes.func.isRequired,
  auth: PropTypes.object
};

//access store and pass it to Navbar as props.
const mapStateToProps = state => ({
  auth: state.auth
});

//connect to store
export default connect(
  mapStateToProps,
  { logout }
)(Navbar);
