import { useState } from 'react'
import { AVAILABLE_USERS, PRIORITY_OPTIONS } from '../utils/constants'

export default function SearchFilter({ onSearchChange, onFilterChange, filters }) {
  const [searchQuery, setSearchQuery] = useState('')
  const [showFilters, setShowFilters] = useState(false)

  function handleSearchChange(e) {
    const value = e.target.value
    setSearchQuery(value)
    onSearchChange(value)
  }

  function handleFilterChange(filterType, value) {
    onFilterChange(filterType, value)
  }

  function clearFilters() {
    setSearchQuery('')
    onSearchChange('')
    onFilterChange('user', null)
    onFilterChange('priority', null)
    onFilterChange('status', null)
  }

  return (
    <div className="mb-6 space-y-4">
      <div className="flex gap-2">
        <div className="flex-1 relative">
          <input
            type="text"
            value={searchQuery}
            onChange={handleSearchChange}
            placeholder="Search tasks by title or description..."
            className="w-full px-4 py-2 pl-10 border-2 border-gray-200 rounded-lg focus:outline-none focus:border-indigo-500 bg-white text-gray-800"
          />
          <svg
            className="absolute left-3 top-2.5 h-5 w-5 text-gray-400"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
          </svg>
        </div>
        <button
          onClick={() => setShowFilters(!showFilters)}
          className="px-4 py-2 bg-gray-200 text-gray-700 rounded-lg hover:bg-gray-300 transition-colors"
        >
          <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 4a1 1 0 011-1h16a1 1 0 011 1v2.586a1 1 0 01-.293.707l-6.414 6.414a1 1 0 00-.293.707V17l-4 4v-6.586a1 1 0 00-.293-.707L3.293 7.293A1 1 0 013 6.586V4z" />
          </svg>
        </button>
      </div>

      {showFilters && (
        <div className="bg-white p-4 rounded-lg border border-gray-200 shadow-sm">
          <div className="flex items-center justify-between mb-4">
            <h3 className="font-semibold text-gray-700">Filters</h3>
            <button
              onClick={clearFilters}
              className="text-sm text-indigo-600 hover:underline"
            >
              Clear all
            </button>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Assigned User
              </label>
              <select
                value={filters.user || ''}
                onChange={(e) => handleFilterChange('user', e.target.value || null)}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg bg-white text-gray-800"
              >
                <option value="">All Users</option>
                {AVAILABLE_USERS.map(user => (
                  <option key={user.id} value={user.id}>{user.name}</option>
                ))}
              </select>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Priority
              </label>
              <select
                value={filters.priority || ''}
                onChange={(e) => handleFilterChange('priority', e.target.value || null)}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg bg-white text-gray-800"
              >
                <option value="">All Priorities</option>
                {PRIORITY_OPTIONS.filter(p => p.value !== 'none').map(priority => (
                  <option key={priority.value} value={priority.value}>{priority.label}</option>
                ))}
              </select>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Status
              </label>
              <select
                value={filters.status || ''}
                onChange={(e) => handleFilterChange('status', e.target.value || null)}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg bg-white text-gray-800"
              >
                <option value="">All Statuses</option>
                <option value="todo">To Do</option>
                <option value="doing">In Progress</option>
                <option value="done">Done</option>
              </select>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}
