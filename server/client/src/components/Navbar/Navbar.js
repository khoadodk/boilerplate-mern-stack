import React from 'react';
import { Link, withRouter } from 'react-router-dom';

const Navbar = ({ history }) => {
  const isActive = path => {
    if (history.location.pathname === path) {
      return { color: '#000' };
    } else {
      return { color: '#fff' };
    }
  };
  return (
    <nav className="navbar bg-primary justify-content-between">
      <Link className="navbar-brand text-light" to="/">
        MERN BOILERPLATE
        {/* <br />
        {JSON.stringify(match)}
        <br />
        {JSON.stringify(history)} */}
      </Link>
      <ul className="nav na-tabs ">
        <li className="nav-item">
          <Link to="/" className="nav-link" style={isActive('/')}>
            Home
          </Link>
        </li>
        <li className="nav-item">
          <Link to="/signin" className="nav-link" style={isActive('/signin')}>
            Sign In
          </Link>
        </li>
        <li className="nav-item">
          <Link to="/signup" className="nav-link" style={isActive('/signup')}>
            Sign Up
          </Link>
        </li>
      </ul>
    </nav>
  );
};

export default withRouter(Navbar);
