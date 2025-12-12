import { useState, useEffect } from 'react'
import { AVAILABLE_USERS, PRIORITY_OPTIONS, TAG_COLORS } from '../utils/constants'

export default function AddTaskModal({ open, onClose, onAdd }) {
  const [title, setTitle] = useState('')
  const [description, setDescription] = useState('')
  const [assignedUsers, setAssignedUsers] = useState([])
  const [priority, setPriority] = useState('none')
  const [dueDate, setDueDate] = useState('')
  const [tags, setTags] = useState([])
  const [newTag, setNewTag] = useState('')
  const [selectedTagColor, setSelectedTagColor] = useState(TAG_COLORS[0].name)

  useEffect(() => {
    if (open) {
      setTitle('')
      setDescription('')
      setAssignedUsers([])
      setPriority('none')
      setDueDate('')
      setTags([])
      setNewTag('')
      setSelectedTagColor(TAG_COLORS[0].name)
    }
  }, [open])

  function handleSubmit(e) {
    e.preventDefault()
    if (!title.trim()) {
      alert('Please enter a task title')
      return
    }
    
    onAdd({ 
      title: title.trim(), 
      description: description.trim(),
      assignedUsers: assignedUsers,
      priority: priority,
      dueDate: dueDate || null,
      tags: tags,
      subtasks: [],
      comments: []
    })
    onClose()
  }

  function toggleUser(userId) {
    setAssignedUsers(prev => 
      prev.includes(userId)
        ? prev.filter(id => id !== userId)
        : [...prev, userId]
    )
  }

  function addTag() {
    if (newTag.trim() && !tags.find(t => t.name === newTag.trim())) {
      const colorInfo = TAG_COLORS.find(c => c.name === selectedTagColor) || TAG_COLORS[0]
      setTags([...tags, { name: newTag.trim(), color: selectedTagColor, colorClass: colorInfo.class }])
      setNewTag('')
    }
  }

  function removeTag(tagName) {
    setTags(tags.filter(t => t.name !== tagName))
  }

  useEffect(() => {
    function handleEscape(e) {
      if (e.key === 'Escape' && open) {
        onClose()
      }
    }
    document.addEventListener('keydown', handleEscape)
    return () => document.removeEventListener('keydown', handleEscape)
  }, [open, onClose])

  useEffect(() => {
    if (open) {
      document.body.style.overflow = 'hidden'
    } else {
      document.body.style.overflow = 'unset'
    }
    return () => {
      document.body.style.overflow = 'unset'
    }
  }, [open])

  const today = new Date().toISOString().split('T')[0]

  if (!open) return null

  return (
    <div 
      className="fixed inset-0 flex items-center justify-center bg-black/50 z-50 p-4"
      onClick={onClose}
    >
      <div 
        className="bg-white rounded-xl shadow-2xl w-full max-w-2xl max-h-[90vh] overflow-y-auto p-6 md:p-8"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="mb-6">
          <h3 className="text-2xl font-bold text-gray-800 mb-2">Add New Task</h3>
          <p className="text-sm text-gray-500">Create a new task for your Kanban board</p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label 
              htmlFor="task-title" 
              className="block text-sm font-medium text-gray-700 mb-2"
            >
              Title <span className="text-red-500">*</span>
            </label>
            <input
              id="task-title"
              type="text"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              placeholder="Enter task title..."
              className="w-full border-2 border-gray-200 rounded-lg px-4 py-3 focus:outline-none focus:border-indigo-500 transition-colors"
              autoFocus
              required
            />
          </div>

          <div>
            <label 
              htmlFor="task-description" 
              className="block text-sm font-medium text-gray-700 mb-2"
            >
              Description <span className="text-gray-400 text-xs">(optional)</span>
            </label>
            <textarea
              id="task-description"
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              placeholder="Enter task description..."
              rows={4}
              className="w-full border-2 border-gray-200 rounded-lg px-4 py-3 focus:outline-none focus:border-indigo-500 transition-colors resize-none"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Tags <span className="text-gray-400 text-xs">(optional)</span>
            </label>
            <div className="flex gap-2 mb-2">
              <input
                type="text"
                value={newTag}
                onChange={(e) => setNewTag(e.target.value)}
                onKeyPress={(e) => e.key === 'Enter' && (e.preventDefault(), addTag())}
                placeholder="Tag name..."
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
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Assign To <span className="text-gray-400 text-xs">(optional)</span>
            </label>
            <div className="border-2 border-gray-200 rounded-lg p-3 max-h-40 overflow-y-auto">
              {AVAILABLE_USERS.map(user => (
                <label
                  key={user.id}
                  className="flex items-center gap-2 p-2 hover:bg-gray-50 rounded cursor-pointer"
                >
                  <input
                    type="checkbox"
                    checked={assignedUsers.includes(user.id)}
                    onChange={() => toggleUser(user.id)}
                    className="rounded border-gray-300"
                  />
                  <span className="text-sm text-gray-700">{user.name}</span>
                </label>
              ))}
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Priority
              </label>
              <select
                value={priority}
                onChange={(e) => setPriority(e.target.value)}
                className="w-full border-2 border-gray-200 rounded-lg px-4 py-3 focus:outline-none focus:border-indigo-500 transition-colors"
              >
                {PRIORITY_OPTIONS.map(option => (
                  <option key={option.value} value={option.value}>{option.label}</option>
                ))}
              </select>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Due Date <span className="text-gray-400 text-xs">(optional)</span>
              </label>
              <input
                type="date"
                value={dueDate}
                onChange={(e) => setDueDate(e.target.value)}
                min={today}
                className="w-full border-2 border-gray-200 rounded-lg px-4 py-3 focus:outline-none focus:border-indigo-500 transition-colors"
              />
            </div>
          </div>

          <div className="flex justify-end gap-3 pt-4">
            <button
              type="button"
              onClick={onClose}
              className="px-6 py-2.5 rounded-lg border-2 border-gray-300 text-gray-700 font-medium hover:bg-gray-50 transition-colors"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="px-6 py-2.5 rounded-lg bg-indigo-600 text-white font-medium hover:bg-indigo-700 transition-colors shadow-md hover:shadow-lg"
            >
              Add Task
            </button>
          </div>
        </form>
      </div>
    </div>
  )
}
