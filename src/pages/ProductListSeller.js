import { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import "../assets/styles/ProductListSeller.css";
import { toast } from "react-toastify";
import LayoutSeller from "../components/layout/LayoutSeller";

function ProductListSeller() {
  const [products, setProducts] = useState([]);
  const navigate = useNavigate();

  useEffect(() => {
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

  const handleEdit = (id) => {
    navigate(`/edit-product/${id}`);
  };

  const handleDelete = (id) => {
    if (window.confirm("Bạn có chắc chắn muốn xóa sản phẩm này không?")) {
      fetch(`http://localhost:3001/products/${id}`, {
        method: "DELETE"
      })
        .then(res => {
          if (res.ok) {
            setProducts(prev => prev.filter(p => p.id !== id));
            toast.success("Đã xóa sản phẩm.");
          } else {
            toast.error("Không thể xóa sản phẩm.");
          }
        })
        .catch(err => {
          console.error("Lỗi xóa sản phẩm:", err);
          toast.error("Đã xảy ra lỗi khi xóa.");
        });
    }
  };

  return (
    <LayoutSeller>
      <div className="product-list-container">
        <div className="header-manage-product">
          <h2 className="text-manage-product">QUẢN LÝ SẢN PHẨM</h2>
          <Link to='/addproduct'>
            <button className="add-product-btn">Thêm sản phẩm</button>
          </Link>
        </div>
        <div className="product-list">
          {products.map(product => (
            <div key={product.id} className="product-card">
              <img src={product.productImgUrl} alt={product.productName} />
              <Link to={`/edit-product/${product.id}`} className="product-name-link">
                <h3>{product.productName}</h3>
              </Link>
              <p className="product-price">
                {product.productPrice ? product.productPrice.toLocaleString() : "N/A"} VNĐ
              </p>
              <div className="button-group">
                <button onClick={() => handleEdit(product.id)}>Sửa</button>
                <button className="delete-btn" onClick={() => handleDelete(product.id)}>Xóa</button>
              </div>
            </div>
          ))}
        </div>
      </div>

    </LayoutSeller>
  );
}

export default ProductListSeller;
