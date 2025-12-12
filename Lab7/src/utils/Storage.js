const STORAGE_KEY = 'kanban_v2'
const COLUMNS_KEY = 'kanban_columns_v2'

export function loadInitialData() {
  try {
    const raw = localStorage.getItem(STORAGE_KEY)
    if (!raw) return null
    return JSON.parse(raw)
  } catch (e) {
    console.error('Failed to load from localStorage', e)
    return null
  }
}

export function saveData(data) {
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(data))
  } catch (e) {
    console.error('Failed to save to localStorage', e)
  }
}

export function loadColumns() {
  try {
    const raw = localStorage.getItem(COLUMNS_KEY)
    if (!raw) return null
    return JSON.parse(raw)
  } catch (e) {
    console.error('Failed to load columns from localStorage', e)
    return null
  }
}

export function saveColumns(columns) {
  try {
    localStorage.setItem(COLUMNS_KEY, JSON.stringify(columns))
  } catch (e) {
    console.error('Failed to save columns to localStorage', e)
  }
}
