package com.rahulcode.hello.repository;

import com.rahulcode.hello.model.Todo;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface TodoRepository extends JpaRepository<Todo, Long> {

    List<Todo> findByProjectId(Long projectId); // Method to fetch todos by project ID
}
