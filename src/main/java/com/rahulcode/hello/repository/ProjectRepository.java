package com.rahulcode.hello.repository;

import com.rahulcode.hello.model.Project;
import org.springframework.data.jpa.repository.JpaRepository;

public interface ProjectRepository extends JpaRepository<Project, Long> {
}
