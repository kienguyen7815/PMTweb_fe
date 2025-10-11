import '../../components/header/Header.css'
import logo from '../../assets/img/BrandTaskHub.png'
import BtnPale from '../button/BtnPale'
import BtnBold from '../button/BtnBold'
import { useState, useEffect } from 'react'

const Header = () => {
  const [isVisible, setIsVisible] = useState(true)
  const [lastScrollY, setLastScrollY] = useState(0)

  useEffect(() => {
    const handleScroll = () => {
      const currentScrollY = window.scrollY
      
      if (currentScrollY < lastScrollY || currentScrollY < 10) {
        setIsVisible(true)
      } else if (currentScrollY > lastScrollY && currentScrollY > 100) {
        setIsVisible(false)
      }
      
      setLastScrollY(currentScrollY)
    }

    window.addEventListener('scroll', handleScroll, { passive: true })
    
    return () => {
      window.removeEventListener('scroll', handleScroll)
    }
  }, [lastScrollY])

  return (
    <header className={`header ${!isVisible ? 'header-hidden' : ''}`}>
      <div className="header-container">
        <div className="header-logo">
          <img src={logo} alt="logo" className='logo-img'/>
          <h1 className='logo-text'>TASK HUB</h1>
        </div>
        <div className="header-nav">
          <ul className="nav-list">
            <li className="nav-item">
              <a href="/" className="nav-link">Home <i class="fa-solid fa-chevron-down"></i></a>
              <a href="/" className="nav-link">About <i class="fa-solid fa-chevron-down"></i></a>
              <a href="/" className="nav-link">Services <i class="fa-solid fa-chevron-down"></i></a>
              <a href="/" className="nav-link">Contact <i class="fa-solid fa-chevron-down"></i></a>
            </li>
          </ul>
        </div>
        <div className="header-right">
          <BtnPale style={{ width: '125px' }}>Đăng Nhập</BtnPale>
          <BtnBold style={{ width: '125px' }}>Đăng Ký</BtnBold>
        </div>
      </div>
    </header>
  );
};

export default Header; 