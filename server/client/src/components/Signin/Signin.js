import React, { useState } from 'react';
import { Link, Redirect } from 'react-router-dom';
import axios from 'axios';
import { authenticate, isAuth } from '../../utils/helpers';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.min.css';

const Signin = () => {
  const [values, setValues] = useState({
    email: '',
    password: '',
    buttonText: 'Log In'
  });

  const { email, password, buttonText } = values;

  const handleChange = event => {
    setValues({ ...values, [event.target.name]: event.target.value });
  };

  const clickSubmit = event => {
    event.preventDefault();
    setValues({ ...values, buttonText: 'Logging In' });
    axios({
      method: 'POST',
      url: `${process.env.REACT_APP_API}/signin`,
      data: { email, password }
    })
      .then(response => {
        console.log('SIGNIN SUCCESS', response);
        //Save the user in the localstorage and token in cookie
        authenticate(response, () => {
          setValues({
            ...values,
            email: '',
            password: '',
            buttonText: 'Submitted'
          });
          toast.success(`Hey ${response.data.user.name}. Welcome back!`);
        });
      })
      .catch(error => {
        console.log('SIGNIN ERROR', error.response.data);
        setValues({ ...values, buttonText: 'Log in' });
        toast.error(error.response.data.error);
      });
  };

  const signupForm = () => (
    <form>
      <div className="form-group">
        <label className="text-muted">Email</label>
        <input
          onChange={handleChange}
          name="email"
          value={email}
          type="email"
          className="form-control"
        />
      </div>

      <div className="form-group">
        <label className="text-muted">Password</label>
        <input
          onChange={handleChange}
          name="password"
          value={password}
          type="password"
          className="form-control"
        />
      </div>

      <div>
        <p>
          Don't remember your password?
          <Link to="/auth/password/forgot">&nbsp;Click here!</Link>
        </p>
        <button className="btn btn-primary float-right" onClick={clickSubmit}>
          {buttonText}
        </button>
      </div>
    </form>
  );

  return (
    <div className="container w-50">
      <ToastContainer />
      {isAuth() ? <Redirect to="/" /> : null}
      <h1 className="p-3 text-center">Log in</h1>
      {signupForm()}
    </div>
  );
};

export default Signin;
