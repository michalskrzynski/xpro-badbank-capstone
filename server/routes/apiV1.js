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



//
// MIDDLEWARE
//

/**
 * Preparing JWT middleware for requests authentication.
 */
const authenticate = auth.authenticate('jwt', {session: false});


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




/**
 * @swagger
 * /api/users:
 *   get:
 *     summary: Retrieve all users
 *     description: Returns a list of all users.
 *     responses:
 *       200:
 *         description: Successful response
 */
router.get('/users', usersAll);
router.post('/users/refresh', usersRefresh );
router.post('/users/login', usersLogin );
router.post('/users/logout', usersLogout );


/** 
 * @swagger
 * /api/v1/users/create:
 *   post:
 *     summary: Create a new user
 *     description: Creates a new user with the provided name, email, and password.
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               name:
 *                 type: string
 *               email:
 *                 type: string
 *               password:
 *                 type: string
 *     responses:
 *       201:
 *         description: User created successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                 data:
 *                   type: object
 *                   properties:
 *                     _id: string
 *                     name: string
 *                     email: string
 *                     account_number: string
 *                     created_at: 
 *                       type: string
 *                       format: date-time
 *       409:
 *         description: User already exists
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *       500:
 *         description: Other error, like internal server error
 */
router.post('/users/create', usersCreate);
router.post('/users/logout', authenticate, usersLogout );
router.post('/users/deposit', authenticate, amountParam, usersDeposit );
router.post('/users/withdraw', authenticate, amountParam, usersWithdraw );


module.exports = router;
