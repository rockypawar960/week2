// Utility functions for the Task Manager
window.TaskUtils = {
    /**
     * Generates a unique ID for tasks
     */
    generateUniqueId: function() {
        return 'task_' + Date.now() + '_' + Math.random().toString(36).substr(2, 9);
    },

    /**
     * Validates task input text
     */
    validateTaskText: function(text) {
        const trimmedText = text.trim();
        if (!trimmedText) return { isValid: false, errorMessage: 'Task cannot be empty' };
        if (trimmedText.length < 3) return { isValid: false, errorMessage: 'Task must be at least 3 characters' };
        if (trimmedText.length > 100) return { isValid: false, errorMessage: 'Task cannot exceed 100 characters' };
        return { isValid: true, errorMessage: '' };
    },

    /**
     * Debounces a function
     */
    debounce: function(func, delay) {
        let timeoutId;
        return function() {
            clearTimeout(timeoutId);
            timeoutId = setTimeout(() => func.apply(this, arguments), delay);
        };
    },

    /**
     * Escapes HTML
     */
    escapeHtml: function(text) {
        const div = document.createElement('div');
        div.textContent = text;
        return div.innerHTML;
    },

    /**
     * Task state checkers
     */
    isTaskActive: function(task) { return !task.completed; },
    isTaskCompleted: function(task) { return task.completed; },
    
    formatCount: function(count) { return count.toString(); }
};
