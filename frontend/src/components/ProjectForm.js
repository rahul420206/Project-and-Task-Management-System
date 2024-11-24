// src/components/ProjectForm.js
import React, { useState } from 'react';
import { createProject } from '../services/api';

function ProjectForm({ onCreate }) {
    const [title, setTitle] = useState('');
    const handleSubmit = async (e) => {
        e.preventDefault();
        const newProject = { title };
        const response = await createProject(newProject);
        onCreate(response.data);
        setTitle('');
    };
    return (
        <form onSubmit={handleSubmit}>
            <h2>Create Project</h2>
            <input
                type="text"
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                placeholder="Project Title"
                required
            />
            <button type="submit">Add Project</button>
        </form>
    );
}
export default ProjectForm;
