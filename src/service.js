const successStatuses = ["successful", "success"]
const processEvent = (data) => {
    try {

        if (!data) return;
        const eventType = data["event.type"];
        const status = data.status || data.transfer.status;
        const transactionId = data.txRef || data.transfer.reference;
        const refId = data.id || data.transfer.id;

        const payload = { eventType, status, transactionId, refId, gateway:"Flutterwave" };
        const success = successStatuses.includes(status);
        if (success) {
            require('./server').sendMessage("transaction.update.success", payload)
        } else {
            require('./server').sendMessage("transaction.update.failure", payload)
        }

    } catch (e) {
        console.log("ProcessEvent >> ", e);
    }
}

const processPaystackEvent = (event) => {
    try {
        
       if (event.event === "charge.success") {
            console.log("💰 Payment successful:", event.data);
            const {id:refId, reference: transactionId, status, } = event.data;
            const eventType = event.event;
            const payload = {eventType, status, transactionId, refId, gateway:"Paystack"};
            if(successStatuses.includes(status)){
                require('./server').sendMessage("transaction.update.success", payload)
            }else{
                 require('./server').sendMessage("transaction.update.failure", payload)
            }
        }
        if (event.event === "transfer.success") {
            console.log("✅ Transfer successful:", event.data);
            const {id:refId, reference: transactionId, status, } = event.data;
            const eventType = event.event;
            const payload = {eventType, status, transactionId, refId, gateway:"Paystack"};
            if(successStatuses.includes(status)){
                require('./server').sendMessage("transaction.update.success", payload)
            }else{
                 require('./server').sendMessage("transaction.update.failure", payload)
            }
        }

        if (event.event === "transfer.failed") {
            console.log("Transfer failed:", event.data);
            const {id:refId, reference: transactionId, status, } = event.data;
            const eventType = event.event;
            const payload = {eventType, status, transactionId, refId, gateway:"Paystack"};
            require('./server').sendMessage("transaction.update.failure", payload)
        }

    } catch (e) {
        console.log("processPaystackEvent >> ", e);
    }
}

module.exports = { processEvent, processPaystackEvent }