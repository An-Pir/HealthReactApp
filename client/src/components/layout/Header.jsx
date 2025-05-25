import { useState, useRef, useEffect } from 'react';
import { NavLink, useNavigate } from 'react-router-dom';
import logo from '../../assets/images/logo1.png';
import Button from '../ui/Button';

const Header = ({ pages, isAuth }) => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const navigate = useNavigate();
  const menuRef = useRef(null);

  // Закрытие меню при клике вне
  useEffect(() => {
    const handleClickOutside = (e) => {
      if (menuRef.current && !menuRef.current.contains(e.target)) {
        setIsMenuOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const handleLogoClick = () => {
    navigate('/')
  }

  return (
    <header className='bg-dark '>
      <div
        className='container m-auto p-7 flex items-center justify-between relative
                      h-[70px] lg:h-[100px]'
      >
        {/* Логотип — переходим на "/" */}
        <img
          src={logo}
          alt='Логотип'
          className='w-[70px] lg:w-[100px] object-contain cursor-pointer'
          onClick={handleLogoClick}
        />

        {/* Кнопка-гамбургер (для мобильных) */}
        <button
          className='lg:hidden text-white text-2xl focus:outline-none cursor-pointer
                     hover:text-electrician'
          onClick={() => setIsMenuOpen((prev) => !prev)}
        >
          ☰
        </button>

        {/* Навигация */}
        <nav
          ref={menuRef}
          className={`
            absolute top-full left-0 w-full bg-dark
            transition-all duration-300 ease-in-out

            ${
              isMenuOpen
                ? 'max-h-screen overflow-auto'
                : 'max-h-0 overflow-hidden'
            }

            lg:static lg:max-h-full lg:overflow-visible
            lg:flex lg:items-center lg:gap-x-4 lg:w-auto
          `}
        >
          <ul className='flex flex-col lg:flex-row gap-y-2 lg:gap-x-4 p-4 lg:p-0'>
            {pages.map(({ name, path }) => (
              <li key={path}>
                <NavLink
                  to={path}
                  onClick={() => setIsMenuOpen(false)}
                  className={({ isActive }) =>
                    `block hover:text-electrician transition-colors
           ${
             isActive
               ? 'text-electrician font-bold'
               : 'text-white'
           }`
                  }
                >
                  {name}
                </NavLink>
              </li>
            ))}
          </ul>
        </nav>

        {/* Кнопка входа */}
        {!isAuth && <Button text='Войти' onClick={() => navigate('/login')} />}
      </div>
    </header>
  );
};

export default Header;
