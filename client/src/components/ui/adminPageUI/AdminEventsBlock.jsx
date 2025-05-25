import { useContext, useState, useEffect } from 'react'
import axios from 'axios'
import toast from 'react-hot-toast'
import { AuthContext } from '../../../context/AuthContext.jsx'
import EventForm from './EventForm.jsx'
import EventsList from './EventsList.jsx'

const AdminEventsBlock = () => {
  const { token, role } = useContext(AuthContext)
  const [events, setEvents] = useState([])
  const [selectedEvent, setSelectedEvent] = useState(null)
  const [isFormOpen, setIsFormOpen] = useState(false)
  const [loading, setLoading] = useState(false)

  useEffect(() => {
    if (token && role === 'admin') fetchEvents()
  }, [token, role])

  const fetchEvents = async () => {
    try {
      const res = await axios.get('/api/events', {
        headers: { Authorization: `Bearer ${token}` },
      })
      setEvents(res.data)
    } catch (err) {
      console.error(err)
      toast.error('Ошибка загрузки мероприятий')
    }
  }

  const handleAddClick = () => {
    setSelectedEvent(null)
    setIsFormOpen((v) => !v)
  }

  const handleEditClick = (ev) => {
    setSelectedEvent(ev)
    setIsFormOpen(true)
  }

  const handleSave = async (formData, isEdit) => {
    setLoading(true)
    try {
      let res
      if (isEdit) {
        res = await axios.put(`/api/events/${selectedEvent._id}`, formData, {
          headers: {
            Authorization: `Bearer ${token}`,
            'Content-Type': 'multipart/form-data',
          },
        })
        setEvents((prev) =>
          prev.map((e) => (e._id === res.data._id ? res.data : e))
        )
        toast.success('Мероприятие обновлено')
      } else {
        res = await axios.post('/api/events', formData, {
          headers: {
            Authorization: `Bearer ${token}`,
            'Content-Type': 'multipart/form-data',
          },
        })
        setEvents((prev) => [...prev, res.data])
        toast.success('Мероприятие добавлено')
      }
      setIsFormOpen(false)
      setSelectedEvent(null)
    } catch (err) {
      console.error(err)
      toast.error('Ошибка при сохранении мероприятия')
    } finally {
      setLoading(false)
    }
  }

  const handleDelete = async (id) => {
    if (!window.confirm('Удалить это Мероприятие?')) return
    try {
      await axios.delete(`/api/events/${id}`, {
        headers: { Authorization: `Bearer ${token}` },
      })
      setEvents((prev) => prev.filter((e) => e._id !== id))
      toast.success('Мероприятие удалено')
    } catch (err) {
      console.error(err)
      toast.error('Ошибка при удалении')
    }
  }

  return (
    <div className="p-6">
      <h2 className="mb-4 text-center">Мероприятия</h2>

      <button
        onClick={handleAddClick}
        className="w-full flex items-center justify-between bg-dark text-white mb-4 px-4 py-3 rounded focus:outline-none hover:bg-electrician hover:text-dark transition"
      >
        <span>
          {selectedEvent ? 'Редактировать Мероприятие' : 'Добавить новое мероприятие'}
        </span>
        <svg
          className={`w-5 h-5 transform transition-transform duration-300 ${
            isFormOpen ? 'rotate-180' : ''
          }`}
          fill="none"
          stroke="currentColor"
          viewBox="0 0 24 24"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={2}
            d="M19 9l-7 7-7-7"
          />
        </svg>
      </button>

      <div
        className={`overflow-hidden transition-all duration-500 max-h-0 ${
          isFormOpen ? 'max-h-screen' : ''
        }`}
      >
        <EventForm
          initialData={selectedEvent}
          onSave={handleSave}
          onCancel={() => {
            setIsFormOpen(false)
            setSelectedEvent(null)
          }}
          loading={loading}
        />
      </div>

      <EventsList
        events={events}
        onEdit={handleEditClick}
        onDelete={handleDelete}
        selectedEvent={selectedEvent}
      />
    </div>
  )
}

export default AdminEventsBlock