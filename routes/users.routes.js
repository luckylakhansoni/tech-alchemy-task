const router = require('express').Router();

const  {register, signing, news, weather} = require('../controllers/users.controller')

const { isAuthenticate} = require('../middleware/auth') // JWT middleware

router.post('/register',  register);
router.post('/login', signing)
router.get('/weather', weather)

// only those user access this URL who have authenticated from JWT
router.get('/news', isAuthenticate, news)

module.exports = router;
