const express = require('express');
const router = express.Router();
const {
	authenticateUser,
} = require('../core/middlewares/authentication.middleware');

const {
	createReview,
	getAllReviewes,
	getSingleReview,
	updateReview,
	deleteReview,
} = require('../controllers/review.controller');

router.route('/').post(authenticateUser, createReview).get(getAllReviewes);

router
	.route('/:id')
	.get(getSingleReview)
	.patch(authenticateUser, updateReview)
	.delete(authenticateUser, deleteReview);

module.exports = router;
