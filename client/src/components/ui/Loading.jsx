

const Loading = ({text='Загрузка...'}) => {
    return (
        <p className='text-green md:text-3xl font-bold flex justify-center '>
        {text}
      </p>
    );
};

export default Loading;