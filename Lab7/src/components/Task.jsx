import { useState } from 'react'
import EditableLabel from './EditableLabel'
import UserAvatar from './UserAvatar'
import TaskDetailsModal from './TaskDetailsModal'
import { AVAILABLE_USERS, PRIORITY_OPTIONS } from '../utils/constants'

export default function Task({ task, onEdit, onDelete }) {
  const [isDragging, setIsDragging] = useState(false)
  const [showDetails, setShowDetails] = useState(false)

  const isOverdue = task.dueDate && new Date(task.dueDate) < new Date() && task.dueDate !== ''

  const priorityInfo = PRIORITY_OPTIONS.find(p => p.value === (task.priority || 'none')) || PRIORITY_OPTIONS[3]

  const assignedUsers = (task.assignedUsers || []).map(userId => 
    AVAILABLE_USERS.find(u => u.id === userId)
  ).filter(Boolean)

  const subtasks = task.subtasks || []
  const completedSubtasks = subtasks.filter(st => st.completed).length
  const comments = task.comments || []
  const tags = task.tags || []

  const formatDueDate = (dateString) => {
    if (!dateString) return null
    const date = new Date(dateString)
    return date.toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })
  }

  function handleDragStart(e) {
    setIsDragging(true)
    e.dataTransfer.setData('text/plain', task.id)
    e.dataTransfer.effectAllowed = 'move'
    
    const dragImage = e.target.cloneNode(true)
    dragImage.style.opacity = '0.5'
    document.body.appendChild(dragImage)
    e.dataTransfer.setDragImage(dragImage, 0, 0)
    setTimeout(() => document.body.removeChild(dragImage), 0)
  }

  function handleDragEnd() {
    setIsDragging(false)
  }

  function handleTitleChange(newTitle) {
    onEdit(task.id, { title: newTitle })
  }

  function handleDelete() {
    if (window.confirm('Are you sure you want to delete this task?')) {
      onDelete(task.id)
    }
  }

  return (
    <>
      <div
        draggable
        onDragStart={handleDragStart}
        onDragEnd={handleDragEnd}
        className={`bg-white p-4 rounded-lg shadow-sm border-2 transition-all duration-200 cursor-move hover:shadow-md ${
          isDragging ? 'opacity-50 scale-95' : 'opacity-100'
        } ${
          isOverdue ? 'border-red-400' : 'border-gray-200'
        }`}
      >
        {task.priority && task.priority !== 'none' && (
          <div className="mb-2">
            <span className={`inline-block px-2 py-1 text-xs font-semibold rounded border ${priorityInfo.color}`}>
              {priorityInfo.label}
            </span>
          </div>
        )}

        {tags.length > 0 && (
          <div className="mb-2 flex flex-wrap gap-1">
            {tags.slice(0, 3).map(tag => (
              <span
                key={tag.name}
                className={`inline-block px-2 py-0.5 text-xs font-semibold rounded border ${tag.colorClass}`}
              >
                {tag.name}
              </span>
            ))}
            {tags.length > 3 && (
              <span className="text-xs text-gray-500">+{tags.length - 3}</span>
            )}
          </div>
        )}

        <div className="flex items-start justify-between gap-3">
          <div className="flex-1 min-w-0">
            <div className="mb-2">
              <EditableLabel 
                value={task.title} 
                onChange={handleTitleChange} 
              />
            </div>
            
            {task.description && (
              <div className="text-sm text-gray-600 mt-2 line-clamp-2">
                {task.description}
              </div>
            )}

            {subtasks.length > 0 && (
              <div className="mt-2 flex items-center gap-1 text-xs text-gray-500">
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" />
                </svg>
                <span>{completedSubtasks}/{subtasks.length} subtasks</span>
              </div>
            )}

            {assignedUsers.length > 0 && (
              <div className="mt-3 flex items-center gap-2 flex-wrap">
                <span className="text-xs text-gray-500">Assigned:</span>
                {assignedUsers.map(user => (
                  <div key={user.id} className="tooltip-container relative group">
                    <UserAvatar name={user.name} email={user.email} size="sm" />
                    <div className="tooltip absolute bottom-full left-1/2 transform -translate-x-1/2 mb-2 px-2 py-1 bg-gray-900 text-white text-xs rounded opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none whitespace-nowrap z-10">
                      {user.name}
                    </div>
                  </div>
                ))}
              </div>
            )}

            {task.dueDate && (
              <div className={`mt-2 flex items-center gap-1 text-xs ${
                isOverdue 
                  ? 'text-red-600 font-semibold' 
                  : 'text-gray-500'
              }`}>
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                </svg>
                <span>
                  {formatDueDate(task.dueDate)}
                  {isOverdue && (
                    <span className="ml-1 px-1.5 py-0.5 bg-red-100 text-red-800 rounded text-xs">
                      Overdue
                    </span>
                  )}
                </span>
              </div>
            )}

            {(comments.length > 0 || subtasks.length > 0) && (
              <div className="mt-2 flex items-center gap-3 text-xs text-gray-500">
                {comments.length > 0 && (
                  <div className="flex items-center gap-1">
                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z" />
                    </svg>
                    <span>{comments.length}</span>
                  </div>
                )}
              </div>
            )}
          </div>

          <div className="flex flex-col gap-2 flex-shrink-0">
            <button
              onClick={() => setShowDetails(true)}
              className="text-indigo-500 hover:text-indigo-700 hover:bg-indigo-50 p-1.5 rounded transition-colors duration-200"
              title="View details"
            >
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
              </svg>
            </button>
            <button
              onClick={handleDelete}
              className="text-red-500 hover:text-red-700 hover:bg-red-50 p-1.5 rounded transition-colors duration-200"
              title="Delete task"
            >
              <svg 
                xmlns="http://www.w3.org/2000/svg" 
                className="h-5 w-5" 
                fill="none" 
                viewBox="0 0 24 24" 
                stroke="currentColor"
              >
                <path 
                  strokeLinecap="round" 
                  strokeLinejoin="round" 
                  strokeWidth={2} 
                  d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" 
                />
              </svg>
            </button>
          </div>
        </div>

        <div className="mt-3 pt-2 border-t border-gray-100 flex items-center gap-1 text-xs text-gray-400">
          <svg 
            xmlns="http://www.w3.org/2000/svg" 
            className="h-4 w-4" 
            fill="none" 
            viewBox="0 0 24 24" 
            stroke="currentColor"
          >
            <path 
              strokeLinecap="round" 
              strokeLinejoin="round" 
              strokeWidth={2} 
              d="M4 8h16M4 16h16" 
            />
          </svg>
          <span>Drag to move</span>
        </div>
      </div>

      {showDetails && (
        <TaskDetailsModal
          task={task}
          open={showDetails}
          onClose={() => setShowDetails(false)}
          onEdit={onEdit}
          onDelete={onDelete}
        />
      )}
    </>
  )
}
