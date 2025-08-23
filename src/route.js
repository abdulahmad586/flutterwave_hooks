const { Router } = require("express");
const express = require('express');
const { secretHash } = require('./config');
const { processEvent, processPaystackEvent } = require("./service");
const crypto = require('crypto');

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

    api.post(
        "/paystack-hook",
        express.json({
            verify: (req, res, buf) => {
                req.rawBody = buf.toString(); // only for this route
            },
        }),
        (req, res) => {
            const paystackSignature = req.headers["x-paystack-signature"];
            if (!paystackSignature) {
                return res.status(401).send("Signature missing");
            }

            const hash = crypto
                .createHmac("sha512", process.env.PAYSTACK_SECRET_KEY)
                .update(req.rawBody) // guaranteed to exist now
                .digest("hex");

            if (hash !== paystackSignature) {
                return res.status(401).send("Invalid signature");
            }

            const event = req.body;
            console.log("Paystack webhook received:", event);
            setTimeout(() => processPaystackEvent(event), 0);

            res.sendStatus(200);
        }
    );

    return api;
}