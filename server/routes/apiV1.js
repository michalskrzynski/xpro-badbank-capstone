const express = require('express');
const router = express.Router();

const auth = require ('../impl/auth-impl');
const usersCreate = require('../controllers/users-create');
const usersLogin = require('../controllers/users-login');
const usersDeposit = require('../controllers/users-deposit');
const usersWithdraw = require('../controllers/users-withdraw');

router.post('/users/login', usersLogin );
router.post('/users/create', usersCreate);

/**
 * Preparing JWT middleware for requests authentication.
 */
const authenticate = auth.authenticate('jwt', {session: false});
/**
 * And from now on authenticated routes
 */


/**
 * Middleware checking the amount param.
 */
function amountParam( req, res, next ) {
  const amount = Number(req.body.amount);

  if( isNaN( amount ) ) return res.status(410).send("'amount' parameter is NaN error.");

  req.amount = amount;
  next();
} 

router.post('/users/deposit', authenticate, amountParam, usersDeposit );
router.post('/users/withdraw', authenticate, amountParam, usersWithdraw );


module.exports = router;
