const User = require('../models/user');
const jwt = require('jsonwebtoken');
const expressJwt = require('express-jwt');
const sgMail = require('@sendgrid/mail');
sgMail.setApiKey(process.env.SENDGRID_API_KEY);

/* SIGN UP
  When they signup, we will send the an email confirmation
contain the signup information encoded in jwt
upon clicking the url, they will be taken to client/app
where we grab that encoded jwt which contains user info to create the account
*/

/* SIGN IN
  check if user is trying to signin but hav not sign up
  check if password match with hash_password that is saved in the db
  if yes, generate token with expiry and sent to the client side
  the token is used to access protected routes
*/

exports.adminMiddleware = (req, res, next) => {
  User.findById({ _id: req.user._id }).exec((err, user) => {
    if (err || !user) {
      return res.status(400).json({
        error: 'User not found'
      });
    }

    if (user.role !== 'admin') {
      return res.status(400).json({
        error: 'Admin resource. Access denied.'
      });
    }
    //set user object in the name of profile
    req.profile = user;
    next();
  });
};

//this middleware'll verify the token and return object as req.user
//We could user req.user._id to find the user
exports.requireSignin = expressJwt({
  secret: process.env.JWT_SECRET
});

exports.signup = (req, res) => {
  const { name, email, password } = req.body;
  // 1.Check if user's email already exist in the database
  User.findOne({ email }).exec((err, user) => {
    if (user) {
      return res.status(400).json({ err: 'The email is already taken' });
    }
  });

  // 2. Generate an signup email with encoded token url
  const token = jwt.sign(
    { name, email, password },
    process.env.JWT_ACCOUNT_ACTIVATION,
    { expiresIn: '10m' }
  );
  const emailData = {
    from: process.env.EMAIL_FROM,
    to: email,
    subject: `Account activation link`,
    html: `
        <h4>Please use the following link to activate your account:</h4>
        <p>${process.env.CLIENT_URL}/auth/activate/${token}</p>
        <hr />
        <p>This email may contain sensitive information</p>
    `
  };
  // 3. Using SendGrid to send the sign up email
  sgMail
    .send(emailData)
    .then(() => {
      return res.json({
        message: `An email has been sent to ${email}. Follow the instruction to activate your account`
      });
    })
    .catch(err => {
      return res.json({ message: err.message });
    });
};

exports.accountActivation = (req, res) => {
  const { token } = req.body;
  // 1.Check if token is available
  if (token) {
    jwt.verify(token, process.env.JWT_ACCOUNT_ACTIVATION, (err, decoded) => {
      if (err) {
        console.log('jwt verify account activation error', err);
        res.status(401).json({ error: 'Expired link. Please sign up again' });
      }
      // 2. Decode the user's name email password and save them to database
      const { name, email, password } = jwt.decode(token);
      const user = new User({ name, email, password });
      user.save((err, user) => {
        if (err) {
          console.log('Save user in account activation error', err);
          return res.status(401).json({
            error: 'Error saving user into the database. Please sign up again'
          });
        }
        return res.json({ message: 'Sign up success!' });
      });
    });
  } else {
    return res.json({ message: 'Token is not found' });
  }
};

exports.signin = (req, res) => {
  const { email, password } = req.body;
  User.findOne({ email }).exec((err, user) => {
    if (err || !user)
      return res.status(400).json({ error: 'Email does not exist' });
    //authenticate in the User schema
    if (!user.authenticate(password))
      return res.status(400).json({ error: 'Email/Password do not match' });

    // Generate token send to client note: the _id is from mongoDB
    const token = jwt.sign({ _id: user._id }, process.env.JWT_SECRET, {
      expiresIn: '7d'
    });
    const { _id, name, email, role } = user;
    return res.json({ token, user: { _id, name, email, role } });
  });
};
