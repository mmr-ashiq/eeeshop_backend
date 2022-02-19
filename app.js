const express = require('express');
const app = express();
require('dotenv').config();
require('express-async-errors');
const morgan = require('morgan');
const cookieParser = require('cookie-parser');
const fileUpload = require('express-fileupload');

const connectDB = require('./src/db/connect');

const authRouter = require('./src/modules/routes/auth.route');
const userRouter = require('./src/modules/routes/user.route');
const productRouter = require('./src/modules/routes/product.route');
const reviewRouter = require('./src/modules/routes/review.route');

const notFoundMiddleware = require('./src/modules/core/middlewares/not-found.middleware');
const errorHandlerMiddleware = require('./src/modules/core/middlewares/error-handler.middleware');

app.use(morgan('tiny'));
app.use(express.json());
app.use(cookieParser(process.env.JWT_SECRET));

app.use(express.static('./public'));
app.use(fileUpload());

app.get('/', (req, res) => {
	res.send('Hello World');
});

app.use('/api/v1/auth', authRouter);
app.use('/api/v1/users', userRouter);
app.use('/api/v1/products', productRouter);
app.use('/api/v1/reviews', reviewRouter);

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
