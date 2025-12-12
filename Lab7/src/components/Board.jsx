import { useState, useEffect, useMemo, useRef } from 'react'
import Column from './Column'
import AddTaskModal from './AddTaskModal'
import SearchFilter from './SearchFilter'
import ColumnManager from './ColumnManager'
import Toast from './Toast'
import { loadInitialData, saveData, loadColumns, saveColumns } from '../utils/Storage'
import { DEFAULT_COLUMNS, AVAILABLE_USERS } from '../utils/constants'
import { exportToPDF } from '../utils/pdfExport'

const initialData = {
  todo: [
    { 
      id: '1', 
      title: 'Welcome to Kanban Board', 
      description: 'Drag tasks between columns to organize your work',
      assignedUsers: [],
      priority: 'none',
      dueDate: null,
      tags: [],
      subtasks: [],
      comments: []
    },
    { 
      id: '2', 
      title: 'Add a new task', 
      description: 'Click the + Add Task button to create new tasks',
      assignedUsers: [],
      priority: 'medium',
      dueDate: null,
      tags: [],
      subtasks: [],
      comments: []
    }
  ],
  doing: [
    { 
      id: '3', 
      title: 'Edit tasks', 
      description: 'Double-click on task titles to edit them',
      assignedUsers: ['1'],
      priority: 'low',
      dueDate: null,
      tags: [],
      subtasks: [],
      comments: []
    }
  ],
  done: [
    { 
      id: '4', 
      title: 'Delete tasks', 
      description: 'Use the delete button to remove tasks',
      assignedUsers: [],
      priority: 'none',
      dueDate: null,
      tags: [],
      subtasks: [],
      comments: []
    }
  ]
}

