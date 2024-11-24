package com.rahulcode.hello.controller;

import com.rahulcode.hello.model.Todo;
import com.rahulcode.hello.service.TodoService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/todos")
public class TodoController {

    @Autowired
    private TodoService todoService;

    @PostMapping
    public Todo addTodoToProject(@RequestBody Todo todo) {
        return todoService.addTodoToProject(todo);
    }

    @GetMapping("/project/{projectId}")
    public List<Todo> getTodosByProject(@PathVariable Long projectId) {
        return todoService.getTodosByProject(projectId);
    }

    @GetMapping
    public List<Todo> getAllTodos() {
        return todoService.getAllTodos();
    }

    @PutMapping("/{id}/toggle-status")
    public ResponseEntity<Todo> toggleTodoStatus(@PathVariable Long id) {
        Todo updatedTodo = todoService.toggleStatus(id);
        return ResponseEntity.ok(updatedTodo);
    }

    @GetMapping("/{todoId}")
    public Todo getTodoById(@PathVariable Long todoId) {
        return todoService.getTodoById(todoId);
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<Void> deleteTodo(@PathVariable Long id) {
        todoService.deleteTodoById(id);
        return ResponseEntity.noContent().build(); // 204 No Content on success
    }

}
