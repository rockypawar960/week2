// Main application
let tasks = [];
let currentFilter = 'all';

window.TaskApp = {
    init: function() {
        tasks = window.TaskStorage.loadTasksFromLocalStorage();
        this.renderTasks(currentFilter);
        this.setupEventListeners();
        this.loadTheme();
    },

    renderTasks: function(filter) {
        window.TaskUI.renderTasks(tasks, filter || currentFilter);
        window.TaskUI.updateTaskStats(tasks);
    },

    addTask: function(text) {
        const validation = window.TaskUtils.validateTaskText(text);
        if (!validation.isValid) {
            window.TaskUI.showError(validation.errorMessage);
            return false;
        }

        const newTask = {
            id: window.TaskUtils.generateUniqueId(),
            text: text,
            completed: false,
            createdAt: new Date().toISOString(),
            updatedAt: new Date().toISOString()
        };

        tasks.unshift(newTask);
        window.TaskStorage.saveTasksToLocalStorage(tasks);
        this.renderTasks();
        return true;
    },

    toggleTaskComplete: function(taskId) {
        const task = tasks.find(t => t.id === taskId);
        if (task) {
            task.completed = !task.completed;
            task.updatedAt = new Date().toISOString();
            window.TaskStorage.saveTasksToLocalStorage(tasks);
            this.renderTasks();
        }
    },

    updateTaskText: function(taskId, newText) {
        const task = tasks.find(t => t.id === taskId);
        if (task) {
            task.text = newText;
            task.updatedAt = new Date().toISOString();
            window.TaskStorage.saveTasksToLocalStorage(tasks);
            this.renderTasks();
        }
    },

    deleteTask: function(taskId) {
        tasks = tasks.filter(t => t.id !== taskId);
        window.TaskStorage.saveTasksToLocalStorage(tasks);
        this.renderTasks();
    },

    reorderTasks: function(draggedId, targetId) {
        const draggedIndex = tasks.findIndex(t => t.id === draggedId);
        const targetIndex = tasks.findIndex(t => t.id === targetId);
        
        if (draggedIndex === -1 || targetIndex === -1) return;
        
        const [draggedTask] = tasks.splice(draggedIndex, 1);
        tasks.splice(targetIndex, 0, draggedTask);
        
        window.TaskStorage.saveTasksToLocalStorage(tasks);
        this.renderTasks();
    },

    setupEventListeners: function() {
        // Form
        elements.addTaskForm.addEventListener('submit', (e) => {
            e.preventDefault();
            const text = elements.taskInput.value.trim();
            if (this.addTask(text)) {
                elements.taskInput.value = '';
                window.TaskUI.clearError();
            }
        });

        // Filters
        elements.filterBtns.forEach(btn => {
            btn.addEventListener('click', () => {
                currentFilter = btn.dataset.filter;
                window.TaskUI.applyFilter(currentFilter);
            });
        });

        // Clear completed
        elements.clearCompletedBtn.addEventListener('click', () => {
            if (tasks.some(t => t.completed)) {
                if (confirm('Clear all completed tasks?')) {
                    tasks = window.TaskStorage.clearCompletedTasks(tasks);
                    this.renderTasks();
                }
            }
        });

        // Task actions
        window.TaskUI.setupTaskEventListeners();

        // Theme toggle
        document.getElementById('themeToggle').addEventListener('click', this.toggleTheme);
    },

    toggleTheme: function() {
        const html = document.documentElement;
        const currentTheme = html.getAttribute('data-theme');
        const newTheme = currentTheme === 'dark' ? 'light' : 'dark';
        
        html.setAttribute('data-theme', newTheme);
        localStorage.setItem('taskManager_theme', newTheme);
        
        const icon = document.querySelector('.theme-icon');
        icon.textContent = newTheme === 'dark' ? '☀️' : '🌙';
    },

    loadTheme: function() {
        const savedTheme = localStorage.getItem('taskManager_theme');
        if (savedTheme) {
            document.documentElement.setAttribute('data-theme', savedTheme);
            document.querySelector('.theme-icon').textContent = 
                savedTheme === 'dark' ? '☀️' : '🌙';
        }
    }
};

// Initialize when DOM is ready
if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', () => window.TaskApp.init());
} else {
    window.TaskApp.init();
}
