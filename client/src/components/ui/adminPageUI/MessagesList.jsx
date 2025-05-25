import { useEffect, useState } from 'react'
import axios from 'axios'
import toast from 'react-hot-toast'
import Button from '../Button'

const MessagesList = () => {
  const [messages, setMessages] = useState([])
  const [loading, setLoading]   = useState(true)

  useEffect(() => {
    const fetchMessages = async () => {
      try {
        const { data } = await axios.get('/api/messages')
        setMessages(data)
      } catch (error) {
        console.error('Ошибка при получении сообщений:', error)
        toast.error('Не удалось загрузить сообщения')
      } finally {
        setLoading(false)
      }
    }

    fetchMessages()
  }, [])

  const handleDelete = async (id) => {
    if (!window.confirm('Вы уверены, что хотите удалить это сообщение?')) {
      return
    }
    try {
      await axios.delete(`/api/messages/${id}`)
      setMessages(prev => prev.filter(msg => msg._id !== id))
      toast.success('Сообщение успешно удалено')
    } catch (error) {
      console.error('Ошибка при удалении сообщения:', error)
      toast.error('Не удалось удалить сообщение')
    }
  }

  if (loading) {
    return <p>Загрузка данных...</p>
  }

  return (
    <section>
      <h2 className="text-center mb-4">Полученные сообщения</h2>

      {messages.length === 0 ? (
        <p>Нет сообщений для отображения.</p>
      ) : (
        <ul className="list-none space-y-4">
          {messages.map(message => (
            <li
              key={message._id}
              className="p-4 border rounded-lg shadow flex flex-col gap-2"
            >
              <h3 className="font-semibold">{message.name}</h3>
              <p><strong>Email:</strong> {message.email}</p>
              <p><strong>Сообщение:</strong> {message.message}</p>

              <div className="mt-2">
                <Button
                  onClick={() => handleDelete(message._id)}
                  text="Удалить"
                  className="bg-red-500 hover:bg-red-600"
                />
              </div>
            </li>
          ))}
        </ul>
      )}
    </section>
  )
}

export default MessagesList