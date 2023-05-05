import mongoose, {model, Schema, models} from "mongoose";

const CategorySchema = new Schema({
    name: {type:String, required: true},
    parent: {type: Schema.Types.ObjectId, ref: 'Category', required:false}
}, {collection: 'categories'});

export const Category = models?.Category || model('Category', CategorySchema);