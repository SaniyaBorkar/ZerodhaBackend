const {Schema} = require("mongoose");

const OrdersSchema = new Schema ({
    name: String,
    qty: Number,
    price: Number,
    mode: String,
    userId: { type: Schema.Types.ObjectId, ref: "Users" }

}, {timestamps: true}
);

module.exports = {OrdersSchema};