import React, { useEffect, useState, useCallback } from "react";
import '../assets/styles/Cart.css';
import Layout from "../components/layout/Layout";
import { useNavigate } from "react-router-dom";

function Cart() {
  const [cart, setCart] = useState([]);
  const [total, setTotal] = useState(0);

  const navigate = useNavigate();

  const updateCart = (updatedCart) => {
    setCart(updatedCart);
    const newTotal = updatedCart.reduce((sum, item) => {
      const quantity = item.quantity || 1;
      return sum + item.price * quantity;
    }, 0);
    setTotal(newTotal);
    localStorage.setItem("cart", JSON.stringify(updatedCart.map(({ productId, quantity }) => ({ productId, quantity }))));
    localStorage.setItem("paymentAmount", newTotal);
  };

  const fetchProductsData = useCallback((cartData) => {
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
            id: cartItem.id || `${cartItem.productId}-${Date.now()}`
          };
        });

        updateCart(updatedCart);
      })
      .catch((error) => console.error("Lỗi khi lấy sản phẩm:", error));
  }, []);

  useEffect(() => {
    const storedCart = JSON.parse(localStorage.getItem("cart")) || [];
    fetchProductsData(storedCart);
  }, [fetchProductsData]);

  const handlePayment = () => {
    localStorage.setItem("paymentCart", JSON.stringify(cart));
    navigate('/payment');
  };

  const handlePaymentDelete = () => {
    localStorage.removeItem("cart");
    setCart([]);
    setTotal(0);
  };

  const handleAddItem = (index) => {
    const item = cart[index];
    const newQuantity = item.quantity + 1;

    const updatedCart = [...cart];
    updatedCart[index].quantity = newQuantity;

    updateCart(updatedCart);
  };

  const handleDecreaseItem = (index) => {
    const item = cart[index];

    if (item.quantity > 1) {
      const updatedCart = [...cart];
      updatedCart[index].quantity -= 1;
      updateCart(updatedCart);
    } else {
      const updatedCart = cart.filter((_, i) => i !== index);
      updateCart(updatedCart);
    }
  };

  return (
    <Layout>
      <div className="cart-container">
        {cart.length === 0 ? (
          <div className="empty-cart">
            <p className="text-empty">Giỏ hàng trống.</p>
          </div>
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
                      <th>Số lượng</th>
                    </tr>
                  </thead>
                  <tbody>
                    {cart.map((item, index) => (
                      <tr key={index}>
                        <td><img src={item.image} alt={item.name} className="cart-item-image" /></td>
                        <td>{item.name}</td>
                        <td>{item.price.toLocaleString()} VNĐ</td>
                        <td>
                          <button onClick={() => handleAddItem(index)}>+</button>
                          <span >{item.quantity}</span>
                          <button onClick={() => handleDecreaseItem(index)}>-</button>
                        </td>
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
                <button id="delete-cart-btn" onClick={handlePaymentDelete}>
                  Xóa đơn hàng
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
