import { Product } from "@/models/product";
import { mongooseConnect } from "@/lib/mongoose";
import { ObjectId } from "mongodb";
import { isAdminRequest } from "./auth/[...nextauth]";

export default async function handle(req, res) {
  const { method } = req;
  await mongooseConnect();
  await isAdminRequest(req, res);

  const id = new ObjectId(req.query.id);
  console.log(id);

  if (method === "GET") {
    if (req.query.id) {
      let singleProduct = await Product.findOne({_id: id});
      res.json(singleProduct);
    } else {
      let products = await Product.find({});
      res.json(products);
    }
  }

  if (method === "POST") {
    let bodyObject = JSON.parse(req.body);
    let productDoc = new Product(bodyObject);
    let myPost = await Product.create(productDoc);
    res.json(myPost);
  }
  if (method === "PUT") {
    let {title, description, price, images, category} = req.body;
    await Product.updateOne(
      {_id: id},
      {$set:{title, description, price, images, category}}
    );
    res.json(true);
  }
  if (method === "DELETE") {
    if(req.query?.id){
      let myDelete = await Product.deleteOne({_id: id});
      res.json(myDelete);
    }
  }
}
