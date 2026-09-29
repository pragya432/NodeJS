// Function to place an order
function placeOrder(item) {

    // Return a new Promise
    return new Promise((resolve, reject) => {

        // Generate a random delay between 1000ms and 2999ms
        const delay = Math.floor(Math.random() * 2000) + 1000;

        // Display the order name and its randomly generated delay
        console.log(`${item} order placed. Delay: ${delay}ms`);

        // Wait for the generated delay before completing the order
        setTimeout(() => {

            // Resolve the Promise when the order is ready
            resolve(`${item} is ready!`);

        }, delay);
    });
}


// Async function to handle multiple orders
async function orderMultiple() {

    // Display a message indicating that all orders are being placed together
    console.log('Placing 3 orders at once...');

    // Start a timer to measure the total execution time
    console.time('Total Time');

    // Place all three orders at the same time using Promise.all()
    const results = await Promise.all([
        placeOrder('Pizza'),
        placeOrder('Burger'),
        placeOrder('Coffee')
    ]);

    // Stop the timer and display the total time taken
    console.timeEnd('Total Time');

    // Display a message after all orders are completed
    console.log('All orders completed:');

    // Display the results of all three completed orders
    console.log(results);
}


// Call the function to start the order process
orderMultiple();