import React, { useState } from 'react';
import { toast} from 'react-toastify';
import { Link, useNavigate } from 'react-router-dom';
import 'react-toastify/dist/ReactToastify.css';
import '../assets/styles/Register.css';
import Layout from '../components/layout/Layout';

function Register() {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [address, setAddress] = useState('');
  const [phone, setPhone] = useState('');
  const navigate = useNavigate();
  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!username || !password || !confirmPassword || !address || !phone) {
      toast.error('Vui lòng điền đầy đủ thông tin.');
      return;
    }

    if (password !== confirmPassword) {
      toast.error('Mật khẩu và xác nhận mật khẩu không khớp.');
      return;
    }

    try {
      const response = await fetch('http://localhost:3001/buyers', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ username, password, address, phone })
      });

      if (!response.ok) {
        toast.error('Đăng ký không thành công!');
        return;
      }

      // const data = await response.json();
      // toast.error('Đăng ký thành công:', data);

      setUsername('');
      setPassword('');
      setConfirmPassword('');
      setAddress('');
      setPhone('');
      toast.success('Tạo tài khoản mới thành công!');
      navigate('/');
    } catch (error) {
      toast.error('Lỗi khi đăng ký: ' + error.message);
    }
  };

  return (
    <Layout>
      <div className="main">
        <div className="register-container">
          <form id="RegisterForm" className="register-form" onSubmit={handleSubmit}>
            <h2 className="form-title">ĐĂNG KÍ TÀI KHOẢN</h2>
            <div className="form-group">
              <label htmlFor="username">Tên đăng nhập <span className="required-mark">*</span>
              </label>
              <input
                type="text"
                id="username"
                name="username"
                placeholder="Nhập tên đăng nhập"
                value={username}
                onChange={(e) => setUsername(e.target.value)} /></div>
            <div className="form-group">
              <label htmlFor="password">
                Mật khẩu <span className="required-mark">*</span>
              </label>
              <input
                type="password"
                id="password"
                name="password"
                placeholder="Nhập mật khẩu"
                value={password}
                onChange={(e) => setPassword(e.target.value)} />
            </div>
            <div className="form-group">
              <label htmlFor="confirmpassword">
                Xác nhận mật khẩu <span className="required-mark">*</span>
              </label>
              <input
                type="password"
                id="confirmpassword"
                name="confirmpassword"
                placeholder="Xác nhận mật khẩu"
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)} />
            </div>
            <div className="form-group">
              <label htmlFor="address">
                Địa chỉ <span className="required-mark">*</span>
              </label>
              <input
                type="text"
                id="address"
                name="address"
                placeholder="Nhập địa chỉ"
                value={address}
                onChange={(e) => setAddress(e.target.value)} />
            </div>
            <div className="form-group">
              <label htmlFor="phone">
                Số điện thoại <span className="required-mark">*</span>
              </label>
              <input
                type="text"
                id="phone"
                name="phone"
                placeholder="Nhập số điện thoại"
                value={phone}
                onChange={(e) => setPhone(e.target.value)} />
            </div>
            <button type="submit" className="register-btn">Tạo tài khoản mới</button>
          </form>
          <hr></hr>
          <div className="login-redirect">
            <p>Đã có tài khoản?</p>
            <Link to="/">
              <button type="button" className="login-btn">Đăng nhập ngay</button>
            </Link>
          </div>
        </div>

      </div>
    </Layout>
  );
};

export default Register;
