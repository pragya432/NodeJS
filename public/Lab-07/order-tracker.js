const EventEmitter = require('events');

// OrderTracker Class

class OrderTracker extends EventEmitter {

    constructor() {

        super();

        this.order = null;

    }

    placeOrder(order) {

        this.order = order;

        this.emit(
            'orderPlaced',
            order
        );

    }

    prepareOrder() {

        if (!this.order) {

            this.emit(
                'error',
                new Error(
                    'No order has been placed.'
                )
            );

            return;

        }

        this.emit(
            'orderPrepared',
            this.order
        );

    }

    deliverOrder() {

        if (!this.order) {

            this.emit(
                'error',
                new Error(
                    'No order has been placed.'
                )
            );

            return;

        }

        this.emit(
            'orderDelivered',
            this.order
        );

    }

}

// Create Tracker

const tracker = new OrderTracker();

// ERROR LISTENER

tracker.on('error', (err) => {

    console.log(
        `ERROR: ${err.message}`
    );

});

// ORDER PLACED — Listener 1

tracker.on(
    'orderPlaced',
    (order) => {

        console.log(
            `Customer: Order ${order.id} placed for ${order.item}.`
        );

    }
);

// ORDER PLACED — Listener 2

tracker.on(
    'orderPlaced',
    (order) => {

        console.log(
            `Kitchen: New order received — ${order.item}.`
        );

    }
);

// ORDER PREPARED — Listener 1

tracker.on(
    'orderPrepared',
    (order) => {

        console.log(
            `Customer: Order ${order.id} is ready.`
        );

    }
);

// ORDER PREPARED — Listener 2

tracker.on(
    'orderPrepared',
    (order) => {

        console.log(
            `Delivery: ${order.item} is ready for pickup.`
        );

    }
);

// ORDER DELIVERED — Listener 1

tracker.on(
    'orderDelivered',
    (order) => {

        console.log(
            `Customer: Order ${order.id} delivered successfully.`
        );

    }
);

// ORDER DELIVERED — Listener 2

tracker.on(
    'orderDelivered',
    (order) => {

        console.log(
            `System: Order ${order.id} completed.`
        );

    }
);

// FIRST ORDER BONUS — ONCE

tracker.once(
    'firstOrderBonus',
    (order) => {

        console.log(
            `Bonus: First-order reward applied to ${order.id}.`
        );

    }
);

// ORDER DATA

const order = {

    id: 'ORD-101',

    item: 'Pizza',

    customer: 'Aman'

};

// ORDER LIFECYCLE

console.log(
    '--- ORDER LIFECYCLE START ---'
);

tracker.placeOrder(order);

tracker.emit(
    'firstOrderBonus',
    order
);

setTimeout(() => {

    tracker.prepareOrder();

}, 1000);

setTimeout(() => {

    tracker.deliverOrder();

}, 2000);

setTimeout(() => {

    console.log(
        '--- ORDER LIFECYCLE COMPLETE ---'
    );

}, 2500);