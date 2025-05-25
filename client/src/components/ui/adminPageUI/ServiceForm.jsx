import { useState, useEffect } from 'react'
import Button from '../Button.jsx'
import Input from './Input.jsx'
import Textarea from './Textarea.jsx'
import { toast } from 'react-hot-toast'

const ServiceForm = ({
  editingService,
  initialData,
  isAccordionOpen,
  setIsAccordionOpen,
  onSave,
  onCancel,
  loading
}) => {
  const editing = Boolean(editingService)

  const [formData, setFormData] = useState({
    name: '',
    description: '',
    priceChildren: '',
    priceAdults: '',
  })
  const [imageFile, setImageFile] = useState(null)
  const [imagePreview, setImagePreview] = useState('')

  // Наполняем форму при редактировании
  useEffect(() => {
    if (initialData) {
      setFormData({
        name: initialData.name,
        description: initialData.description,
        priceChildren: initialData.priceChildren || '',
        priceAdults: initialData.priceAdults || '',
      })
      setImagePreview(initialData.imageUrl || '')
      setImageFile(null)
    } else {
      setFormData({ name: '', description: '', priceChildren: '', priceAdults: '' })
      setImagePreview('')
      setImageFile(null)
    }
  }, [initialData])

  const handleChange = e => {
    const { name, value, files } = e.target
    if (name === 'image') {
      const file = files[0]
      setImageFile(file)
      setImagePreview(file ? URL.createObjectURL(file) : '')
    } else {
      setFormData(prev => ({ ...prev, [name]: value }))
    }
  }

  const handleSubmit = async e => {
    e.preventDefault()
    // простая валидация
    if (!formData.name || !formData.description) {
      toast.error('Заполните все обязательные поля')
      return
    }
    const data = new FormData()
    data.append('name', formData.name)
    data.append('description', formData.description)
    data.append('priceChildren', formData.priceChildren)
    data.append('priceAdults', formData.priceAdults)
    if (imageFile) data.append('image', imageFile)

    await onSave(data, editing)
  }

  const toggleAccordion = () => {
    setIsAccordionOpen(o => !o)
    if (!isAccordionOpen === false) onCancel?.()
  }

  return (
    <>
      {/* кнопка-аккордеон */}
      <button
        onClick={toggleAccordion}
        className="w-full flex items-center justify-between bg-dark text-white mb-4 px-4 py-3 rounded focus:outline-none hover:bg-electrician hover:text-dark transition"
      >
        <span>
          {editingService ? 'Редактировать услугу' : 'Добавить новую услугу'}
        </span>
        <svg
          className={`w-5 h-5 transform transition-transform duration-300 ${
            isAccordionOpen ? 'rotate-180' : ''
          }`}
          fill="none"
          stroke="currentColor"
          viewBox="0 0 24 24"
        >
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2}
                d="M19 9l-7 7-7-7" />
        </svg>
      </button>

      {/* тело аккордеона */}
      <div className={`overflow-hidden transition-all duration-500 ${
        isAccordionOpen ? 'max-h-screen' : 'max-h-0'
      }`}>
        <form
          onSubmit={handleSubmit}
          className="border border-gray-300 p-6 rounded shadow-sm mb-8"
        >
          <h3 className="text-xl mb-4">
            {editing ? 'Редактировать услугу' : 'Добавить новую услугу'}
          </h3>

          <Input
            name="name"
            placeholder="Название"
            value={formData.name}
            onChange={handleChange}
            className="w-full mb-3 p-2 border rounded"
          />

          <Textarea
            name="description"
            placeholder="Описание"
            value={formData.description}
            onChange={handleChange}
            className="w-full mb-3 p-2 border rounded"
          />

          {imagePreview && (
            <div className="mb-3">
              <p className="font-semibold mb-1">Изображение:</p>
              <img
                src={imagePreview}
                alt="preview"
                className="w-32 h-32 object-cover rounded mb-2"
              />
            </div>
          )}

          <Input
            type="file"
            name="image"
            accept="image/*"
            onChange={handleChange}
            className="w-full mb-4"
          />

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mb-4">
            <Input
              type="number"
              name="priceChildren"
              placeholder="Цена для детей"
              value={formData.priceChildren}
              onChange={handleChange}
              className="w-full p-2 border rounded"
              min="0"
            />
            <Input
              type="number"
              name="priceAdults"
              placeholder="Цена для взрослых"
              value={formData.priceAdults}
              onChange={handleChange}
              className="w-full p-2 border rounded"
              min="0"
            />
          </div>

          <div className="flex gap-3">
            <Button
              type="submit"
              text={
                loading
                  ? editing
                    ? 'Сохраняем...'
                    : 'Добавляем...'
                  : editing
                  ? 'Обновить'
                  : 'Добавить'
              }
              className="bg-green-600 text-white px-4 py-2 rounded hover:bg-green-700"
              disabled={loading}
            />
            {editing && (
              <Button
                type="button"
                text="Отмена"
                onClick={() => {
                  onCancel()
                  setImagePreview(initialData?.imageUrl || '')
                }}
                className="bg-gray-400 text-white px-4 py-2 rounded hover:bg-gray-500"
                disabled={loading}
              />
            )}
          </div>
        </form>
      </div>
    </>
  )
}

export default ServiceForm