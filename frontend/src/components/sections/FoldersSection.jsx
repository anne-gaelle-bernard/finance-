import { FolderOpen, Plus, FileText, Calendar } from 'lucide-react';
import { format } from 'date-fns';

const FoldersSection = ({ folders, onSelectFolder, onAddFolder }) => {
  const totalReceipts = folders.reduce((sum, folder) => sum + (folder.receipts?.length || 0), 0);
  const totalAmount = folders.reduce((sum, folder) => sum + parseFloat(folder.total || 0), 0);

  return (
    <div>
      <div className="mb-6 flex items-center justify-between">
        <div>
          <h1 className="text-2xl sm:text-3xl font-bold text-gray-800 mb-2">Mes Dossiers</h1>
          <p className="text-gray-600">Organisez vos reçus par dossier</p>
        </div>
        <button
          onClick={onAddFolder}
          className="flex items-center gap-2 px-4 py-2 bg-pink-500 text-white rounded-lg hover:bg-pink-600 transition-colors"
        >
          <Plus size={20} />
          <span className="hidden sm:inline">Nouveau Dossier</span>
        </button>
      </div>

      {/* Summary Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mb-8">
        <div className="glass-card rounded-xl shadow-md p-6">
          <div className="flex items-center justify-between mb-2">
            <h3 className="text-sm font-semibold text-gray-600">Total Dossiers</h3>
            <FolderOpen className="text-blue-500" size={24} />
          </div>
          <p className="text-3xl font-bold text-gray-800">{folders.length}</p>
        </div>

        <div className="glass-card rounded-xl shadow-md p-6">
          <div className="flex items-center justify-between mb-2">
            <h3 className="text-sm font-semibold text-gray-600">Total Reçus</h3>
            <FileText className="text-purple-500" size={24} />
          </div>
          <p className="text-3xl font-bold text-gray-800">{totalReceipts}</p>
        </div>

        <div className="glass-card rounded-xl shadow-md p-6">
          <div className="flex items-center justify-between mb-2">
            <h3 className="text-sm font-semibold text-gray-600">Montant Total</h3>
            <FileText className="text-green-500" size={24} />
          </div>
          <p className="text-3xl font-bold text-gray-800">${totalAmount.toFixed(2)}</p>
        </div>
      </div>

      {/* Folders Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
        {folders.length === 0 ? (
          <div className="col-span-full glass-card rounded-xl shadow-md p-12 text-center">
            <FolderOpen className="mx-auto mb-4 text-gray-300" size={64} />
            <h3 className="text-xl font-semibold text-gray-600 mb-2">Aucun dossier</h3>
            <p className="text-gray-500 mb-4">Créez votre premier dossier pour organiser vos reçus</p>
            <button
              onClick={onAddFolder}
              className="inline-flex items-center gap-2 px-6 py-3 bg-pink-500 text-white rounded-lg hover:bg-pink-600 transition-colors"
            >
              <Plus size={20} />
              Créer un Dossier
            </button>
          </div>
        ) : (
          folders.map((folder) => (
            <div
              key={folder.id}
              onClick={() => onSelectFolder(folder)}
              className="glass-card rounded-xl shadow-md p-6 cursor-pointer hover:shadow-xl transition-all hover:scale-105"
            >
              <div className="flex items-start justify-between mb-4">
                <div 
                  className={`w-12 h-12 rounded-lg flex items-center justify-center text-white`}
                  style={{ backgroundColor: folder.color || '#FF6B9D' }}
                >
                  <FolderOpen size={24} />
                </div>
                <span className="text-xs text-gray-500">
                  {folder.receipts?.length || 0} reçus
                </span>
              </div>

              <h3 className="text-lg font-bold text-gray-800 mb-2">{folder.name}</h3>
              
              {folder.description && (
                <p className="text-sm text-gray-600 mb-3 line-clamp-2">{folder.description}</p>
              )}

              <div className="flex items-center justify-between pt-3 border-t border-gray-200">
                <div className="flex items-center gap-1 text-xs text-gray-500">
                  <Calendar size={14} />
                  <span>{format(new Date(folder.createdAt), 'dd/MM/yyyy')}</span>
                </div>
                <div className="text-sm font-bold text-pink-600">
                  ${parseFloat(folder.total || 0).toFixed(2)}
                </div>
              </div>
            </div>
          ))
        )}
      </div>

      {/* Folders Table (Alternative View) */}
      {folders.length > 0 && (
        <div className="glass-card rounded-xl shadow-lg p-6 mt-8">
          <h2 className="text-xl font-bold text-gray-800 mb-4">Vue Détaillée</h2>
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className="bg-pink-50">
                <tr>
                  <th className="px-4 py-3 text-left text-sm font-semibold text-gray-700">Dossier</th>
                  <th className="px-4 py-3 text-center text-sm font-semibold text-gray-700">Reçus</th>
                  <th className="px-4 py-3 text-right text-sm font-semibold text-gray-700">Montant Total</th>
                  <th className="px-4 py-3 text-right text-sm font-semibold text-gray-700">Date de Création</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-200">
                {folders.map((folder) => (
                  <tr 
                    key={folder.id}
                    onClick={() => onSelectFolder(folder)}
                    className="hover:bg-gray-50 cursor-pointer"
                  >
                    <td className="px-4 py-3">
                      <div className="flex items-center gap-3">
                        <div 
                          className="w-8 h-8 rounded-lg flex items-center justify-center text-white"
                          style={{ backgroundColor: folder.color || '#FF6B9D' }}
                        >
                          <FolderOpen size={16} />
                        </div>
                        <div>
                          <div className="font-medium text-gray-800">{folder.name}</div>
                          {folder.description && (
                            <div className="text-xs text-gray-500 truncate max-w-xs">
                              {folder.description}
                            </div>
                          )}
                        </div>
                      </div>
                    </td>
                    <td className="px-4 py-3 text-center">
                      <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-blue-100 text-blue-800">
                        {folder.receipts?.length || 0}
                      </span>
                    </td>
                    <td className="px-4 py-3 text-right font-semibold text-gray-800">
                      ${parseFloat(folder.total || 0).toFixed(2)}
                    </td>
                    <td className="px-4 py-3 text-right text-sm text-gray-600">
                      {format(new Date(folder.createdAt), 'dd/MM/yyyy')}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}
    </div>
  );
};

export default FoldersSection;
