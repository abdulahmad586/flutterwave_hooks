const successStatuses = ["successful"]

const appServer = require("./server");

const processEvent = (data) => {
    try {

        if (!data) return;
        const eventType = data["event.type"];
        const status = data.status || data.transfer.status;
        const transactionId = data.txRef || data.transfer.reference;
        const refId = data.id || data.transfer.id;

        const payload = { eventType, status, transactionId, refId };
        const success = successStatuses.includes(status);
        if (success) {
            appServer.sendMessage("transaction.update.success", payload)
        } else {
            appServer.sendMessage("transaction.update.failure", payload)
        }

    } catch (e) {
        console.log("ProcessEvent >> ", e);
    }
}

module.exports = { processEvent }