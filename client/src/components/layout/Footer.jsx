import { useContext } from 'react';
import { NavLink, useLocation, useNavigate } from 'react-router-dom';
import logo from '../../assets/images/logo1.png';
import { FaVk, FaTelegramPlane, FaWhatsapp } from 'react-icons/fa';
import { WindowSizeContext } from '../../context/WindowSizeContext';

const Footer = ({ pages }) => {
  const location = useLocation();
  const navigate = useNavigate();
  // если в пути /login или /registration — не рендерим футер
  if (['/login', '/registration'].includes(location.pathname)) {
    return null;
  }

  const currentYear = new Date().getFullYear();

  const { width } = useContext(WindowSizeContext);
  const isMobile = width < 768; // md = 768px

  const handleIconVkClick = () => {
    window.open('https://vk.com/zdorove89');
  };
  const handleIconTgClick = () => {
    window.open('https://t.me/fokz89');
  };
  const handleIconOkClick = () => {
    window.open('https://ok.ru/zdorove89');
  };
  const handleLogoClick = () => {
    navigate('/');
  };

  return (
    <footer className='bg-dark  '>
      <div className='container m-auto p-2  md:py-3 xl:py-2 flex flex-wrap items-center justify-center md:justify-evenly gap-5'>
        <div
          onClick={handleLogoClick}
          className='hidden md:block cursor-pointer'
        >
          <img src={logo} alt='Логотип' className='w-[60px] lg:w-[100px]' />
        </div>

        <nav className='hidden md:block text-white text-sm lg:text-lg'>
          {!isMobile && (
            <ul className='grid grid-cols-2 justify-items-center gap-x-5 text-sm xl:text-base'>
              {pages.map(({ name, path }, idx) => (
                <li key={idx}>
                  <NavLink
                    to={path}
                    className={({ isActive }) =>
                      `block hover:text-electrician transition-colors
           ${isActive ? 'text-electrician ' : 'text-white'}`
                    }
                  >
                    {name}
                  </NavLink>
                </li>
              ))}
            </ul>
          )}
        </nav>

        <div className='text-center'>
          <h4 className='text-white/50 mb-2'>Мы в соцсетях:</h4>
          <div className='flex justify-center gap-5'>
            <FaVk
              onClick={handleIconVkClick}
              className='text-white w-4 md:w-8 cursor-pointer hover:text-electrician'
            />
            <FaTelegramPlane
              onClick={handleIconTgClick}
              className='text-white w-4 md:w-8 cursor-pointer hover:text-electrician'
            />
            <FaWhatsapp
              onClick={handleIconOkClick}
              className='text-white w-4 md:w-8 cursor-pointer hover:text-electrician'
            />
          </div>
        </div>
      </div>

      <p className='container m-auto text-electrician text-center text-sm py-3 border-t border-t-gray-700'>
        &copy; {currentYear} | Все права защищены
      </p>
    </footer>
  );
};

export default Footer;
