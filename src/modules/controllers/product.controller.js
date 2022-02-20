const Product = require('../models/product.model');
const { StatusCodes } = require('http-status-codes');
const CustomError = require('../../utils/errors');
const path = require('path');

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

	res.status(StatusCodes.OK).json({ products, cout: products.length });
};

const getSingleProduct = async (req, res) => {
	const product = await Product.findOne({ _id: req.params.id }).populate(
		'reviews'
	);
	if (!product) throw new CustomError.NotFoundError('Product not found');

	res.status(StatusCodes.OK).json({ product });
};

const updateProduct = async (req, res) => {
	const { id: productId } = req.params;
	const product = await Product.findOneAndUpdate(
		{ _id: productId },
		req.body,
		{
			new: true,
			runValidators: true,
		}
	);

	if (!product) throw new CustomError.NotFoundError('Product not found');

	res.status(StatusCodes.OK).json({ product });
};

const deleteProduct = async (req, res) => {
	const { id: productId } = req.params;
	const product = await Product.findOne({ _id: productId });

	if (!product) throw new CustomError.NotFoundError('Product not found');

	await product.remove();
	res.status(StatusCodes.OK).json({ msg: 'Product removed' });
};

const uploadProductImage = async (req, res) => {
	if (!req.files) {
		throw new CustomError.BadRequestError('No file uploaded');
	}
	const productImage = req.files.image;

	if (!productImage.mimetype.startsWith('image')) {
		throw new CustomError.BadRequestError('must be upload an image');
	}

	const maxSize = 1024 * 1024 * 2;
	if (productImage.size > maxSize) {
		throw new CustomError.BadRequestError(
			'Image size must be less than 2MB'
		);
	}

	const imagePath = path.join(
		__dirname,
		'../../../public/uploads/' + `${productImage.name}`
	);
	await productImage.mv(imagePath);

	res.status(StatusCodes.OK).json({
		message: 'Image uploaded successfully',
		image: `/uploads/${productImage.name}`,
	});
};

module.exports = {
	createProduct,
	getAllProducts,
	getSingleProduct,
	updateProduct,
	deleteProduct,
	uploadProductImage,
};
