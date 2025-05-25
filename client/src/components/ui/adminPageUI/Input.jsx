
const Input = ({name, value, onChange, placeholder, type, className=''}) => {
    return (
        <input
           name={name} 
           type={type}
           value={value}
           onChange={onChange}
           placeholder={placeholder}
           className={`${className} w-full border-0 shadow-sm focus:outline-none rounded shadow-green  p-2 bg-electrician/10 `}

        />
    );
};

export default Input;