import React, { useEffect, useState } from "react";
import '../assets/styles/Cart.css';
import Layout from "../components/layout/Layout";
import { useNavigate } from "react-router-dom";


function Cart() {
  const [cart, setCart] = useState([]);
  const [total, setTotal] = useState(0);
  const navigate = useNavigate();

  useEffect(() => {
    const storedCart = JSON.parse(localStorage.getItem("cart")) || [];
    fetchProductsData(storedCart);
  }, []);

  const fetchProductsData = (cartData) => {
    fetch("http://localhost:3001/products")
      .then((res) => res.json())
      .then((products) => {
        const updatedCart = cartData.map((cartItem) => {
          const product = products.find((prod) => prod.id === cartItem.productId);
          return {
            ...cartItem,
            name: product ? product.productName : "Unknown",
            price: product ? product.productPrice : 0,
            image: product ? product.productImgUrl : "",
          };
        });

        const totalPrice = updatedCart.reduce((sum, item) => {
          const quantity = item.quantity || 1;
          return sum + item.price * quantity;
        }, 0);

        setCart(updatedCart);
        setTotal(totalPrice);
        localStorage.setItem("paymentAmount", totalPrice);
      })
      .catch((error) => console.error("Lỗi khi lấy sản phẩm:", error));
  };

  const handlePayment = () => {
    localStorage.setItem("paymentCart", JSON.stringify(cart));
    navigate('/payment');
  };

  return (
    <Layout>
<div className="cart-container">
  {cart.length === 0 ? (
    <p className="text-empty">Giỏ hàng trống.</p>
  ) : (
    <>
      <h2 className="text-cart">GIỎ HÀNG</h2>
      <div className="container-cart">
        <div id="cart-list">
          <table className="cart-table">
            <thead>
              <tr>
                <th>Hình ảnh</th>
                <th>Tên sản phẩm</th>
                <th>Giá</th>
              </tr>
            </thead>
            <tbody>
              {cart.map((item, index) => (
                <tr key={index}>
                  <td><img src={item.image} alt={item.name} className="cart-item-image" /></td>
                  <td>{item.name}</td>
                  <td>{item.price.toLocaleString()} VNĐ</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        <div className="information-check-cart">
          <h2 className="text-information-check-cart">Thông tin đơn hàng</h2>
          <p className="textdelivery">
            <i className="bi bi-calendar-check"></i> Nhận hàng sau 5-10 ngày đặt
          </p>
          <div className="check-information-payment">
            <div className="check-price">
              <p>Tạm tính</p>
              <p>{total.toLocaleString()} VNĐ</p>
            </div>
            <div className="check-delivery">
              <p>Phí vận chuyển</p>
              <p>Miễn phí</p>
            </div>
            <div className="check-discount">
              <p>Tổng khuyến mãi</p>
              <p>0 VNĐ</p>
            </div>
          </div>
          <hr />
          <div id="cart-total">
            <strong>Tổng cộng:</strong>
            <strong>{total.toLocaleString()} VNĐ</strong>
          </div>
          <button id="payment-btn" onClick={handlePayment}>
            Thanh toán
          </button>
        </div>
      </div>
    </>
  )}
</div>

    </Layout>
  );
}

export default Cart;
