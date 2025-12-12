import { useState, useEffect } from 'react'

export default function EditableLabel({ value, onChange }) {
  const [editing, setEditing] = useState(false)
  const [text, setText] = useState(value)

  useEffect(() => {
    setText(value)
  }, [value])

  function handleCommit() {
    setEditing(false)
    const trimmed = text.trim()
    
    if (trimmed === '') {
      setText(value)
      return
    }
    
    if (trimmed !== value) {
      onChange(trimmed)
    }
  }

  function handleCancel() {
    setEditing(false)
    setText(value)
  }

  function handleKeyDown(e) {
    if (e.key === 'Enter') {
      e.preventDefault()
      handleCommit()
    } else if (e.key === 'Escape') {
      e.preventDefault()
      handleCancel()
    }
  }

  if (editing) {
    return (
      <input
        type="text"
        className="border-2 border-indigo-500 rounded px-2 py-1 w-full focus:outline-none focus:ring-2 focus:ring-indigo-200 font-semibold text-gray-800 bg-white"
        value={text}
        onChange={(e) => setText(e.target.value)}
        onBlur={handleCommit}
        onKeyDown={handleKeyDown}
        autoFocus
      />
    )
  }

  return (
    <div 
      onDoubleClick={() => setEditing(true)} 
      className="cursor-text font-semibold text-gray-800 hover:text-indigo-600 transition-colors select-none"
      title="Double-click to edit"
    >
      {value}
    </div>
  )
}
