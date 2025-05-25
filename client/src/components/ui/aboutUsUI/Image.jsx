
const Image = ({src, alt, className=''}) => {
    return (
        <img
            src={src}
            alt={alt}
            className={`${className}  w-[550px] lg:w-1/3 object-contain rounded-md`}
        />
    );
};

export default Image;