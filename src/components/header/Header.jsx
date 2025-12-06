import '../../components/header/Header.css'
import logo from '../../assets/img/BrandTaskHub.png'
import BtnPale from '../button/BtnPale'
import BtnBold from '../button/BtnBold'
import { useState, useEffect } from 'react'
import { useAuth } from '../../contexts/AuthContext'
import { useNavigate } from 'react-router-dom'

const Header = () => {
  const [isVisible, setIsVisible] = useState(true)
  const [lastScrollY, setLastScrollY] = useState(0)
  const [isDarkMode, setIsDarkMode] = useState(false)
  const { user, logout, isAuthenticated } = useAuth()
  const navigate = useNavigate()

  useEffect(() => {
    const checkBackgroundColor = () => {
      const header = document.querySelector('.header')
      if (!header) return

      const headerRect = header.getBoundingClientRect()
      const headerBottom = headerRect.bottom
      
      // Lấy element ngay bên dưới header
      const elementBelow = document.elementFromPoint(
        window.innerWidth / 2,
        headerBottom + 10
      )
      
      if (elementBelow) {
        const bgColor = window.getComputedStyle(elementBelow).backgroundColor
        
        // Chuyển đổi rgb/rgba thành giá trị brightness
        const rgb = bgColor.match(/\d+/g)
        if (rgb && rgb.length >= 3) {
          const r = parseInt(rgb[0])
          const g = parseInt(rgb[1])
          const b = parseInt(rgb[2])
          
          // Tính brightness (0-255)
          const brightness = (r * 299 + g * 587 + b * 114) / 1000
          
          // Nếu brightness > 200 thì coi là nền sáng (trắng)
          setIsDarkMode(brightness > 200)
        }
      }
    }

    const handleScroll = () => {
      const currentScrollY = window.scrollY
      
      if (currentScrollY < lastScrollY || currentScrollY < 10) {
        setIsVisible(true)
      } else if (currentScrollY > lastScrollY && currentScrollY > 100) {
        setIsVisible(false)
      }
      
      setLastScrollY(currentScrollY)
      checkBackgroundColor()
    }

    // Check ngay khi component mount
    checkBackgroundColor()
    
    // Check lại sau một khoảng ngắn để đảm bảo DOM đã render xong
    const timeoutId = setTimeout(checkBackgroundColor, 100)

    window.addEventListener('scroll', handleScroll, { passive: true })
    window.addEventListener('resize', checkBackgroundColor, { passive: true })
    
    return () => {
      window.removeEventListener('scroll', handleScroll)
      window.removeEventListener('resize', checkBackgroundColor)
      clearTimeout(timeoutId)
    }
  }, [lastScrollY])

  return (
    <header className={`header ${!isVisible ? 'header-hidden' : ''} ${isDarkMode ? 'header-light-bg' : ''}`}>
      <div className="header-container">
        <div className="header-logo">
          <img src={logo} alt="logo" className='logo-img'/>
          <p className='logo-text'>TASK HUB</p>
        </div>
        <div className="header-nav">
          <ul className="nav-list">
            <li className="nav-item">
              <a href="/" className="nav-link">Home<i className="fa-solid fa-chevron-down"></i></a>
              <a href="/about" className="nav-link">About<i className="fa-solid fa-chevron-down"></i></a>
              <a href="/services" className="nav-link">Services<i className="fa-solid fa-chevron-down"></i></a>
              <a href="/contact" className="nav-link">Contact<i className="fa-solid fa-chevron-down"></i></a>
            </li>
          </ul>
        </div>
        <div className="header-right">
          {isAuthenticated ? (
            <div style={{ display: 'flex', alignItems: 'center', gap: '15px' }}>
              <span className="user-greeting">
                Xin chào, {user?.username}
              </span>
              <BtnPale 
                style={{ width: '125px' }}
                onClick={logout}
              >
                Đăng xuất
              </BtnPale>
            </div>
          ) : (
            <>
              <BtnPale 
                style={{ width: '125px' }}
                onClick={() => navigate('/login')}
              >
                Đăng Nhập
              </BtnPale>
              <BtnBold 
                style={{ width: '125px' }}
                onClick={() => navigate('/register')}
              >
                Đăng Ký
              </BtnBold>
            </>
          )}
        </div>
      </div>
    </header>
  );
};

export default Header; 