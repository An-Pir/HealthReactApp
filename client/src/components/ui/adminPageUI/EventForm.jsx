import { useState, useEffect, useCallback, useMemo } from 'react'
import { toast } from 'react-hot-toast'
import Input from './Input.jsx'
import Textarea from './Textarea.jsx'
import Button from '../Button.jsx'

/**
 * EventForm — форма создания/редактирования мероприятия
 *
 * Props:
 *  - initialData: объект с данными редактируемого мероприятия (или null)
 *  - onSave:   async-функция сохранения формы ( FormData, isEditing ) => Promise
 *  - onCancel: callback при отмене редактирования
 *  - loading:  флаг загрузки (дисейблит кнопку)
 */
const EventForm = ({ initialData, onSave, onCancel, loading }) => {
  const isEditing = Boolean(initialData)

  // стэйт для полей формы
  const [form, setForm] = useState({
    title: '',
    date: '',
    description: '',
    fullText: '',
  })
  // чтобы сравнивать, изменились ли данные
  const [initialForm, setInitialForm] = useState(null)
  // стэйт для работы с изображением
  const [file, setFile] = useState(null)
  const [currentImageUrl, setCurrentImageUrl] = useState('')
  const [removeImage, setRemoveImage] = useState(false)

  // При монтировании/смене initialData заполняем форму
  useEffect(() => {
    if (initialData) {
      const trimmedDate = initialData.date.slice(0, 10) // yyyy-mm-dd
      const init = {
        title: initialData.title,
        date: trimmedDate,
        description: initialData.description,
        fullText: initialData.fullText || '',
      }
      setForm(init)
      setInitialForm(init)
      setCurrentImageUrl(initialData.imageUrl || '')
    } else {
      // сбрасываем всё
      setForm({ title: '', date: '', description: '', fullText: '' })
      setInitialForm(null)
      setCurrentImageUrl('')
    }
    setFile(null)
    setRemoveImage(false)
  }, [initialData])

  /**
   * handleChange — общий обработчик полей формы и file-input
   */
  const handleChange = useCallback((e) => {
    const { name, value, files } = e.target

    if (name === 'image') {
      // загружаем новый файл
      setFile(files?.[0] || null)
      // если выбираем файл, считаем, что не нужно удалять старое
      setRemoveImage(false)
    } else {
      // обновляем простое поле формы
      setForm((prev) => ({ ...prev, [name]: value }))
    }
  }, [])

  /**
   * isDataChanged — мемоизированный флаг, что пользователь что-то изменил
   */
  const isDataChanged = useMemo(() => {
    if (!initialForm) return true // при создании — всегда считаем изменения
    return (
      form.title !== initialForm.title ||
      form.date !== initialForm.date ||
      form.description !== initialForm.description ||
      form.fullText !== initialForm.fullText ||
      Boolean(file) ||
      removeImage
    )
  }, [form, initialForm, file, removeImage])

  /**
   * prepareFormData — собирает FormData для отправки
   */
  const prepareFormData = useCallback(() => {
    const data = new FormData()
    data.append('title', form.title)
    data.append('date', form.date)
    data.append('description', form.description)
    data.append('fullText', form.fullText)
    if (file) data.append('image', file)
    if (removeImage) data.append('removeImage', 'true')
    return data
  }, [form, file, removeImage])

  /**
   * handleSubmit — при сабмите формы
   */
  const handleSubmit = useCallback(
    async (e) => {
      e.preventDefault()

      if (!isDataChanged) {
        toast.error('Данные не были изменены')
        return
      }

      const data = prepareFormData()
      await onSave(data, isEditing)
    },
    [isDataChanged, prepareFormData, onSave, isEditing]
  )

  /**
   * toggleRemoveImage — переключает флаг удаления текущего изображения
   */
  const toggleRemoveImage = useCallback(() => {
    setRemoveImage((v) => !v)
    // если отменяем удаление, сбросим возможный новый файл
    if (removeImage) setFile(null)
  }, [removeImage])

  return (
    <form onSubmit={handleSubmit} className="border border-gray-300 p-6 rounded shadow mb-8">
      <h3 className="text-xl mb-4">
        {isEditing ? 'Редактировать мероприятие' : 'Создать мероприятие'}
      </h3>

      {/* Заголовок */}
      <Input
        type="text"
        name="title"
        placeholder="Заголовок"
        value={form.title}
        onChange={handleChange}
        className="mb-3 p-2"
      />

      {/* Дата */}
      <Input
        type="date"
        name="date"
        value={form.date}
        onChange={handleChange}
        className="mb-3 p-2"
      />

      {/* Краткое описание */}
      <Textarea
        name="description"
        placeholder="Краткое описание"
        value={form.description}
        onChange={handleChange}
        className="mb-3"
        required
      />

      {/* Полный текст */}
      <Textarea
        name="fullText"
        placeholder="Полный текст"
        value={form.fullText}
        onChange={handleChange}
        className="mb-3"
      />

      {/* Отображаем текущее изображение и кнопку удаления */}
      {isEditing && currentImageUrl && !file && (
        <div className="mb-3 p-2 bg-electrician/10 rounded shadow-green">
          <p className="font-semibold mb-1">Текущее изображение:</p>
          <img
            src={currentImageUrl}
            alt="Preview"
            className="h-32 object-cover rounded mb-2"
          />
          <Button
            type="button"
            text={removeImage ? 'Восстановить изображение' : 'Удалить изображение'}
            onClick={toggleRemoveImage}
          />
        </div>
      )}

      {/* Загрузка нового изображения */}
      <div className="mb-4 p-2 bg-electrician/10 rounded shadow-green">
        <label className="block mb-1 font-semibold">Изображение</label>
        <input
          type="file"
          name="image"
          accept="image/*"
          onChange={handleChange}
          className="w-full p-2 rounded bg-electrician/10 shadow-green focus:outline-none"
        />
      </div>

      {/* Кнопки отправки и отмены */}
      <div className="flex justify-center space-x-3">
        <Button
          type="submit"
          disabled={loading}
          text={
            isEditing
              ? loading
                ? 'Сохраняем...'
                : 'Сохранить'
              : loading
              ? 'Добавляем...'
              : 'Добавить'
          }
          className="bg-green"
        />

        {isEditing && (
          <Button
            type="button"
            className="bg-gray-400 hover:bg-gray-500"
            text="Отменить"
            onClick={onCancel}
          />
        )}
      </div>
    </form>
  )
}

export default EventForm