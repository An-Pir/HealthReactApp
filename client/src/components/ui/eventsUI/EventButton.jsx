
import toast from 'react-hot-toast';

const EventButton = ({
  text,
  onClick,
  isActive, // для кнопок-фильтров
  eventDate, // для кнопки «Записаться»
  disabled = false, // внешний флаг «запретить»
  className = '',
}) => {
  // Режим «Записаться»
  if (eventDate) {
    const now = new Date();
    const eventTime = new Date(eventDate);
    const isUpcoming = eventTime >= now; // событие ещё не прошло
    const needAuth = disabled; // неавторизован
    const isGreyedOut = !isUpcoming || needAuth;

    const handleClick = () => {
      if (!isUpcoming) return;
      if (needAuth) {
        toast.error('Запись доступна только авторизованным пользователям');
      } else {
        onClick();
      }
    };

    return (
      <button
        onClick={handleClick}
        // браузерный disabled только для past-событий,
        // чтобы убрать фокус/hover, а авторизацию мы сами обрабатываем
        disabled={!isUpcoming}
        // родной тултип при наведении на «нуждаемся в авторизации»
        title={
          needAuth && isUpcoming
            ? 'Запись доступна только авторизованным пользователям'
            : undefined
        }
        className={`
          ${className} px-4 py-2 shadow rounded transition-colors duration-200 border border-transparent cursor-pointer
          ${
            isGreyedOut
              ? 'bg-gray-400 text-gray-700 cursor-not-allowed'
              : 'bg-electrician text-dark hover:bg-white hover:text-green hover:border-green'
          }
        `}
      >
        {text}
      </button>
    );
  }

  // Режим «фильтр»
  return (
    <button
      onClick={onClick}
      className={` shadow cursor-pointer border border-transparent hover:bg-white hover:text-green hover:border-green transition-all duration-300 
        ${className} px-2 py-1 rounded transition-colors duration-200
        ${isActive ? 'bg-electrician text-dark ' : 'bg-gray-200 '}
      `}
    >
      {text}
    </button>
  );
};

export default EventButton;
