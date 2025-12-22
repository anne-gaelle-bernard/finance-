import { useState } from 'react'
import { useData } from '../contexts/DataContext'

const FoldersList = ({ onSelectFolder }) => {
  const { folders, deleteFolder } = useData()

  const formatCurrency = (amount) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD'
    }).format(amount)
  }

  const getColorClass = (color) => {
    const colors = {
      rose: 'bg-rose-100 text-rose-700 border-rose-300',
      pink: 'bg-pink-100 text-pink-700 border-pink-300',
      purple: 'bg-purple-100 text-purple-700 border-purple-300',
      blue: 'bg-blue-100 text-blue-700 border-blue-300',
      green: 'bg-green-100 text-green-700 border-green-300',
      yellow: 'bg-yellow-100 text-yellow-700 border-yellow-300'
    }
    return colors[color] || colors.pink
  }

  return (
    <div className="glass-card rounded-xl shadow-md p-4 sm:p-6">
      <h2 className="text-lg sm:text-xl font-bold text-gray-800 mb-4">
        <i className="fas fa-folder-open mr-2"></i>Folders
      </h2>
      
      {folders.length === 0 ? (
        <div className="text-center text-gray-500 py-8">
          <i className="fas fa-folder text-4xl mb-2 opacity-70"></i>
          <p className="text-sm">No folders yet</p>
        </div>
      ) : (
        <div className="space-y-3">
          {folders.map((folder) => (
            <div
              key={folder.id}
              className={`p-4 rounded-lg border-2 cursor-pointer hover:shadow-md transition ${getColorClass(folder.color)}`}
              onClick={() => onSelectFolder && onSelectFolder(folder)}
            >
              <div className="flex items-start justify-between">
                <div className="flex-1 min-w-0">
                  <h3 className="font-bold text-base mb-1 truncate">
                    📁 {folder.name}
                  </h3>
                  <p className="text-sm opacity-80">
                    {folder.receipts?.length || 0} receipt{folder.receipts?.length !== 1 ? 's' : ''}
                  </p>
                  <p className="text-lg font-bold mt-2">
                    {formatCurrency(folder.totalAmount || 0)}
                  </p>
                </div>
                <button
                  onClick={(e) => {
                    e.stopPropagation()
                    if (confirm(`Delete folder "${folder.name}"?`)) {
                      deleteFolder(folder.id)
                    }
                  }}
                  className="text-red-500 hover:text-red-700 ml-2"
                  title="Delete folder"
                >
                  <i className="fas fa-trash"></i>
                </button>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  )
}

export default FoldersList
