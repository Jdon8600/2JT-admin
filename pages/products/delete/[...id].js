import Layout from "@/components/Layout";
import { useRouter } from "next/router";
import { useEffect, useState } from "react";
import axios from "axios";

export default function Delete() {
  const [productInfo, setProductInfo] = useState(null);
  const router = useRouter();
  const id = router.query.id;
  function goBack() {
    router.push("/products");
  }
  useEffect(() => {
    if (!id) {
      return;
    }
    axios.get("/api/products?id=" + id).then((response) => {
      setProductInfo(response.data);
    });
  }, [id]);

  async function deleteProduct() {
    await axios.delete("/api/products?id=" + id).then((response) => {
      goBack();
    });
  }
  console.log(productInfo);
  return (
    <Layout>
      {productInfo &&<h1 className="text-center">
        Are you sure you want to delete <b>"{productInfo.title}"</b>?
      </h1>}
      <div className="flex gap-2 justify-center">
        <button className="btn-red" onClick={deleteProduct}>Yes</button>
        <button className="btn-default" onClick={goBack}>
          No
        </button>
      </div>
    </Layout>
  );
}
