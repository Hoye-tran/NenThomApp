import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { toast } from 'react-toastify';
import Layout from '../components/layout/Layout';
import '../assets/styles/Login.css';

function Login(){
    const [username, setUsername] = useState('');
    const [password, setPassword] = useState('');
    const navigate = useNavigate();

    const handleClick = () => {
        navigate('/register');
    }

    const handleSubmit = async(event) => {
        event.preventDefault();

        try {
            const buyersResponse = await fetch('http://localhost:3001/buyers');
            if (!buyersResponse.ok) {
                throw new Error(`HTTP error! status: ${buyersResponse.status}`);
            }
            const buyers = await buyersResponse.json();


            const sellersResponse = await fetch('http://localhost:3001/seller');
            if (!sellersResponse.ok) {
                throw new Error(`HTTP error! status: ${sellersResponse.status}`);
            }
            const sellers = await sellersResponse.json();

            const authenticatedBuyer = buyers.find(
                (user) => user.username === username && user.password === password
            );

            if (authenticatedBuyer) {
                localStorage.setItem("currentUser", JSON.stringify(authenticatedBuyer));
                console.log('Đăng nhập thành công với vai trò người mua!', authenticatedBuyer);
                toast.success('Đăng nhập thành công!');
                navigate('/productlist'); 
                return;
            }

           
            const authenticatedSeller = sellers.find(
                (user) => user.username === username && user.password === password
            );

            if (authenticatedSeller) {
                localStorage.setItem("currentUser", JSON.stringify(authenticatedSeller));
                console.log('Đăng nhập thành công với vai trò người bán!', authenticatedSeller);
                toast.success('Đăng nhập thành công!');
                navigate('/productlistseller'); 
                return; 
            }

            
            toast.error('Tên đăng nhập hoặc mật khẩu không đúng.');

        } catch (error) {
            console.error('Lỗi khi gọi API:', error);
            toast.error('Đã xảy ra lỗi khi đăng nhập.');
        }
    };

    return(
        <Layout>
        <div className="main">
        <h2 className="label-register">ĐĂNG NHẬP</h2>
        <form id="LoginForm" onSubmit={handleSubmit}>
            <div className="form-group">
                <label htmlFor="loginUsername" className='username'>Tên đăng nhập <span className="required-mark">*</span></label>
                <input
                    type="text"
                    id="loginUsername"
                    name="loginUsername"
                    placeholder="Nhập tên đăng nhập"
                    value={username}
                    onChange={(e) => setUsername(e.target.value)}
                />
            </div>
            <div className="form-group">
                <label htmlFor="loginPassword" className='password'>Mật khẩu <span className="required-mark">*</span></label>
                <input
                    type="password"
                    id="loginPassword"
                    name="loginPassword"
                    placeholder="Nhập mật khẩu"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                />
            </div>
            <button type="submit" className="login-btn">Đăng nhập</button>
        </form>
        <hr></hr>
        <div className="login-link">
            <h5 className='text-register'>Chưa có tài khoản?</h5>
            <button type="button" className="register-btn" onClick={handleClick}>Đăng ký</button>
        </div>
    </div>
    </Layout>
    );
};
export default Login;