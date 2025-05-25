import { useState, useEffect } from 'react';
import slide1 from '../../../assets/images/image2.jpeg';
import slide2 from '../../../assets/images/image3.jpeg';
import slide3 from '../../../assets/images/image4.png';
import slide4 from '../../../assets/images/image5.jpeg';

const slides = [
  { src: slide1, caption: 'Тестирование нормативов "ГТО"' },
  { src: slide2, caption: 'Открытый урок по скандинавской ходьбе' },
  { src: slide3, caption: 'Стальной пресс' },
  { src: slide4, caption: 'Эстетика тенниса' },
];

const Slider = () => {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [isHovered, setIsHovered] = useState(false); // состояние для наведения

  // Автосмена при условии, что мышь не наведена
  useEffect(() => {
    if (isHovered) return; // не запускать интервал, если наведен курсор

    const interval = setInterval(() => {
      setCurrentIndex(prev => (prev === slides.length - 1 ? 0 : prev + 1));
    }, 3000);

    return () => clearInterval(interval);
  }, [isHovered]); 

  const prevSlide = () => {
    setCurrentIndex(prev => (prev === 0 ? slides.length - 1 : prev - 1));
  };
  const nextSlide = () => {
    setCurrentIndex(prev => (prev === slides.length - 1 ? 0 : prev + 1));
  };
  const goToSlide = (index) => {
    setCurrentIndex(index);
  };

  return (
    <section className='border-t-2 border-green'>
      
      <h2 className='text-center lg:text-3xl my-10 '>Фотоновости</h2>
      <div className='relative w-full max-w-3xl mx-auto overflow-hidden my-5'>
        {/* Подпись сверху */}
        <div className='absolute top-5 left-1/2 transform -translate-x-1/2 bg-electrician/80 text-[12px] md:text-lg lg:text-xl text-dark text-lg text-center px-4 py-2 rounded shadow-md z-10'>
          {slides[currentIndex].caption}
        </div>

        {/* Изображение с навигацией */}
        <img
          src={slides[currentIndex].src}
          alt={`Слайд ${currentIndex + 1}`}
          className='w-full h-auto rounded-md shadow-lg transition-transform duration-500'
          onMouseEnter={() => setIsHovered(true)} // при наведении
          onMouseLeave={() => setIsHovered(false)} // при уходе
        />

        {/* Стрелки навигации */}
        <button
          onClick={prevSlide}
          className='absolute top-1/2 left-1 sm:left-4 transform -translate-y-1/2 bg-white p-1 sm:p-2 rounded-full shadow-md hover:bg-electrician cursor-pointer'
        >
          &#8592;
        </button>
        <button
          onClick={nextSlide}
          className='absolute top-1/2 right-1 sm:right-4 transform -translate-y-1/2 bg-white p-1 sm:p-2 rounded-full shadow-md hover:bg-electrician cursor-pointer'
        >
          &#8594;
        </button>

        {/* Индикаторы снизу */}
        <div className='absolute bottom-6 left-1/2 transform -translate-x-1/2 flex space-x-5 z-10'>
          {slides.map((_, index) => (
            <button
              key={index}
              onClick={() => goToSlide(index)}
              className={`w-2 h-2 md:w-4 md:h-4 rounded-full cursor-pointer ${
                index === currentIndex ? 'bg-electrician' : 'bg-gray-300'
              }`}
            />
          ))}
        </div>
      </div>
    </section>
  );
};

export default Slider;