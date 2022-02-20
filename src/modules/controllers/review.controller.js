const Review = require('../models/review.model');
const Product = require('../models/product.model');

const { StatusCodes } = require('http-status-codes');
const CustomError = require('../../utils/errors');
const checkPermissions = require('../../utils/checkPermissions');

const createReview = async (req, res) => {
	const { product: productId } = req.body;

	const isValidProduct = await Product.findOne({ _id: productId });
	if (!isValidProduct)
		throw new CustomError.NotFoundError('Product not found');

	const alreadySubmittedReview = await Review.findOne({
		product: productId,
		user: req.user.userId,
	});
	if (alreadySubmittedReview) {
		throw new CustomError.BadRequestError(
			'You have already submitted a review'
		);
	}

	req.body.user = req.user.userId;

	const review = await Review.create(req.body);

	res.status(StatusCodes.CREATED).json({ review });
};

const getAllReviewes = async (req, res) => {
	const reviews = await Review.find({});

	res.status(StatusCodes.OK).json({ reviews, count: reviews.length });
};

const getSingleReview = async (req, res) => {
	const { id: reviewId } = req.params;

	const review = await Review.findOne({ _id: reviewId });

	if (!review) throw new CustomError.NotFoundError('review not found');

	res.status(StatusCodes.OK).json({ review });
};

const updateReview = async (req, res) => {
	const { id: reviewId } = req.params;
	const { rating, title, comment } = req.body;

	const review = await Review.findOne({ _id: reviewId });
	if (!review) throw new CustomError.NotFoundError('review not found');

	checkPermissions(req.user, review.user);

	if (rating) review.rating = rating;
	if (title) review.title = title;
	if (comment) review.comment = comment;

	await review.save();

	res.status(StatusCodes.OK).json({ review });
};

const deleteReview = async (req, res) => {
	const { id: reviewId } = req.params;

	const review = await Review.findOne({ _id: reviewId });
	if (!review) throw new CustomError.NotFoundError('review not found');

	checkPermissions(req.user, review.user);

	await review.remove();

	res.status(StatusCodes.OK).json({ msg: 'Review removed' });
};

const getSingleProductReviews = async (req, res) => {
	const { id: productId } = req.params;

	const reviews = await Review.find({ product: productId });

	res.status(StatusCodes.OK).json({ reviews, count: reviews.length });
};

module.exports = {
	createReview,
	getAllReviewes,
	getSingleReview,
	updateReview,
	deleteReview,
	getSingleProductReviews,
};
