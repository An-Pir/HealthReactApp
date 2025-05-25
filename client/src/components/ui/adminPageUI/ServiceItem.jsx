import { useState } from 'react'
import Button from '../Button.jsx'
import defaultServiceImage from '../../../assets/images/img7.jpg'


const ServiceItem = ({ svc, onEdit, onDelete, isEditing }) => {
  const [isDescOpen, setIsDescOpen] = useState(false)

  const [imgSrc, setImgSrc] = useState(svc.imageUrl || defaultServiceImage)

  return (
    <div className="border border-gray-200 rounded shadow-sm p-4 flex flex-col items-center relative">
      <img
        src={imgSrc}
        alt={svc.name}
        onError={() => {
          // если ошибка загрузки — ставим дефолт
          if (imgSrc !== defaultServiceImage) {
            setImgSrc(defaultServiceImage)
          }
        }}
        className="h-40 w-full object-cover rounded mb-3 bg-gray-100"
      />

      {/* Название услуги */}
      <h4 className="text-lg font-semibold text-center">{svc.name}</h4>

      {/* Аккордеон-описание */}
      <div
        className={`
          w-full text-gray-700 mb-2 transition-all duration-300
          ${isDescOpen ? 'max-h-60 overflow-y-auto' : 'max-h-16 overflow-hidden'}
        `}
      >
        {svc.description}
      </div>
      <button
        type="button"
        onClick={() => setIsDescOpen((o) => !o)}
        className="self-start text-sm text-blue-500 mb-4 hover:underline"
      >
        {isDescOpen ? 'Свернуть' : 'Подробнее'}
      </button>

      {/* Цены */}
      {(svc.priceChildren || svc.priceAdults) && (
        <p className="text-sm text-gray-500 mb-4">
          {svc.priceChildren != null && <>Дети: {svc.priceChildren}₽</>}
          {svc.priceAdults != null && (
            <>{svc.priceChildren != null ? ', ' : ''}Взрослые: {svc.priceAdults}₽</>
          )}
        </p>
      )}

      {/* Кнопки «Редактировать» и «Удалить» */}
      <div className="flex space-x-2 justify-center w-full mb-2">
        {/* Скрываем кнопку Редактировать, если уже в режиме редактирования */}
        {!isEditing && (
          <Button
            type="button"
            onClick={() => onEdit(svc)}
            text="Редактировать"
          />
        )}
        <Button
          type="button"
          onClick={() => onDelete(svc._id)}
          text="Удалить"
          className="bg-red-500 hover:bg-red-600"
        />
      </div>
    </div>
  )
}

export default ServiceItem