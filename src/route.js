const { Router } = require("express");
const { secretHash } = require('./config');
const { processEvent } = require("./service");

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
        setTimeout(() => {
            processEvent(payload);
        }, 0)
        // Do something (that doesn't take too long) with the payload
        res.status(200).end()
    });

    return api;
}