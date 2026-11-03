# TaskFlow — React Task Manager

A responsive task-management dashboard built with React, Vite, Lucide icons and plain CSS.

## Features

- Create, edit and delete tasks
- Mark tasks complete or incomplete
- Set a category, priority and due date
- Search task titles, descriptions and categories
- Filter by all tasks, today, upcoming, completed and pending
- Dashboard statistics and completion percentage
- Persist tasks in browser LocalStorage
- Responsive layout for desktop and mobile

## Run in GitHub Codespaces

1. Create a new GitHub repository (for example, `taskflow-react`).
2. Upload the contents of this project to the repository and commit them.
3. On GitHub, open the repository and select **Code → Codespaces → Create codespace on main**.
4. Wait for Codespaces to initialise. The `.devcontainer/devcontainer.json` file installs dependencies automatically.
5. In the Codespaces terminal, run:

   ```bash
   npm run dev
   ```

6. Open the forwarded port **5173** when prompted (or select the Ports tab and click the local address).

If dependencies were not installed automatically, run `npm install` first.

## Run locally

Requires Node.js 20 or newer.

```bash
npm install
npm run dev
```

## Project structure

```text
taskflow-react/
├── .devcontainer/
│   └── devcontainer.json
├── src/
│   ├── App.jsx
│   ├── main.jsx
│   └── styles.css
├── .gitignore
├── index.html
├── package.json
├── vite.config.js
└── README.md
```

## How the app works

- `main.jsx` mounts the React application into the `#root` element and imports the stylesheet.
- `App.jsx` owns the task data and UI state. React state updates cause the interface to re-render.
- `useEffect` writes the task array to LocalStorage whenever it changes.
- `readTasks()` loads saved tasks when the app starts, falling back to sample tasks for a first visit.
- `useMemo` derives the visible task list from the current search query and selected filter.
- The task form is used for both creation and editing. `editingId` determines which operation to perform.
- `toggleTask()` changes completion state; `deleteTask()` removes a task after confirmation.
- `styles.css` controls the layout, colors, responsive breakpoints, task states and modal styling.

## Main React concepts demonstrated

| Concept | Where it is used | Why |
|---|---|---|
| Components | `App` and mapped task rows | Organise the UI into reusable pieces |
| `useState` | Tasks, filter, query, modal and form | Store interactive UI data |
| `useEffect` | LocalStorage persistence | Run a side effect when tasks change |
| `useMemo` | `visibleTasks` | Recalculate filtered tasks when dependencies change |
| Props / event handlers | Button callbacks and form handlers | Connect user actions to application logic |
| Conditional rendering | Empty state, modal, completed styling | Show UI based on application state |
| List rendering | `map()` over navigation and tasks | Render a changing number of items |

## Data model

Each task is a JavaScript object:

```js
{
  id: 123,
  title: "Plan the project roadmap",
  description: "Outline milestones",
  category: "Work",
  priority: "High",
  dueDate: "2026-11-05",
  completed: false
}
```

## Important note

LocalStorage is specific to the browser and device being used. It is not a shared database, user authentication system or cloud sync service. For a multi-user production app, add a backend API, database, authentication, server-side validation and appropriate access controls.
