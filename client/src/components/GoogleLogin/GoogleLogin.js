import React from 'react';
import GoogleLogin from 'react-google-login';
import axios from 'axios';

// set the informParent default props-type as function
const Google = ({ informParent = func => func }) => {
  //Get the response from Google API (success/failure)
  //Send the idToken to the server for verification
  const responseGoogle = response => {
    // console.log(response);
    axios({
      method: 'POST',
      url: `${process.env.REACT_APP_API}/google-login`,
      data: { idToken: response.tokenId }
    })
      .then(response => {
        // console.log('GOOGLE SIGNIN SUCCESS', response);
        // inform parent component/Signin
        informParent(response);
      })
      .catch(error => {
        // console.log('GOOGLE SIGNIN ERROR', error.response);
      });
  };
  return (
    <div className="pb-3">
      <GoogleLogin
        clientId={`${process.env.REACT_APP_GOOGLE_CLIENT_ID}`}
        onSuccess={responseGoogle}
        onFailure={responseGoogle}
        // render={renderProps => (
        //   <button
        //     onClick={renderProps.onClick}
        //     disabled={renderProps.disabled}
        //     className="btn btn-primary btn-lg btn-block"
        //   >
        //     <i className="fab fa-google pr-2"></i> Login with Google
        //   </button>
        // )}
        cookiePolicy={'single_host_origin'}
      />
    </div>
  );
};

export default Google;
