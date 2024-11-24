package com.rahulcode.hello.controller;

import com.rahulcode.hello.exception.ResourceNotFoundException;
import com.rahulcode.hello.model.Project;
import com.rahulcode.hello.model.Todo;
import com.rahulcode.hello.service.ProjectService;
import com.rahulcode.hello.service.TodoService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/projects")
public class ProjectController {

    @Autowired
    private ProjectService projectService;

    @Autowired
    private TodoService todoService;

    // Create a new project
    @PostMapping
    public ResponseEntity<Project> createProject(@RequestBody Project project) {
        return ResponseEntity.status(HttpStatus.CREATED).body(projectService.createProject(project));
    }

    // Get all projects
    @GetMapping
    public ResponseEntity<List<Project>> getAllProjects() {
        List<Project> projects = projectService.getAllProjects();
        projects.forEach(project -> project.setTodos(project.getTodos() != null ? project.getTodos() : List.of()));
        return ResponseEntity.ok(projects);
    }

    // Get a project by ID
    @GetMapping("/{projectId}")
    public ResponseEntity<?> getProjectById(@PathVariable Long projectId) {
        try {
            Project project = projectService.getProjectById(projectId);
            return ResponseEntity.ok(project);
        } catch (ResourceNotFoundException e) {
            return ResponseEntity.status(HttpStatus.NOT_FOUND).body(e.getMessage());
        }
    }

    // Update a project
    @PutMapping("/{projectId}")
    public ResponseEntity<?> updateProject(@PathVariable Long projectId, @RequestBody Project projectDetails) {
        try {
            Project project = projectService.getProjectById(projectId);
            project.setTitle(projectDetails.getTitle());
            Project updatedProject = projectService.saveProject(project);
            return ResponseEntity.ok(updatedProject);
        } catch (ResourceNotFoundException e) {
            return ResponseEntity.status(HttpStatus.NOT_FOUND).body(e.getMessage());
        }
    }

    // Add a todo to a project
    @PostMapping("/{projectId}/todos")
    public ResponseEntity<?> addTodoToProject(@PathVariable Long projectId, @RequestBody Todo todo) {
        try {
            Project project = projectService.getProjectById(projectId);
            todo.setProject(project);
            Todo savedTodo = todoService.saveTodo(todo);
            return ResponseEntity.status(HttpStatus.CREATED).body(savedTodo);
        } catch (ResourceNotFoundException e) {
            return ResponseEntity.status(HttpStatus.NOT_FOUND).body(e.getMessage());
        }
    }

    // Update a specific todo within a project
    @PutMapping("/{projectId}/todos/{todoId}")
    public ResponseEntity<?> updateTodo(
            @PathVariable Long projectId,
            @PathVariable Long todoId,
            @RequestBody Todo todoDetails) {
        try {
            todoDetails.setProject(projectService.getProjectById(projectId));
            Todo updatedTodo = todoService.updateTodo(todoId, todoDetails);
            return ResponseEntity.ok(updatedTodo);
        } catch (ResourceNotFoundException e) {
            return ResponseEntity.status(HttpStatus.NOT_FOUND).body(e.getMessage());
        }
    }

    // Toggle todo status
    @PutMapping("/todos/{todoId}/toggle-status")
    public ResponseEntity<?> toggleTodoStatus(@PathVariable Long todoId) {
        Todo todo = todoService.toggleStatus(todoId);
        return ResponseEntity.ok(todo);
    }

    // Delete a project by ID
    @DeleteMapping("/{id}")
    public ResponseEntity<Void> deleteProject(@PathVariable Long id) {
        try {
            projectService.deleteProjectById(id);
            return ResponseEntity.noContent().build(); // 204 No Content
        } catch (RuntimeException e) {
            return ResponseEntity.status(HttpStatus.NOT_FOUND).build(); // 404 Not Found
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).build(); // 500 Internal Server Error
        }
    }

    @GetMapping("/{id}/export-gist")
    public ResponseEntity<String> exportProjectAsGist(@PathVariable Long id) {
        try {
            String gistUrl = projectService.exportProjectAsGist(id);
            return ResponseEntity.ok(gistUrl);
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body(e.getMessage());
        }
    }

}
