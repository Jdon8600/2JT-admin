import {model, Schema, models} from "mongoose";

const OrderSchema = new Schema({
    line_items: Object,
    name: String,
    email: String,
    address: String,
    city: String,
    state: String,
    zip: String,
    country:String,
    paid: Boolean
}, {collection:'Orders', timestamps:true})

export const Order = models?.Orders || model('Orders', OrderSchema);