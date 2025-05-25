import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import Input from '../../../ui/Input';
import Button from '../../../ui/Button';

const RegForm = () => {
  // состояния
  const [userName, setUserName] = useState('');
  const [userNameValid, setUserNameValid] = useState(true);

  const [email, setEmail] = useState('');

  const [password, setPassword] = useState('');
  const [passwordValid, setPasswordValid] = useState(true);

  const [passwordMatch, setPasswordMatch] = useState('');
  const [passwordsMatch, setPasswordsMatch] = useState(true);

  const [checked, setChecked] = useState(false);

  const [messageType, setMessageType] = useState('');
  const [message, setMessage] = useState('');

  const [isLoading, setIsLoading] = useState(false);

  const navigate = useNavigate();

  // регулярка для проверки пароля: буквы+цифры, минимум 4 символа
  const passwordRegex = /^(?=.*[A-Za-z])(?=.*\d)[A-Za-z\d]{4,}$/;
  const checkPassword = (pwd) => passwordRegex.test(pwd);

  // --- обработчики ---

  const handleChangeUserName = (e) => {
    const value = e.target.value;
    setUserName(value);
    setUserNameValid(value.trim().length > 0);
    // при любом вводе сбрасываем глобальные сообщения
    setMessage('');
    setMessageType('');
  };

  const handleChangeEmail = (e) => {
    setEmail(e.target.value);
    setMessage('');
    setMessageType('');
  };

  const handleChangePassword = (e) => {
    const value = e.target.value;
    setPassword(value);

    // проверяем формат
    const valid = checkPassword(value);
    setPasswordValid(valid);

    // если формат валидный — сразу убираем ошибку
    if (valid) {
      setMessage('');
      setMessageType('');
    }

    // проверяем совпадение с полем «повтор пароля», если там уже >=2 символа
    if (passwordMatch.length >= 2) {
      setPasswordsMatch(value === passwordMatch);
    }
  };

  const handleChangePasswordMatch = (e) => {
    const value = e.target.value;
    setPasswordMatch(value);
    setMessage('');
    setMessageType('');

    if (value.length >= 2) {
      setPasswordsMatch(value === password);
    } else {
      setPasswordsMatch(true);
    }
  };

  const handleCheckboxChange = () => {
    setChecked((prev) => !prev);
    setMessage('');
    setMessageType('');
  };

  // --- отправка формы ---
  const handleSubmit = async (e) => {
    e.preventDefault();

    // 1) имя
    const isNameOK = userName.trim().length > 0;
    setUserNameValid(isNameOK);
    if (!isNameOK) return;

    // 2) пароля формат
    if (!checkPassword(password)) {
      setPasswordValid(false);
      return;
    }

    // 3) совпадение паролей
    if (password !== passwordMatch) {
      setPasswordsMatch(false);
      return;
    }

    // 4) чекбокс
    if (!checked) {
      setMessageType('error');
      setMessage('Необходимо согласие на обработку данных');
      return;
    }
    setIsLoading(true);
    // 5) отправляем на сервер
    try {
      const response = await axios.post(
        '/api/auth/register',
        { name: userName, email, password }
      );
      if (response.status === 201) {
        setMessageType('success');
        setMessage('Вы успешно зарегистрированы!');
        // сброс полей формы при успешной регистрации
        setUserName('');
        setEmail('');
        setPassword('');
        setPasswordMatch('');
        setPasswordsMatch(true);
        setChecked(false);
        setTimeout(()=> {
        navigate('/login');
        }, 3000)
      } else {
        setMessageType('error');
        setMessage(response.data.message || 'Ошибка регистрации');
      }
    } catch (err) {
      setMessageType('error');
      setMessage(err.response?.data?.message || err.message);
    } finally {
      // в любом случае — выключаем индикатор
      setIsLoading(false);
    }
  };

  //

  // доступность кнопки
  const canSubmit =
    userName.trim().length > 0 &&
    email.trim().length > 0 &&
    checkPassword(password) &&
    passwordMatch.length >= 2 &&
    passwordsMatch &&
    checked;
    
  return (
    <div className='container  mx-auto h-screen min-h-[500px] flex items-center justify-center '>
      <div className='min-w-[250px] p-2 md:p-5 lg:p-6 mx-5 rounded-2xl flex flex-col gap-5 shadow-lg bg-electrician/30'>
        <h2 className='text-center font-bold text-dark/70 text-2xl lg:text-4xl'>
          Регистрация
        </h2>

        <form
          onSubmit={handleSubmit}
          className='max-w-[290px] md:max-w-[340px] flex flex-col gap-2 lg:gap-8 items-center relative'
        >
          {/* Имя */}
          <Input
            type='text'
            placeholder='Ваше имя'
            value={userName}
            onChange={handleChangeUserName}
          />
          {!userNameValid && (
            <div className='lg:text-sm text-red-500'>Укажите имя</div>
          )}

          {/* Email */}
          <Input
            type='email'
            placeholder='Ваш Email'
            value={email}
            onChange={handleChangeEmail}
          />

          {/* Пароль */}
          <Input
            type='password'
            placeholder='Введите пароль'
            value={password}
            onChange={handleChangePassword}
            className={passwordValid ? 'text-green' : 'text-red-500'}
          />
          {!passwordValid && (
            <div className='lg:text-sm text-red-500'>
              Пароль минимум 4 знака, буквы и цифры.
            </div>
          )}

          {/* Повтор пароля */}
          <Input
            type='password'
            placeholder='Повторите пароль'
            value={passwordMatch}
            onChange={handleChangePasswordMatch}
            className={passwordsMatch ? 'text-green' : 'text-red-500'}
          />
          {!passwordsMatch && passwordMatch.length >= 2 && (
            <div className='lg:text-sm text-red-500'>Пароли не совпадают</div>
          )}

          {/* Чекбокс */}
          <label className='w-[290px] flex text-[12px] text-dark/70'>
            <Input
              type='checkbox'
              checked
              onChange={handleCheckboxChange}
              className='hidden'
            />
            <span
              className={`flex items-center justify-center w-5 h-5 border-2 ${
                checked ? 'border-green' : 'border-dark/50'
              } rounded-md mr-2`}
            >
              {checked && <span className='w-3 h-3 bg-green rounded-md' />}
            </span>
            согласие на обработку персональных данных
          </label>

          {/* Глобальное сообщение */}
          {message && (
            <div
              className={`mt-4 text-center p-2 rounded ${
                messageType === 'error'
                  ? 'bg-red-100 text-red-700'
                  : 'bg-green-100 text-green-700'
              }`}
            >
              {message}
            </div>
          )}

          {/* Кнопка */}
          <div className='flex gap-2.5'>
            <Button
              text={isLoading ? 'Загрузка...' : 'Зарегистрироваться'}
              disabled={!canSubmit || isLoading}
            />
          </div>
        </form>
      </div>
    </div>
  );
};

export default RegForm;
