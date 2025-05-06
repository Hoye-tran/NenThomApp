import React from "react";
import '../../assets/styles/HeaderSeller.css';

const HeaderSeller =() => {
    return (
        <header>
            <div className="header-container" id="header-container">
                        <a href ='/productlistseller'className="productlistseller-link">Nến thơm</a>
                        <p>Doanh thu</p>
                        <a href='/orderlist' className="order-link"> Đơn hàng</a>
                        <p>Xin chào bạn</p>
            </div>
        </header>
    );
};
export default HeaderSeller;