import React from 'react';
import '../../assets/styles/FooterSeller.css';
import 'bootstrap/dist/css/bootstrap.css';
function FooterSeller () {
    return (
        <footer>
            <div className='footer-container'>
                <div className="footer-quote">
                    <p>Nến chuẩn gu, chill chuẩn mood<br /> Chúc bạn một ngày tốt lành</p>
                </div>
                <div className="footer-contact">
                    <h4 className="text-contact-label">LIÊN HỆ</h4>
                    <div className="footer-icons">
                       <a href="http://facebook.com"><i className="bi bi-facebook"></i></a>
                       <a href="http://instagram.com"><i className="bi bi-instagram"></i></a>
                       <a href="http://tiktok.com"><i className="bi bi-tiktok"></i></a>
                    </div>
                </div>
                <div className="footer-copyright">
                    <h4 className="text-copyright-label">BẢN QUYỀN</h4>
                    <p className="text-copyright">© 2025 Bản quyền thuộc về hoye21</p>
                </div>
            </div>
        </footer>
    );
};
export default FooterSeller;