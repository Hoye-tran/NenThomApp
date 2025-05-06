import React, { useState, useEffect } from 'react';
import "../assets/styles/AddProduct.css";
import { toast } from "react-toastify";
import LayoutSeller from "../components/layout/LayoutSeller";
const API_URL = "http://localhost:3001/products";
const CATEGORIES_URL = "http://localhost:3001/categories";

function AddProduct() {
  const [productName, setProductName] = useState('');
  const [productPrice, setProductPrice] = useState('');
  const [productImgUrl, setProductImgUrl] = useState('');
  const [productDescription, setProductDescription] = useState('');
  const [productCategoriseId, setProductCategoriseId] = useState('');
  const [productStock, setProductStock] = useState('');
  const [categories, setCategories] = useState([]);

  useEffect(() => {
    fetch(CATEGORIES_URL)
      .then(res => res.json())
      .then(data => setCategories(data))
      .catch(error => toast.error("Lỗi khi tải danh mục:", error));
  }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!productName || !productPrice || !productImgUrl || !productDescription || !productCategoriseId || !productStock) {
        toast.error('Vui lòng điền đầy đủ thông tin sản phẩm.');
      return;
    }

    const newProduct = {
      productname: productName,
      "product-price": Number(productPrice),
      "product-img-url": productImgUrl,
      "product-description": productDescription,
      "product-categorise": productCategoriseId,
      "product-stock": Number(productStock),
      product_rating: 0,
      rating_count: 0
    };

    try {
      const res = await fetch(API_URL, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(newProduct)
      });

      const result = await res.json();
      toast.success("Đã thêm sản phẩm!");
      setProductName('');
      setProductPrice('');
      setProductImgUrl('');
      setProductDescription('');
      setProductCategoriseId('');
      setProductStock('');
      console.log(result);
    } catch (err) {
      console.error("Lỗi khi thêm sản phẩm:", err);
      toast.error("Có lỗi khi thêm sản phẩm.");
    }
  };

  return (
    <LayoutSeller>
      <a href='/productlistseller'> <button  className='back-btn'><i class="bi bi-arrow-left"></i>   Quay lại</button></a>
      <h2 className='text-add-product'>THÊM SẢN PHẨM</h2>
    <form id="add-product-form" onSubmit={handleSubmit}>
      <div>
        <label htmlFor="product-name">Tên sản phẩm:</label>
        <input
          type="text"
          id="product-name"
          name="productname" 
          value={productName}
          onChange={(e) => setProductName(e.target.value)}
        />
      </div>
      <div>
        <label htmlFor="product-price">Giá:</label>
        <input
          type="number"
          id="product-price"
          name="product-price" 
          value={productPrice}
          onChange={(e) => setProductPrice(e.target.value)}
        />
      </div>
      <div>
        <label htmlFor="product-img-url">URL hình ảnh:</label>
        <input
          type="text"
          id="product-img-url"
          name="product-img-url"
          value={productImgUrl}
          onChange={(e) => setProductImgUrl(e.target.value)}
        />
      </div>
      <div>
        <label htmlFor="product-description">Mô tả:</label>
        <textarea
          id="product-description"
          name="product-description"
          value={productDescription}
          onChange={(e) => setProductDescription(e.target.value)}
        />
      </div>
      <div>
        <label htmlFor="product-categorise">Danh mục:</label>
        <select
          id="product-categorise"
          name="product-categorise" 
          value={productCategoriseId}
          onChange={(e) => setProductCategoriseId(e.target.value)}
        >
          <option value="">Chọn danh mục</option>
          {categories.map(category => (
            <option key={category.id} value={category.id}>{category.name}</option>
          ))}
        </select>
      </div>
      <div>
        <label htmlFor="product-stock">Số lượng kho:</label>
        <input
          type="number"
          id="product-stock"
          name="product-stock" 
          value={productStock}
          onChange={(e) => setProductStock(e.target.value)}
        />
      </div>
      <button type="submit" id='add-product-btn'>Thêm sản phẩm</button>
    </form>
    </LayoutSeller>
  );
}

export default AddProduct;