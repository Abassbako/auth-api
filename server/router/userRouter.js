const { Router } = require('express');

const { registerUser } = require('../controller/userController')

const router = Router();

router.post('/register', registerUser);

module.exports = router;