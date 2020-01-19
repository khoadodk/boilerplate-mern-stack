import React, { useState } from 'react';
import { Redirect } from 'react-router-dom';
import axios from 'axios';
import { isAuth } from '../../utils/helpers';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.min.css';

const ForgotPage = () => {
  const [values, setValues] = useState({
    email: '',
    buttonText: 'Submit'
  });

  const { email, buttonText } = values;

  const handleChange = event => {
    setValues({ ...values, [event.target.name]: event.target.value });
  };

  const clickSubmit = event => {
    event.preventDefault();
    setValues({ ...values, buttonText: 'Submitting' });
    axios({
      method: 'PUT',
      url: `${process.env.REACT_APP_API}/forgot-password`,
      data: { email }
    })
      .then(response => {
        toast.success(response.data.message);
        setValues({ ...values, buttonText: 'Submitted' });
      })
      .catch(error => {
        toast.error(error.response.data.error);
        setValues({ ...values, buttonText: 'Submit' });
      });
  };

  const forgotPasswordForm = () => (
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
      <div>
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
      <h1 className="p-3 text-center">Forgot Password</h1>
      {forgotPasswordForm()}
    </div>
  );
};

export default ForgotPage;
