import Task from './Task'

export default function Column({ 
  columnKey, 
  title, 
  tasks, 
  onEditTask, 
  onDeleteTask, 
  onDropTask, 
  onDragOver,
  onDragLeave,
  dragState 
}) {
  const columnStyles = {
    todo: 'border-blue-200 bg-blue-50',
    doing: 'border-yellow-200 bg-yellow-50',
    done: 'border-green-200 bg-green-50'
  }

  const headerStyles = {
    todo: 'text-blue-700',
    doing: 'text-yellow-700',
    done: 'text-green-700'
  }

  const currentColumnStyle = columnStyles[columnKey] || 'border-gray-200'

  return (
    <div className={`bg-white rounded-2xl p-4 md:p-6 shadow-md flex flex-col h-full border-2 ${currentColumnStyle}`}>
      <div className="mb-4">
        <h3 className={`font-bold text-lg md:text-xl mb-1 ${headerStyles[columnKey] || 'text-gray-700'}`}>
          {title}
        </h3>
        <span className="text-sm text-gray-500 font-medium">
          {tasks.length} {tasks.length === 1 ? 'task' : 'tasks'}
        </span>
      </div>

      <div
        onDragOver={(e) => {
          e.preventDefault()
          onDragOver(e, columnKey)
        }}
        onDragLeave={(e) => {
          if (!e.currentTarget.contains(e.relatedTarget)) {
            onDragLeave()
          }
        }}
        onDrop={(e) => onDropTask(e, columnKey)}
        className={`space-y-3 flex-1 overflow-y-auto p-2 min-h-[200px] transition-all duration-200 scrollbar-thin ${
          dragState.over === columnKey 
            ? 'ring-2 ring-dashed ring-indigo-400 rounded-lg bg-indigo-50' 
            : ''
        }`}
      >
        {tasks.length === 0 ? (
          <div className="text-center text-gray-400 py-8 text-sm">
            Drop tasks here
          </div>
        ) : (
          tasks.map(task => (
            <Task
              key={task.id}
              task={task}
              onEdit={onEditTask}
              onDelete={onDeleteTask}
            />
          ))
        )}
      </div>
    </div>
  )
}
