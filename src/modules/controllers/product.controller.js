const Product = require('../models/product.model');
const { StatusCodes } = require('http-status-codes');
const CustomError = require('../../utils/errors');

const createProduct = async (req, res) => {
	req.body.user = req.user.userId;

	const productName = req.body.name;
	const product = await Product.findOne({ name: productName });
	if (!product) {
		const newProduct = new Product(req.body);
		await newProduct.save();
		res.status(StatusCodes.CREATED).json({
			message: 'Product created successfully',
			product: newProduct,
		});
	} else {
		throw new CustomError.BadRequestError(
			'Product already exists',
			StatusCodes.BAD_REQUEST
		);
	}

	// const product = await Product.create(req.body);
	// res.status(StatusCodes.CREATED).json({ product });
};

const getAllProducts = async (req, res) => {
	const products = await Product.find({});
	res.status(StatusCodes.OK).json(products);
};

const getSingleProduct = async (req, res) => {
	const product = await Product.findOne({ _id: req.params.id });
	if (!product) throw new CustomError.NotFoundError();
	res.status(StatusCodes.OK).json({ product });
};

const updateProduct = async (req, res) => {
	res.send('update product');
};

const deleteProduct = async (req, res) => {
	const product = await Product.findOneAndDelete({ _id: req.params.id });
	if (!product) throw new CustomError.NotFoundError();
};

const uploadProductImage = async (req, res) => {
	res.send('upload product image');
};

module.exports = {
	createProduct,
	getAllProducts,
	getSingleProduct,
	updateProduct,
	deleteProduct,
	uploadProductImage,
};