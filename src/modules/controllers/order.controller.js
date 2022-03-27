const Product = require('../models/product.model');
const Order = require('../models/order.model');

const { StatusCodes } = require('http-status-codes');
const CustomError = require('../../utils/errors');
const checkPermissions = require('../../utils/checkPermissions');

const futureStripeAPI = async ({ amount, currency }) => {
	const clientSecret = 'someRandomValue';
	return { clientSecret, amount };
};

const createOrder = async (req, res) => {
	const { items: cartItems, tax, shippingFee } = req.body;

	if (!cartItems || cartItems.length < 1) {
		throw new CustomError.BadRequestError('Cart is empty');
	}
	if (!tax || !shippingFee) {
		throw new CustomError.BadRequestError('Tax or shipping fee is missing');
	}

	let orderItems = [];
	let subtotal = 0;

	for (const item of cartItems) {
		const product = await Product.findOne({ _id: item.productId});
		if (!product) {
			throw new CustomError.NotFoundError('Product not found');
		}

		const { name, price, image, _id } = product;
		const SingleOrderItem = {
			amount: item.amount,
			name,
			price,
			image,
			product: _id,
		};

		orderItems = [...orderItems, SingleOrderItem];

		subtotal += item.amount * price;
	}

	const total = subtotal + tax + shippingFee;

	const paymentIntent = await futureStripeAPI({
		amount: total,
		currency: 'USD',
	});

	const order = await Order.create({
		orderItems,
		subtotal,
		tax,
		shippingFee,
		total,
		clientSecret: paymentIntent.clientSecret,
		user: req.user.userId,
	});

	res.status(StatusCodes.CREATED).json({
		order,
		clientSecret: order.clientSecret,
	});
};

const getAllOrders = async (req, res) => {};

const getSingleOrder = async (req, res) => {};

const getCurrentUserOrders = async (req, res) => {};

const updateOrder = async (req, res) => {};

module.exports = {
	getAllOrders,
	getSingleOrder,
	getCurrentUserOrders,
	createOrder,
	updateOrder,
};
