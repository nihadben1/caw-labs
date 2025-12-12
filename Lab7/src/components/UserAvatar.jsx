export default function UserAvatar({ name, email, size = 'md' }) {
  const getInitials = (name) => {
    if (!name) return '?'
    const parts = name.trim().split(' ')
    if (parts.length >= 2) {
      return (parts[0][0] + parts[parts.length - 1][0]).toUpperCase()
    }
    return name.substring(0, 2).toUpperCase()
  }

  const getColor = (name) => {
    if (!name) return 'bg-gray-400'
    const colors = [
      'bg-blue-500',
      'bg-green-500',
      'bg-yellow-500',
      'bg-purple-500',
      'bg-pink-500',
      'bg-indigo-500',
      'bg-red-500',
      'bg-teal-500'
    ]
    const index = name.charCodeAt(0) % colors.length
    return colors[index]
  }

  const sizeClasses = {
    sm: 'w-6 h-6 text-xs',
    md: 'w-8 h-8 text-sm',
    lg: 'w-10 h-10 text-base'
  }

  const initials = getInitials(name)
  const colorClass = getColor(name)

  return (
    <div
      className={`${sizeClasses[size]} ${colorClass} rounded-full flex items-center justify-center text-white font-semibold shadow-sm`}
      title={name || email}
    >
      {initials}
    </div>
  )
}
