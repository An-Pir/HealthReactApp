import { useState, useEffect } from 'react';
import { FaAngleDoubleUp } from "react-icons/fa";

const ScrollToTopButton = () => {
  const [visible, setVisible] = useState(false);

  // проверяю позицию скролла
  const toggleVisible = () => {
    const scrolled = window.pageYOffset;
    // показываю кнопку, если скролл больше 
    if (scrolled > 20) {
      setVisible(true);
    } else {
      setVisible(false);
    }
  };

  // плавно скроллю наверх
  const scrollToTop = () => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  useEffect(() => {
    window.addEventListener('scroll', toggleVisible);
    return () => window.removeEventListener('scroll', toggleVisible);
  }, []);

  return (
    <button
      onClick={scrollToTop}
      className={
        `fixed bottom-3 right-3 p-3 lg:p-5 rounded-full bg-green text-white shadow-lg
          cursor-pointer 
         ${visible ? 'animate-pulse opacity-100 ' : 'opacity-0 pointer-events-none '}`
      }
      aria-label="Наверх"
    >
      <FaAngleDoubleUp className=' lg:w-10 lg:h-10' />
    </button>
  );
};

export default ScrollToTopButton;