export default function Board() {
  const savedColumns = loadColumns() || DEFAULT_COLUMNS
  const [columns, setColumns] = useState(savedColumns)
  const boardRef = useRef(null)

  const [data, setData] = useState(() => {
    const saved = loadInitialData()
    if (saved) {
      const columnIds = savedColumns.map(c => c.id)
      const newData = { ...saved }
      columnIds.forEach(id => {
        if (!newData[id]) {
          newData[id] = []
        }
      })
      return newData
    }
    return initialData
  })

  const [dragState, setDragState] = useState({ over: null })
  const [modalOpen, setModalOpen] = useState(false)
  const [columnManagerOpen, setColumnManagerOpen] = useState(false)
  const [searchQuery, setSearchQuery] = useState('')
  const [filters, setFilters] = useState({
    user: null,
    priority: null,
    status: null
  })
  const [toast, setToast] = useState({ show: false, message: '', type: 'info' })

  function showToast(message, type = 'info') {
    setToast({ show: true, message, type })
  }

  useEffect(() => {
    saveData(data)
  }, [data])

  useEffect(() => {
    saveColumns(columns)
  }, [columns])

  const filteredData = useMemo(() => {
    const filtered = { ...data }
    
    Object.keys(filtered).forEach(columnKey => {
      filtered[columnKey] = filtered[columnKey].filter(task => {
        if (searchQuery) {
          const query = searchQuery.toLowerCase()
          const matchesSearch = 
            task.title.toLowerCase().includes(query) ||
            (task.description && task.description.toLowerCase().includes(query))
          if (!matchesSearch) return false
        }

        if (filters.user) {
          if (!task.assignedUsers || !task.assignedUsers.includes(filters.user)) {
            return false
          }
        }

        if (filters.priority) {
          if (task.priority !== filters.priority) {
            return false
          }
        }

        if (filters.status) {
          if (columnKey !== filters.status) {
            return false
          }
        }

        return true
      })
    })

    return filtered
  }, [data, searchQuery, filters])

  function onAddTaskTo(columnKey, taskData) {
    const newTask = {
      id: Date.now().toString(),
      title: taskData.title,
      description: taskData.description || '',
      assignedUsers: taskData.assignedUsers || [],
      priority: taskData.priority || 'none',
      dueDate: taskData.dueDate || null,
      tags: taskData.tags || [],
      subtasks: taskData.subtasks || [],
      comments: taskData.comments || []
    }
    
    setData(prev => ({
      ...prev,
      [columnKey]: [...prev[columnKey], newTask]
    }))

    showToast('Task added successfully!', 'success')
  }

  function onEditTask(taskId, updates) {
    setData(prev => {
      const newData = { ...prev }
      
      for (const col of Object.keys(newData)) {
        const index = newData[col].findIndex(t => t.id === taskId)
        if (index !== -1) {
          newData[col] = [...newData[col]]
          newData[col][index] = { ...newData[col][index], ...updates }
          break
        }
      }
      
      return newData
    })
  }

  function onDeleteTask(taskId) {
    setData(prev => {
      const newData = {}
      Object.keys(prev).forEach(key => {
        newData[key] = prev[key].filter(t => t.id !== taskId)
      })
      return newData
    })
    showToast('Task deleted', 'info')
  }

  function onDropTask(e, targetColumn) {
    e.preventDefault()
    const id = e.dataTransfer.getData('text/plain')
    if (!id) return

    setData(prev => {
      let moved = null
      const newCols = {}
      
      Object.keys(prev).forEach(key => {
        newCols[key] = []
      })
      
      Object.keys(prev).forEach(col => {
        for (const t of prev[col]) {
          if (t.id === id) {
            moved = t
          } else {
            newCols[col].push(t)
          }
        }
      })
      
      if (!moved) return prev
      
      if (newCols[targetColumn]) {
        newCols[targetColumn].push(moved)
      }
      
      return newCols
    })
    
    setDragState({ over: null })
    showToast('Task moved', 'success')
  }

  function onDragOverColumn(e, col) {
    e.preventDefault()
    setDragState({ over: col })
  }

  function onDragLeaveColumn() {
    setDragState({ over: null })
  }

  function handleUpdateColumns(newColumns) {
    setColumns(newColumns)
    
    const columnIds = newColumns.map(c => c.id)
    const deletedColumns = Object.keys(data).filter(key => !columnIds.includes(key))
    
    if (deletedColumns.length > 0 && newColumns.length > 0) {
      const firstColumnId = newColumns[0].id
      setData(prev => {
        const newData = { ...prev }
        const tasksToMove = []
        
        deletedColumns.forEach(col => {
          tasksToMove.push(...(prev[col] || []))
          delete newData[col]
        })
        
        newColumns.forEach(col => {
          if (!newData[col.id]) {
            newData[col.id] = []
          }
        })
        
        if (newData[firstColumnId]) {
          newData[firstColumnId] = [...newData[firstColumnId], ...tasksToMove]
        }
        
        return newData
      })
    } else {
      setData(prev => {
        const newData = { ...prev }
        newColumns.forEach(col => {
          if (!newData[col.id]) {
            newData[col.id] = []
          }
        })
        return newData
      })
    }
    
    showToast('Columns updated', 'success')
  }

  async function handleExportPDF() {
    if (!boardRef.current) {
      showToast('Board element not found', 'error')
      return
    }
    
    try {
      showToast('Generating PDF...', 'info')
      await exportToPDF(boardRef.current, 'kanban-board')
      showToast('PDF exported successfully!', 'success')
    } catch (error) {
      console.error('PDF export error:', error)
      showToast(`Failed to export PDF: ${error.message}`, 'error')
    }
  }

  const sortedColumns = useMemo(() => {
    return [...columns].sort((a, b) => a.order - b.order)
  }, [columns])

  return (
    <div ref={boardRef} className="min-h-screen bg-gradient-to-br from-indigo-50 via-white to-purple-50 p-4 md:p-8">
      <div className="max-w-7xl mx-auto">
        <div className="mb-6 md:mb-8">
          <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
            <div>
              <h1 className="text-3xl md:text-4xl font-bold text-gray-800 mb-2">
                Kanban Board
              </h1>
              <p className="text-gray-600">Organize your tasks efficiently</p>
            </div>
            
            <div className="flex flex-wrap gap-2">
              <button
                onClick={() => setColumnManagerOpen(true)}
                className="px-4 py-2 bg-gray-200 text-gray-700 rounded-lg hover:bg-gray-300 transition-colors text-sm font-medium"
              >
                Manage Columns
              </button>
              <button
                onClick={handleExportPDF}
                className="px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors text-sm font-medium"
              >
                Export PDF
              </button>
            </div>
          </div>
        </div>

        <SearchFilter
          onSearchChange={setSearchQuery}
          onFilterChange={(type, value) => {
            setFilters(prev => ({ ...prev, [type]: value }))
          }}
          filters={filters}
        />

        <div 
          className="grid gap-4 md:gap-6 h-full"
          style={{ 
            gridTemplateColumns: `repeat(${Math.min(sortedColumns.length, 4)}, minmax(280px, 1fr))`,
            gridAutoColumns: 'minmax(280px, 1fr)'
          }}
        >
          <AddTaskModal 
            open={modalOpen} 
            onClose={() => setModalOpen(false)} 
            onAdd={(taskData) => {
              const firstColumn = sortedColumns[0]
              if (firstColumn) {
                onAddTaskTo(firstColumn.id, taskData)
              }
            }} 
          />

          <ColumnManager
            open={columnManagerOpen}
            onClose={() => setColumnManagerOpen(false)}
            columns={sortedColumns}
            onUpdateColumns={handleUpdateColumns}
          />

          {sortedColumns.map(column => (
            <Column
              key={column.id}
              columnKey={column.id}
              title={column.title}
              tasks={filteredData[column.id] || []}
              onEditTask={onEditTask}
              onDeleteTask={onDeleteTask}
              onDropTask={onDropTask}
              onDragOver={onDragOverColumn}
              onDragLeave={onDragLeaveColumn}
              dragState={dragState}
            />
          ))}
        </div>

        <div className="fixed bottom-6 right-6 z-40">
          <button 
            onClick={() => setModalOpen(true)} 
            className="bg-indigo-600 hover:bg-indigo-700 text-white px-6 py-3 rounded-full shadow-lg hover:shadow-xl transition-all duration-200 flex items-center gap-2 text-lg font-semibold"
          >
            <span className="text-2xl">+</span>
            <span className="hidden sm:inline">Add Task</span>
          </button>
        </div>

        <Toast
          show={toast.show}
          message={toast.message}
          type={toast.type}
          onClose={() => setToast({ ...toast, show: false })}
        />
      </div>
    </div>
  )
}
