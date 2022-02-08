const User = require('../models/user.model');
const { StatusCodes } = require('http-status-codes');
const CustomError = require('../../utils/errors');
const createTokenForUser = require('../../utils/createTokenForUser');
const { attachCookiesToResponse } = require('../../utils/jwt');

const getAllUsers = async (req, res) => {
	const users = await User.find({ role: 'user' }).select('-password');
	res.status(StatusCodes.OK).json(users);
};

const getSingleUser = async (req, res) => {
	const user = await User.findOne({ _id: req.params.id }).select('-password');

	if (!user) throw new CustomError.NotFoundError();

	res.status(StatusCodes.OK).json({ user });
};

const showCurrentUser = async (req, res) => {
	res.status(StatusCodes.OK).json({ user: req.user });
};

const updateUser = async (req, res) => {
	const { email, name } = req.body;
	if (!email || !name) {
		throw new CustomError.BadRequestError(
			'provide email and name to update user'
		);
	}

	const user = await User.findOneAndUpdate(
		{ _id: req.user.userId },
		{ email, name },
		{ new: true, runValidators: true }
	);

	const tokenUser = createTokenForUser(user);
	attachCookiesToResponse({ res, user: tokenUser });
	res.status(StatusCodes.OK).json({ user: tokenUser });
};

const updateUserPassword = async (req, res) => {
	const { oldPassword, newPassword } = req.body;
	if (!oldPassword || !newPassword) {
		throw new CustomError.BadRequestError(
			'provide old and new password both to change password'
		);
	}
	const user = await User.findOne({ _id: req.user.userId });

	const isPasswordValid = await user.comparePassword(oldPassword);
	if (!isPasswordValid) {
		throw new CustomError.UnauthenticatedError('Invalid Credentials');
	}

	user.password = newPassword;

	await user.save();
	res.status(StatusCodes.OK).json({
		message: 'Password changed successfully',
	});
};

module.exports = {
	getAllUsers,
	getSingleUser,
	showCurrentUser,
	updateUser,
	updateUserPassword,
};
