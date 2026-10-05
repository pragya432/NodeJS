// Function to place an order
function placeOrder(item) {

    // Return a new Promise
    return new Promise((resolve, reject) => {

        // Display a message when the order is placed
        console.log(`Order placed: ${item}`);

        // Simulate a 2-second preparation delay
        setTimeout(() => {

            // Generate a random success or failure
            // Math.random() returns a value between 0 and 1
            // There is an 80% chance of success
            const success = Math.random() > 0.2;

            // Check whether the order was successfully prepared
            if (success) {

                // Resolve the Promise when the order is successful
                resolve(`${item} is out for delivery!`);

            } else {

                // Reject the Promise when the order fails
                reject(`Sorry, the restaurant could not prepare ${item}`);
            }

        }, 2000);
    });
}


// Call the placeOrder function with "Burger"
placeOrder('Burger')

    // .then() runs when the Promise is successfully resolved
    .then((message) => {

        // Display the success message
        console.log(message);
    })

    // .catch() runs when the Promise is rejected
    .catch((error) => {

        // Display the error message
        console.log(error);
    });