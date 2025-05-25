import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';

const EventsBlock = () => {
 const navigate = useNavigate()
  const [events, setEvents] = useState([]); // сюда придут события
  const [loading, setLoading] = useState(true); // индикатор загрузки
  const [error, setError] = useState(null); // для ошибок

  const handleClick = () => {
    navigate('/events')
  }

  useEffect(() => {
    // Функция, которая делает запрос за 3 ближайшими событиями
    const fetchEvents = async () => {
      try {
        const response = await fetch('/api/events/upcoming?limit=3');
        if (!response.ok) {
          throw new Error(`Ошибка ${response.status}: ${response.statusText}`);
        }
        const data = await response.json();
        // ожидаем, что data — это массив из объектов { id, startDate, title, description }
        setEvents(data);
      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };

    fetchEvents();
  }, []); // пустой массив — запрос выполнится один раз при монтировании

  // Пока идёт загрузка
  if (loading) {
    return <div className='container mx-auto p-4'>Загрузка событий...</div>;
  }

  // При ошибке
  if (error) {
    return (
      <div className='container mx-auto p-4 text-red-500'>
        Не удалось загрузить события: {error}
      </div>
    );
  }

  // Рендерим три события
  return (
    <section className='container mx-auto flex flex-col items-center border-t-2 border-green'>
    <h2 className='text-center lg:text-3xl my-10 '>Ближайшие мероприятия</h2>
      {events.length === 0 ? (
        <p>Ближайших событий не найдено.</p>
      ) : (
        <ul className='space-y-8   '>
          {events.map((ev) => (
            <li key={ev._id || ev.id} className='  pb-6 text-center  '>
              {/* Картинка */}
              {ev.imageUrl && (
                <img
                  src={ev.imageUrl}
                  alt={ev.title}
                  className='w-full md:w-1/2  object-cover rounded mb-4 flex mx-auto transform hover:scale-120 transition-transform duration-500'
                />
              )}

              <div className='cursor-pointer  ' onClick={handleClick}>
                {/* Дата */}
                <em className='text-sm text-red-400'>{ev.startDate}</em>
  
                {/* Заголовок */}
                <h4 className='text-xl font-semibold mt-1 text-green'>{ev.title}</h4>
  
                {/* Описание */}
                <p className='mt-2'>{ev.description}</p>
              </div>
            </li>
          ))}
        </ul>
      )}

    </section>
  );
};

export default EventsBlock;
