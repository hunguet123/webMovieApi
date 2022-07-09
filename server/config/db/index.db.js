const mongoose = require('mongoose');
const dotenv = require('dotenv');
dotenv.config();

const { env } = require('process');

async function connect() {
    try {
        await mongoose.connect(process.env.MONGO_URI);
        console.log('Connect database successfully');
    } catch (error) {
        console.log(error);
        console.log('Connect database failed');
    }
}

module.exports = { connect };
