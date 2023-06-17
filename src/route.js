const { Router } = require("express");
const { secretHash } = require('./config')

module.exports = () => {
    const api = new Router();
    api.post("/hook", (req, res) => {

        const signature = req.headers["verif-hash"];
        if (!signature || (signature !== secretHash)) {
            // This request isn't from Flutterwave; discard
            res.status(401).end();
        }
        const payload = req.body;
        // It's a good idea to log all received events.
        console.log(payload);
        // Do something (that doesn't take too long) with the payload
        res.status(200).end()
    });

    return api;
}