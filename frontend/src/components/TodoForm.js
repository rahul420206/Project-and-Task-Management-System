// src/components/TodoForm.js
import React, { useState } from 'react';
import { addTodoToProject } from '../services/api';

function TodoForm({ projectId, onAdd }) {
    const [description, setDescription] = useState('');

    const handleSubmit = async (e) => {
        e.preventDefault();
        const newTodo = { description, status: false, project: { id: projectId } };
        const response = await addTodoToProject(newTodo);
        onAdd(response.data);
        setDescription('');
    };
    return (
        <form onSubmit={handleSubmit}>
            <h2>Add Todo</h2>
            <input
                type="text"
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                placeholder="Todo Description"
                required
            />
            <button type="submit">Add Todo</button>
        </form>
    );
}

export default TodoForm;
