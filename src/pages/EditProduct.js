import React, { useEffect, useState } from "react";
import { useParams, useNavigate } from 'react-router-dom';
import '../assets/styles/EditProduct.css';
import LayoutSeller from "../components/layout/LayoutSeller";
import { toast } from "react-toastify";

function EditProduct() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [product, setProduct] = useState(null);
  const [categories, setCategories] = useState([]); 
  const API_URL = "http://localhost:3001/products";

  useEffect(() => {
    // Lấy chi tiết sản phẩm
    fetch(`${API_URL}/${id}`)
      .then(res => res.json())
      .then(data => setProduct(data))
      .catch(error => console.error("Lỗi khi tải chi tiết sản phẩm:", error));

    // Lấy danh mục
    fetch("http://localhost:3001/categories")
      .then(res => res.json())
      .then(data => setCategories(data))
      .catch(error => console.error("Lỗi khi tải danh mục:", error));
  }, [id]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setProduct(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleSave = () => {
    const {
      productName,
      productImgUrl,
      productDescription,
      productPrice,
      productStock,
      "product-categorise": categoryId,
    } = product;
  
    if (
      !productName ||
      !productImgUrl ||
      !productDescription ||
      isNaN(productPrice) ||
      isNaN(productStock)
    ) {
      toast.error("Điền đầy đủ và chính xác thông tin sản phẩm!");
      return;
    }
  
    fetch(`${API_URL}/${id}`, {
      method: "PUT",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(product),
    })
      .then((res) => {
        if (res.ok) {
          toast.success("Cập nhật sản phẩm thành công!");
          navigate("/productlistseller");
        } else {
          toast.error("Không thể cập nhật sản phẩm.");
        }
      })
      .catch((err) => {
        console.error("Lỗi khi cập nhật sản phẩm:", err);
        toast.error("Đã xảy ra lỗi khi cập nhật.");
      });
  };
  
  return (
    <LayoutSeller>
      {!product ? (
        <div className="product-detail-container">Đang tải sản phẩm...</div>
      ) : (
        <div className="product-detail-container">
                  <a href='/productlistseller'> <button  className='back-btn'><i class="bi bi-arrow-left"></i>   Quay lại</button></a>
          <h1 className="label-detail-product">CHỈNH SỬA SẢN PHẨM</h1>
          <div className="flex-information">
            <div className="flex-information-img">
              <img src={product.productImgUrl} alt={product.productName} />
            </div>
            <div className="flex-information-text">
              <input type="text" name="productname" value={product.productName} onChange={handleChange} placeholder="Tên sản phẩm" />
              <input type="text" name="product-img-url" value={product.productImgUrl} onChange={handleChange} placeholder="URL ảnh" />
              <textarea name="product-description" value={product.productDescription} onChange={handleChange} placeholder="Mô tả" />
              <input type="number" name="product-price" value={product.productPrice} onChange={handleChange} placeholder="Giá" />
              <input type="number" name="product-stock" value={product.productStock} onChange={handleChange} placeholder="Số lượng" />
              <select
                name="product-categorise"
                value={product["product-categorise"]}
                onChange={handleChange}
                className="dropdown-categorise"
              >
                <option value="">Chọn danh mục</option>
                {categories.map((cat) => (
                  <option key={cat.id} value={cat.id}>
                    {cat.name}
                  </option>
                ))}
              </select>
              <button className="save-information-btn" onClick={handleSave}>Lưu thông tin</button>
            </div>
          </div>
        </div>
      )}
    </LayoutSeller>
  );
}

export default EditProduct;
