import { useEffect, useMemo, useState } from 'react'
import {
  LayoutDashboard, ListTodo, CalendarDays, CheckCircle2, Plus,
  Search, Bell, ChevronDown, MoreHorizontal, Pencil, Trash2,
  X, Clock3, Flag, Circle, Check, Menu
} from 'lucide-react'

const starterTasks = [
  { id: 1, title: 'Plan the project roadmap', description: 'Outline milestones and agree on the next deliverables.', category: 'Work', priority: 'High', dueDate: '2026-11-05', completed: false },
  { id: 2, title: 'Review design feedback', description: 'Collect comments and update the latest screens.', category: 'Design', priority: 'Medium', dueDate: '2026-11-06', completed: false },
  { id: 3, title: 'Prepare weekly team update', description: 'Summarise progress, blockers and upcoming work.', category: 'Work', priority: 'Low', dueDate: '2026-11-07', completed: true },
  { id: 4, title: 'Read React documentation', description: 'Review hooks and component composition.', category: 'Learning', priority: 'Medium', dueDate: '2026-11-08', completed: false },
]

const today = new Date().toISOString().slice(0, 10)
const emptyForm = { title: '', description: '', category: 'Work', priority: 'Medium', dueDate: today }

function readTasks() {
  try {
    const saved = localStorage.getItem('taskflow.tasks')
    return saved ? JSON.parse(saved) : starterTasks
  } catch {
    return starterTasks
  }
}

