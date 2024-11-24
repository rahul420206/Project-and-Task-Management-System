// src/services/api.js
import axios from 'axios';

const api = axios.create({
    baseURL: 'http://localhost:8080/api', // Backend URL
    headers: {
        'Content-Type': 'application/json',
    },
});


export const getProjects = () => api.get('/projects');
export const createProject = (project) => api.post('/projects', project);
export const getProjectTodos = (projectId) => api.get(`/todos/project/${projectId}`);
export const addTodoToProject = (todo) => api.post('/todos', todo);

export default api;
