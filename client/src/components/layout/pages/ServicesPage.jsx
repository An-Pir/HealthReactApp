import { useEffect, useState, useContext } from 'react';
import { useParams } from 'react-router-dom';
import imgDefault from '../../../assets/images/img7.jpg'; // Убедитесь, что путь правильный
import axios from 'axios';
import { WindowSizeContext } from '../../../context/WindowSizeContext'; // Импортируем контекст
import Loading from '../../ui/Loading';

const ServicesPage = () => {
  const [services, setServices] = useState([]);
  const { id } = useParams(); // для страницы детали услуги
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null); // Для обработки ошибок
  const { width } = useContext(WindowSizeContext); // Используем контекст для получения размера окна

  // Загружаем все услуги
  useEffect(() => {
    const fetchServices = async () => {
      setLoading(true);
      setError(null); // Сбрасываем ошибки перед новым запросом
      try {
        const response = await axios.get('/api/services');
        setServices(response.data);
      } catch (error) {
        console.error(error);
        setError('Ошибка при загрузке данных. Попробуйте позже.');
      } finally {
        setLoading(false);
      }
    };

    fetchServices();
  }, []);

  // Если есть id — показываем деталь услуги
  const serviceDetail = id
    ? services.find((service) => service._id === id)
    : null;

  // Состояния аккордеонов для списка услуг
  const [accordionStates, setAccordionStates] = useState({});

  // Функция для переключения аккордеона
  const toggleAccordion = (serviceId) => {
    setAccordionStates((prevStates) => ({
      ...prevStates,
      [serviceId]: !prevStates[serviceId],
    }));
  };

  if (loading)
    return (
      <Loading />
    ); // Индикатор загрузки
  if (error)
    return (
      <p className='text-red-500 md:text-3xl font-bold flex justify-center '>
        {error}
      </p>
    ); // Сообщение об ошибке

  return (
    <main className='container mx-auto p-6 bg-white rounded-lg shadow-lg'>
      <h1 className='lg:my-4 text-center'>Услуги</h1>

      {/* Если есть id, показываем деталь услуги */}
      {serviceDetail ? (
        <div className='mb-6'>
          <h2 className='text-2xl font-semibold mb-4'>{serviceDetail.name}</h2>
          <img
            src={`/api/services/image/${serviceDetail._id}`} // Получаем изображение по ID
            alt={serviceDetail.name}
            className='w-full h-auto mb-4 rounded'
            onError={(e) => {
              e.target.onerror = null; // предотвращает зацикливание
              e.target.src = imgDefault; // Путь к изображению-заменителю
            }}
          />

          {/* Для мобильных устройств */}
          {width < 768 ? (
            <>
              <button
                onClick={() => setAccordionOpenDetail((prev) => !prev)}
                className='mb-2 px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600 transition flex items-center'
              >
                <span>
                  {isAccordionOpenDetail
                    ? 'Скрыть описание'
                    : 'Показать описание'}
                </span>
                <svg
                  className={`w-5 h-5 transform transition-transform duration-300 ml-2 ${isAccordionOpenDetail ? 'rotate-180' : ''}`}
                  fill='none'
                  stroke='currentColor'
                  viewBox='0 0 24 24'
                >
                  <path
                    strokeLinecap='round'
                    strokeLinejoin='round'
                    strokeWidth={2}
                    d='M19 9l-7 7-7-7'
                  />
                </svg>
              </button>
              {isAccordionOpenDetail && (
                <p className='text-gray-700'>{serviceDetail.description}</p>
              )}
            </>
          ) : (
            // Для десктопных устройств
            <p className='text-gray-700 mb-4'>{serviceDetail.description}</p>
          )}

          {/* Отображение цен, если они есть */}
          {serviceDetail.priceChildren && (
            <p className='lg:text-lg md:font-bold'>
              Стоимость для детей:{' '}
              <span className='text-red-500'>
                {serviceDetail.priceChildren}
              </span>{' '}
              ₽
            </p>
          )}
          {serviceDetail.priceAdults && (
            <p className='lg:text-lg md:font-bold'>
              Стоимость для взрослых:{' '}
              <span className='text-red-500'>{serviceDetail.priceAdults}</span>{' '}
              ₽
            </p>
          )}
        </div>
      ) : (
        <ul className='space-y-6'>
          {services.map((service) => (
            <li key={service._id} className='flex flex-col gap-2 lg:gap-5 border-b pb-4'>
              <h2 className='text-xl font-semibold text-green-600'>
                {service.name}
              </h2>
              <img
                src={`/api/services/image/${service._id}`} // Получаем изображение по ID
                alt={service.name}
                className='w-full h-auto mb-2 rounded'
                onError={(e) => {
                  e.target.onerror = null;
                  e.target.src = imgDefault; // Путь к изображению-заменителю
                }}
              />

              {/* Для мобильных устройств */}
              {width < 768 ? (
                <>
                  <button
                    onClick={() => toggleAccordion(service._id)}
                    aria-expanded={accordionStates[service._id]}
                    className='mb-2 px-4 py-2 bg-dark text-white rounded hover:bg-electrician hover:text-dark transition flex items-center'
                  >
                    <span>
                      {accordionStates[service._id]
                        ? 'Скрыть описание'
                        : 'Показать описание'}
                    </span>
                    <svg
                      className={`w-5 h-5 transform transition-transform duration-300 ml-2 ${accordionStates[service._id] ? 'rotate-180' : ''}`}
                      fill='none'
                      stroke='currentColor'
                      viewBox='0 0 24 24'
                    >
                      <path
                        strokeLinecap='round'
                        strokeLinejoin='round'
                        strokeWidth={2}
                        d='M19 9l-7 7-7-7'
                      />
                    </svg>
                  </button>
                  {accordionStates[service._id] && (
                    <p className='text-gray-700'>{service.description}</p>
                  )}
                </>
              ) : (
                // Для десктопных устройств
                <p className='text-gray-700 mb-4'>{service.description}</p>
              )}

              {/* Отображение цен, если они есть */}
              <div className='flex flex-col gap-2'>
                {service.priceChildren && (
                  <p className='lg:text-lg md:font-bold'>
                    Стоимость для детей:{' '}
                    <span className='text-red-500'>
                      {service.priceChildren}
                    </span>{' '}
                    ₽
                  </p>
                )}
                {service.priceAdults && (
                  <p className='lg:text-lg md:font-bold'>
                    Стоимость для взрослых:{' '}
                    <span className='text-red-500'>{service.priceAdults}</span>{' '}
                    ₽
                  </p>
                )}
              </div>
            </li>
          ))}
        </ul>
      )}
    </main>
  );
};

export default ServicesPage;
