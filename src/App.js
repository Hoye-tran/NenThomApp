// import logo from './logo.svg';
//import { ToastContainer } from 'react-toastify';
import './App.css';
import { ToastContainer } from "react-toastify";
import { BrowserRouter as Router, Routes, Route} from 'react-router-dom';
import Register from './pages/Register';
//import Header from './components/Header';
//import Footer from './components/Footer';
import Login from './pages/Login';
import ProductList from './pages/ProductList';
import Cart from './pages/Cart';
import Payment from './pages/Payment';
import ProductListSeller from './pages/ProductListSeller';
import AddProduct from './pages/AddProduct';
import ProductDetail from './pages/DetailProduct';
import EditProduct from './pages/EditProduct';
import OrderList from './pages/OrderList';
import OrderDetail from './pages/OrderDetail';
function App() {
  return (
    <Router>
      <Routes>
        <Route path='/' element={<Login/>}/>
        <Route path='/register' element={<Register/>}/>
        <Route path='/productlist' element={<ProductList/>}/>
        <Route path='/cart' element={<Cart/>}/>
        <Route path='/payment' element={<Payment/>}/>
        <Route path='/productlistseller' element={<ProductListSeller/>}/>
        <Route path='/addproduct' element={<AddProduct/>}/>
        <Route path="/products/:id" element={<ProductDetail />} />
        <Route path="/edit-product/:id" element={<EditProduct />} />
        <Route path="/orderlist" element={<OrderList />} />
        <Route path="/orders/:id" element={<OrderDetail />} />
    </Routes>
      <ToastContainer position="top-right" autoClose={2000} />
    </Router>
  );
}

export default App;
