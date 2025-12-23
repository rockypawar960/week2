// UI rendering and DOM elements
const elements = {
    taskInput: document.getElementById('taskInput'),
    addTaskForm: document.getElementById('addTaskForm'),
    errorMessage: document.getElementById('errorMessage'),
    tasksList: document.getElementById('tasksList'),
    emptyState: document.getElementById('emptyState'),
    totalTasks: document.getElementById('totalTasks'),
    activeTasks: document.getElementById('activeTasks'),
    completedTasks: document.getElementById('completedTasks'),
    filterBtns: document.querySelectorAll('.filter-btn[data-filter]'),
    clearCompletedBtn: document.getElementById('clearCompletedBtn')
};

window.TaskUI = {
    renderTasks: function(tasks, filter) {
        elements.tasksList.innerHTML = '';
        let filteredTasks = tasks;
        
        if (filter === 'active') filteredTasks = tasks.filter(window.TaskUtils.isTaskActive);
        else if (filter === 'completed') filteredTasks = tasks.filter(window.TaskUtils.isTaskCompleted);
        
        filteredTasks.sort((a, b) => {
            if (a.completed !== b.completed) return a.completed ? 1 : -1;
            return new Date(b.createdAt) - new Date(a.createdAt);
        });
        
        filteredTasks.forEach(task => {
            const li = this.createTaskElement(task);
            elements.tasksList.appendChild(li);
        });
        
        this.toggleEmptyState(filteredTasks.length === 0);
    },

    createTaskElement: function(task) {
        const li = document.createElement('li');
        li.className = `task-item ${task.completed ? 'complete' : ''}`;
        li.draggable = true;
        li.dataset.taskId = task.id;
        
        li.innerHTML = `
            <div class="task-checkbox ${task.completed ? 'checked' : ''}" tabindex="0" role="checkbox" aria-checked="${task.completed}"></div>
            <div class="task-content" data-task-id="${task.id}">${window.TaskUtils.escapeHtml(task.text)}</div>
            <div class="task-actions">
                <button class="task-action-btn edit-btn" title="Edit" data-action="edit">✏️</button>
                <button class="task-action-btn delete-btn" title="Delete" data-action="delete">🗑️</button>
            </div>
        `;
        
        // Event listeners
        const checkbox = li.querySelector('.task-checkbox');
        const content = li.querySelector('.task-content');
        
        checkbox.addEventListener('click', () => window.TaskApp.toggleTaskComplete(task.id));
        content.addEventListener('dblclick', () => this.startEditTask(task.id, content));
        
        // Drag & drop
        li.addEventListener('dragstart', this.handleDragStart);
        li.addEventListener('dragover', this.handleDragOver);
        li.addEventListener('drop', this.handleDrop);
        li.addEventListener('dragend', this.handleDragEnd);
        
        return li;
    },

    updateTaskStats: function(tasks) {
        const total = tasks.length;
        const completed = tasks.filter(window.TaskUtils.isTaskCompleted).length;
        const active = total - completed;
        
        elements.totalTasks.textContent = window.TaskUtils.formatCount(total);
        elements.activeTasks.textContent = window.TaskUtils.formatCount(active);
        elements.completedTasks.textContent = window.TaskUtils.formatCount(completed);
    },

    applyFilter: function(filter) {
        elements.filterBtns.forEach(btn => {
            btn.classList.toggle('active', btn.dataset.filter === filter);
        });
        window.TaskApp.renderTasks(filter);
    },

    showError: function(message) {
        elements.errorMessage.textContent = message;
        elements.errorMessage.classList.add('show');
        setTimeout(() => elements.errorMessage.classList.remove('show'), 3000);
    },

    clearError: function() {
        elements.errorMessage.classList.remove('show');
        elements.errorMessage.textContent = '';
    },

    toggleEmptyState: function(show) {
        elements.emptyState.style.display = show ? 'block' : 'none';
        elements.tasksList.style.display = show ? 'none' : 'block';
    },

    startEditTask: function(taskId, contentElement) {
        const input = document.createElement('input');
        input.type = 'text';
        input.value = contentElement.textContent;
        input.maxLength = 100;
        
        contentElement.classList.add('editing');
        contentElement.innerHTML = '';
        contentElement.appendChild(input);
        input.focus();
        input.select();
        
        const finishEdit = () => {
            const newText = input.value.trim();
            const validation = window.TaskUtils.validateTaskText(newText);
            if (validation.isValid) {
                window.TaskApp.updateTaskText(taskId, newText);
            } else {
                window.TaskUI.showError(validation.errorMessage);
                input.focus();
            }
        };
        
        input.addEventListener('blur', finishEdit);
        input.addEventListener('keydown', (e) => {
            if (e.key === 'Enter') finishEdit();
            if (e.key === 'Escape') {
                contentElement.classList.remove('editing');
                contentElement.textContent = input.value;
            }
        });
    },

    // Drag & Drop handlers
    draggedTaskId: null,
    
    handleDragStart: function(e) {
        window.TaskUI.draggedTaskId = e.currentTarget.dataset.taskId;
        e.currentTarget.classList.add('dragging');
    },

    handleDragOver: function(e) {
        e.preventDefault();
    },

    handleDrop: function(e) {
        e.preventDefault();
        const dropId = e.currentTarget.dataset.taskId;
        if (window.TaskUI.draggedTaskId && dropId !== window.TaskUI.draggedTaskId) {
            window.TaskApp.reorderTasks(window.TaskUI.draggedTaskId, dropId);
        }
    },

    handleDragEnd: function(e) {
        e.currentTarget.classList.remove('dragging');
        window.TaskUI.draggedTaskId = null;
    },

    setupTaskEventListeners: function() {
        elements.tasksList.addEventListener('click', (e) => {
            const btn = e.target.closest('.task-action-btn');
            if (!btn) return;
            
            const taskItem = btn.closest('.task-item');
            const taskId = taskItem.dataset.taskId;
            
            if (btn.dataset.action === 'delete') {
                if (confirm('Delete this task?')) {
                    window.TaskApp.deleteTask(taskId);
                }
            }
        });
    }
};
