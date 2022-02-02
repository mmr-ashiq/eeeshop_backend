const express = require('express');
const router = express.Router();
const {
	authenticateUser,
} = require('../core/middlewares/authentication.middleware');

const {
	getAllUsers,
	getSingleUser,
	showCurrentUser,
	updateUser,
	updateUserPassword,
} = require('../controllers/user.controller');

router.route('/').get(authenticateUser, getAllUsers);
router.route('/showMe').get(showCurrentUser);
router.route('/updateUser').patch(updateUser);
router.route('/updateUserPassword').patch(updateUserPassword);
router.route('/:id').get(authenticateUser, getSingleUser);

module.exports = router;
