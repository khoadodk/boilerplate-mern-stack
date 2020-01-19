import React, { useState, useEffect } from 'react';
import axios from 'axios';
import jwt from 'jsonwebtoken';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.min.css';

const Signup = ({ match }) => {
  const [values, setValues] = useState({
    name: '',
    token: '',
    show: true
  });

  useEffect(() => {
    //http://localhost:3000/auth/activate/
    //eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJuYW1lIjoiS2hvYSBEbyIsImVtYWlsIjoia2hvYWRvLmRrQGdtYWlsLmNvbSIsInBhc3N3b3JkIjoibXlmYW1pbHkiLCJpYXQiOjE1NzkyMTM0NzEsImV4cCI6MTU3OTIxNDA3MX0.StEYuMn9FBqePAvowszNSYKL775Ubq1X69pJ_c9hrww
    //Grab the token from the url
    let token = match.params.token;
    //Decode the token and grab the name
    let { name } = jwt.decode(token);
    if (token) setValues({ ...values, name, token });
    // eslint-disable-next-line
  }, []);

  const { name, token } = values;

  const clickSubmit = event => {
    event.preventDefault();
    axios({
      method: 'POST',
      url: `${process.env.REACT_APP_API}/account-activation`,
      data: { token }
    })
      .then(response => {
        // console.log('ACCOUNT ACTIVATION', response);
        setValues({
          ...values,
          show: false
        });
        toast.success(response.data.message);
      })
      .catch(error => {
        // console.log('ACCOUNT ACTIVATION ERROR', error.response.data);
        toast.error(error.response.data.error);
      });
  };

  const activationLink = () => (
    <div className="text-center">
      <h1 className="p-3">Hi {name},</h1>
      <h4> Ready to activate your account!</h4>

      <button className="btn btn-outline-primary mt-3" onClick={clickSubmit}>
        Activate Account
      </button>
    </div>
  );

  return (
    <div className="container w-50">
      <ToastContainer />
      {activationLink()}
    </div>
  );
};

export default Signup;
