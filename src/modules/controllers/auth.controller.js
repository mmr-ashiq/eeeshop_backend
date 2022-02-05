const User = require('../models/user.model');
const { StatusCodes } = require('http-status-codes');
const CustomError = require('../../utils/errors');
const { attachCookiesToResponse } = require('../../utils/jwt');
const createTokenForUser = require('../../utils/createTokenForUser');

const register = async (req, res) => {
	const { email, name, password } = req.body;

	const emailAlreadyExists = await User.findOne({ email });
	if (emailAlreadyExists) {
		throw new CustomError.BadRequestError('Email already exists');
	}

	const user = await User.create({ name, email, password });

	const tokenUser = createTokenForUser(user);
	attachCookiesToResponse({ res, user: tokenUser });

	res.status(StatusCodes.CREATED).json({ user: tokenUser });
};

const login = async (req, res) => {
	const { email, password } = req.body;

	if (!email || !password) {
		throw new CustomError.BadRequestError(
			'Email and password are required'
		);
	}

	const user = await User.findOne({ email });
	if (!user) {
		throw new CustomError.UnauthorizedError('Invalid Credentials');
	}

	const isPasswordValid = await user.comparePassword(password);
	if (!isPasswordValid) {
		throw new CustomError.UnauthorizedError('Invalid Credentials');
	}

	const tokenUser = createTokenForUser(user);
	attachCookiesToResponse({ res, user: tokenUser });

	res.status(StatusCodes.OK).json({ user: tokenUser });
};

const logout = async (req, res) => {
	res.cookie('token', 'signout', {
		httpOnly: true,
		expires: new Date(Date.now()),
	});

	res.status(StatusCodes.OK).json({ message: 'Logged out successfully' });
};

module.exports = {
	register,
	login,
	logout,
};
