import { useState, useEffect, useContext } from 'react'
import axios from 'axios'
import toast from 'react-hot-toast'
import { AuthContext } from '../../../context/AuthContext.jsx'
import ServiceForm from './ServiceForm.jsx'
import ServicesList from './ServicesList.jsx'

const AdminServicesBlock = () => {
  const { token, role } = useContext(AuthContext)
  const [services, setServices] = useState([])
  const [editingService, setEditingService] = useState(null)
  const [isAccordionOpen, setIsAccordionOpen] = useState(false)
  const [loading, setLoading] = useState(false)

  useEffect(() => {
    if (token && role === 'admin') {
      fetchServices()
    }
  }, [token, role])

  // Всегда возвращает готовые объекты с imageUrl
  const fetchServices = async () => {
    try {
      const res = await axios.get('/api/services', {
        headers: { Authorization: `Bearer ${token}` },
      })
      setServices(res.data)
    } catch (err) {
      console.error(err)
      toast.error('Ошибка загрузки услуг')
    }
  }

  // После POST/PUT всегда перезагружаем список
  const handleSave = async (formData, isEdit) => {
    setLoading(true)
    try {
      if (isEdit) {
        await axios.put(
          `/api/services/${editingService._id}`,
          formData,
          {
            headers: {
              Authorization: `Bearer ${token}`,
              'Content-Type': 'multipart/form-data',
            },
          }
        )
        toast.success('Услуга обновлена')
      } else {
        await axios.post(
          '/api/services',
          formData,
          {
            headers: {
              Authorization: `Bearer ${token}`,
              'Content-Type': 'multipart/form-data',
            },
          }
        )
        toast.success('Услуга добавлена')
      }

      // ключевая строка – заново подтягиваем весь массив
      await fetchServices()

      setIsAccordionOpen(false)
      setEditingService(null)
    } catch (err) {
      console.error(err)
      toast.error('Ошибка при сохранении услуги')
    } finally {
      setLoading(false)
    }
  }

  // После DELETE тоже перезагружаем список
  const handleDelete = async id => {
    if (!window.confirm('Удалить эту услугу?')) return
    try {
      await axios.delete(`/api/services/${id}`, {
        headers: { Authorization: `Bearer ${token}` },
      })
      toast.success('Услуга удалена')
      await fetchServices()
    } catch (err) {
      console.error(err)
      toast.error('Ошибка при удалении')
    }
  }

  const handleEdit = service => {
    setEditingService(service)
    setIsAccordionOpen(true)
  }

  return (
    <div className="p-6">
      <h2 className="mb-4 text-center">Услуги</h2>

      <ServiceForm
        editingService={editingService}
        initialData={editingService}
        isAccordionOpen={isAccordionOpen}
        setIsAccordionOpen={setIsAccordionOpen}
        onSave={handleSave}
        onCancel={() => {
          setEditingService(null)
          setIsAccordionOpen(false)
        }}
        loading={loading}
      />

      <ServicesList
        services={services}
        onEdit={handleEdit}
        onDelete={handleDelete}
        editingService={editingService}
      />
    </div>
  )
}

export default AdminServicesBlock