const express = require('express');
const app = express();
require('dotenv').config();

const connectDB = require('./src/db/connect');

app.use(express.json());

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
