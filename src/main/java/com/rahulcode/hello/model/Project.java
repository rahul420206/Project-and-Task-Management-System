package com.rahulcode.hello.model;

import jakarta.persistence.*;
import java.time.LocalDateTime;
import java.util.ArrayList;
import java.util.List;

@Entity
public class Project {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    private String title; // Title field for project name

    @Column(name = "created_date")
    private LocalDateTime createdDate = LocalDateTime.now();

    @OneToMany(cascade = CascadeType.ALL, orphanRemoval = true)
    @JoinColumn(name = "project_id")
    private List<Todo> todos;

    public Long getId() {
        return id;
    }

    public void setId(Long id) {
        this.id = id;
    }

    public String getTitle() {
        return title;
    }

    public void setTitle(String title) {
        this.title = title;
    }

    public LocalDateTime getCreatedDate() {
        return createdDate != null ? createdDate : LocalDateTime.now();
    }

    public void setCreatedDate(LocalDateTime createdDate) {
        this.createdDate = createdDate != null ? createdDate : LocalDateTime.now();
    }

    public List<Todo> getTodos() {
        if (todos == null) {
            todos = new ArrayList<>();
        }
        return todos;
    }

    public void setTodos(List<Todo> todos) {
        this.todos = todos;
    }

}
