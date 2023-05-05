import { Category } from "@/models/categories";
import { mongooseConnect } from "@/lib/mongoose";
import { isAdminRequest } from "./auth/[...nextauth]";

export default async function handle(req, res) {
  const { method } = req;
  const { name, parent_category, id } = req.body;
  console.log(parent_category);
  await mongooseConnect();
  await isAdminRequest(req, res);

  if (method === "GET") {
    res.json(await Category.find().populate("parent"));
  }

  if (method === "PUT") {
    let catDoc = await Category.updateOne(
      { _id: id },
      { $set: { name: name, parent: parent_category } }
    );
    res.json(catDoc);
  }

  if (method === "POST") {
    if (!!parent_category) {
      let catDoc = await Category.create({
        name,
        parent: parent_category,
      });
      res.json(catDoc);
    } else {
      let catDoc = await Category.create({
        name,
      });
      res.json(catDoc);
    }
  }

  if (method === "DELETE") {
    const id = req.query._id;
    let catDoc = await Category.deleteOne({ _id: id });
    res.json(catDoc);
  }
}
