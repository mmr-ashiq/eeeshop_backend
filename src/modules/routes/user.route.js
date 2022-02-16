const express = require('express');
const router = express.Router();
const {
	authenticateUser,
	authorizePermissions,
} = require('../core/middlewares/authentication.middleware');

const {
	getAllUsers,
	getSingleUser,
	showCurrentUser,
	updateUser,
	updateUserPassword,
	deleteUser,
} = require('../controllers/user.controller');

router
	.route('/')
	.get(
		authenticateUser,
		authorizePermissions('owner', 'admin', 'user'),
		getAllUsers
	);
router.route('/showMe').get(authenticateUser, showCurrentUser);
router.route('/updateUser').patch(authenticateUser, updateUser);
router.route('/updateUserPassword').patch(authenticateUser, updateUserPassword);
router.route('/:id').get(authenticateUser, getSingleUser);
router.route('/:id').delete(authenticateUser, deleteUser);

module.exports = router;
