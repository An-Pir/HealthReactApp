import { useContext, useEffect, useState } from 'react';
import axios from 'axios';
import { toast } from 'react-hot-toast';
import { AuthContext } from '../../../context/AuthContext';
import Button from '../Button';

const EventRegistration = () => {
  const { token, user, updateUser } = useContext(AuthContext);
  const [events, setEvents] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const api = axios.create({
    baseURL: import.meta.env.VITE_API_URL || 'http://localhost:5000',
    headers: { Authorization: `Bearer ${token}` },
  });

  useEffect(() => {
    if (!token) return;
    api
      .get('/api/events')
      .then((res) => {
        const now = new Date();
        setEvents(res.data.filter((ev) => new Date(ev.date) >= now));
      })
      .catch(() => setError('Не удалось загрузить мероприятия'))
      .finally(() => setLoading(false));
  }, [token]);

  const handleRegister = async (eventId) => {
    try {
      await api.post(`/api/events/${eventId}/register`);
      // обновляем профиль
      const { data: profile } = await api.get('/api/auth/profile');
      updateUser(profile);

      // показываем toast
      const ev = events.find((e) => e._id === eventId);
      toast.success(`Вы успешно зарегистрированы на «${ev.title}»!`);

      // обновляем локальный список
      setEvents((evts) =>
        evts.map((e) => (e._id === eventId ? { ...e, registered: true } : e))
      );
    } catch (err) {
      console.error(err);
      toast.error('Ошибка при регистрации. Попробуйте ещё раз.');
    }
  };

  const handleUnregister = async (eventId) => {
    if (!window.confirm('Отменить регистрацию?')) return;
    try {
      await api.delete(`/api/events/${eventId}/register`);
      const { data: profile } = await api.get('/api/auth/profile');
      updateUser(profile);
      toast.success('Регистрация отменена.');
      setEvents((evts) =>
        evts.map((e) => (e._id === eventId ? { ...e, registered: false } : e))
      );
    } catch (err) {
      console.error(err);
      toast.error('Ошибка при отмене регистрации.');
    }
  };

  if (loading) return <p>Загрузка…</p>;
  if (error) return <p className='text-red-600'>{error}</p>;

  const registeredSet = new Set(user?.registeredEvents || []);
  const registeredEvents = events.filter((ev) => registeredSet.has(ev._id));
  const freeEvents = events.filter((ev) => !registeredSet.has(ev._id));

  return (
    <div className='space-y-8 text-center md:text-left'>
      <section>
        <h3 className='text-green'>Ваши регистрации</h3>
        {registeredEvents.length === 0 ? (
          <p>Нет зарегистрированных событий.</p>
        ) : (
          registeredEvents.map((ev) => (
            <div
              key={ev._id}
              className='flex flex-col bg-electrician/20 md:flex-row justify-between p-2 shadow-md shadow-green/20 rounded my-4 gap-3'
            >
              <div>
                <strong>{ev.title}</strong>
                <p className='text-sm mt-2 text-red-500'>
                  {new Date(ev.date).toLocaleString()}
                </p>
              </div>
              <div className='flex items-center justify-center md:justify-start'>
                <Button
                  onClick={() => handleUnregister(ev._id)}
                  text='Отменить'
                />
              </div>
            </div>
          ))
        )}
      </section>

      <section>
        <h3 className='text-green'>Доступные мероприятия</h3>
        {freeEvents.length === 0 ? (
          <p>Нет доступных событий.</p>
        ) : (
          freeEvents.map((ev) => (
            <div
              key={ev._id}
              className='flex flex-col md:flex-row justify-center  md:justify-between p-2 shadow-md shadow-green/20 rounded my-4'
            >
              <div>
                <strong>{ev.title}</strong>
                <p className='text-sm mt-5'>
                  {new Date(ev.date).toLocaleString()}
                </p>
              </div>
              <div className='flex items-center justify-center md:justify-start'>
                <Button
                  onClick={() => handleRegister(ev._id)}
                  className='bg-green-500'
                  text='Зарегистрироваться'
                />
              </div>
            </div>
          ))
        )}
      </section>
    </div>
  );
};

export default EventRegistration;
