import imgDirector from '../../../assets/images/image6_director.jpg';
import { FaChevronRight } from 'react-icons/fa';
import { Link } from 'react-router-dom';

const RequestBlock = () => {
  return (
    <section className= 'border-t-2'>
      <div className='flex justify-between md:gap-x-8 my-10 p-5 md:p-10 shadow-md border-gray-200 rounded-md hover:bg-green hover:text-white transition-colors duration-300 '>
        <div className='hidden md:block'>
          <img
            className=' min-w-25 rounded-full border-2 border-white'
            src={imgDirector}
            alt='Изображение директора ФОК Здоровье'
          />
        </div>
        <div className=' flex flex-col gap-5'>
          <h2 className='text-center md:text-left'>Прямая речь</h2>
          <div className=' flex flex-col gap-4 '>
            <p className='text-center'>Уважаемые друзья!</p>
            <p>
              Рад приветствовать Вас на страницах сайта Муниципального автономного
              учреждения «Физкультурно-оздоровительный комплекс Здоровье» города
              Ноябрьска.
            </p>
            <p>
              На нашем сайте Вы сможете ознакомиться с общей информацией о
              деятельности учреждения, нормативными документами, получить сведения
              об инструкторском составе и видах спорта, культивируемых в нашем
              комплексе.
            </p>
            <p>
              Мы всегда открыты и будем рады, если сайт станет продолжением
              общения с нашим коллективом. Я надеюсь, что это знакомство будет для
              всех интересным и полезным.
            </p>
          </div>
          <div className='flex flex-col sm:flex-row justify-between items-center gap-5 text-[14px] pt-5 border-t border-t-gray-200'>
            <div className='flex gap-4'>
              <div className=' md:hidden'>
                <img
                  className='min-w-[70px]  rounded-full border-2 border-white'
                  src={imgDirector}
                  alt='Изображение директора ФОК Здоровье'
                />
              </div>
              <div className='flex flex-col justify-start gap-1'>
                <em>С уважением,</em>
                <em>директор МАУ «ФОКЗ» Виталий Викторович Ташлык</em>
              </div>
            </div>
  
            <div  >
              <Link
                to={'/about'}
                className='flex justify-center items-center hover:bg-white hover:text-green px-4 rounded  hover:outline hover:outline-white hover:outline-offset-2 cursor-pointer transition-all duration-300 '
              >
                <div className='flex gap-1 items-center'>
                  <span className='italic p-1'>Подробнее</span>
                  <FaChevronRight />
                </div>
              </Link>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default RequestBlock;
