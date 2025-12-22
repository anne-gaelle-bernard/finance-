import { useData } from '../../contexts/DataContext'

const FolderDetailsModal = ({ folder, onClose }) => {
  const { deleteReceiptFromFolder } = useData()

  const formatCurrency = (amount) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD'
    }).format(amount)
  }

  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric'
    })
  }

  const getColorClass = (color) => {
    const colors = {
      rose: 'from-rose-500 to-rose-600',
      pink: 'from-pink-500 to-rose-500',
      purple: 'from-purple-500 to-purple-600',
      blue: 'from-blue-500 to-blue-600',
      green: 'from-green-500 to-green-600',
      yellow: 'from-yellow-400 to-yellow-500'
    }
    return colors[color] || colors.pink
  }

  const handleDeleteReceipt = (receiptId) => {
    if (confirm('Delete this receipt?')) {
      deleteReceiptFromFolder(folder.id, receiptId)
    }
  }

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 z-50 flex items-center justify-center p-4 overflow-y-auto">
      <div className="bg-white rounded-xl max-w-3xl w-full shadow-2xl my-8">
        <div className={`bg-gradient-to-r ${getColorClass(folder.color)} text-white p-6 rounded-t-xl`}>
          <div className="flex justify-between items-start">
            <div>
              <h2 className="text-2xl font-bold mb-2">📁 {folder.name}</h2>
              <p className="opacity-90">
                {folder.receipts?.length || 0} receipt{folder.receipts?.length !== 1 ? 's' : ''} • {formatCurrency(folder.totalAmount || 0)}
              </p>
            </div>
            <button onClick={onClose} className="text-white hover:bg-white hover:bg-opacity-20 p-2 rounded-lg transition">
              <i className="fas fa-times text-xl"></i>
            </button>
          </div>
        </div>

        <div className="p-6 max-h-[60vh] overflow-y-auto">
          {!folder.receipts || folder.receipts.length === 0 ? (
            <div className="text-center text-gray-500 py-12">
              <i className="fas fa-receipt text-5xl mb-4 opacity-50"></i>
              <p className="text-lg font-medium">No receipts in this folder</p>
              <p className="text-sm mt-2">Scan a receipt and add it to this folder to get started</p>
            </div>
          ) : (
            <div className="space-y-4">
              {folder.receipts.map((receipt) => (
                <div
                  key={receipt.id}
                  className="border border-gray-200 rounded-lg p-4 hover:shadow-md transition"
                >
                  <div className="flex items-start gap-4">
                    {/* Receipt Image */}
                    {receipt.imageUrl && (
                      <div className="flex-shrink-0">
                        <img
                          src={receipt.imageUrl}
                          alt="Receipt"
                          className="w-24 h-24 object-cover rounded-lg border border-gray-300 cursor-pointer hover:opacity-80 transition"
                          onClick={() => window.open(receipt.imageUrl, '_blank')}
                          title="Click to view full size"
                        />
                      </div>
                    )}

                    {/* Receipt Details */}
                    <div className="flex-1 min-w-0">
                      <div className="flex items-start justify-between mb-2">
                        <div className="flex-1 min-w-0">
                          <h3 className="font-bold text-gray-800 text-lg mb-1 truncate">
                            {receipt.description}
                          </h3>
                          <p className="text-sm text-gray-600">
                            <i className={`fas fa-tag mr-2`}></i>
                            {receipt.category} • {formatDate(receipt.date)}
                          </p>
                        </div>
                        <button
                          onClick={() => handleDeleteReceipt(receipt.id)}
                          className="text-red-500 hover:text-red-700 ml-2"
                          title="Delete receipt"
                        >
                          <i className="fas fa-trash"></i>
                        </button>
                      </div>
                      
                      <div className="flex items-center justify-between mt-3">
                        <p className="text-2xl font-bold text-pink-600">
                          {formatCurrency(receipt.amount)}
                        </p>
                        {receipt.scannedAt && (
                          <p className="text-xs text-gray-500">
                            <i className="fas fa-camera mr-1"></i>
                            Scanned {formatDate(receipt.scannedAt)}
                          </p>
                        )}
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>

        <div className="p-6 border-t border-gray-200">
          <button
            onClick={onClose}
            className="w-full px-4 py-2 bg-gray-100 text-gray-700 rounded-lg hover:bg-gray-200 transition font-medium"
          >
            Close
          </button>
        </div>
      </div>
    </div>
  )
}

export default FolderDetailsModal
