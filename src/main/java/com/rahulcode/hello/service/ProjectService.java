package com.rahulcode.hello.service;

import com.rahulcode.hello.exception.ResourceNotFoundException;
import com.rahulcode.hello.model.Project;
import com.rahulcode.hello.repository.ProjectRepository;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.web.client.RestTemplate;
import org.springframework.http.HttpEntity;
import org.springframework.http.HttpHeaders;
import org.springframework.http.ResponseEntity;
import org.json.JSONObject;

import java.nio.charset.StandardCharsets;
import java.util.HashMap;
import java.util.List;
import java.util.Map;

@Service
public class ProjectService {

    @Autowired
    private ProjectRepository projectRepository;

    public Project createProject(Project project) {
        return projectRepository.save(project);
    }

    public List<Project> getAllProjects() {
        return projectRepository.findAll();
    }

    public Project getProjectById(Long id) {
        return projectRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Project not found with id: " + id));
    }

    public Project saveProject(Project project) {
        return projectRepository.save(project);
    }

    public Project updateProject(Long id, Project projectDetails) {
        Project project = getProjectById(id);
        if (projectDetails.getTitle() != null && !projectDetails.getTitle().trim().isEmpty()) {
            project.setTitle(projectDetails.getTitle());
        }
        return projectRepository.save(project);
    }

    // Delete a project by ID
    public void deleteProjectById(Long id) {
        if (!projectRepository.existsById(id)) {
            throw new RuntimeException("Project not found");
        }
        projectRepository.deleteById(id);
    }

    public String exportProjectAsGist(Long projectId) throws Exception {
        Project project = getProjectById(projectId);

        // Generate project summary
        StringBuilder content = new StringBuilder();
        content.append("# ").append(project.getTitle()).append("\n\n");
        content.append("**Summary:** ")
                .append(project.getTodos().stream().filter(todo -> todo.isCompleted()).count())
                .append(" / ")
                .append(project.getTodos().size())
                .append(" completed.\n\n");

        // Section 1: Pending Tasks
        content.append("## Pending Tasks\n");
        project.getTodos().stream()
                .filter(todo -> !todo.isCompleted())
                .forEach(todo -> content.append("- [ ] ").append(todo.getDescription()).append("\n"));

        // Section 2: Completed Tasks
        content.append("\n## Completed Tasks\n");
        project.getTodos().stream()
                .filter(todo -> todo.isCompleted())
                .forEach(todo -> content.append("- [x] ").append(todo.getDescription()).append("\n"));

        // Prepare Gist payload
        Map<String, String> files = new HashMap<>();
        files.put(project.getTitle() + ".md", content.toString());

        JSONObject gistPayload = new JSONObject();
        gistPayload.put("description", "Project Summary for " + project.getTitle());
        gistPayload.put("public", false); // Secret Gist
        gistPayload.put("files", new JSONObject(files));

        // Make POST request to GitHub Gist API
        RestTemplate restTemplate = new RestTemplate();
        HttpHeaders headers = new HttpHeaders();
        headers.set("Authorization", "Bearer " + System.getenv(
                "PASTE_YOUR_GITHUB_ACCESS_TOKEN_HERE"));
        headers.set("Content-Type", "application/json");

        HttpEntity<String> request = new HttpEntity<>(gistPayload.toString(), headers);
        String gistApiUrl = "https://api.github.com/gists";

        ResponseEntity<String> response = restTemplate.postForEntity(gistApiUrl, request, String.class);

        if (response.getStatusCode().is2xxSuccessful()) {
            JSONObject responseBody = new JSONObject(response.getBody());
            return responseBody.getString("html_url");
        } else {
            throw new Exception("Failed to create Gist. Response: " + response.getBody());
        }
    }

    public byte[] downloadProject(Long projectId) throws Exception {
        Project project = getProjectById(projectId);
        String content = "Title: " + project.getTitle() + "\nCreated Date: " + project.getCreatedDate();
        return content.getBytes(StandardCharsets.UTF_8);
    }

    public int getResponseStatus(ResponseEntity<String> response) {
        return response.getStatusCode().value(); // Correct approach for Spring 6.0
    }
}
