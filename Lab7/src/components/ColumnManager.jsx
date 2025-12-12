import { useState } from 'react'

export default function ColumnManager({ open, onClose, columns, onUpdateColumns }) {
  const [newColumnTitle, setNewColumnTitle] = useState('')
  const [draggedColumn, setDraggedColumn] = useState(null)

  if (!open) return null

  function handleAddColumn() {
    if (!newColumnTitle.trim()) return
    
    const newColumn = {
      id: `col-${Date.now()}`,
      title: newColumnTitle.trim(),
      order: columns.length
    }
    
    onUpdateColumns([...columns, newColumn])
    setNewColumnTitle('')
  }

  function handleDeleteColumn(columnId) {
    if (columns.length <= 1) {
      alert('You must have at least one column')
      return
    }
    if (window.confirm('Are you sure you want to delete this column? All tasks will be moved to the first column.')) {
      onUpdateColumns(columns.filter(c => c.id !== columnId))
    }
  }

  function handleDragStart(e, index) {
    setDraggedColumn(index)
    e.dataTransfer.effectAllowed = 'move'
  }

  function handleDragOver(e, index) {
    e.preventDefault()
    if (draggedColumn === null) return
    
    const newColumns = [...columns]
    const draggedItem = newColumns[draggedColumn]
    newColumns.splice(draggedColumn, 1)
    newColumns.splice(index, 0, draggedItem)
    
    newColumns.forEach((col, idx) => {
      col.order = idx
    })
    
    onUpdateColumns(newColumns)
    setDraggedColumn(index)
  }

  function handleDragEnd() {
    setDraggedColumn(null)
  }

  return (
    <div 
      className="fixed inset-0 flex items-center justify-center bg-black/50 z-50 p-4"
      onClick={onClose}
    >
      <div 
        className="bg-white rounded-xl shadow-2xl w-full max-w-md p-6"
        onClick={(e) => e.stopPropagation()}
      >
        <h3 className="text-xl font-bold text-gray-800 mb-4">Manage Columns</h3>
        
        <div className="mb-6 flex gap-2">
          <input
            type="text"
            value={newColumnTitle}
            onChange={(e) => setNewColumnTitle(e.target.value)}
            onKeyPress={(e) => e.key === 'Enter' && handleAddColumn()}
            placeholder="New column name..."
            className="flex-1 px-3 py-2 border border-gray-300 rounded-lg bg-white text-gray-800"
          />
          <button
            onClick={handleAddColumn}
            className="px-4 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700"
          >
            Add
          </button>
        </div>

        <div className="space-y-2 max-h-96 overflow-y-auto">
          {columns.map((column, index) => (
            <div
              key={column.id}
              draggable
              onDragStart={(e) => handleDragStart(e, index)}
              onDragOver={(e) => handleDragOver(e, index)}
              onDragEnd={handleDragEnd}
              className="flex items-center gap-2 p-3 bg-gray-50 rounded-lg cursor-move"
            >
              <svg className="w-5 h-5 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 8h16M4 16h16" />
              </svg>
              <span className="flex-1 text-gray-700">{column.title}</span>
              {columns.length > 1 && (
                <button
                  onClick={() => handleDeleteColumn(column.id)}
                  className="text-red-500 hover:text-red-700"
                >
                  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                  </svg>
                </button>
              )}
            </div>
          ))}
        </div>

        <div className="mt-6 flex justify-end">
          <button
            onClick={onClose}
            className="px-4 py-2 bg-gray-200 text-gray-700 rounded-lg hover:bg-gray-300"
          >
            Close
          </button>
        </div>
      </div>
    </div>
  )
}
