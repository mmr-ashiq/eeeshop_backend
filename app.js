const express = require('express');
const app = express();
require('dotenv').config();
require('express-async-errors');
const morgan = require('morgan');
const cookieParser = require('cookie-parser');
const fileUpload = require('express-fileupload');
const mongoSanitize = require('express-mongo-sanitize');
const rateLimiter = require('express-rate-limit');
const helmet = require('helmet');
const xss = require('xss-clean');
const cors = require('cors');

const swaggerUi = require('swagger-ui-express'),
	swaggerDocument = require('./swagger.json');

const connectDB = require('./src/db/connect');

const authRouter = require('./src/modules/routes/auth.route');
const userRouter = require('./src/modules/routes/user.route');
const productRouter = require('./src/modules/routes/product.route');
const reviewRouter = require('./src/modules/routes/review.route');
const orderRouter = require('./src/modules/routes/order.route');

const notFoundMiddleware = require('./src/modules/core/middlewares/not-found.middleware');
const errorHandlerMiddleware = require('./src/modules/core/middlewares/error-handler.middleware');

app.use(
	'/api-docs',
	swaggerUi.serve,
	swaggerUi.setup(swaggerDocument)
);

app.set('trust proxy', 1);
app.use(rateLimiter({
	windowMs: 15 * 60 * 1000,
	max: 100,
	message: 'Too many requests from this IP, please try again after an hour!'
}));

app.use(helmet());
app.use(xss());
app.use(mongoSanitize());
app.use(cors());

app.use(morgan('tiny'));
app.use(express.json());
app.use(cookieParser(process.env.JWT_SECRET));

app.use(express.static('./public'));
app.use(fileUpload());

app.get('/', (req, res) => {
	res.send('<h1>Welcome to the mmr-shop API</h1>');
});

app.use('/api/v1/auth', authRouter);
app.use('/api/v1/users', userRouter);
app.use('/api/v1/products', productRouter);
app.use('/api/v1/reviews', reviewRouter);
app.use('/api/v1/orders', orderRouter);

app.use(notFoundMiddleware);
app.use(errorHandlerMiddleware);

const port = process.env.PORT || 5000;

const start = async () => {
	try {
		await connectDB(process.env.MONGO_URI);

		app.listen(port, () => {
			console.log(`Server started on port ${port}`);
		});
	} catch (err) {
		console.log(err);
	}
};

start();
