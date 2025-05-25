import ContactForm from '../../ui/ContactPageUI/ContactForm';

const ContactPage = () => {
  const hours = {
    open: 8,
    close: 22,
  };

  const currentHour = new Date().getHours();
  const isOpen = currentHour >= hours.open && currentHour < hours.close;

  return (
    <main className='container mx-auto flex justify-center mt-10'>
      <div className='p-8 w-lg mx-auto bg-white shadow-md rounded-lg flex flex-col gap-5'>
        <div className='flex flex-col gap-1'>
          <h2 className='text-center mb-4'>Контактная информация</h2>
          <p className='mb-2'>
            <strong>Адрес:</strong> г. Ноябрьск, ул. 60 лет СССР, 29а
          </p>
          <p className='mb-2'>
            <strong>Телефон:</strong> +7 (3496) 35-78-44
          </p>
          <p>
            <strong>Email:</strong> zdorovje@noyabrsk.yanao.ru
          </p>
          <h3 className='text-green'>Отдел по спортивной работе</h3>
          <p className='mb-2'>
            <strong>Телефон:</strong> +7 (3496) 35-73-86
          </p>
          <div className='flex flex-col gap-2 mt-4'>
            <h2>График работы:</h2>
            <p>Ежедневно с 8-00 до 22-00</p>
            {isOpen ? (
              <p className='py-4 rounded shadow text-center text-green-500 font-semibold bg-electrician/20'>
                Учреждение работает. Закроется в {hours.close}:00.
              </p>
            ) : (
              <p className='py-4 rounded shadow text-center text-red-500 font-semibold bg-red-300/20'>
                Учреждение закрыто. Открывается в {hours.open}:00.
              </p>
            )}
          </div>
        </div>
        <ContactForm />
      </div>
    </main>
  );
};

export default ContactPage;
