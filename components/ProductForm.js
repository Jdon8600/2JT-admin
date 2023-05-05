import { useState, useEffect } from "react";
import { useRouter } from "next/router";
import axios from "axios";
import Spinner from "./Spinner";
import { ReactSortable } from "react-sortablejs";

export default function ProductForm({
  _id,
  title: existinTitle,
  description: existingDescription,
  price: existingPrice,
  images,
  category: existingCategory,
}) {
  const [title, setTitle] = useState(existinTitle || "");
  const [description, setDescription] = useState(existingDescription || "");
  const [price, setPrice] = useState(existingPrice || "");
  const [goToProduct, setGoToProduct] = useState(false);
  const [imagesArray, setImagesArray] = useState(images || []);
  const [isUploading, setIsUploading] = useState(false);
  const [categories, setCategories] = useState([]);
  const [category, setCategory] = useState(existingCategory||"");
  const router = useRouter();
  useEffect(() => {
    axios.get("/api/categories").then((res) => {
      setCategories(res.data);
    });
  }, []);
  function goBack() {
    router.push("/products");
  }

  async function saveProduct(ev) {
    ev.preventDefault();
    const data = {
      title: title,
      description: description,
      price: +price,
      images: imagesArray,
      category: category,
    };
    if (_id) {
      await axios
        .put(`/api/products?id=${_id}`, { ...data, _id })
        .then((res) => {
          console.log(res.data);
        });
    } else {
      let res = await fetch("/api/products", {
        method: "POST",
        body: JSON.stringify(data),
      });
      console.log(res);
    }
    setGoToProduct(true);
  }
  async function uploadImages(ev) {
    ev.preventDefault();
    const files = ev.target?.files;
    if (files?.length > 0) {
      setIsUploading(true);
      const formData = new FormData();
      for (const file of files) {
        formData.append("file", file);
      }
      let res = await axios.post("/api/upload", formData);
      setImagesArray((currImgs) => {
        return [...currImgs, ...res.data.links];
      });
      setIsUploading(false);
    }
  }

  function updateImagesOrder(imagesArray) {
    setImagesArray(imagesArray);
  }

  if (goToProduct) {
    router.push("/products");
  }

  return (
    <form onSubmit={saveProduct}>
      <label>Product Name</label>
      <input
        type="text"
        placeholder="product name"
        value={title}
        onChange={(ev) => setTitle(ev.target.value)}
      />
      <label>Category</label>
      <select value={category} onChange={(ev) => setCategory(ev.target.value)}>
        <option value="">Uncategorized</option>
        {categories.length > 0 &&
          categories.map((cat) => <option value={cat._id}>{cat.name}</option>)}
      </select>
      <label>Product Image(s)</label>
      <div className="mb-2 flex flex-wrap gap-2">
        <ReactSortable
          list={imagesArray}
          className="flex flex-wrap gap-1"
          setList={updateImagesOrder}
        >
          {!!imagesArray?.length &&
            imagesArray.map((link) => (
              <div key={link} className="h-24">
                <img src={link} alt="" className="rounded-lg" />
              </div>
            ))}
        </ReactSortable>
        {isUploading && (
          <div className="h-24 p-1 flex items-center rounded-lg">
            <Spinner />
          </div>
        )}
        <label className="w-24 h-24 text-center flex flex-col items-center justify-center gap-1 rounded-lg bg-gray-200 hover:cursor-pointer">
          {" "}
          <svg
            xmlns="http://www.w3.org/2000/svg"
            fill="none"
            viewBox="0 0 24 24"
            strokeWidth={1.5}
            stroke="currentColor"
            className="w-6 h-6 "
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              d="M9 8.25H7.5a2.25 2.25 0 00-2.25 2.25v9a2.25 2.25 0 002.25 2.25h9a2.25 2.25 0 002.25-2.25v-9a2.25 2.25 0 00-2.25-2.25H15m0-3l-3-3m0 0l-3 3m3-3V15"
            />
          </svg>
          <div>Upload</div>
          <input type="file" className="hidden" onChange={uploadImages} />
        </label>
      </div>
      <label>Product Description</label>
      <textarea
        placeholder="product description"
        value={description}
        onChange={(ev) => setDescription(ev.target.value)}
      />
      <label>Price (in USD)</label>
      <input
        type="number"
        placeholder="product price"
        value={price}
        onChange={(ev) => setPrice(ev.target.value)}
      />
      <div className="flex gap-2">
        <button type="submit" className="btn-primary">
          Save
        </button>
        <button className="btn-default" onClick={goBack}>
          Cancel
        </button>
      </div>
    </form>
  );
}
