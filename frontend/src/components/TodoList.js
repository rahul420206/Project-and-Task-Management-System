// src/components/TodoList.js
import React, { useEffect, useState } from 'react';
import { getProjectTodos } from '../services/api';

function TodoList({ projectId }) {
    const [todos, setTodos] = useState([]);
    useEffect(() => {
        if (projectId) {
            getProjectTodos(projectId).then(response => setTodos(response.data));
        }
    }, [projectId]);
    return (
        <div>
            <h2>Todos</h2>
            <ul>
                {todos.map(todo => (
                    <li key={todo.id}>
                        {todo.description} - {todo.status ? 'Complete' : 'Pending'}
                    </li>
                ))}
            </ul>
        </div>
    );
}
export default TodoList;
