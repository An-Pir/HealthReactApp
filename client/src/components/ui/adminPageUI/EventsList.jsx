import EventItem from './EventItem.jsx';
import DefaultImg from '../../../assets/images/img7.jpg'; // Путь к изображению по умолчанию

const EventsList = ({ events, onEdit, onDelete, selectedEvent }) => {
  return (
    <>
      <h3 className="mb-4">Список мероприятий</h3>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {events.map((ev) => {
          const eventWithDefaultImage = {
            ...ev,
            imageUrl: ev.imageUrl && ev.imageUrl.trim() ? ev.imageUrl : DefaultImg,
          };

          return (
            <EventItem
              key={ev._id}
              ev={eventWithDefaultImage}
              onEdit={onEdit}
              onDelete={onDelete}
              isEditing={selectedEvent?._id === ev._id}
            />
          );
        })}
      </div>
    </>
  );
};

export default EventsList;