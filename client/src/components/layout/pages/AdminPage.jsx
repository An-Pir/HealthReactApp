import { useContext } from 'react';
import { useNavigate } from 'react-router-dom';
import { AuthContext } from '../../../context/AuthContext.jsx';

import Button from '../../ui/Button.jsx';
import AdminServicesBlock from '../../ui/adminPageUI/AdminServicesBlock.jsx';
import AdminEventsBlock from '../../ui/adminPageUI/AdminEventsBlock.jsx';
import MessagesList from '../../ui/adminPageUI/MessagesList.jsx';

const AdminPage = () => {
  const { logout } = useContext(AuthContext);
  const nav = useNavigate();

  return (
    <div className='container mx-auto p-4 bg-white'>
      <AdminEventsBlock />
      <AdminServicesBlock />
      <MessagesList />
      {/* Выйти из аккаунта */}
      <div className='flex justify-center mt-10'>
        <Button
          text='Выйти из аккаунта'
          onClick={() => {
            logout();
            nav('/');
          }}
          className='bg-red-500 shadow-2xl shadow-red-200'
        />
      </div>
    </div>
  );
};

export default AdminPage;
