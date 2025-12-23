// LocalStorage handling
const STORAGE_KEY = 'taskManager_tasks_v2';

window.TaskStorage = {
    saveTasksToLocalStorage: function(tasks) {
        try {
            localStorage.setItem(STORAGE_KEY, JSON.stringify(tasks));
        } catch (error) {
            console.error('Save failed:', error);
            sessionStorage.setItem(STORAGE_KEY, JSON.stringify(tasks));
        }
    },

    loadTasksFromLocalStorage: function() {
        try {
            const stored = localStorage.getItem(STORAGE_KEY) || sessionStorage.getItem(STORAGE_KEY);
            if (!stored) return [];
            
            const tasks = JSON.parse(stored);
            return Array.isArray(tasks) ? tasks.map(this.migrateTask).filter(Boolean) : [];
        } catch (error) {
            console.error('Load failed:', error);
            return [];
        }
    },

    clearCompletedTasks: function(tasks) {
        const activeTasks = tasks.filter(task => !task.completed);
        this.saveTasksToLocalStorage(activeTasks);
        return activeTasks;
    },

    migrateTask: function(task) {
        if (!task || typeof task !== 'object') return null;
        return {
            id: task.id || window.TaskUtils.generateUniqueId(),
            text: task.text || task.title || '',
            completed: Boolean(task.completed || task.done || false),
            createdAt: task.createdAt || new Date().toISOString(),
            updatedAt: task.updatedAt || new Date().toISOString()
        };
    }
};
