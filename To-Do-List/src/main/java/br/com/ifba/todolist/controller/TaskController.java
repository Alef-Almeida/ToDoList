package br.com.ifba.todolist.controller;

import br.com.ifba.todolist.model.Task;
import br.com.ifba.todolist.service.TaskService;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@CrossOrigin(origins = "*")
@RestController
@RequestMapping("/api/tasks")
public class TaskController {
    private final TaskService taskService;

    public TaskController(TaskService taskService) {
        this.taskService = taskService;
    }

    @PostMapping
    public ResponseEntity<Task> createTask(@RequestBody Task task) {
        // Ao criar, uma tarefa geralmente não está completa.
        // Certifique-se de que o campo 'completed' venha como false ou defina-o aqui.
        if (task.isCompleted()) { // Uma tarefa nova não deveria começar como completa
            task.setCompleted(false);
        }
        return ResponseEntity.ok(taskService.createTask(task));
    }

    @GetMapping
    public ResponseEntity<List<Task>> getAllTasks() {
        // Se você quiser que este endpoint retorne apenas tarefas pendentes:
        // return ResponseEntity.ok(taskService.getPendingTasks());
        // Caso contrário, ele continuará retornando todas as tarefas (pendentes e concluídas).
        return ResponseEntity.ok(taskService.getAllTasks());
    }

    @GetMapping("/{id}")
    public ResponseEntity<Task> getTaskById(@PathVariable Long id) {
        return taskService.getTaskById(id)
                .map(ResponseEntity::ok)
                .orElse(ResponseEntity.notFound().build());
    }

    @PutMapping("/{id}")
    public ResponseEntity<Task> updateTask(@PathVariable Long id, @RequestBody Task task) {
        return ResponseEntity.ok(taskService.updateTask(id, task));
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<Void> deleteTask(@PathVariable Long id) {
        taskService.deleteTask(id);
        return ResponseEntity.noContent().build();
    }

    // --- Novo endpoint para o histórico de tarefas concluídas ---
    @GetMapping("/history")
    public ResponseEntity<List<Task>> getCompletedTasksHistory() {
        return ResponseEntity.ok(taskService.getCompletedTasks());
    }

    // Opcional: Adicionar um endpoint para listar apenas tarefas pendentes
    @GetMapping("/pending")
    public ResponseEntity<List<Task>> getPendingTasks() {
        return ResponseEntity.ok(taskService.getPendingTasks());
    }
}