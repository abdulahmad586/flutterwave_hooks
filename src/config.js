require('dotenv').config();

module.exports = {
    secretHash: process.env.FLW_WHOOK_HASH,
    jwtKey: process.env.JWT_KEY,
    paystackSecretKey: process.env.PAYSTACK_SECRET_KEY,
}