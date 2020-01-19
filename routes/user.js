const express = require('express');
const router = express.Router();

//Controllers
const { read, update } = require('../controllers/user');
const { requireSignin, adminMiddleware } = require('../controllers/auth');

router.get('/user/:id', requireSignin, read);
router.put('/user/update', requireSignin, update);
router.put('/admin/update', requireSignin, adminMiddleware, update);

module.exports = router;
