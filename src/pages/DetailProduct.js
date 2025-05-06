import { useParams } from 'react-router-dom';
import { useEffect, useState } from 'react';
import LayoutSeller from '../components/layout/LayoutSeller';
import '../assets/styles/OrderDetail.css'; 

const OrderDetail = () => {
  const { id } = useParams(); 
  const [order, setOrder] = useState(null); 
  const [buyers, setBuyers] = useState([]); 
  const [items, setItems] = useState([]);
  const [products, setProducts] = useState([]);

  useEffect(() => {
    Promise.all([
      fetch(`http://localhost:3001/orders/${id}`).then(res => res.json()),
      fetch(`http://localhost:3001/order_items?orderId=${id}`).then(res => res.json()),
      fetch(`http://localhost:3001/buyers`).then(res => res.json()),
      fetch(`http://localhost:3001/products`).then(res => res.json())
    ])
    .then(([orderData, itemData, buyersData, productData]) => {
      setOrder(orderData);
      setItems(itemData);
      setBuyers(buyersData);
      setProducts(productData);
    })
    .catch(err => console.error("Lỗi khi tải dữ liệu:", err));
  }, [id]);

  if (!order || !buyers.length || !products.length) {
    return <p>Đang tải dữ liệu...</p>; 
  }

  const buyer = buyers.find(b => b.id === order.userId);

  return (
    <LayoutSeller>
      <div className="order-detail-container">
        <a href='/orderlist'>
          <button className='back-btn'>
            <i className="bi bi-arrow-left"></i> Quay lại
          </button>
        </a>
        <h2 className='orderdetail-text'>CHI TIẾT ĐƠN HÀNG</h2>

        <table className="order-info-table">
          <tbody>
            <tr>
              <td><strong>Mã đơn hàng:</strong></td>
              <td>{order.id}</td>
            </tr>
            <tr>
              <td><strong>Trạng thái:</strong></td>
              <td>{order.status}</td>
            </tr>
            <tr>
              <td><strong>Tổng tiền:</strong></td>
              <td>{order.totalPrice?.toLocaleString() ?? 'Chưa có thông tin'} VNĐ</td>
            </tr>
          </tbody>
        </table>

        <div className="order-section">
          <h3>Thông tin khách hàng</h3>
          <table className="customer-info-table">
            <tbody>
              <tr>
                <td><strong>Tên:</strong></td>
                <td>{buyer?.username ?? 'Không rõ'}</td>
              </tr>
              <tr>
                <td><strong>Địa chỉ:</strong></td>
                <td>{buyer?.address ?? 'Không rõ'}</td>
              </tr>
              <tr>
                <td><strong>SĐT:</strong></td>
                <td>{buyer?.phone ?? 'Không rõ'}</td>
              </tr>
            </tbody>
          </table>
        </div>
        <h3>Sản phẩm trong đơn hàng</h3>
        <table className="product-table">
          <thead>
            <tr>
              <th>Hình ảnh</th>
              <th>Tên sản phẩm</th>
              <th>Số lượng</th>
              <th>Đơn giá</th>
              <th>Thành tiền</th>
            </tr>
          </thead>
          <tbody>
            {items.length > 0 ? items.map((item, index) => {
              const product = products.find(p => String(p.id) === String(item.productId));
              return (
                <tr key={index}>
                  {product ? (
                    <>
                      <td><img src={product.productImgUrl} alt={product.productName} width="80" /></td>
                      <td>{product.productName}</td>
                      <td>{item.quantity}</td>
                      <td>{item.price?.toLocaleString() ?? '0'} VNĐ</td>
                      <td>{(item.quantity * item.price).toLocaleString()} VNĐ</td>
                    </>
                  ) : (
                    <td colSpan="5">Sản phẩm không tồn tại</td>
                  )}
                </tr>
              );
            }) : (
              <tr><td colSpan="5">Không có sản phẩm trong đơn hàng</td></tr>
            )}
          </tbody>
        </table>
      </div>
    </LayoutSeller>
  );
};

export default OrderDetail;
