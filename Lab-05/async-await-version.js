// Function to place an order
// It returns a Promise because the operation is asynchronous
function placeOrder(item) {

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


// Function to prepare/track the order
// It also returns a Promise
function trackOrder(item) {

    return new Promise((resolve, reject) => {

        // Simulate a 1-second delay
        setTimeout(() => {

            // Display the preparation message
            console.log(`Preparing: ${item}`);

            // Resolve the Promise and pass the item forward
            resolve(item);

        }, 1000);
    });
}


// Function to confirm that the order is out for delivery
function confirmDelivery(item) {

    return new Promise((resolve, reject) => {

        // Simulate a 1-second delay
        setTimeout(() => {

            // Display the delivery status
            console.log(`Out for Delivery: ${item}`);

            // Resolve the Promise and pass the item forward
            resolve(item);

        }, 1000);
    });
}


// async function allows us to use await inside the function
async function processOrder() {

    // try block contains the code that may produce an error
    try {

        // Wait for the order to be placed
        // The returned item is stored in the 'item' variable
        const item = await placeOrder('Pasta');


        // Wait for the order preparation to complete
        await trackOrder(item);


        // Wait for the order to go out for delivery
        await confirmDelivery(item);


        // This runs after all three steps are successfully completed
        console.log(`Delivered: ${item}`);

    } 
    
    // catch handles any error/rejected Promise
    catch (error) {

        // Display the error message if the order fails
        console.log(`Order failed: ${error}`);
    }
}


// Call the processOrder function to start the entire process
processOrder();