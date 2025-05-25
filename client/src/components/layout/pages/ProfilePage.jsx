import { useState, useEffect, useContext } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import { toast } from 'react-hot-toast'; 
import { AuthContext } from '../../../context/AuthContext';
import Button from '../../ui/Button';
import EventRegistration from '../../ui/profilePageUI/EventRegistration';
import Label from '../../ui/adminPageUI/Label'
import Loading from '../../ui/Loading';


const ProfilePage = () => {
  const { token, updateUser, logout } = useContext(AuthContext);
  const navigate = useNavigate();

  const [form, setForm] = useState({ name: '', email: '', password: '', confirmPassword: '' });
  const [message, setMessage] = useState('');
  const [loading, setLoading] = useState(true);
  const [showEdit, setShowEdit] = useState(false);

  useEffect(() => {
    if (!token) return;
    axios
      .get('/api/auth/profile', {
        headers: { Authorization: `Bearer ${token}` },
      })
      .then((res) => {
        const { name, email } = res.data;
        setForm({ name, email, password: '', confirmPassword: '' });
        updateUser(res.data);
      })
      .catch((err) => console.error(err))
      .finally(() => setLoading(false));
  }, [token]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setForm((f) => ({ ...f, [name]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (form.password && form.password !== form.confirmPassword) {
      toast.error('Пароли не совпадают');
      return;
    }

    try {
      const payload = { name: form.name, email: form.email };
      if (form.password.trim()) payload.password = form.password;

      const res = await axios.put('/api/auth/profile', payload, {
        headers: { Authorization: `Bearer ${token}` },
      });
      toast.success('Профиль успешно обновлён');
      setMessage('Профиль успешно обновлён.');
      updateUser(res.data);
      setForm((f) => ({ ...f, password: '', confirmPassword: '' }));
      setShowEdit(false);
    } catch (err) {
      toast.error(err.response?.data?.message || 'Ошибка при обновлении профиля');
    }
  };

  // функция для определения цвета текста в полях пароля в реальном времени
  const getPasswordTextColor = () => {
    if (form.password === '' && form.confirmPassword === '') {
      return 'black'; // стандартный цвет, если поля пустые
    }
    return form.password === form.confirmPassword ? 'green' : 'red';
  };

  if (loading) return <Loading text='Загрузка профиля…'/>;

  return (
    <div className='container mx-auto p-6 bg-white rounded-lg shadow-lg'>
      <h2 className='text-2xl font-semibold mb-4 text-center'>Личный кабинет</h2>

      {message && (
        <div className='mb-4 p-3 bg-green-100 text-green-800 rounded'>{message}</div>
      )}

      <div className='mb-6 text-center'>
        <button
  onClick={() => setShowEdit((s) => !s)}
  className="w-full flex gap-5 items-center justify-center bg-dark text-white mb-4 px-4 py-3 rounded focus:outline-none hover:bg-electrician hover:text-dark transition"
>
  <span>
    {showEdit ? 'Скрыть форму редактирования' : 'Редактировать профиль'}
  </span>
  <svg
    className={`w-5 h-5 transform transition-transform duration-300 ${showEdit ? 'rotate-180' : ''}`}
    fill="none"
    stroke="currentColor"
    viewBox="0 0 24 24"
  >
    <path
      strokeLinecap="round"
      strokeLinejoin="round"
      strokeWidth={2}
      d="M19 9l-7 7-7-7"
    />
  </svg>
</button>
      </div>

      {showEdit && (
        <form onSubmit={handleSubmit} className='space-y-4 mb-8'>
          {/* поля */}
          <div className=' flex flex-col gap-5'>
            <div>
              <Label text='Имя:'/>
              <input
                name='name'
                value={form.name}
                onChange={handleChange}
                required
                className='w-full px-4 py-2 border-0 shadow-md shadow-green/20 rounded focus:outline-none focus:shadow-green/50 '
              />
            </div>
            <div>
              <Label text='Email:'/>
              <input
                name='email'
                type='email'
                value={form.email}
                onChange={handleChange}
                required
                className='w-full px-4 py-2 border-0 shadow-md shadow-green/20 rounded focus:outline-none focus:shadow-green/50'
              />
            </div>
            <div>
              <Label text='Пароль (оставьте пустым, чтобы не менять):'/>
              <input
                name='password'
                type='password'
                value={form.password}
                onChange={handleChange}
                style={{ color: getPasswordTextColor() }}
  className='w-full px-4 py-2 border-0 shadow-md shadow-green/20 rounded focus:outline-none focus:shadow-green/50'
              />
            </div>
            <div>
              <Label text='Повторите пароль:'/>
              <input
                name='confirmPassword'
                type='password'
                value={form.confirmPassword}
                onChange={handleChange}
                style={{ color: getPasswordTextColor() }}
                className='w-full px-4 py-2 border-0 shadow-md shadow-green/20 rounded focus:outline-none focus:shadow-green/50'
              />
            </div>
          </div>
          <div className='flex justify-center md:justify-end'>
            <Button
              type='submit'
              text='Сохранить'
            />
          </div>
        </form>
      )}

      <EventRegistration />


      <div className='mt-10 flex justify-center md:justify-end'>
        <Button
          text='Выйти из аккаунта'
          onClick={() => {
            logout();
            navigate('/');
          }}
          className='bg-red-500 hover:bg-red-600 text-white py-2 px-6 rounded animate-pulse'
        />
      </div>
    </div>
  );
};

export default ProfilePage;