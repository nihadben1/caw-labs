import { useEffect } from 'react'

export default function Toast({ message, type = 'info', show, onClose, duration = 3000 }) {
  useEffect(() => {
    if (show) {
      const timer = setTimeout(() => {
        onClose()
      }, duration)
      return () => clearTimeout(timer)
    }
  }, [show, duration, onClose])

  if (!show) return null

  const typeStyles = {
    success: 'bg-green-500 text-white',
    error: 'bg-red-500 text-white',
    info: 'bg-blue-500 text-white',
    warning: 'bg-yellow-500 text-white'
  }

  return (
    <div className="fixed top-4 right-4 z-50 animate-slide-in">
      <div className={`${typeStyles[type]} px-6 py-3 rounded-lg shadow-lg flex items-center gap-3 min-w-[300px]`}>
        <span>{message}</span>
        <button
          onClick={onClose}
          className="ml-auto text-white hover:text-gray-200"
        >
          <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
          </svg>
        </button>
      </div>
    </div>
  )
}
