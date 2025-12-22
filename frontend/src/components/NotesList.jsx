import { useData } from '../contexts/DataContext'

const NotesList = ({ notes }) => {
  const { deleteNote } = useData()

  return (
    <div className="glass-card rounded-xl shadow-md p-6">
      <h2 className="text-xl font-bold text-gray-800 mb-4">📝 Quick Notes</h2>
      
      <div className="space-y-3">
        {notes.length === 0 ? (
          <div className="text-center text-gray-500 py-8">
            <i className="fas fa-sticky-note text-4xl mb-2 opacity-70"></i>
            <p className="text-sm">No notes yet</p>
          </div>
        ) : (
          notes.map((note) => (
            <div key={note.id} className="p-4 bg-gray-50 rounded-lg border-l-4 border-pink-500">
              <div className="flex justify-between items-start">
                <div className="flex-1">
                  {note.title && (
                    <h3 className="font-semibold text-gray-800 mb-1">{note.title}</h3>
                  )}
                  <p className="text-sm text-gray-700 whitespace-pre-wrap">{note.content}</p>
                  {note.createdAt && (
                    <p className="text-xs text-gray-500 mt-2">
                      {new Date(note.createdAt).toLocaleDateString('fr-FR', {
                        day: 'numeric',
                        month: 'short',
                        year: 'numeric',
                        hour: '2-digit',
                        minute: '2-digit'
                      })}
                    </p>
                  )}
                </div>
                <button
                  onClick={() => deleteNote(note.id)}
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

export default NotesList
