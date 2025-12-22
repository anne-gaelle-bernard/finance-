import { useState } from 'react'

const CalculatorModal = ({ onClose }) => {
  const [display, setDisplay] = useState('0')
  const [previousValue, setPreviousValue] = useState(null)
  const [operation, setOperation] = useState(null)
  const [newNumber, setNewNumber] = useState(true)

  const handleNumber = (num) => {
    if (newNumber) {
      setDisplay(num)
      setNewNumber(false)
    } else {
      setDisplay(display === '0' ? num : display + num)
    }
  }

  const handleDecimal = () => {
    if (newNumber) {
      setDisplay('0.')
      setNewNumber(false)
    } else if (!display.includes('.')) {
      setDisplay(display + '.')
    }
  }

  const handleOperation = (op) => {
    const currentValue = parseFloat(display)
    
    if (previousValue !== null && !newNumber) {
      calculate()
    } else {
      setPreviousValue(currentValue)
    }
    
    setOperation(op)
    setNewNumber(true)
  }

  const calculate = () => {
    if (previousValue === null || operation === null) return
    
    const current = parseFloat(display)
    let result = 0

    switch (operation) {
      case '+':
        result = previousValue + current
        break
      case '-':
        result = previousValue - current
        break
      case '×':
        result = previousValue * current
        break
      case '÷':
        result = current !== 0 ? previousValue / current : 0
        break
      default:
        return
    }

    setDisplay(result.toString())
    setPreviousValue(null)
    setOperation(null)
    setNewNumber(true)
  }

  const clear = () => {
    setDisplay('0')
    setPreviousValue(null)
    setOperation(null)
    setNewNumber(true)
  }

  const backspace = () => {
    if (display.length > 1) {
      setDisplay(display.slice(0, -1))
    } else {
      setDisplay('0')
      setNewNumber(true)
    }
  }

  const copyToClipboard = () => {
    navigator.clipboard.writeText(display)
    // Optional: show a notification
  }

  const buttons = [
    ['C', '⌫', '÷'],
    ['7', '8', '9', '×'],
    ['4', '5', '6', '-'],
    ['1', '2', '3', '+'],
    ['0', '.', '=']
  ]

  const handleButtonClick = (btn) => {
    if (btn >= '0' && btn <= '9') {
      handleNumber(btn)
    } else if (btn === '.') {
      handleDecimal()
    } else if (btn === 'C') {
      clear()
    } else if (btn === '⌫') {
      backspace()
    } else if (btn === '=') {
      calculate()
    } else {
      handleOperation(btn)
    }
  }

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 z-50 flex items-center justify-center p-4">
      <div className="bg-white rounded-xl max-w-sm w-full shadow-2xl">
        <div className="p-6">
          <div className="flex justify-between items-center mb-4">
            <h2 className="text-xl font-bold text-gray-800">🧮 Calculator</h2>
            <button onClick={onClose} className="text-gray-500 hover:text-gray-700">
              <i className="fas fa-times text-xl"></i>
            </button>
          </div>

          {/* Display */}
          <div className="mb-4 relative">
            <div className="bg-gray-100 rounded-lg p-4 text-right">
              <div className="text-3xl font-bold text-gray-800 break-all">
                {display}
              </div>
              {operation && previousValue !== null && (
                <div className="text-sm text-gray-500 mt-1">
                  {previousValue} {operation}
                </div>
              )}
            </div>
            <button
              onClick={copyToClipboard}
              className="absolute top-2 right-2 text-pink-500 hover:text-pink-700 text-sm"
              title="Copy result"
            >
              <i className="fas fa-copy"></i>
            </button>
          </div>

          {/* Buttons */}
          <div className="grid gap-2">
            {buttons.map((row, rowIndex) => (
              <div key={rowIndex} className="grid grid-cols-4 gap-2">
                {row.map((btn) => (
                  <button
                    key={btn}
                    onClick={() => handleButtonClick(btn)}
                    className={`
                      p-4 rounded-lg font-semibold text-lg transition-all
                      ${btn === 'C' || btn === '⌫'
                        ? 'bg-red-100 text-red-700 hover:bg-red-200'
                        : btn === '=' 
                        ? 'bg-pink-500 text-white hover:bg-pink-600 col-span-2'
                        : btn === '+' || btn === '-' || btn === '×' || btn === '÷'
                        ? 'bg-pink-100 text-pink-700 hover:bg-pink-200'
                        : 'bg-gray-100 hover:bg-gray-200 text-gray-800'
                      }
                      ${btn === '0' ? 'col-span-2' : ''}
                      active:scale-95
                    `}
                  >
                    {btn}
                  </button>
                ))}
              </div>
            ))}
          </div>

          <button
            onClick={onClose}
            className="w-full mt-4 px-4 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition"
          >
            Close
          </button>
        </div>
      </div>
    </div>
  )
}

export default CalculatorModal
