import Input from '../../../ui/Input';
import Button from '../../../ui/Button';
import { useState, useContext } from 'react';
import axios from 'axios';
import { NavLink, useNavigate } from 'react-router-dom';
import { AuthContext } from '../../../../context/AuthContext';

const LoginForm = () => {
  const [email, setEmail]       = useState('');
  const [password, setPassword] = useState('');
  const [message, setMessage]   = useState('');
  const [messageType, setMessageType] = useState('');
  const navigate = useNavigate();

  // забираем login из контекста
  const { login } = useContext(AuthContext);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setMessage('');

    try {
      const res = await axios.post(
        '/api/auth/login',
        { email, password },
        { withCredentials: true }
      );

      // из ответа достаём и токен, и роль
      const { token, role } = res.data;

      // кладём их в контекст (и в localStorage)
      login(token, role);

      setMessageType('success');
      setMessage('Добро пожаловать на портал!');

      // после небольшого таймаута переходим на нужную страницу
      setTimeout(() => {
        if (role === 'admin') {
          navigate('/admin');
        } else {
          navigate('/');
        }
      }, 1500);

    } catch (err) {
      console.error(err);
      setMessageType('error');
      setMessage(
        err.response?.data?.message
        || 'Ошибка авторизации. Попробуйте ещё раз.'
      );
    }
  };

  return (
    <div className='container mx-auto h-screen flex items-center justify-center'>
      <div className='p-6 rounded-2xl shadow-lg bg-electrician/30'>
        <h2 className='text-2xl font-bold text-center mb-4'>
          Авторизация
        </h2>
        <form
          onSubmit={handleSubmit}
          className='flex flex-col gap-4 items-center'
        >
          <Input
            type='email' placeholder='Ваш Email'
            value={email} onChange={e => setEmail(e.target.value)}
          />
          <Input
            type='password' placeholder='Введите пароль'
            value={password} onChange={e => setPassword(e.target.value)}
          />

          {message && (
            <div
              className={`mt-2 p-2 rounded ${
                messageType === 'error'
                ? 'bg-red-100 text-red-700'
                : 'bg-green-100 text-green-700'
              }`}
            >
              {message}
            </div>
          )}

          <div className='flex items-center gap-2'>
            <span>Нет аккаунта?</span>
            <NavLink to='/registration' className={({isActive}) =>
              isActive ? 'text-green-500' : 'text-red-500'
            }>
              Зарегистрироваться
            </NavLink>
          </div>

          <Button type='submit' text='Войти' />
        </form>
      </div>
    </div>
  );
};

export default LoginForm;