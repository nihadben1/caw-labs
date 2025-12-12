import { useState } from 'react'
import { AVAILABLE_USERS, TAG_COLORS } from '../utils/constants'
import UserAvatar from './UserAvatar'

export default function TaskDetailsModal({ task, open, onClose, onEdit, onDelete }) {
  const [newSubtask, setNewSubtask] = useState('')
  const [newComment, setNewComment] = useState('')
  const [newTag, setNewTag] = useState('')
  const [selectedTagColor, setSelectedTagColor] = useState(TAG_COLORS[0].name)

  if (!open || !task) return null

  const subtasks = task.subtasks || []
  const comments = task.comments || []
  const tags = task.tags || []

  function addSubtask() {
    if (newSubtask.trim()) {
      const updatedSubtasks = [...subtasks, { id: Date.now().toString(), text: newSubtask.trim(), completed: false }]
      onEdit(task.id, { subtasks: updatedSubtasks })
      setNewSubtask('')
    }
  }

  function toggleSubtask(subtaskId) {
    const updatedSubtasks = subtasks.map(st => 
      st.id === subtaskId ? { ...st, completed: !st.completed } : st
    )
    onEdit(task.id, { subtasks: updatedSubtasks })
  }

  function deleteSubtask(subtaskId) {
    const updatedSubtasks = subtasks.filter(st => st.id !== subtaskId)
    onEdit(task.id, { subtasks: updatedSubtasks })
  }

  function addComment() {
    if (newComment.trim()) {
      const updatedComments = [...comments, { 
        id: Date.now().toString(), 
        text: newComment.trim(), 
        timestamp: new Date().toISOString() 
      }]
      onEdit(task.id, { comments: updatedComments })
      setNewComment('')
    }
  }

  function deleteComment(commentId) {
    const updatedComments = comments.filter(c => c.id !== commentId)
    onEdit(task.id, { comments: updatedComments })
  }

  function addTag() {
    if (newTag.trim() && !tags.find(t => t.name === newTag.trim())) {
      const colorInfo = TAG_COLORS.find(c => c.name === selectedTagColor) || TAG_COLORS[0]
      const updatedTags = [...tags, { name: newTag.trim(), color: selectedTagColor, colorClass: colorInfo.class }]
      onEdit(task.id, { tags: updatedTags })
      setNewTag('')
    }
  }

  function removeTag(tagName) {
    const updatedTags = tags.filter(t => t.name !== tagName)
    onEdit(task.id, { tags: updatedTags })
  }

  const completedSubtasks = subtasks.filter(st => st.completed).length
  const totalSubtasks = subtasks.length

  return (
    <div 
      className="fixed inset-0 flex items-center justify-center bg-black/50 z-50 p-4"
      onClick={onClose}
    >
      <div 
        className="bg-white rounded-xl shadow-2xl w-full max-w-3xl max-h-[90vh] overflow-y-auto p-6 md:p-8"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="flex items-start justify-between mb-6">
          <div>
            <h3 className="text-2xl font-bold text-gray-800 mb-2">{task.title}</h3>
            {task.description && (
              <p className="text-gray-600">{task.description}</p>
            )}
          </div>
          <button
            onClick={onClose}
            className="text-gray-400 hover:text-gray-600"
          >
            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        </div>

        <div className="space-y-6">
          <div>
            <h4 className="font-semibold text-gray-700 mb-3">Tags</h4>
            <div className="flex gap-2 mb-2">
              <input
                type="text"
                value={newTag}
                onChange={(e) => setNewTag(e.target.value)}
                onKeyPress={(e) => e.key === 'Enter' && (e.preventDefault(), addTag())}
                placeholder="Add tag..."
                className="flex-1 border-2 border-gray-200 rounded-lg px-3 py-2 focus:outline-none focus:border-indigo-500"
              />
              <select
                value={selectedTagColor}
                onChange={(e) => setSelectedTagColor(e.target.value)}
                className="border-2 border-gray-200 rounded-lg px-3 py-2 focus:outline-none focus:border-indigo-500"
              >
                {TAG_COLORS.map(color => (
                  <option key={color.name} value={color.name}>{color.name}</option>
                ))}
              </select>
              <button
                type="button"
                onClick={addTag}
                className="px-4 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700"
              >
                Add
              </button>
            </div>
            {tags.length > 0 && (
              <div className="flex flex-wrap gap-2">
                {tags.map(tag => (
                  <span
                    key={tag.name}
                    className={`inline-flex items-center gap-1 px-2 py-1 text-xs font-semibold rounded border ${tag.colorClass}`}
                  >
                    {tag.name}
                    <button
                      type="button"
                      onClick={() => removeTag(tag.name)}
                      className="hover:text-red-600"
                    >
                      ×
                    </button>
                  </span>
                ))}
              </div>
            )}
          </div>

          <div>
            <h4 className="font-semibold text-gray-700 mb-3">
              Subtasks {totalSubtasks > 0 && `(${completedSubtasks}/${totalSubtasks})`}
            </h4>
            <div className="space-y-2 mb-3">
              {subtasks.map(subtask => (
                <div key={subtask.id} className="flex items-center gap-2">
                  <input
                    type="checkbox"
                    checked={subtask.completed}
                    onChange={() => toggleSubtask(subtask.id)}
                    className="rounded border-gray-300"
                  />
                  <span className={`flex-1 ${subtask.completed ? 'line-through text-gray-400' : 'text-gray-700'}`}>
                    {subtask.text}
                  </span>
                  <button
                    onClick={() => deleteSubtask(subtask.id)}
                    className="text-red-500 hover:text-red-700 text-sm"
                  >
                    Delete
                  </button>
                </div>
              ))}
            </div>
            <div className="flex gap-2">
              <input
                type="text"
                value={newSubtask}
                onChange={(e) => setNewSubtask(e.target.value)}
                onKeyPress={(e) => e.key === 'Enter' && (e.preventDefault(), addSubtask())}
                placeholder="Add subtask..."
                className="flex-1 border-2 border-gray-200 rounded-lg px-3 py-2 focus:outline-none focus:border-indigo-500"
              />
              <button
                type="button"
                onClick={addSubtask}
                className="px-4 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700"
              >
                Add
              </button>
            </div>
          </div>

          <div>
            <h4 className="font-semibold text-gray-700 mb-3">Comments ({comments.length})</h4>
            <div className="space-y-3 mb-3 max-h-60 overflow-y-auto">
              {comments.map(comment => (
                <div key={comment.id} className="bg-gray-50 p-3 rounded-lg">
                  <div className="flex items-start justify-between">
                    <p className="text-sm text-gray-700 flex-1">{comment.text}</p>
                    <button
                      onClick={() => deleteComment(comment.id)}
                      className="text-red-500 hover:text-red-700 text-xs ml-2"
                    >
                      Delete
                    </button>
                  </div>
                  <p className="text-xs text-gray-400 mt-1">
                    {new Date(comment.timestamp).toLocaleString()}
                  </p>
                </div>
              ))}
            </div>
            <div className="flex gap-2">
              <textarea
                value={newComment}
                onChange={(e) => setNewComment(e.target.value)}
                placeholder="Add a comment..."
                rows={2}
                className="flex-1 border-2 border-gray-200 rounded-lg px-3 py-2 focus:outline-none focus:border-indigo-500 resize-none"
              />
              <button
                type="button"
                onClick={addComment}
                className="px-4 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 self-start"
              >
                Add
              </button>
            </div>
          </div>
        </div>

        <div className="mt-6 flex justify-end gap-3">
          <button
            onClick={() => {
              if (window.confirm('Are you sure you want to delete this task?')) {
                onDelete(task.id)
                onClose()
              }
            }}
            className="px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700"
          >
            Delete Task
          </button>
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

