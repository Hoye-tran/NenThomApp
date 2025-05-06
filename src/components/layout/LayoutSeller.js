
import React from 'react';
import HeaderSeller from './HeaderSeller';
import FooterSeller from './FooterSeller';

function LayoutSeller({ children }) {
  return (
    <div>
      <HeaderSeller />
      <main>{children}</main> {}
      <FooterSeller />
    </div>
  );
}

export default LayoutSeller;