const User = require('../models/user.model');
const { StatusCodes } = require('http-status-codes');
const CustomError = require('../../utils/errors');
const { attachCookiesToResponse } = require('../../utils/jwt');

const register = async (req, res) => {
	const { email, name, password } = req.body;

	const emailAlreadyExists = await User.findOne({ email });
	if (emailAlreadyExists) {
		throw new CustomError.BadRequestError('Email already exists');
	}

	const user = await User.create({ name, email, password });

	const tokenUser = { name: user.name, userId: user._id, role: user.role };
	attachCookiesToResponse({ res, user: tokenUser });

	res.status(StatusCodes.CREATED).json({ user: tokenUser });
};

const login = async (req, res) => {
	res.send('login user');
};

const logout = async (req, res) => {
	res.send('logout user');
};

module.exports = {
	register,
	login,
	logout,
};
