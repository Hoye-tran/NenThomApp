import React from "react";
import '../../assets/styles/Header.css';
// import { Link } from "react-router-dom";

const Header =() => {
    return (
        <header>
        <div className="header-container">
            <a href='/productlist' className="nav-link">Nến thơm</a>
            <a href='/cart' className="nav-link">Giỏ hàng</a>
            <p className="nav-text">Đơn hàng</p>
            <p className="nav-text">Xin chào bạn</p>
        </div>
        </header>

    );
};
export default Header;