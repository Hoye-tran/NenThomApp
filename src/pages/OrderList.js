import React, { useEffect, useState } from 'react';
import "../assets/styles/OrderList.css";
import LayoutSeller from '../components/layout/LayoutSeller';
import { Link } from "react-router-dom";
import { toast } from 'react-toastify';

function OrderList() {
  const [orders, setOrders] = useState([]);
  const [buyers, setBuyers] = useState([]);
  const [filterStatus, setFilterStatus] = useState('Tất cả');
  const [searchKeyword, setSearchKeyword] = useState('');
  const [currentPage, setCurrentPage] = useState(1);
  const ordersPerPage = 10;

  useEffect(() => {
    Promise.all([
      fetch('http://localhost:3001/orders').then(res => res.json()),
      fetch('http://localhost:3001/buyers').then(res => {
        if (!res.ok) throw new Error("Không thể fetch buyers");
        return res.json();
      })
    ])
      .then(([orderData, buyerData]) => {
        setOrders(orderData);
        setBuyers(buyerData);
      })
      .catch(err => console.error("Lỗi khi tải dữ liệu:", err));
  }, []);

  const handleUpdateStatus = async (orderId, newStatus) => {
    try {
      await fetch(`http://localhost:3001/orders/${orderId}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ status: newStatus }),
      });
      setOrders(prev =>
        prev.map(order =>
          order.id === orderId ? { ...order, status: newStatus } : order
        )
      );
      toast.success("Cập nhật trạng thái thành công!");
    } catch (error) {
      console.error('Lỗi khi cập nhật trạng thái:', error);
      toast.error("Cập nhật trạng thái thất bại!");
    }
  };

  const getBuyerName = (userId) => {
    const buyer = buyers.find(b => b.id === userId);
    return buyer ? buyer.username : "Không rõ người mua";
  };

  const getBuyerAddress = (userId) => {
    const buyer = buyers.find(b => b.id === userId);
    return buyer ? buyer.address : "Không rõ địa chỉ";
  };

  const filteredOrders = orders.filter(order => {
    const buyerName = getBuyerName(order.userId).toLowerCase();
    const matchesStatus = filterStatus === 'Tất cả' || order.status === filterStatus;
    const matchesSearch = buyerName.includes(searchKeyword.toLowerCase());
    return matchesStatus && matchesSearch;
  });

  const indexOfLastOrder = currentPage * ordersPerPage;
  const indexOfFirstOrder = indexOfLastOrder - ordersPerPage;
  const currentOrders = filteredOrders.slice(indexOfFirstOrder, indexOfLastOrder);
  const totalPages = Math.ceil(filteredOrders.length / ordersPerPage);
  const pageNumbers = [];
  for (let i = 1; i <= totalPages; i++) {
    pageNumbers.push(i);
  }

  return (
    <LayoutSeller>
      <div className="order-list-container">
        <h2 className='orderlist-text'>DANH SÁCH ĐƠN HÀNG</h2>

        <div className="search-container">
          <div className="search-wrapper">
            <input
              type="text"
              placeholder="Tìm theo tên người mua..."
              value={searchKeyword}
              onChange={(e) => setSearchKeyword(e.target.value)}
              className="search-input"
            />
            <i className="bi bi-search search-icon"></i>
          </div>

          <div className="filter-container">
            <select
              id="filterStatus"
              className="filter-dropdown input-base"
              value={filterStatus}
              onChange={(e) => setFilterStatus(e.target.value)}
            >
              <option value="Tất cả">Tất cả</option>
              <option value="Đang xử lý">Đang xử lý</option>
              <option value="Đã xác nhận">Đã xác nhận</option>
              <option value="Đã hủy">Đã hủy</option>
            </select>
          </div>
        </div>

        <table className="order-table">
          <thead>
            <tr>
              <th>ID đơn hàng</th>
              <th>Người mua</th>
              <th>Địa chỉ</th>
              <th>Tổng tiền</th>
              <th>Trạng thái</th>
              <th>Thao tác</th>
            </tr>
          </thead>
          <tbody>
            {currentOrders.map(order => (
              <tr key={order.id}>
                <td>
                  <Link to={`/orders/${order.id}`} className="order-id-link">
                    {order.id}
                  </Link>
                </td>
                <td>{getBuyerName(order.userId)}</td>
                <td>{getBuyerAddress(order.userId)}</td>
                <td>{order.totalPrice.toLocaleString()} VNĐ</td>
                <td>
                  <span className={`status-label ${order.status === 'Đã xác nhận' ? 'confirmed' : order.status === 'Đã hủy' ? 'cancelled' : 'processing'}`}>
                    {order.status}
                  </span>
                </td>
                <td>
                  <div className="btn-group">
                    <button className="btn-delete" onClick={() => handleUpdateStatus(order.id, 'Đã hủy')}>Hủy</button>
                    <button className="btn-confirm" onClick={() => handleUpdateStatus(order.id, 'Đã xác nhận')}>Xác nhận</button>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>

        <div className="pagination">
          <button onClick={() => setCurrentPage(currentPage - 1)} disabled={currentPage === 1}>Trước</button>
          {pageNumbers.map((number) => (
            <button key={number} onClick={() => setCurrentPage(number)}>{number}</button>
          ))}
          <button onClick={() => setCurrentPage(currentPage + 1)} disabled={currentPage === totalPages}>Sau</button>
        </div>
      </div>
    </LayoutSeller>
  );
}

export default OrderList;
