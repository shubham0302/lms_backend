require('dotenv').config();

const { PORT, DATABASE_URL, SALT_SECRET, JWT_SECRET, IK_PUBLIC_KEY, IK_PRIVATE_KEY, IK_UPLOAD_URL } = process.env;

module.exports = { PORT, DATABASE_URL, SALT_SECRET, JWT_SECRET, IK_PUBLIC_KEY, IK_PRIVATE_KEY, IK_UPLOAD_URL }
