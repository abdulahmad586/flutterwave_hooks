const express = require('express');
const cors = require('cors');
const dotenv = require('dotenv');
dotenv.config();

const port = 3000;

const app = express();

app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: false }));

app.get('/', (req, res) => {
    res.status(200).json({ message: 'Zuma Wallet Webhook Server' });
})

app.listen(port, () => {
    console.log(`Webhook Server running on port ${port}`);
});

