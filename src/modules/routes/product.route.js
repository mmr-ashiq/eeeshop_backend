const express = require('express');
const router = express.Router();

const {
	authenticateUser,
	authorizePermissions,
} = require('../core/middlewares/authentication.middleware');

const {
	createProduct,
	getAllProducts,
	getSingleProduct,
	updateProduct,
	deleteProduct,
	uploadProductImage,
} = require('../controllers/product.controller');

const { getSingleProductReviews } = require('../controllers/review.controller');

router
	.route('/')
	.post([authenticateUser, authorizePermissions('admin')], createProduct)
	.get(getAllProducts);

router
	.route('/uploadProductImage')
	.post(
		[authenticateUser, authorizePermissions('admin')],
		uploadProductImage
	);

router
	.route('/:id')
	.get(getSingleProduct)
	.patch([authenticateUser, authorizePermissions('admin')], updateProduct)
	.delete([authenticateUser, authorizePermissions('admin')], deleteProduct);

router.route('/:id/reviews').get(getSingleProductReviews);

module.exports = router;
