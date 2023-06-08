const express = require('express');
const router = express.Router();

const {auth} = require ('../impl/auth-impl');
const usersAll = require('../controllers/users-all');
const usersCreate = require('../controllers/users-create');
const usersLogin = require('../controllers/users-login');
const usersRefresh = require('../controllers/users-refresh');
const usersLogout = require('../controllers/users-logout');
const usersDeposit = require('../controllers/users-deposit');
const usersWithdraw = require('../controllers/users-withdraw');

router.get('/users', usersAll);
router.post('/users/refresh', usersRefresh );
router.post('/users/login', usersLogin );
router.post('/users/logout', usersLogout );
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
  console.log("amountParam middleware: " + req.body.amount + " using parseInt");
  const amount = parseInt(req.body.amount);

  if( isNaN( amount ) ) return res.status(410).send("'amount' parameter is NaN error.");

  req.amount = amount;
  console.log("amountParam: " + req.amount);
  next();
} 

router.post('/users/logout', authenticate, usersLogout );
router.post('/users/deposit', authenticate, amountParam, usersDeposit );
router.post('/users/withdraw', authenticate, amountParam, usersWithdraw );


module.exports = router;
