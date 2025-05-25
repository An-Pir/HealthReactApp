
const BlockWrap = ({ children, className = '' }) => {
  return (
    <div
      className={`${className} flex justify-center gap-4 flex-wrap  lg:flex-nowrap mt-5 text-indent-20`}
    >
      {children}
    </div>
  );
};

export default BlockWrap;
