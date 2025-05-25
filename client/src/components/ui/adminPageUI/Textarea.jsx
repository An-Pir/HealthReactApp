
const Textarea = ({name, value, onChange, placeholder,  className=''}) => {
    return (
        <textarea
        placeholder={placeholder}
            name={name}
            value={value}
            onChange={onChange}
            className={`${className} w-full border-0 outline-0 rounded shadow-sm shadow-green  p-2 bg-electrician/10 `}
            required
        />
    );
};

export default Textarea;