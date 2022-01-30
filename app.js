const express = require('express');
const app = express();
require('dotenv').config();
require('express-async-errors');
const morgan = require('morgan');

const connectDB = require('./src/db/connect');

const authRouter = require('./src/modules/routes/auth.route');

const notFoundMiddleware = require('./src/modules/core/middlewares/not-found');
const errorHandlerMiddleware = require('./src/modules/core/middlewares/error-handler');

app.use(morgan('tiny'));
app.use(express.json());

app.get('/', (req, res) => {
	res.send('Hello World');
});

app.use('/api/v1/auth', authRouter);

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
