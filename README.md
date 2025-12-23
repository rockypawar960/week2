# Interactive Task Manager

A complete, responsive task management application built with **HTML, CSS, and Vanilla JavaScript**. Features drag & drop reordering, localStorage persistence, dark/light themes, and full accessibility.

## Features

- ✅ Add/Edit/Delete tasks
- ✅ Mark tasks complete/incomplete
- ✅ Filter: All/Active/Completed
- ✅ Real-time statistics
- ✅ Drag & drop reordering
- ✅ localStorage persistence
- ✅ Dark/Light theme toggle
- ✅ Form validation & error handling
- ✅ Fully responsive design
- ✅ Keyboard accessible
- ✅ Smooth animations

## Folder Structure

week2-task-manager/
│── index.html
│
├── css/
│ ├── style.css # Layout, animations, responsive design
│ └── theme.css # Light/dark themes with CSS variables
│
├── js/
│ ├── app.js # Main logic & initialization
│ ├── storage.js # localStorage functions
│ ├── ui.js # DOM rendering & UI updates
│ └── utils.js # Helper functions
│
├── README.md
└── .gitignore


## How to Run

1. **Download/Clone** the project
2. **Open** `index.html` in any modern browser
3. **That's it!** No build tools or servers required

**Works offline** - all features persist via localStorage.

## How to Use

1. **Add tasks**: Type and press Enter or click Add
2. **Complete tasks**: Click checkbox or press Enter on focused checkbox
3. **Edit tasks**: Double-click task text
4. **Delete tasks**: Click 🗑️ button (confirm dialog)
5. **Reorder**: Drag tasks up/down
6. **Filter**: Click All/Active/Completed buttons
7. **Clear completed**: Click "Clear Completed" button
8. **Theme**: Click ☀️/🌙 toggle

**Keyboard shortcuts**:
- `Enter`: Add task (form) / Toggle complete (checkbox)
- `Escape`: Cancel editing
- `Tab`: Navigate focusable elements

## Technical Details

### Data Structure
{
id: "task_1234567890_abc123",
text: "Task description",
completed: false,
createdAt: "2025-01-01T00:00:00Z",
updatedAt: "2025-01-01T00:00:00Z"
}


### Key Technologies
- **DOM APIs**: `querySelector`, `addEventListener`, `classList`
- **HTML5 Drag & Drop**: Native `draggable` + `drag*` events
- **localStorage**: JSON serialization with error handling
- **CSS Variables**: Dynamic theming
- **CSS Grid/Flexbox**: Responsive layouts
- **Event Delegation**: Efficient task action handling

### Architecture
- **Modular JS**: 4 separate modules with clear responsibilities
- **Separation of Concerns**: UI, storage, utils, app logic
- **Reactive Updates**: Single source of truth (tasks array)


## Testing & Validation

✅ **Tested browsers**: Chrome, Firefox, Safari, Edge (latest)
✅ **Responsive**: Mobile (320px) → Desktop (1200px+)
✅ **Accessibility**: ARIA labels, keyboard navigation, screen reader friendly
✅ **Performance**: 60fps animations, efficient DOM updates
✅ **Edge cases**: Empty tasks, long text, storage quota exceeded
✅ **Persistence**: Survives page refresh, browser restart

**Validation passed**:
- HTML5 semantic markup
- CSS custom properties
- Vanilla JS only (no frameworks)
- localStorage quota handling
- Cross-browser drag & drop
