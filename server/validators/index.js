const { validationResult } = require('express-validator');
//https://express-validator.github.io/docs/validation-chain-api.html

exports.runValidation = (req, res, next) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(422).json({
      error: errors.array()[0].msg
    });
  }
  next();
};
