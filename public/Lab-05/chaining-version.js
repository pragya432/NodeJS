// Function to place an order
function placeOrder(item) {
    // Create and return a Promise
    return new Promise((resolve, reject) => {

        // Simulate a 1-second delay
        setTimeout(() => {

            // Display the order placed message
            console.log(`Order Placed: ${item}`);

            // Resolve the Promise and pass the item to the next step
            resolve(item);

        }, 1000);
    });
}


// Function to track/prepare the order
function trackOrder(item) {
    // Create and return a Promise
    return new Promise((resolve, reject) => {

        // Simulate a 1-second delay
        setTimeout(() => {

            // Display the preparation message
            console.log(`Preparing: ${item}`);

            // Resolve the Promise and pass the item to the next step
            resolve(item);

        }, 1000);
    });
}


/*
// Alternative trackOrder function to demonstrate error handling
function trackOrder(item) {
    // Create and return a Promise
    return new Promise((resolve, reject) => {

        // Simulate a 1-second delay
        setTimeout(() => {

            // Reject the Promise if the order cannot be tracked
            reject(`Unable to track ${item}`);

        }, 1000);
    });
}
*/


// Function to confirm that the order is out for delivery
function confirmDelivery(item) {
    // Create and return a Promise
    return new Promise((resolve, reject) => {

        // Simulate a 1-second delay
        setTimeout(() => {

            // Display the delivery status
            console.log(`Out for Delivery: ${item}`);

            // Resolve the Promise and pass the item to the next step
            resolve(item);

        }, 1000);
    });
}


// Start the order process with "Pasta"
placeOrder('Pasta')

    // Execute when placeOrder() is successfully completed
    .then((item) => {

        // Call trackOrder() and pass the item to it
        return trackOrder(item);
    })

    // Execute when trackOrder() is successfully completed
    .then((item) => {

        // Call confirmDelivery() and pass the item to it
        return confirmDelivery(item);
    })

    // Execute when confirmDelivery() is successfully completed
    .then((item) => {

        // Display the final delivery message
        console.log(`Delivered: ${item}`);
    })

    // Handle any rejected Promise or error
    .catch((error) => {

        // Display the error message
        console.log(`Order failed: ${error}`);
    });