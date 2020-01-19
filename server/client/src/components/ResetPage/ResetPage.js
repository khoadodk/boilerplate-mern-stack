import React, { useState, useEffect } from 'react';
import jwt from 'jsonwebtoken';
import axios from 'axios';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.min.css';

const ResetPage = ({ match }) => {
  const [values, setValues] = useState({
    name: '',
    token: '',
    newPassword: '',
    buttonText: 'Log In'
  });

  useEffect(() => {
    let token = match.params.token;
    let { name } = jwt.decode(token);
    if (token) {
      setValues({ ...values, name, token });
    }
  }, []);

  const { name, token, newPassword, buttonText } = values;

  const handleChange = event => {
    setValues({ ...values, newPassword: event.target.value });
  };

  const clickSubmit = event => {
    event.preventDefault();
    setValues({ ...values, buttonText: 'Submitting' });
    axios({
      method: 'PUT',
      url: `${process.env.REACT_APP_API}/reset-password`,
      data: { newPassword, resetPasswordLink: token }
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

  const passwordResetForm = () => (
    <form>
      <div className="form-group">
        <label className="text-muted">New Password</label>
        <input
          onChange={handleChange}
          name="password"
          value={newPassword}
          type="password"
          className="form-control"
          required
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
      <div className="p-3 text-center">
        <h2 className="pb-2">Welcome back! {name}.</h2>
        <span>Reset Your Password</span>
      </div>

      {passwordResetForm()}
    </div>
  );
};

export default ResetPage;
