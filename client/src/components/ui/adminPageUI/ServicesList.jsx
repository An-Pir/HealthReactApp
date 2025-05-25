import ServiceItem from './ServiceItem.jsx'

const ServicesList = ({ services, onEdit, onDelete, editingService }) => {
  return (
    <>
      <h3 className="mb-4">Список услуг</h3>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {services.map(svc => (
          <ServiceItem
            key={svc._id}
            svc={svc}
            onEdit={onEdit}
            onDelete={onDelete}
            isEditing={editingService?._id === svc._id}
          />
        ))}
      </div>
    </>
  )
}

export default ServicesList