function App() {
  const [tasks, setTasks] = useState(readTasks)
  const [filter, setFilter] = useState('All tasks')
  const [query, setQuery] = useState('')
  const [modalOpen, setModalOpen] = useState(false)
  const [editingId, setEditingId] = useState(null)
  const [form, setForm] = useState(emptyForm)
  const [mobileNavOpen, setMobileNavOpen] = useState(false)

  useEffect(() => {
    localStorage.setItem('taskflow.tasks', JSON.stringify(tasks))
  }, [tasks])

  const completed = tasks.filter(task => task.completed).length
  const pending = tasks.length - completed
  const progress = tasks.length ? Math.round((completed / tasks.length) * 100) : 0

  const visibleTasks = useMemo(() => {
    return tasks.filter(task => {
      const matchesQuery = `${task.title} ${task.description} ${task.category}`.toLowerCase().includes(query.toLowerCase())
      const matchesFilter =
        filter === 'All tasks' ||
        (filter === 'Today' && task.dueDate === today) ||
        (filter === 'Upcoming' && !task.completed && task.dueDate > today) ||
        (filter === 'Completed' && task.completed) ||
        (filter === 'Pending' && !task.completed)
      return matchesQuery && matchesFilter
    }).sort((a, b) => a.completed - b.completed || a.dueDate.localeCompare(b.dueDate))
  }, [tasks, filter, query])

  function openNewTask() {
    setEditingId(null)
    setForm(emptyForm)
    setModalOpen(true)
  }

  function openEditTask(task) {
    setEditingId(task.id)
    setForm({ title: task.title, description: task.description, category: task.category, priority: task.priority, dueDate: task.dueDate })
    setModalOpen(true)
  }

  function saveTask(event) {
    event.preventDefault()
    if (!form.title.trim()) return
    if (editingId !== null) {
      setTasks(current => current.map(task => task.id === editingId ? { ...task, ...form, title: form.title.trim() } : task))
    } else {
      setTasks(current => [{ ...form, title: form.title.trim(), id: Date.now(), completed: false }, ...current])
    }
    setModalOpen(false)
  }

  function toggleTask(id) {
    setTasks(current => current.map(task => task.id === id ? { ...task, completed: !task.completed } : task))
  }

  function deleteTask(id) {
    if (window.confirm('Delete this task?')) setTasks(current => current.filter(task => task.id !== id))
  }

  const navItems = [
    { label: 'All tasks', icon: LayoutDashboard, count: tasks.length },
    { label: 'Today', icon: CalendarDays },
    { label: 'Upcoming', icon: Clock3 },
    { label: 'Completed', icon: CheckCircle2, count: completed },
  ]

  return (
    <div className="app-shell">
      <aside className={`sidebar ${mobileNavOpen ? 'sidebar-open' : ''}`}>
        <div className="brand"><span className="brand-mark"><Check size={19} strokeWidth={3} /></span><span>taskflow</span></div>
        <div className="workspace-label">WORKSPACE</div>
        <nav className="nav-list" aria-label="Task filters">
          {navItems.map(({ label, icon: Icon, count }) => (
            <button key={label} className={`nav-item ${filter === label ? 'active' : ''}`} onClick={() => { setFilter(label); setMobileNavOpen(false) }}>
              <Icon size={18} /><span>{label}</span>{count !== undefined && <span className="nav-count">{count}</span>}
            </button>
          ))}
        </nav>
        <div className="sidebar-bottom">
          <div className="tip-card">
            <div className="tip-icon"><Flag size={17} /></div>
            <strong>Make today count</strong>
            <p>Small steps every day lead to big results.</p>
          </div>
          <div className="profile">
            <div className="avatar">JD</div>
            <div className="profile-copy"><strong>Jamie Davis</strong><span>Personal workspace</span></div>
            <MoreHorizontal size={19} />
          </div>
        </div>
      </aside>

      <main className="main-area">
        <header className="topbar">
          <button className="mobile-menu icon-button" onClick={() => setMobileNavOpen(!mobileNavOpen)} aria-label="Toggle navigation"><Menu size={20} /></button>
          <div className="breadcrumb">Workspace <span>/</span> <strong>{filter}</strong></div>
          <div className="top-actions">
            <label className="search-box"><Search size={17} /><input value={query} onChange={e => setQuery(e.target.value)} placeholder="Search tasks..." /></label>
            <button className="icon-button notification" aria-label="Notifications"><Bell size={19} /><i /></button>
          </div>
        </header>

        <div className="content">
          <section className="welcome-row">
            <div><div className="eyebrow">TUESDAY, NOVEMBER 3, 2026</div><h1>Good morning, Jamie <span>✦</span></h1><p>Here's what's happening with your tasks today.</p></div>
            <button className="primary-button" onClick={openNewTask}><Plus size={18} /> New task</button>
          </section>

          <section className="stats-grid" aria-label="Task statistics">
            <article className="stat-card"><div className="stat-top"><span>Total tasks</span><span className="stat-icon purple"><ListTodo size={18} /></span></div><div className="stat-number">{tasks.length}</div><div className="stat-foot">Across your workspace</div></article>
            <article className="stat-card"><div className="stat-top"><span>In progress</span><span className="stat-icon orange"><Clock3 size={18} /></span></div><div className="stat-number">{pending}</div><div className="stat-foot">Tasks left to complete</div></article>
            <article className="stat-card"><div className="stat-top"><span>Completed</span><span className="stat-icon green"><CheckCircle2 size={18} /></span></div><div className="stat-number">{completed}</div><div className="stat-foot">Great work, keep it up!</div></article>
            <article className="stat-card progress-card"><div className="stat-top"><span>Overall progress</span><span className="stat-icon blue"><Flag size={18} /></span></div><div className="progress-number">{progress}<small>%</small></div><div className="progress-track"><span style={{ width: `${progress}%` }} /></div><div className="stat-foot">Completion rate</div></article>
          </section>

          <section className="task-panel">
            <div className="panel-heading"><div><h2>{filter}</h2><p>You have <strong>{visibleTasks.length}</strong> {visibleTasks.length === 1 ? 'task' : 'tasks'} to focus on</p></div><button className="filter-button" onClick={() => setFilter('All tasks')}>View all <ChevronDown size={15} /></button></div>
            <div className="task-list">
              {visibleTasks.length === 0 ? <div className="empty-state"><div className="empty-icon"><ListTodo size={24} /></div><strong>No tasks found</strong><p>Try another filter or create a new task.</p><button className="primary-button" onClick={openNewTask}><Plus size={17} /> Add a task</button></div> :
                visibleTasks.map(task => (
                  <article className={`task-row ${task.completed ? 'is-complete' : ''}`} key={task.id}>
                    <button className={`task-check ${task.completed ? 'checked' : ''}`} onClick={() => toggleTask(task.id)} aria-label={task.completed ? 'Mark task incomplete' : 'Mark task complete'}>{task.completed && <Check size={14} />}</button>
                    <div className="task-main"><div className="task-title">{task.title}</div><div className="task-description">{task.description || 'No description added'}</div></div>
                    <span className={`category-pill ${task.category.toLowerCase()}`}>{task.category}</span>
                    <span className={`priority ${task.priority.toLowerCase()}`}><span />{task.priority}</span>
                    <span className="due-date"><CalendarDays size={14} />{new Date(`${task.dueDate}T00:00:00`).toLocaleDateString('en-GB', { day: 'numeric', month: 'short' })}</span>
                    <div className="task-actions"><button className="icon-button" onClick={() => openEditTask(task)} aria-label="Edit task"><Pencil size={16} /></button><button className="icon-button delete-button" onClick={() => deleteTask(task.id)} aria-label="Delete task"><Trash2 size={16} /></button></div>
                  </article>
                ))
              }
            </div>
            <div className="panel-footer"><span>Showing {visibleTasks.length} of {tasks.length} tasks</span><span><Circle size={8} fill="currentColor" /> Synced to this browser</span></div>
          </section>
          <footer className="footer">Made for focused work <span>✦</span></footer>
        </div>
      </main>

      {modalOpen && <div className="modal-backdrop" onMouseDown={e => { if (e.target === e.currentTarget) setModalOpen(false) }}>
        <form className="task-modal" onSubmit={saveTask}>
          <div className="modal-heading"><div><h2>{editingId !== null ? 'Edit task' : 'Create a task'}</h2><p>Capture the details and keep moving forward.</p></div><button type="button" className="icon-button" onClick={() => setModalOpen(false)} aria-label="Close"><X size={20} /></button></div>
          <label className="field-label">Task title<input autoFocus required maxLength="100" value={form.title} onChange={e => setForm({ ...form, title: e.target.value })} placeholder="e.g. Prepare project proposal" /></label>
          <label className="field-label">Description<textarea rows="3" value={form.description} onChange={e => setForm({ ...form, description: e.target.value })} placeholder="Add a few details..." /></label>
          <div className="form-grid"><label className="field-label">Category<select value={form.category} onChange={e => setForm({ ...form, category: e.target.value })}><option>Work</option><option>Design</option><option>Learning</option><option>Personal</option></select></label><label className="field-label">Priority<select value={form.priority} onChange={e => setForm({ ...form, priority: e.target.value })}><option>Low</option><option>Medium</option><option>High</option></select></label></div>
          <label className="field-label">Due date<input type="date" value={form.dueDate} onChange={e => setForm({ ...form, dueDate: e.target.value })} /></label>
          <div className="modal-actions"><button type="button" className="secondary-button" onClick={() => setModalOpen(false)}>Cancel</button><button type="submit" className="primary-button">{editingId !== null ? 'Save changes' : 'Create task'}</button></div>
        </form>
      </div>}
    </div>
  )
}

export default App