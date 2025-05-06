import React, { useEffect, useState } from "react";
import '../assets/styles/ProductList.css';
import { useNavigate, Link } from "react-router-dom";
import Layout from '../components/layout/Layout';
import { toast } from "react-toastify";

function ProductList() {
  const [products, setProducts] = useState([]);
  const navigate = useNavigate();

  useEffect(() => {
    if (!localStorage.getItem("cart")) {
      localStorage.setItem("cart", JSON.stringify([]));
    }

    fetch("http://localhost:3001/products")
      .then((res) => res.json())
      .then((data) => {
        console.log("Dữ liệu sản phẩm trả về: ", data);  
        setProducts(data);
      })
      .catch((error) => {
        console.error("Lỗi khi lấy sản phẩm:", error);
        toast.error("Lỗi khi lấy sản phẩm.");
      });
  }, []);

  const goToDetailProduct = (id) => {
    console.log("Đi tới chi tiết sản phẩm với ID: ", id);
    navigate(`/products/${id}`);  
  };

  const addToCart = (product) => {
    const currentUser = JSON.parse(localStorage.getItem("currentUser"));
    if (!currentUser) {
      toast.error("Bạn phải đăng nhập trước khi thêm vào giỏ!");
      navigate("/login");
      return;
    }

    const itemToAdd = {
      userId: currentUser.id,
      productId: product.id,
      quantity: 1,
    };

    fetch("http://localhost:3001/cart", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(itemToAdd),
    })
      .then((response) => {
        if (!response.ok) {
          throw new Error(`HTTP error! status: ${response.status}`);
        }
        return response.json();
      })
      .then((data) => {
        console.log("Đã thêm vào giỏ hàng trên server:", data);
        toast.success("Đã thêm vào giỏ hàng!");

        let cart = JSON.parse(localStorage.getItem("cart")) || [];
        const existingItem = cart.find(item => item.productId === product.id);
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

  return (
    <Layout>
      <div className="product-list">
        {products.map((product) => (
          <div className="product-item" key={product.id}>
            <img className="product-img"src={product.productImgUrl}  alt={product.productName}  
            />
            <Link to={`/products/${product.id}`} className="product-name-link"> 
              <h3 className="product-name"onClick={() => goToDetailProduct(product.id)} >
                {product.productName}  
              </h3>
            </Link>
            <p className="product-price">
              {product.productPrice ? product.productPrice.toLocaleString() : "N/A"} VNĐ </p>
            <button className="add-cart-btn" onClick={() => addToCart(product)}>Thêm</button>
          </div>
        ))}
      </div>
    </Layout>
  );
}

export default ProductList;
