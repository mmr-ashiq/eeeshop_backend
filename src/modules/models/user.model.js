const mongoose = require('mongoose');
const validator = require('validator');
const bcrypt = require('bcryptjs');

const UserSchema = new mongoose.Schema({
	name: {
		type: String,
		required: [true, 'Name is required'],
		minlength: [3, 'Name must be at least 3 characters long'],
		maxlength: [50, 'Name must be less than 50 characters long'],
	},
	email: {
		type: String,
		unique: true,
		required: [true, 'Email is required'],
		validate: {
			validator: validator.isEmail,
			message: 'Please enter a valid email',
		},
	},
	password: {
		type: String,
		required: [true, 'Password is required'],
		minlength: [6, 'Password must be at least 6 characters long'],
		maxlength: [50, 'Password must be less than 50 characters long'],
	},
	role: {
		type: String,
		enum: ['user', 'admin'],
		default: 'user',
	},
	createdAt: {
		type: Date,
		default: Date.now,
	},
});

UserSchema.pre('save', async function () {
	if (!this.isModified('password')) return;
	const salt = await bcrypt.genSalt(10);
	this.password = await bcrypt.hash(this.password, salt);
});

UserSchema.methods.comparePassword = async function (candidatePassword) {
	const isMatch = await bcrypt.compare(candidatePassword, this.password);
	return isMatch;
};

module.exports = mongoose.model('User', UserSchema);
