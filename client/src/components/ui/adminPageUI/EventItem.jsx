import Button from '../Button.jsx'

const EventItem = ({ ev, onEdit, onDelete, isEditing }) => {
  return (
    <div className="border border-gray-200 rounded shadow-sm p-4 flex flex-col items-center">
      {ev.imageUrl && (
        <img
          src={ev.imageUrl}
          alt={ev.title}
          className="h-40 w-full object-cover rounded mb-3"
        />
      )}
      <h4 className="text-lg font-semibold">{ev.title}</h4>
      <p className="text-sm text-gray-500 mb-2">
        {new Date(ev.date).toLocaleDateString()}
      </p>
      <p className="flex-grow text-gray-700 mb-4">{ev.description}</p>
      <div className="flex space-x-2">
        {!isEditing && (
          <Button onClick={() => onEdit(ev)} text="Редактировать" />
        )}
        <Button
          onClick={() => onDelete(ev._id)}
          className="bg-red-500"
          text="Удалить"
        />
      </div>
    </div>
  )
}

export default EventItem