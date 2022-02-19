const mongoose = require('mongoose');

const ReviewSchema = mongoose.Schema(
	{
		rating: {
			type: Number,
			min: 1,
			max: 5,
			required: [true, 'Rating is required'],
		},
		title: {
			type: String,
			trim: true,
			required: [true, 'Review title is required'],
			maxlength: [100, 'Review title must be less than 50 characters'],
		},
		comment: {
			type: String,
			required: [true, 'Review comment is required'],
			maxlength: [500, 'Review comment must be less than 500 characters'],
		},
		user: {
			type: mongoose.Schema.ObjectId,
			ref: 'User',
			required: [true, 'Review must belong to a user'],
		},
		product: {
			type: mongoose.Schema.ObjectId,
			ref: 'Product',
			required: true,
		},
	},
	{ timestamps: true }
);

ReviewSchema.index({ product: 1, user: 1 }, { unique: true });

module.exports = mongoose.model('Review', ReviewSchema);
