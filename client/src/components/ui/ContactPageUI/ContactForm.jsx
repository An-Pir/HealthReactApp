
import { useContext, useState, useEffect } from 'react'; 
import axios from 'axios';
import Button from '../../ui/Button';
import Input from '../../ui/adminPageUI/Input';
import Textarea from '../../ui/adminPageUI/Textarea';
import Label from '../../ui/adminPageUI/Label';
import toast from 'react-hot-toast';
import { AuthContext } from '../../../context/AuthContext';

const ContactForm = () => {
  const { token } = useContext(AuthContext);
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    message: '',
  });
  const [loading, setLoading] = useState(false);
  const [isButtonDisabled, setIsButtonDisabled] = useState(true);

  useEffect(() => {
    const { name, email, message } = formData;
    setIsButtonDisabled(!(name && email && message));
  }, [formData]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({
      ...formData,
      [name]: value,
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!token) {
      toast.error('Пожалуйста, войдите в систему, чтобы отправить сообщение.');
      return;
    }

    setLoading(true);

    try {
      const response = await axios.post('/api/messages', formData, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      if (response.status === 201) {
        toast.success('Сообщение успешно отправлено');
        setFormData({ name: '', email: '', message: '' });
      } else {
        toast.error('Ошибка при отправке сообщения');
      }
    } catch (error) {
      console.error('Ошибка:', error);
      toast.error('Ошибка при отправке сообщения');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className='last-child:text-center shadow  rounded p-2'>
      <h2 className='mb-4 text-center'>Форма обратной связи</h2>
      <form onSubmit={handleSubmit} className='flex flex-col gap-4'>
        <div>
          <Label htmlFor='name' text='Имя:' />
          <Input
            type='text'
            id='name'
            name='name'
            value={formData.name}
            onChange={handleChange}
            required
          />
        </div>
        <div>
          <Label htmlFor='email' text='Email:' />
          <Input
            type='email'
            id='email'
            name='email'
            value={formData.email}
            onChange={handleChange}
            required
          />
        </div>
        <div>
          <Label htmlFor='message' text='Сообщение:' />
          <Textarea
            id='message'
            name='message'
            value={formData.message}
            onChange={handleChange}
            required
          />
        </div>
        <div className='flex justify-center'>
          <Button
            type='submit'
            text={loading ? 'Отправка...' : 'Отправить'}
            disabled={isButtonDisabled || loading}
          />
        </div>
      </form>
    </div>
  );
};

export default ContactForm;