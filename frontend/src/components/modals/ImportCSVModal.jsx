import { useState } from 'react';
import { X, Upload, FileText, AlertCircle, CheckCircle } from 'lucide-react';
import Papa from 'papaparse';
import { format } from 'date-fns';
import { useData } from '../../contexts/DataContext';

export default function ImportCSVModal({ onClose }) {
  const [file, setFile] = useState(null);
  const [preview, setPreview] = useState([]);
  const [error, setError] = useState('');
  const [importing, setImporting] = useState(false);
  const [result, setResult] = useState(null);
  const { addTransaction } = useData();

  const handleFileChange = (e) => {
    const selectedFile = e.target.files[0];
    if (!selectedFile) return;

    if (!selectedFile.name.endsWith('.csv')) {
      setError('Please select a CSV file');
      return;
    }

    setFile(selectedFile);
    setError('');

    // Parse CSV for preview
    Papa.parse(selectedFile, {
      header: true,
      skipEmptyLines: true,
      complete: (results) => {
        if (results.errors.length > 0) {
          setError('Error parsing CSV file');
          return;
        }
        setPreview(results.data.slice(0, 5)); // Show first 5 rows
      },
      error: (error) => {
        setError('Failed to read CSV file: ' + error.message);
      }
    });
  };

  const handleImport = () => {
    if (!file) {
      setError('Please select a file');
      return;
    }

    setImporting(true);
    setError('');

    Papa.parse(file, {
      header: true,
      skipEmptyLines: true,
      complete: async (results) => {
        let imported = 0;
        let failed = 0;

        for (const row of results.data) {
          try {
            // Expected CSV format: date, description, amount, category, type
            const transaction = {
              type: row.type?.toLowerCase() || 'expense',
              amount: parseFloat(row.amount),
              description: row.description || 'Imported transaction',
              category: row.category || 'Other',
              date: row.date ? new Date(row.date) : new Date()
            };

            // Validate
            if (isNaN(transaction.amount) || transaction.amount <= 0) {
              failed++;
              continue;
            }

            await addTransaction(transaction);
            imported++;
          } catch (err) {
            console.error('Import error:', err);
            failed++;
          }
        }

        setResult({ imported, failed, total: results.data.length });
        setImporting(false);
      },
      error: (error) => {
        setError('Import failed: ' + error.message);
        setImporting(false);
      }
    });
  };

  const downloadTemplate = () => {
    const template = `date,description,amount,category,type
${format(new Date(), 'yyyy-MM-dd')},Grocery Shopping,45.50,Food,expense
${format(new Date(), 'yyyy-MM-dd')},Salary,2500.00,Salary,income
${format(new Date(), 'yyyy-MM-dd')},Electric Bill,120.00,Utilities,expense`;

    const blob = new Blob([template], { type: 'text/csv' });
    const url = window.URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = 'finance-tracker-template.csv';
    a.click();
    window.URL.revokeObjectURL(url);
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-lg w-full max-w-3xl max-h-[90vh] overflow-hidden">
        <div className="flex justify-between items-center p-6 border-b">
          <h2 className="text-2xl font-bold text-gray-800">Import from CSV</h2>
          <button onClick={onClose} className="text-gray-500 hover:text-gray-700">
            <X size={24} />
          </button>
        </div>

        <div className="p-6 overflow-y-auto max-h-[calc(90vh-140px)]">
          {!result ? (
            <>
              {/* Instructions */}
              <div className="bg-blue-50 border border-blue-200 rounded-lg p-4 mb-6">
                <h3 className="font-semibold text-blue-900 mb-2">CSV Format</h3>
                <p className="text-sm text-blue-800 mb-2">
                  Your CSV file should have these columns: <code className="bg-blue-100 px-1 rounded">date</code>, <code className="bg-blue-100 px-1 rounded">description</code>, <code className="bg-blue-100 px-1 rounded">amount</code>, <code className="bg-blue-100 px-1 rounded">category</code>, <code className="bg-blue-100 px-1 rounded">type</code>
                </p>
                <button
                  onClick={downloadTemplate}
                  className="text-sm text-blue-600 hover:text-blue-800 underline"
                >
                  Download template file
                </button>
              </div>

              {/* File Upload */}
              <div className="mb-6">
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Select CSV File
                </label>
                <div className="border-2 border-dashed border-gray-300 rounded-lg p-8 text-center hover:border-blue-500 transition">
                  <input
                    type="file"
                    accept=".csv"
                    onChange={handleFileChange}
                    className="hidden"
                    id="csv-upload"
                  />
                  <label htmlFor="csv-upload" className="cursor-pointer">
                    <Upload className="mx-auto h-12 w-12 text-gray-400 mb-3" />
                    <p className="text-sm text-gray-600">
                      {file ? file.name : 'Click to upload or drag and drop'}
                    </p>
                    <p className="text-xs text-gray-500 mt-1">CSV files only</p>
                  </label>
                </div>
              </div>

              {/* Error */}
              {error && (
                <div className="bg-red-50 border border-red-200 rounded-lg p-4 mb-6 flex items-start">
                  <AlertCircle className="text-red-600 mr-2 flex-shrink-0" size={20} />
                  <p className="text-sm text-red-800">{error}</p>
                </div>
              )}

              {/* Preview */}
              {preview.length > 0 && (
                <div className="mb-6">
                  <h3 className="font-semibold text-gray-800 mb-3 flex items-center">
                    <FileText className="mr-2" size={20} />
                    Preview (first 5 rows)
                  </h3>
                  <div className="overflow-x-auto">
                    <table className="min-w-full divide-y divide-gray-200 text-sm">
                      <thead className="bg-gray-50">
                        <tr>
                          <th className="px-4 py-2 text-left text-xs font-medium text-gray-500 uppercase">Date</th>
                          <th className="px-4 py-2 text-left text-xs font-medium text-gray-500 uppercase">Description</th>
                          <th className="px-4 py-2 text-left text-xs font-medium text-gray-500 uppercase">Amount</th>
                          <th className="px-4 py-2 text-left text-xs font-medium text-gray-500 uppercase">Category</th>
                          <th className="px-4 py-2 text-left text-xs font-medium text-gray-500 uppercase">Type</th>
                        </tr>
                      </thead>
                      <tbody className="bg-white divide-y divide-gray-200">
                        {preview.map((row, idx) => (
                          <tr key={idx}>
                            <td className="px-4 py-2 whitespace-nowrap">{row.date}</td>
                            <td className="px-4 py-2">{row.description}</td>
                            <td className="px-4 py-2 whitespace-nowrap">${row.amount}</td>
                            <td className="px-4 py-2 whitespace-nowrap">{row.category}</td>
                            <td className="px-4 py-2 whitespace-nowrap">
                              <span className={`px-2 py-1 rounded text-xs ${
                                row.type?.toLowerCase() === 'income' 
                                  ? 'bg-green-100 text-green-800' 
                                  : 'bg-red-100 text-red-800'
                              }`}>
                                {row.type}
                              </span>
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                </div>
              )}
            </>
          ) : (
            /* Import Result */
            <div className="text-center py-8">
              <CheckCircle className="mx-auto h-16 w-16 text-green-500 mb-4" />
              <h3 className="text-2xl font-bold text-gray-800 mb-2">Import Complete!</h3>
              <div className="bg-gray-50 rounded-lg p-6 max-w-md mx-auto">
                <div className="grid grid-cols-3 gap-4 text-sm">
                  <div>
                    <p className="text-gray-600">Total</p>
                    <p className="text-2xl font-bold text-gray-800">{result.total}</p>
                  </div>
                  <div>
                    <p className="text-gray-600">Imported</p>
                    <p className="text-2xl font-bold text-green-600">{result.imported}</p>
                  </div>
                  <div>
                    <p className="text-gray-600">Failed</p>
                    <p className="text-2xl font-bold text-red-600">{result.failed}</p>
                  </div>
                </div>
              </div>
            </div>
          )}
        </div>

        {/* Footer */}
        {!result && (
          <div className="flex justify-end gap-3 p-6 border-t">
            <button
              onClick={onClose}
              className="px-4 py-2 border border-gray-300 rounded-lg text-gray-700 hover:bg-gray-50"
            >
              Cancel
            </button>
            <button
              onClick={handleImport}
              disabled={!file || importing}
              className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:bg-gray-300 disabled:cursor-not-allowed flex items-center"
            >
              {importing ? (
                <>
                  <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
                  Importing...
                </>
              ) : (
                <>
                  <Upload size={18} className="mr-2" />
                  Import Transactions
                </>
              )}
            </button>
          </div>
        )}

        {result && (
          <div className="flex justify-end gap-3 p-6 border-t">
            <button
              onClick={onClose}
              className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
            >
              Done
            </button>
          </div>
        )}
      </div>
    </div>
  );
}
