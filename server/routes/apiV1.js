const express = require('express');
const router = express.Router();

const auth = require ('../impl/auth-impl');
const usersCreate = require('../controllers/users-create');
const usersLogin = require('../controllers/users-login');


router.post('/users/login', usersLogin );
router.post('/users/create', usersCreate);

/**
 * Preparing JWT middleware for requests authentication.
 */
const authenticate = auth.authenticate('jwt', {session: false});
/**
 * And from now on authenticated routes
 */


router.post('/users/:id/deposit', authenticate, (req,res) => {

  const resData = { ...req.body, balance: "999.99"}

  res.send({ message: "ok", data: resData });
})

router.post('/users/:id/withdraw', authenticate, (req, res) => {
  res.send({ message: "ok", data: req.body });
})


module.exports = router;
