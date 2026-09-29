// Function to place an order using a callback
function placeOrderCallback(item, callback) {

    // Display a message when the order is placed
    console.log(`Order placed: ${item}`);

    // Simulate a 2-second delay for processing the order
    setTimeout(() => {

        // After 2 seconds, execute the callback function
        callback(`${item} is out for delivery!`);

    }, 2000);
}


// Function to track the order using a callback
function trackOrderCallback(item, callback) {

    // Display a message when order tracking starts
    console.log(`Tracking order: ${item}`);

    // Simulate a 2-second delay
    setTimeout(() => {

        // After 2 seconds, execute the callback function
        callback(`${item} is being tracked.`);

    }, 2000);
}


// Function to confirm delivery using a callback
function confirmDeliveryCallback(item, callback) {

    // Display a message when delivery confirmation starts
    console.log(`Confirming delivery: ${item}`);

    // Simulate a 2-second delay
    setTimeout(() => {

        // After 2 seconds, execute the callback function
        callback(`${item} has been delivered successfully!`);

    }, 2000);
}


// Step 1: Place the Pizza order
placeOrderCallback('Pizza', (message) => {

    // Display the message returned by the place-order callback
    console.log(message);


    // Step 2: Start tracking the Pizza order
    // This function runs only after the order is out for delivery
    trackOrderCallback('Pizza', (message) => {

        // Display the tracking message
        console.log(message);


        // Step 3: Confirm delivery
        // This function runs only after tracking is completed
        confirmDeliveryCallback('Pizza', (message) => {

            // Display the final delivery confirmation message
            console.log(message);
        });
    });
});