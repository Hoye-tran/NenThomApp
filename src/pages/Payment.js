import React, { useEffect, useState } from 'react';
import Layout from '../components/layout/Layout';
import '../assets/styles/Payment.css';
import { Link } from "react-router-dom";

function Payment() {
  const [amount, setAmount] = useState(null);
  const [qrUrl, setQrUrl] = useState('');

  useEffect(() => {
    const paymentAmount = localStorage.getItem('paymentAmount');
    
    console.log("paymentAmount:", paymentAmount);

    if (paymentAmount !== null && paymentAmount !== undefined && !isNaN(paymentAmount)) {
      const formattedAmount = Number(paymentAmount).toLocaleString();
      setAmount(formattedAmount);

      const bankBin = '970448';
      const accountNo = '0050100023019006';
      const description = 'THANHTOAN';
      const accountName = 'Tran Thi Hoang Yen';

      const qr = `https://img.vietqr.io/image/${bankBin}-${accountNo}-compact2.png?amount=${paymentAmount}&addInfo=${description}&accountName=${accountName}`;
      setQrUrl(qr);
    } else {
      setAmount("0");
    }
  }, []);

  const handlePaymentSuccess = () => {
    localStorage.removeItem("cart");
  };

  return (
    <Layout>
      <h2 className='text-payment'>THANH TOÁN</h2>
      <div className="payment-container">
        <h2>Số tiền cần thanh toán:</h2>
        <p id="amount">{amount ? amount : "0"} VNĐ</p>
        {/* Kiểm tra qrUrl trước khi render ảnh */}
        {qrUrl ? <img id="qr-code" src={qrUrl} alt="QR Code thanh toán" /> : null}
      </div>
      <Link to='/productlist'>
        <button
          id='payment-success-btn'
          className='payment-success-btn'
          onClick={handlePaymentSuccess}
        >
          Đã thanh toán
        </button>
      </Link>
    </Layout>
  );
}

export default Payment;
