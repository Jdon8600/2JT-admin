import Layout from "@/components/Layout";
import axios from "axios";
import { useEffect, useState } from "react";
import { withSwal } from "react-sweetalert2";

function Categories({swal}) {
  const [editedCategory, setEditedCategory] = useState(null);
  const [name, setName] = useState("");
  const [categories, setCategories] = useState([]);
  const [parentCategory, setParentCategory] = useState("");
  useEffect(() => {
    fetchCategories();
  }, []);
  function fetchCategories() {
    axios.get("/api/categories").then((res) => {
      console.log(res.data);
      setCategories(res.data);
    });
  }

  async function saveCat(e) {
    e.preventDefault();
    const data = {
      name: name,
      parent_category: parentCategory,
    };
    if (editedCategory) {
      data.id = editedCategory._id;
      await axios.put("/api/categories", data); 
      setEditedCategory(null);
    }else{
     await axios.post("/api/categories", data); 
    }
      setName("");
      setParentCategory("");
      fetchCategories();
  }

  function editCategory(cat) {
    setEditedCategory(cat);
    setName(cat.name)
    setParentCategory(cat.parent?._id)
  }
  function deleteCategory(cat) {
    swal.fire({
      title: "Are you sure?",
      text: `Once deleted, you will not be able to recover ${cat.name}!`,
      icon: "warning",
      showCancelButton: true,
      cancelButtonTitle: 'Cancel',
      confirmButtonText: 'Delete',
      confirmButtonColor: '@d55',
      reverseButtons: true,
    })
    .then( result =>{
      if (result.isConfirmed){
        console.log(cat)
        const id = cat._id;
        axios.delete(`/api/categories?_id=${id}`).then((res) => {
          console.log(res.data);
          fetchCategories();
        });
      }
    });
  }

  return (
    <Layout>
      <h1>Categories</h1>
      <label>{editedCategory ? "Edit Category" : "New Category Name"}</label>
      <form onSubmit={saveCat} className="flex gap-1">
        <input
          className="mb-0"
          type="text"
          placeholder={"Category name"}
          value={name}
          onChange={(e) => setName(e.target.value)}
        />
        <select
          className="mb-0"
          value={parentCategory}
          onChange={(e) => setParentCategory(e.target.value)}
        >
          <option value="0">Select Category</option>
          {categories.length > 0 &&
            categories.map((cat) => (
              <option value={cat._id}>{cat.name}</option>
            ))}
        </select>
        <button className="btn-primary py-1" type="submit">
        {editedCategory ? "Save" : "Add Category"}
        </button>
      </form>
      <table className="basic mt-4">
        <thead>
          <tr>
            <td>Category Name</td>
            <td>Parent Category</td>
            <td></td>
          </tr>
        </thead>
        <tbody>
          {categories.length > 0 &&
            categories.map((cat) => (
              <tr key={cat._id}>
                <td>{cat.name}</td>
                <td>{cat?.parent?.name}</td>
                <td>
                  <div className="flex gap-1">
                    <button
                      onClick={() => editCategory(cat)}
                      className="btn-primary"
                    >
                      Edit
                    </button>
                    <button  onClick={()=>deleteCategory(cat)}className="btn-primary">Delete</button>
                  </div>
                </td>
              </tr>
            ))}
        </tbody>
      </table>
    </Layout>
  );
}

export default withSwal(({swal}, ref)=>(
  <Categories swal= {swal}/>
));