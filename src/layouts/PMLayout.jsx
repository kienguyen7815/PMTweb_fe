import React from 'react';
import Header from '../components/Header';
import Sidebar from '../components/Sidebar';
import './Layout.css';

const PMLayout = ({ children }) => {
  return (
    <div className="layout">
      <Header />
      <div className="layout-content">
        {/* <Sidebar /> */}
        <main className="main-content">
          <div className="content-wrapper">
            {children}
          </div>
        </main>
      </div>
    </div>
  );
};

export default PMLayout; 