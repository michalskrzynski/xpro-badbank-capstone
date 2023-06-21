const express = require('express');
const router = express.Router();

const {auth} = require ('../impl/auth-impl');
const usersAll = require('../controllers/users-all');
const usersCreate = require('../controllers/users-create');
const usersLogin = require('../controllers/users-login');
const usersRefresh = require('../controllers/users-refresh');
const usersLogout = require('../controllers/users-logout');
const transactionsDeposit = require('../controllers/transactions-deposit');
const transactionsWithdraw = require('../controllers/transactions-withdraw');
const transactionsWireTransfer = require('../controllers/transactions-wire-transfer');
const transactions = require('../controllers/transactions')



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
 * /api/v1/users:
 *   get:
 *     summary: Retrieve all users
 *     description: Returns a list of all users.
 *     security:
 *       - []
 *     responses:
 *       200:
 *         description: Successful response
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 type: object
 */
router.get('/users', usersAll);



/**
 * @swagger
 * /api/v1/users/login:
 *   post:
 *     summary: Performs user login.
 *     description: Logs in the user and yields access and Refresh token.
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               email:
 *                 type: string
 *               password:
 *                 type: string
 *     responses:
 *       200:
 *         description: Successfully logged in.
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 token:
 *                   type: string
 *                 RefreshToken:
 *                   type: string
 *       403:
 *         description: Invalid username or password, or user not yet validated.
 *       500:
 *         description: Internal server error.
 */
router.post('/users/login', usersLogin );



/**
 * @swagger
 * /api/v1/users/refresh:
 *   post:
 *     summary: Refresh JWT token
 *     description: Refreshes a JWT token and returns new access and Refresh tokens. Can be considered as other kind of login.
 *     produces:
 *       - application/json
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               RefreshToken:
 *                 type: string
 *     responses:
 *       200:
 *         description: Successfully refreshed token.
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 token:
 *                   type: string
 *                 RefreshToken:
 *                   type: string
 *       401:
 *         description: Unauthorized. Invalid or expired refresh token.
 *       500:
 *         description: Internal server error.
 */
router.post('/users/refresh', usersRefresh );


/**
 * @swagger
 * /api/v1/users/logout:
 *   post:
 *     summary: Log out an authenticated user.
 *     description: Logs out the currently authenticated user and invalidates the session.
 *     responses:
 *       200:
 *         description: OK
 *         content: 
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message: 
 *                   type: string
 *                   example: ok
 */
router.post('/users/logout', authenticate, usersLogout );




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
 *       200:
 *         description: User created successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                 user:
 *                   type: object
 *                   description: A newly created user object.
 *                 error: 
 *                   type: string
 *                   description: Positive error, like "User already exists"
 *       500:
 *         description: Other error, like internal server error
 */
router.post('/users/create', usersCreate);


/**
 * @swagger
 * securityDefinitions:
 *   bearerAuth:
 *     type: apiKey
 *     name: Authorization
 *     in: header
 *     description: Bearer token for user authorization
 * paths:
 *   /api/v1/transactions/deposit:
 *     post:
 *       security:
 *         - bearerAuth: []
 *       tags:
 *         - Transactions
 *       summary: Deposits money into the user's account
 *       description: This API endpoint allows users to deposit money into their account.
 *       consumes:
 *         - application/json
 *       produces:
 *         - application/json
 *       requestBody:
 *         required: true
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 amount:
 *                   type: number
 *                   description: Amount to be deposited in cents.
 *       responses:
 *         '200':
 *           description: Successful deposit
 *           content:
 *             application/json:
 *               schema:
 *                 type: object
 *                 properties:
 *                   message:
 *                     type: string
 *                     description: Success message
 *                   deposited:
 *                     type: number
 *                     description: Amount deposited in cents
 *                   user:
 *                     type: object
 *                     description: User object after the deposit.
 *                   transaction:
 *                     type: object
 *                     description: Transaction object of the transaction made.
 *         '401':
 *           description: Unauthorized - Invalid or missing token
 *           content:
 *             application/json:
 *               schema:
 *                 type: object
 *                 properties:
 *                   error:
 *                     type: string
 *                     description: Error message
 */
