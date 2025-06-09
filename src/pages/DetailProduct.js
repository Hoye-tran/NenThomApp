import React, { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import "../assets/styles/DetailProduct.css";
import Layout from '../components/layout/Layout';
import { toast } from "react-toastify";

function DetailProduct() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [product, setProduct] = useState(null);
  const [categories, setCategories] = useState([]);
  const API_URL = "http://localhost:3001";

  useEffect(() => {
    fetch(`${API_URL}/products/${id}`)
      .then((res) => res.json())
      .then((data) => setProduct(data))
      .catch((err) => {
        console.error("Lỗi tải sản phẩm:", err);
        toast.error("Không thể tải sản phẩm!");
      });

    fetch(`${API_URL}/categories`)
      .then((res) => res.json())
      .then((data) => setCategories(data))
      .catch((err) => {
        console.error("Lỗi tải danh mục:", err);
      });
  }, [id]);

  const addToCart = (product) => {
    const currentUser = JSON.parse(localStorage.getItem("currentUser"));
    if (!currentUser) {
      toast.error("Bạn phải đăng nhập trước khi thêm vào giỏ!");
      navigate("/");
      return;
    }

    const itemToAdd = {
      userId: currentUser.id,
      productId: product.id,
      quantity: 1,
    };

    fetch(`${API_URL}/cart`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(itemToAdd),
    })
      .then((res) => {
        if (!res.ok) throw new Error(`HTTP error! status: ${res.status}`);
        return res.json();
      })
      .then(() => {
        toast.success("Đã thêm vào giỏ hàng!");

        let cart = JSON.parse(localStorage.getItem("cart")) || [];

        const existingItem = cart.find((item) => item.productId === product.id);

        if (existingItem) {
          existingItem.quantity += 1;
        } else {
          cart.push({ productId: product.id, quantity: 1 });
        }

        localStorage.setItem("cart", JSON.stringify(cart));
      })
      .catch((error) => {
        console.error("Lỗi khi thêm vào giỏ hàng:", error);
        toast.error("Có lỗi khi thêm vào giỏ hàng!");
      });
  };

  const getCategoryName = (id) => {
    const category = categories.find((cat) => cat.id === id);
    return category ? category.name : "Không rõ";
  };

  const handleAddToCart = () => {
    addToCart(product);
  };

  if (!product) {
    return <div className="product-detail-container">Đang tải sản phẩm...</div>;
  }

  return (
    <Layout>
      <div className="product-detail-container">
        <button className="back-btn" onClick={() => navigate("/productlist")}>
          <i className="bi bi-arrow-left"></i> Quay lại
        </button>
        <h1 className="text-productname">{product.productName}</h1>
        <div className="flex-information">
          <div className="flex-information-img">
            <img src={product.productImgUrl} alt={product.productName} />
          </div>
          <div className="flex-information-text">
            <p><strong>Mô tả:</strong> {product.productDescription}</p>
            <p><strong>Giá:</strong> {product.productPrice.toLocaleString()} VNĐ</p>
            <p><strong>Tồn kho:</strong> {product.productStock} sản phẩm</p>
            <p><strong>Danh mục: </strong>{getCategoryName(product.categoryId)}</p>
            <button className="add-cart-btn-detail" onClick={handleAddToCart}>
              Thêm vào giỏ hàng
            </button>
          </div>
        </div>
      </div>
    </Layout>
  );
}

export default DetailProduct;
