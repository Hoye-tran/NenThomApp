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

  const handleUpdateStatus = async (orderId, newStatus) => {
    try {
      await fetch(`http://localhost:3001/orders/${orderId}`, {
        method: 'PATCH',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ status: newStatus }),
      });
      setOrder(prevOrder => ({ ...prevOrder, status: newStatus }));
    } catch (error) {
      console.error('Lỗi khi cập nhật trạng thái:', error);
    }
  };

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
        
        <div className='status-order'>
            <div className="order-status-container">
              <div className="status-text">
                Tình trạng đơn hàng: 
                <span className={`status-label ${order.status.toLowerCase().replace(' ', '-')}`}> 
                  {order.status}
                </span>
              </div>
              <div className="btn-group">
                <button className="btn-delete"
                  onClick={() => handleUpdateStatus(order.id, 'Đã hủy')}
                  disabled={order.status === 'Đã hủy' || order.status === 'Đã xác nhận'}>
                  Hủy
                </button>
                <button className="btn-confirm"
                  onClick={() => handleUpdateStatus(order.id, 'Đã xác nhận')}
                  disabled={order.status === 'Đã xác nhận' || order.status === 'Đã hủy'}>
                  Xác nhận
                </button>
              </div>
            </div>
          </div>
        <div className="order-address-container">
          <div className="order-address-header">
          <i class="bi bi-geo-alt-fill me-2"></i>
            <span className='address-label'> Địa chỉ nhận hàng</span>
          </div>
          <div className="order-address-content">
            <span className='name-order' >{buyer?.username ?? 'Không rõ'}</span>
            {' - '}
            <span >{buyer?.phone ?? 'Không rõ'}</span>
            {' - '}
            <span>{buyer?.address ?? 'Không rõ'}</span>
          </div>
        </div>
        <br></br>
        


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
