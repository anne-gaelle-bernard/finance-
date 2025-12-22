import { useState } from 'react'
import { useData } from '../../contexts/DataContext'

const AddReceiptModal = ({ onClose }) => {
  const { folders, addTransaction, addReceiptToFolder } = useData()
  const [selectedFolder, setSelectedFolder] = useState('')
  const [image, setImage] = useState(null)
  const [preview, setPreview] = useState(null)
  const [isScanning, setIsScanning] = useState(false)
  const [scanResult, setScanResult] = useState(null)
  const [manualEntry, setManualEntry] = useState({
    description: '',
    amount: '',
    category: 'other',
    date: new Date().toISOString().split('T')[0]
  })

  const handleImageChange = (e) => {
    const file = e.target.files[0]
    if (file) {
      setImage(file)
      const reader = new FileReader()
      reader.onloadend = () => {
        setPreview(reader.result)
      }
      reader.readAsDataURL(file)
    }
  }

  const scanReceipt = async () => {
    if (!image) return

    setIsScanning(true)
    try {
      // Simulate OCR scanning - in production, use Tesseract.js or an API
      await new Promise(resolve => setTimeout(resolve, 2000))
      
      // Mock OCR result
      const mockResult = {
        description: 'Restaurant Bill',
        amount: (Math.random() * 100 + 10).toFixed(2),
        date: new Date().toISOString().split('T')[0],
        category: 'food'
      }
      
      setScanResult(mockResult)
      setManualEntry(mockResult)
    } catch (error) {
      console.error('Error scanning receipt:', error)
      alert('Error scanning receipt. Please enter details manually.')
    } finally {
      setIsScanning(false)
    }
  }

  const handleSubmit = (e) => {
    e.preventDefault()
    
    if (!selectedFolder) {
      alert('Please select a folder')
      return
    }

    if (!manualEntry.description || !manualEntry.amount) {
      alert('Please enter description and amount')
      return
    }

    const receipt = {
      description: manualEntry.description,
      amount: parseFloat(manualEntry.amount),
      category: manualEntry.category,
      date: manualEntry.date,
      imageUrl: preview,
      scannedAt: new Date().toISOString()
    }

    // Add as transaction
    addTransaction({
      type: 'expense',
      description: receipt.description,
      amount: receipt.amount,
      category: receipt.category,
      date: receipt.date
    })

    // Add to folder
    addReceiptToFolder(selectedFolder, receipt)

    onClose()
  }

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 z-50 flex items-center justify-center p-4 overflow-y-auto">
      <div className="bg-white rounded-xl max-w-2xl w-full shadow-2xl my-8">
        <div className="p-6">
          <div className="flex justify-between items-center mb-4">
            <h2 className="text-xl font-bold text-gray-800">📸 Scan Receipt</h2>
            <button onClick={onClose} className="text-gray-500 hover:text-gray-700">
              <i className="fas fa-times text-xl"></i>
            </button>
          </div>

          <form onSubmit={handleSubmit} className="space-y-4">
            {/* Folder Selection */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                <i className="fas fa-folder mr-2"></i>Select Folder
              </label>
              <select
                value={selectedFolder}
                onChange={(e) => setSelectedFolder(e.target.value)}
                required
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-pink-500 focus:border-transparent"
              >
                <option value="">Choose a folder...</option>
                {folders.map(folder => (
                  <option key={folder.id} value={folder.id}>
                    {folder.name}
                  </option>
                ))}
              </select>
            </div>

            {/* Image Upload */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                <i className="fas fa-image mr-2"></i>Upload Receipt Image
              </label>
              <input
                type="file"
                accept="image/*"
                onChange={handleImageChange}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-pink-500 focus:border-transparent"
              />
            </div>

            {/* Image Preview */}
            {preview && (
              <div className="space-y-3">
                <div className="border border-gray-300 rounded-lg p-4">
                  <img 
                    src={preview} 
                    alt="Receipt preview" 
                    className="max-h-64 mx-auto rounded-lg shadow-md"
                  />
                </div>
                
                {!scanResult && (
                  <button
                    type="button"
                    onClick={scanReceipt}
                    disabled={isScanning}
                    className="w-full px-4 py-3 bg-gradient-to-r from-blue-500 to-blue-600 text-white rounded-lg hover:from-blue-600 hover:to-blue-700 transition disabled:opacity-50 font-medium"
                  >
                    {isScanning ? (
                      <>
                        <i className="fas fa-spinner fa-spin mr-2"></i>
                        Scanning Receipt...
                      </>
                    ) : (
                      <>
                        <i className="fas fa-search mr-2"></i>
                        Scan Receipt with OCR
                      </>
                    )}
                  </button>
                )}
              </div>
            )}

            {/* Manual Entry / Scanned Results */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Description
                </label>
                <input
                  type="text"
                  value={manualEntry.description}
                  onChange={(e) => setManualEntry({...manualEntry, description: e.target.value})}
                  required
                  placeholder="e.g., Grocery shopping"
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-pink-500 focus:border-transparent"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Amount ($)
                </label>
                <input
                  type="number"
                  step="0.01"
                  value={manualEntry.amount}
                  onChange={(e) => setManualEntry({...manualEntry, amount: e.target.value})}
                  required
                  placeholder="0.00"
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-pink-500 focus:border-transparent"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Category
                </label>
                <select
                  value={manualEntry.category}
                  onChange={(e) => setManualEntry({...manualEntry, category: e.target.value})}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-pink-500 focus:border-transparent"
                >
                  <option value="food">🍔 Food & Dining</option>
                  <option value="transport">🚗 Transport</option>
                  <option value="shopping">🛍️ Shopping</option>
                  <option value="healthcare">💊 Healthcare</option>
                  <option value="entertainment">🎮 Entertainment</option>
                  <option value="utilities">💡 Utilities</option>
                  <option value="other">📦 Other</option>
                </select>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Date
                </label>
                <input
                  type="date"
                  value={manualEntry.date}
                  onChange={(e) => setManualEntry({...manualEntry, date: e.target.value})}
                  required
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-pink-500 focus:border-transparent"
                />
              </div>
            </div>

            {scanResult && (
              <div className="bg-green-50 border border-green-200 rounded-lg p-3">
                <p className="text-sm text-green-700">
                  <i className="fas fa-check-circle mr-2"></i>
                  Receipt scanned successfully! Review and edit the details above if needed.
                </p>
              </div>
            )}

            {/* Buttons */}
            <div className="flex gap-3 pt-4">
              <button
                type="button"
                onClick={onClose}
                className="flex-1 px-4 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition"
              >
                Cancel
              </button>
              <button
                type="submit"
                className="flex-1 px-4 py-2 bg-gradient-to-r from-pink-500 to-rose-500 text-white rounded-lg hover:from-pink-600 hover:to-rose-600 transition font-medium"
              >
                <i className="fas fa-save mr-2"></i>Save Receipt
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  )
}

export default AddReceiptModal
