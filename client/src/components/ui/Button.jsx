const Button = ({ type, disabled, onClick, text, className = '' }) => {
  return (
    <button
      type={type}
      disabled={disabled}
      onClick={onClick}
      className={`
        ${className}
        text-sm xl:text-lg
        bg-dark/90 text-white px-3 py-2 rounded outline-2
        transition-colors duration-300

        ${!disabled ? 'cursor-pointer hover:bg-white hover:text-dark/90' : ''}
        disabled:opacity-50
        disabled:cursor-not-allowed
        disabled:bg-gray-400
      `}
    >
      {text}
    </button>
  );
};

export default Button;