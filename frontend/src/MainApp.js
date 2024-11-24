import React, { useState, useEffect } from "react";
import axios from "axios";
import "./App.css";

function MainApp() {
  const [projects, setProjects] = useState([]);
  const [selectedProject, setSelectedProject] = useState(null);
  const [newProjectTitle, setNewProjectTitle] = useState("");
  const [newTodoDescription, setNewTodoDescription] = useState("");
  const [gistUrl, setGistUrl] = useState("");


  // Fetch projects on component load
  useEffect(() => {
    fetchProjects();
  }, []);

  const fetchProjects = async () => {
    try {
      const response = await axios.get("http://localhost:8080/api/projects");
      setProjects(response.data || []);
    } catch (error) {
      console.error("Error fetching projects:", error);
    }
  };

  const addProject = async () => {
    if (newProjectTitle.trim() === "") return;
    try {
      const response = await axios.post("http://localhost:8080/api/projects", {
        title: newProjectTitle,
      });
      setProjects([...projects, response.data]);
      setNewProjectTitle("");
    } catch (error) {
      console.error("Error adding project:", error);
    }
  };

  const selectProject = async (projectId) => {
    try {
      const response = await axios.get(
        `http://localhost:8080/api/projects/${projectId}`
      );
      setSelectedProject(response.data);
    } catch (error) {
      console.error("Error selecting project:", error);
    }
  };

  const deleteProject = async (id) => {
    try {
      await axios.delete(`http://localhost:8080/api/projects/${id}`);
      setProjects(projects.filter((project) => project.id !== id));
      if (selectedProject?.id === id) setSelectedProject(null);
    } catch (error) {
      console.error("Error deleting project:", error);
    }
  };

  const addTodo = async () => {
    if (!selectedProject || newTodoDescription.trim() === "") return;
    try {
      const response = await axios.post(
        `http://localhost:8080/api/projects/${selectedProject.id}/todos`,
        { description: newTodoDescription }
      );
      setSelectedProject({
        ...selectedProject,
        todos: [...selectedProject.todos, response.data],
      });
      setNewTodoDescription("");
    } catch (error) {
      console.error("Error adding todo:", error);
    }
  };

  const toggleTodoStatus = async (id) => {
    try {
      const response = await axios.put(
        `http://localhost:8080/api/todos/${id}/toggle-status`
      );
      setSelectedProject((prev) => ({
        ...prev,
        todos: prev.todos.map((todo) =>
          todo.id === id ? { ...todo, status: response.data.status } : todo
        ),
      }));
    } catch (error) {
      console.error("Error toggling todo status:", error);
    }
  };

  const deleteTodo = async (id) => {
    try {
      await axios.delete(`http://localhost:8080/api/todos/${id}`);
      setSelectedProject((prev) => ({
        ...prev,
        todos: prev.todos.filter((todo) => todo.id !== id),
      }));
    } catch (error) {
      console.error("Error deleting todo:", error);
    }
  };

  const editProjectName = async (projectId, newTitle) => {
    if (!newTitle.trim()) {
      console.error("Project name cannot be empty");
      return;
    }
    try {
      const response = await axios.put(`http://localhost:8080/api/projects/${projectId}`, {
        title: newTitle,
      });
      setProjects((prevProjects) =>
        prevProjects.map((project) =>
          project.id === projectId ? { ...project, title: response.data.title } : project
        )
      );
      if (selectedProject?.id === projectId) {
        setSelectedProject((prev) => ({ ...prev, title: response.data.title }));
      }
    } catch (error) {
      console.error("Error updating project name:", error);
    }
  };

  const updateTodoDescription = async (todoId, newDescription) => {
    try {
      await axios.put(`http://localhost:8080/api/todos/${todoId}`, {
        description: newDescription,
      });
  
      // Refresh the selected project to get the updated dates
      const updatedProject = await axios.get(
        `http://localhost:8080/api/projects/${selectedProject.id}`
      );
      setSelectedProject(updatedProject.data);
      console.log("Todo description updated successfully");
    } catch (error) {
      console.error("Error updating todo description:", error);
    }
      
  };

  const createGist = async (project) => {
    if (!project) return;
  
    // Extract project details
    const { title, todos } = project;
  
    // Categorize todos into "Pending" and "Completed"
    const pendingTodos = todos.filter((todo) => !todo.status);
    const completedTodos = todos.filter((todo) => todo.status);
  
    // Construct Markdown content with tick boxes for todos
    const gistContent = `
  # ${title}
  
  ### Summary:
  ${completedTodos.length}/${todos.length} todos completed
  
  ### Pending
  ${pendingTodos.map((todo) => `- [ ] ${todo.description}`).join("\n")}
  
  ### Completed
  ${completedTodos.map((todo) => `- [x] ${todo.description}`).join("\n")}
  `.replace(/^\s+|\s+$/gm, ""); // Trim any extra whitespace
  
    try {
      // Send POST request to GitHub Gists API
      const response = await axios.post(
        "https://api.github.com/gists",
        {
          description: `${title} summary`,
          public: false, // Create a secret Gist
          files: {
            [`${title}.md`]: {
              content: gistContent, // Add the formatted content
            },
          },
        },
        {
          headers: {
            Authorization: `Bearer ${'PASTE_YOUR_GITHUB_ACCESS_TOKEN_HERE'}`, // Use environment variable for token
          },
        }
      );
      
      setGistUrl(response.data.html_url);
      console.log("Gist created:", response.data.html_url);
    } catch (error) {
      console.error("Error creating Gist:", error);
      alert("Failed to create Gist. Please try again.");
    }
  };  

  // Call the function when exporting project details as a Gist
  const exportProjectAsGist = async () => {
    if (selectedProject) {
      await createGist(selectedProject);
    } else {
      alert("No project selected.");
    }
  };

  return (
    <div className="app">
      <header className="header">
        <h1>Project and Task Management</h1>
      </header>

      <main className="main">
        {/* Create Project Section */}
        <section className="create-project">
          <h2>Create Project</h2>
          <div className="input-group">
            <input
              type="text"
              value={newProjectTitle}
              onChange={(e) => setNewProjectTitle(e.target.value)}
              placeholder="Enter project name"
            />
            <button onClick={addProject}>Add Project</button>
          </div>
        </section>

        {/* Project List */}
        <section className="project-list">
        <h2>Projects</h2>
        {Array.isArray(projects) && projects.length > 0 ? (
          projects.map((project) => (
            <div
              key={project.id}
              className={`project-item ${
                selectedProject?.id === project.id ? "selected" : ""
              }`}
            >
              <span onClick={() => selectProject(project.id)}>{project.title}</span>
              <div className="button-group">
                <button onClick={() => selectProject(project.id)}>Select</button>
                <button onClick={() => deleteProject(project.id)}>Delete</button>
              </div>
            </div>
          ))
        ) : (
          <p>No projects available.</p>
        )}
      </section>


        {/* Project Details */}
        {selectedProject && (
          <section className="project-details">
            <h2>Project: {selectedProject.title}</h2>
            <div className="editable-project-title">
              <input
                type="text"
                value={selectedProject.title}
                onChange={(e) =>
                  setSelectedProject((prev) => ({
                    ...prev,
                    title: e.target.value,
                  }))
                }
                onBlur={() => editProjectName(selectedProject.id, selectedProject.title)}
                onKeyDown={(e) => {
                  if (e.key === "Enter") {
                    e.target.blur();
                  }
                }}
                className="project-title-input"
              />
            </div>

            <p>
              Completed Tasks:{" "}
              {selectedProject.todos.filter((t) => t.status).length} /{" "}
              {selectedProject.todos.length}
            </p>

            <h3>Add Task</h3>
            <div className="input-group">
              <input
                type="text"
                value={newTodoDescription}
                onChange={(e) => setNewTodoDescription(e.target.value)}
                placeholder="Enter task description"
              />
              <button onClick={addTodo}>Add Task</button>
            </div>

            <h4>Pending Tasks:</h4>
            <ul>
              {selectedProject.todos
                .filter((todo) => !todo.status)
                .map((todo) => (
                  <li key={todo.id} className="todo-item">
                    <div className="todo-header">
                      <strong>Description:</strong>{" "}
                      {todo.isEditing ? (
                        <input
                          type="text"
                          value={todo.description}
                          onChange={(e) =>
                            setSelectedProject((prev) => ({
                              ...prev,
                              todos: prev.todos.map((t) =>
                                t.id === todo.id ? { ...t, description: e.target.value } : t
                              ),
                            }))
                          }
                        />
                      ) : (
                        <span>{todo.description}</span>
                      )}
                      <button
                        className="update-button"
                        onClick={() => {
                          if (todo.isEditing) {
                            updateTodoDescription(todo.id, todo.description);
                          }
                          setSelectedProject((prev) => ({
                            ...prev,
                            todos: prev.todos.map((t) =>
                              t.id === todo.id ? { ...t, isEditing: !t.isEditing } : t
                            ),
                          }));
                        }}
                      >
                        {todo.isEditing ? "Save" : "Update"}
                      </button>
                    </div>
                    <div className="todo-dates">
                      <div>
                        <strong>Created:</strong>{" "}
                        {new Date(todo.createdDate).toLocaleString()}
                      </div>
                      {todo.updatedDate && (
                        <div>
                          <strong>Last Updated:</strong>{" "}
                          {new Date(todo.updatedDate).toLocaleString()}
                        </div>
                      )}
                    </div>
                    <div className="todo-actions">
                      <button className="mark-complete" onClick={() => toggleTodoStatus(todo.id)}>
                        Mark Complete
                      </button>
                      <button className="delete" onClick={() => deleteTodo(todo.id)}>
                        Delete
                      </button>
                    </div>
                  </li>
                ))}
            </ul>

            <h4>Completed Tasks:</h4>
            <ul>
              {selectedProject.todos
                .filter((todo) => todo.status)
                .map((todo) => (
                  <li key={todo.id} className="todo-item">
                    <div className="todo-header">
                      <strong>Description:</strong>{" "}
                      {todo.isEditing ? (
                        <input
                          type="text"
                          value={todo.description}
                          onChange={(e) =>
                            setSelectedProject((prev) => ({
                              ...prev,
                              todos: prev.todos.map((t) =>
                                t.id === todo.id ? { ...t, description: e.target.value } : t
                              ),
                            }))
                          }
                        />
                      ) : (
                        <span>{todo.description}</span>
                      )}
                      <button
                        className="update-button"
                        onClick={() => {
                          if (todo.isEditing) {
                            updateTodoDescription(todo.id, todo.description);
                          }
                          setSelectedProject((prev) => ({
                            ...prev,
                            todos: prev.todos.map((t) =>
                              t.id === todo.id ? { ...t, isEditing: !t.isEditing } : t
                            ),
                          }));
                        }}
                      >
                        {todo.isEditing ? "Save" : "Update"}
                      </button>
                    </div>
                    <div className="todo-dates">
                      <div>
                        <strong>Created:</strong>{" "}
                        {new Date(todo.createdDate).toLocaleString()}
                      </div>
                      {todo.updatedDate && (
                        <div>
                          <strong>Last Updated:</strong>{" "}
                          {new Date(todo.updatedDate).toLocaleString()}
                        </div>
                      )}
                    </div>
                    <div className="todo-actions">
                      <button className="mark-incomplete" onClick={() => toggleTodoStatus(todo.id)}>
                        Mark Incomplete
                      </button>
                      <button className="delete" onClick={() => deleteTodo(todo.id)}>
                        Delete
                      </button>
                    </div>
                  </li>
                ))}
            </ul>
            <button onClick={exportProjectAsGist}>Export Project as Gist</button>
            {gistUrl && (
              <div className="gist-link">
                <p>
                  Gist created successfully! View it here:{" "}
                  <a href={gistUrl} target="_blank" rel="noopener noreferrer">
                    {gistUrl}
                  </a>
                </p>
              </div>
            )}

          </section>
        )}
      </main>
    </div>
  );
}

export default MainApp;

