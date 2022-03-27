const mongoose = require('mongoose');

const SingleOrderItemSchema = mongoose.Schema({
    name: { type: String, required: true },
    price: { type: Number, required: true },
    image: { type: String, required: true },
    amount: { type: Number, required: true },
    product: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Product',
        required: true,
    },
});

const OrderSchema = mongoose.Schema(
    {
        user: {
            type: mongoose.Schema.ObjectId,
            ref: 'User',
            required: [true, 'User is required'],
        },
        tax: {
            type: Number,
            required: [true, 'Tax is required'],
        },
        shippingFee: {
            type: Number,
            required: [true, 'Shipping fee is required'],
        },
        subtotal: {
            type: Number,
            required: [true, 'Sub total is required'],
        },
        total: {
            type: Number,
            required: [true, 'Total is required'],
        },
        orderItems: [SingleOrderItemSchema],
        status: {
            type: String,
            enum: ['pending', 'processing', 'completed', 'cancelled'],
            default: 'pending',
        },
        clientSecret: {
            type: String,
            required: [true, 'Client secret is required'],
        },
        paymentIntentId: {
            type: String,
        },
    },
    {
        timestamps: true,
    }
);

module.exports = mongoose.model('Order', OrderSchema);
