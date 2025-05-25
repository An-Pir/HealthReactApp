import { useState, useEffect, useContext } from 'react';
import axios from 'axios';
import EventItem from '../../ui/eventsUI/EventItem';
import EventButton from '../../ui/eventsUI/EventButton';
import { WindowSizeContext } from '../../../context/WindowSizeContext';
import { AuthContext } from '../../../context/AuthContext';
import Loading from '../../ui/Loading';

const EventsPage = () => {
  const { token, user } = useContext(AuthContext);
  const { width } = useContext(WindowSizeContext);
  const isMobile = width < 768;

  const [events, setEvents] = useState([]);
  const [filter, setFilter] = useState('all'); // all | upcoming | past
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    const fetchEvents = async () => {
      try {
        const headers = token ? { Authorization: `Bearer ${token}` } : {};
        const res = await axios.get('/api/events', { headers });

        // Промаркируем флагом registered
        const withFlags = res.data.map((ev) => ({
          ...ev,
          registered: Array.isArray(user?.registeredEvents)
            ? user.registeredEvents.some(
                (id) => id.toString() === ev._id.toString()
              )
            : false,
        }));

        setEvents(withFlags);
      } catch (err) {
        console.error(err);
        setError('Не удалось загрузить события');
      } finally {
        setLoading(false);
      }
    };

    fetchEvents();
  }, [token, user]);

  // Фильтрация
  const now = new Date();
  const getFilteredEvents = () => {
    const upcoming = [];
    const past = [];
    events.forEach((ev) => {
      new Date(ev.date) >= now ? upcoming.push(ev) : past.push(ev);
    });
    upcoming.sort((a, b) => new Date(a.date) - new Date(b.date));
    past.sort((a, b) => new Date(b.date) - new Date(a.date));

    if (filter === 'upcoming') return upcoming;
    if (filter === 'past') return past;
    return [...upcoming, ...past];
  };
  const filteredEvents = getFilteredEvents();

  if (loading) return <Loading />;
  if (error) return <p className='text-red-600'>{error}</p>;

  const allText = isMobile ? 'Все' : 'Все мероприятия';

  return (
    <div className='flex-1 container mx-auto p-4'>
      <h1 className='mb-4 text-center md:text-left'>Мероприятия</h1>

      {/* Фильтры */}
      <div className='mb-4 flex justify-center md:justify-start space-x-2 md:space-x-4'>
        <EventButton
          text={allText}
          onClick={() => setFilter('all')}
          isActive={filter === 'all'}
        />
        <EventButton
          text='Предстоящие'
          onClick={() => setFilter('upcoming')}
          isActive={filter === 'upcoming'}
        />
        <EventButton
          text='Прошедшие'
          onClick={() => setFilter('past')}
          isActive={filter === 'past'}
        />
      </div>

      {/* Список */}
      {filteredEvents.length === 0 ? (
        <p>Нет мероприятий по выбранному фильтру.</p>
      ) : (
        <ul className='space-y-4'>
          {filteredEvents.map((ev) => (
            <EventItem key={ev._id} event={ev} />
          ))}
        </ul>
      )}
    </div>
  );
};

export default EventsPage;
