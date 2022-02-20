const mongoose = require('mongoose');

const ProductSchema = new mongoose.Schema(
	{
		name: {
			type: String,
			required: [true, 'Name is required'],
			trim: true,
			minlength: [3, 'Name must be at least 3 characters long'],
			maxlength: [255, 'Name must be less than 255 characters'],
		},
		price: {
			type: Number,
			required: [true, 'Price is required'],
			default: 0,
		},
		description: {
			type: String,
			required: [true, 'Description is required'],
			max: [1000, 'Description must be less than 1000 characters'],
		},
		image: {
			type: String,
			required: [true, 'Image is required'],
			default: '/uploads/default.jpeg',
		},
		category: {
			type: String,
			required: [true, 'Category is required'],
			enum: [
				'Electronics',
				'Fashion',
				'Home',
				'Sports',
				'office',
				'Kitchen',
				'bedroom',
				'Mobile',
				'laptop',
				'Other',
			],
		},
		company: {
			type: String,
			required: [true, 'Company is required'],
			enum: {
				values: [
					'Apple',
					'Samsung',
					'LG',
					'ikea',
					'liddy',
					'macros',
					'Motorola',
					'Xiaomi',
					'Asus',
					'One plus',
					'Other',
				],
				message: '{VALUE} is not a valid company',
			},
		},
		colors: {
			type: [String],
			required: [true, 'Colors are required'],
		},
		featured: {
			type: Boolean,
			default: false,
		},
		freeShipping: {
			type: Boolean,
			default: false,
		},
		inventory: {
			type: Number,
			required: [true, 'Inventory is required'],
			default: 0,
		},
		averageRating: {
			type: Number,
			default: 0,
		},
		user: {
			type: mongoose.Types.ObjectId,
			ref: 'User',
			required: [true, 'User is required'],
		},
	},
	{
		timestamps: true,
		toJSON: { virtuals: true },
		toObject: { virtuals: true },
	}
);

ProductSchema.virtual('reviews', {
	ref: 'Review',
	localField: '_id',
	foreignField: 'product',
	justOne: false,
});

module.exports = mongoose.model('Product', ProductSchema);
