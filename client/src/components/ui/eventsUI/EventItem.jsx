import { useState, useEffect, useRef, useContext } from 'react';
import axios from 'axios';
import toast from 'react-hot-toast';
import { AuthContext } from '../../../context/AuthContext';
import EventButton from '../../ui/eventsUI/EventButton';
import { FaAngleDoubleUp, FaAngleDoubleDown } from 'react-icons/fa';
import DefaultImg from '../../../assets/images/img7.jpg'; // Убедитесь, что путь правильный

const EventItem = ({ event }) => {
  const { token, addRegisteredEvent } = useContext(AuthContext);
  const isAuthenticated = Boolean(token);

  // Локальный флаг «уже записан»
  const [registered, setRegistered] = useState(event.registered || false);
  const [loadingReg, setLoadingReg] = useState(false);

  // Для разворачивания полного текста
  const [isOpen, setIsOpen] = useState(false);
  const [maxHeight, setMaxHeight] = useState('0px');
  const contentRef = useRef(null);

  useEffect(() => {
    if (contentRef.current) {
      setMaxHeight(isOpen ? `${contentRef.current.scrollHeight}px` : '0px');
    }
  }, [isOpen, event.fullText]);

  // Синхронизация стейта, если проп event.registered поменялся
  useEffect(() => {
    setRegistered(event.registered || false);
  }, [event.registered]);

  const eventDate = new Date(event.date);
  const now = new Date();
  const isPast = eventDate < now;

  // Функция, в которой проверяем всё перед регистрацией
  const handleClick = () => {
    if (!isAuthenticated) {
      toast.error('Запись доступна только авторизованным пользователям');
      return;
    }

    if (registered) {
      toast.error('Вы уже зарегистрированы на это мероприятие');
      return;
    }

    // Если всё ок — вызываем регистрацию
    handleRegister();
  };

  // Реальная регистрация в API
  const handleRegister = async () => {
    setLoadingReg(true);
    try {
      const api = axios.create({
        baseURL: import.meta.env.VITE_API_URL || 'http://localhost:5000',
        headers: { Authorization: `Bearer ${token}` },
      });

      await api.post(`/api/events/${event._id}/register`);
      addRegisteredEvent(event._id);
      toast.success(`Вы успешно записались на "${event.title}"`);
    } catch (err) {
      console.error(err);
      toast.error('Не удалось записаться. Попробуйте ещё раз.');
    } finally {
      setLoadingReg(false);
    }
  };

  // Определите, какое изображение использовать
  const imgSrc = event.imageUrl && event.imageUrl.trim() ? event.imageUrl : DefaultImg;

  return (
    <li
      className='p-4 rounded shadow-xl hover:shadow-lg transition-shadow mb-4 cursor-pointer'
      onClick={() => setIsOpen((o) => !o)} // обработчик клика на li
    >
      <div className='flex flex-col md:flex-row justify-between items-start md:items-center'>
        <div className='flex-1'>
          <h2 className='text-xl font-semibold'>{event.title}</h2>
          <em className='text-red-500 font-bold'>{eventDate.toLocaleDateString()}</em>
          <img
            src={imgSrc} // Используем изображение по умолчанию, если нет
            alt={event.title}
            className='w-full md:w-64 h-48 object-cover rounded mt-4'
          />
          <p className='mt-2 md:text-lg font-bold text-green'>{event.description}</p>
        </div>

        <div>
          {isOpen ? (
            <FaAngleDoubleUp className='w-6 h-6 text-red-500 cursor-pointer hover:scale-110 transition-transform duration-300' />
          ) : (
            <FaAngleDoubleDown className='w-6 h-6 text-red-500 cursor-pointer hover:scale-110 transition-transform duration-300' />
          )}
        </div>
      </div>

      <div
        ref={contentRef}
        className='overflow-hidden transition-all duration-500 ease-in-out'
        style={{ maxHeight }}
      >
        <p className='mt-4 text-gray-800'>{event.fullText}</p>
        {!isPast && (
          <div className='mt-4'>
            <EventButton
              text={registered ? 'Вы записаны' : 'Записаться'}
              onClick={handleClick}
              disabled={loadingReg}
              eventDate={event.date}
            />
          </div>
        )}
      </div>
    </li>
  );
};

export default EventItem;