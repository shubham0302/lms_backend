require('dotenv').config();

const { PORT, DATABASE_URL, SALT_SECRET, JWT_SECRET } = process.env;

module.exports = { PORT, DATABASE_URL, SALT_SECRET, JWT_SECRET }