package com.rahulcode.hello.service;

import com.rahulcode.hello.exception.ResourceNotFoundException;
import com.rahulcode.hello.model.Todo;
import com.rahulcode.hello.repository.TodoRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
public class TodoService {

    @Autowired
    private TodoRepository todoRepository;

    public Todo addTodoToProject(Todo todo) {
        return todoRepository.save(todo);
    }

    public List<Todo> getTodosByProject(Long projectId) {
        return todoRepository.findByProjectId(projectId);
    }

    public List<Todo> getAllTodos() {
        return todoRepository.findAll();
    }

    public Todo getTodoById(Long todoId) {
        return todoRepository.findById(todoId)
                .orElseThrow(() -> new ResourceNotFoundException("Todo with ID " + todoId + " not found"));
    }

    public Todo updateTodo(Long id, Todo todoDetails) {
        Todo todo = todoRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Todo not found with id: " + id));
        todo.setDescription(todoDetails.getDescription());
        todo.setStatus(todoDetails.getStatus());
        return todoRepository.save(todo);
    }

    // Delete a todo by ID
    public void deleteTodoById(Long id) {
        if (!todoRepository.existsById(id)) {
            throw new RuntimeException("Todo not found");
        }
        todoRepository.deleteById(id);
    }

    public Todo saveTodo(Todo todo) {
        if (todo.getDescription() == null || todo.getDescription().trim().isEmpty()) {
            todo.setDescription("(No Description)");
        }
        return todoRepository.save(todo);
    }

    public Todo toggleStatus(Long id) {
        // Fetch the Todo by ID
        Todo todo = todoRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Todo not found"));

        // Toggle the status
        todo.setStatus(!todo.isStatus());

        // Save the updated Todo back to the database
        return todoRepository.save(todo);
    }

}