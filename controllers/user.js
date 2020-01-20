const User = require('../models/User');

exports.read = (req, res) => {
  const userId = req.params.id;
  User.findById(userId).exec((err, user) => {
    if (err || !user) {
      return res.status(400).json({ error: 'User not found' });
    }
    const { role, _id, name, email } = user;
    res.json({ role, _id, name, email });
  });
};

exports.update = (req, res) => {
  // console.log('Update user req', req.user, 'update user', res.body)
  const { name, password } = req.body;
  User.findOne({ _id: req.user._id }, (err, user) => {
    if (err || !user) return res.status(400).json({ error: 'User not found' });
    if (!name) {
      return res.status(400).json({ error: 'Name is required' });
    } else {
      user.name = name;
    }

    if (password) {
      if (password.length < 6) {
        return res.status(400).json({
          error: 'Password should have more than 6 characters'
        });
      } else {
        user.password = password;
      }
    }
    user.save((err, updatedUser) => {
      console.log('USER UPDATE ERROR', err);
      if (err) res.status(400).json({ error: 'Fail to update the user' });
      const { role, _id, name, email } = updatedUser;
      res.json({ role, _id, name, email });
    });
  });
};
