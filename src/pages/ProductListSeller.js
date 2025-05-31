import { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import "../assets/styles/ProductListSeller.css";
import { toast } from "react-toastify";
import LayoutSeller from "../components/layout/LayoutSeller";

function ProductListSeller() {
  const [products, setProducts] = useState([]);
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 12; 
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
        method: "DELETE",
      })
        .then((res) => {
          if (res.ok) {
            setProducts((prev) => prev.filter((p) => p.id !== id));
            toast.success("Đã xóa sản phẩm.");
            if (
              (currentPage - 1) * itemsPerPage >=
                products.length - 1 &&
              currentPage > 1
            ) {
              setCurrentPage(currentPage - 1);
            }
          } else {
            toast.error("Không thể xóa sản phẩm.");
          }
        })
        .catch((err) => {
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
        </div>
        <Link to="/addproduct">
          <button className="add-product-btn">Thêm sản phẩm</button>
        </Link>
        <div className="product-list">
          {currentItems.map((product) => (
            <div key={product.id} className="product-card">
              <img src={product.productImgUrl} alt={product.productName} />
              <Link
                to={`/edit-product/${product.id}`}
                className="product-name-link"
              >
                <h3>{product.productName}</h3>
              </Link>
              <p className="product-price">
                {product.productPrice
                  ? product.productPrice.toLocaleString()
                  : "N/A"}{" "}
                VNĐ
              </p>
              <div className="button-group">
                <button onClick={() => handleEdit(product.id)}>Sửa</button>
                <button
                  className="delete-btn"
                  onClick={() => handleDelete(product.id)}
                >
                  Xóa
                </button>
              </div>
            </div>
          ))}
        </div>
      </div>

      <div className="pagination">
        <button
          onClick={() => setCurrentPage((prev) => Math.max(prev - 1, 1))}
          disabled={currentPage === 1}>Trước</button>

        {pageNumbers.map((number) => (
          <button
            key={number}
            onClick={() => setCurrentPage(number)}
            className={currentPage === number ? "active-page" : ""}>{number}</button>
        ))}

        <button
          onClick={() => setCurrentPage((prev) => Math.min(prev + 1, totalPages))}
          disabled={currentPage === totalPages}>Sau</button>
      </div>
    </LayoutSeller>
  );
}

export default ProductListSeller;