router.post('/transactions/deposit', authenticate, amountParam, transactionsDeposit );


/**
 * @swagger
 * paths:
 *   /api/v1/transactions/withdraw:
 *     post:
 *       security:
 *         - bearerAuth: []
 *       tags:
 *         - Transactions
 *       summary: Withdraws money from the user's account
 *       description: This API endpoint allows users to withdraw money from their account.
 *       consumes:
 *         - application/json
 *       produces:
 *         - application/json
 *       requestBody:
 *         required: true
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 amount:
 *                   type: number
 *                   description: Amount to be withdrawn in cents.
 *       responses:
 *         200:
 *           description: Successful withdraw
 *           content:
 *             application/json:
 *               schema:
 *                 type: object
 *                 properties:
 *                   message:
 *                     type: string
 *                     description: Success message
 *                   error:
 *                     type: string
 *                     description: Positive error, like Insufficient funds
 *                   withdrawn:
 *                     type: number
 *                     description: Amount withdrawn in cents
 *                   user:
 *                     type: object
 *                     description: User object after the withdraw.
 *                   transaction:
 *                     type: object
 *                     description: Transaction object if the transaction was successful.
 *         401:
 *           description: Unauthorized - Invalid or missing token
 *           content:
 *             application/json:
 *               schema:
 *                 type: object
 *                 properties:
 *                   error:
 *                     type: string
 *                     description: Error message
 */
router.post('/transactions/withdraw', authenticate, amountParam, transactionsWithdraw );



/**
 * @swagger
 * paths:
 *   /api/v1/transactions/wire-transfer:
 *     post:
 *       security:
 *         - bearerAuth: []
 *       tags:
 *         - Transactions
 *       summary: Transfers money from authenticated user's account to one pointed by BBAN.
 *       description: With this method user authenticated user can wire money to another.
 *       consumes:
 *         - application/json
 *       requestBody:
 *         required: true
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 amount:
 *                   type: number
 *                   description: Amount to be sent in cents.
 *                 receiverAccount:
 *                   type: string
 *                   description: Account number in format 1234-5678-9012-3456
 *                 receiver:
 *                   type: string
 *                   description: Arbitrary receiver name, doesn't have to match the account owner name.
 *                 description:
 *                   type: string
 *                   description: Arbitrary description.
 *                 
 *       responses:
 *         '200':
 *           description: Successfully made transfer
 *           content:
 *             application/json:
 *               schema:
 *                 type: object
 *                 properties:
 *                   message:
 *                     type: string
 *                     description: Success message
 *                   error:
 *                     type: string
 *                     description: Positive error, like - Insufficient funds
 *                   transferred:
 *                     type: number
 *                     description: Amount transferred in cents.
 *                   user:
 *                     type: object
 *                     description: User object after the transfer.
 *                   transaction:
 *                     type: object
 *                     description: Transaction object if the transaction was successful.
 *         '401':
 *           description: Unauthorized - Invalid or missing token
 *           content:
 *             application/json:
 *               schema:
 *                 type: object
 *                 properties:
 *                   error:
 *                     type: string
 *                     description: Error message
 */
router.post('/transactions/wire-transfer', authenticate, amountParam, transactionsWireTransfer );



/**
 * @swagger
 * /api/v1/transactions:
 *   post:
 *     summary: Retrieve all user's transactions.
 *     description: Returns the entire transaction history of the authenticated user.
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       '200':
 *         description: Successful response
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 type: object
 *       '401':
 *         description: Unauthorized - Invalid or missing token
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 error:
 *                   type: string
 *                   description: Error message
 */
router.post('/transactions', authenticate, transactions);

module.exports = router;
