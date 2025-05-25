const Input = ({
  name,
  type,
  value,
  placeholder,
  className = '',
  onChange,
  checked,
}) => {
  return (
    <input
      className={`${className}  rounded border border-dark/50 w-full px-5 py-1 text-dark placeholder:text-dark/30 focus:outline-none focus:bg-white/60 focus:border-green/70 `}
      type={type}
      value={value}
      placeholder={placeholder}
      onChange={onChange}
      checked={checked}
      name={name}
    ></input>
  );
};

export default Input;
