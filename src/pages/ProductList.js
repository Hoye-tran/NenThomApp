import React, { useEffect, useState } from "react";
import '../assets/styles/ProductList.css';
import { useNavigate, Link } from "react-router-dom";
import Layout from '../components/layout/Layout';
import { toast } from "react-toastify";

function ProductList() {
  const [products, setProducts] = useState([]);
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 8;
  const navigate = useNavigate();

  const indexOfLastItem = currentPage * itemsPerPage;
  const indexOfFirstItem = indexOfLastItem - itemsPerPage;
  const currentItems = products.slice(indexOfFirstItem, indexOfLastItem);
  const totalPages = Math.ceil(products.length / itemsPerPage);
  const pageNumbers = [];
  for (let i = 1; i <= totalPages; i++) {
    pageNumbers.push(i);
  }
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
    navigate(`/products/${id}`);
  };

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

    fetch("http://localhost:3001/cart", {
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

        const updatedCart = [...cart];
        const existingItem = updatedCart.find(item => item.productId === product.id);

        if (existingItem) {
          existingItem.quantity += 1;
        } else {
          updatedCart.push({ productId: product.id, quantity: 1 });
        }

        localStorage.setItem("cart", JSON.stringify(updatedCart));
      })
      .catch((error) => {
        console.error("Lỗi khi thêm vào giỏ hàng:", error);
        toast.error("Có lỗi khi thêm vào giỏ hàng!");
      });

  };

  return (
    <Layout>
      <div className="product-list">
        {currentItems.map((product) => (
          <div className="product-item" key={product.id}>
            <img className="product-img" src={product.productImgUrl} alt={product.productName} />
            <Link to={`/products/${product.id}`} className="product-name-link">
              <h3 className="product-name" onClick={() => goToDetailProduct(product.id)}>
                {product.productName}
              </h3>
            </Link>
            <p className="product-price">
              {product.productPrice ? product.productPrice.toLocaleString() : "N/A"} VNĐ
            </p>
            <button className="add-cart-btn" onClick={() => addToCart(product)}>Thêm</button>
          </div>
        ))}
      </div>

      <div className="pagination">
        <button onClick={() => setCurrentPage(currentPage - 1)} disabled={currentPage === 1}>Trước</button>
        {pageNumbers.map((number) => (
          <button key={number} onClick={() => setCurrentPage(number)}>
            {number}</button>
        ))}

        <button onClick={() => setCurrentPage(currentPage + 1)} disabled={currentPage === totalPages}>Sau</button>
      </div>

    </Layout>
  );
}

export default ProductList;
