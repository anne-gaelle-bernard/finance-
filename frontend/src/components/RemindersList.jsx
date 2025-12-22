import { useData } from '../contexts/DataContext'

const RemindersList = ({ reminders }) => {
  const { deleteReminder } = useData()

  return (
    <div className="glass-card rounded-xl shadow-md p-6">
      <h2 className="text-xl font-bold text-gray-800 mb-4">📅 Reminders</h2>
      
      <div className="space-y-3">
        {reminders.length === 0 ? (
          <div className="text-center text-gray-500 py-8">
            <i className="fas fa-bell text-4xl mb-2 opacity-70"></i>
            <p className="text-sm">No upcoming reminders</p>
          </div>
        ) : (
          reminders.map((reminder) => (
            <div key={reminder.id} className="p-4 bg-gray-50 rounded-lg">
              <div className="flex justify-between items-start">
                <div className="flex-1">
                  <h3 className="font-medium text-gray-800">{reminder.title}</h3>
                  <p className="text-sm text-gray-600">
                    {reminder.date} • {reminder.time}
                  </p>
                  {reminder.notes && (
                    <p className="text-xs text-gray-500 mt-1">{reminder.notes}</p>
                  )}
                </div>
                <button
                  onClick={() => deleteReminder(reminder.id)}
                  className="text-red-500 hover:text-red-700 ml-2"
                >
                  <i className="fas fa-trash"></i>
                </button>
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  )
}

export default RemindersList
