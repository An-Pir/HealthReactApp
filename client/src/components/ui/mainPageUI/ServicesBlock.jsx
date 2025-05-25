import { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import defaultImg from '../../../assets/images/service1.jpg' // ваша дефолтная картинка

const ServicesBlock = () => {
  const navigate = useNavigate()
  const [services, setServices] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)

  // 1) Загрузим список услуг
  useEffect(() => {
    const fetchServices = async () => {
      try {
        const res = await fetch('/api/services')
        if (!res.ok) throw new Error(`Status ${res.status}`)
        const data = await res.json()
        setServices(data)
      } catch (err) {
        console.error('Ошибка при загрузке услуг:', err)
        setError('Не удалось загрузить услуги')
      } finally {
        setLoading(false)
      }
    }
    fetchServices()
  }, [])

  // 2) Обработчик клика по услуге
  const handleClick = () => {
    navigate(`/services`)
  }

  // 3) UI
  if (loading) {
    return <p className="text-center py-10">Загрузка услуг…</p>
  }
  if (error) {
    return <p className="text-center py-10 text-red-500">{error}</p>
  }
  if (services.length === 0) {
    return <p className="text-center py-10">Услуг пока нет.</p>
  }

  return (
    <section className="py-8 px-4 border-t-2 border-green">
      <h2 className="text-center mb-6">Предоставляемые услуги</h2>
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6">
        {services.map((service) => {
          // URL для картинки из БД
          const imgUrl = `/api/services/image/${service._id}`

          return (
            <div
              key={service._id}
              className="cursor-pointer bg-white rounded-lg overflow-hidden shadow hover:shadow-lg transition"
              onClick={() => handleClick()}
            >
              <div className="w-full h-48 bg-gray-100 overflow-hidden">
                <img
                  src={imgUrl}
                  onError={(e) => {
                    // если не нашли картинку на сервере — подставляем дефолт
                    e.currentTarget.onerror = null
                    e.currentTarget.src = defaultImg
                  }}
                  alt={service.name}
                  className="w-full h-full object-cover"
                />
              </div>
              <div className="p-4">
                <h3 className="text-xl font-medium text-green text-center">
                  {service.name}
                </h3>
              </div>
            </div>
          )
        })}
      </div>
    </section>
  )
}

export default ServicesBlock