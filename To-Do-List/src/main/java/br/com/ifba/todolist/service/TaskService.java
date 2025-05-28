package br.com.ifba.todolist.service;

import br.com.ifba.todolist.model.Task;
import br.com.ifba.todolist.repository.TaskIRepository;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.Optional;

@Service
public class TaskService {
    private final TaskIRepository taskRepository;

    public TaskService(TaskIRepository taskRepository) {
        this.taskRepository = taskRepository;
    }

    public Task createTask(Task task) {
        if (task.getDescription() == null || task.getDescription().trim().isEmpty()) {
            throw new IllegalArgumentException("Descrição não pode ser vazia");
        }
        return taskRepository.save(task);
    }

    public List<Task> getAllTasks() {
        // Agora, você pode querer retornar apenas tarefas não concluídas por padrão
        // Ou criar um método para retornar todas e outro para não concluídas.
        // Por simplicidade, vou manter getAllTasks como está e adicionar um novo para pendentes.
        return taskRepository.findAll();
    }

    public List<Task> getPendingTasks() {
        return taskRepository.findByCompletedFalse(); // Assumindo que você quer listar pendentes explicitamente
    }

    public Optional<Task> getTaskById(Long id) {
        return taskRepository.findById(id);
    }

    public Task updateTask(Long id, Task task) {
        Optional<Task> existingTask = taskRepository.findById(id);
        if (existingTask.isEmpty()) {
            throw new IllegalArgumentException("Tarefa não encontrada");
        }
        Task updatedTask = existingTask.get();
        updatedTask.setDescription(task.getDescription());
        updatedTask.setCompleted(task.isCompleted());
        return taskRepository.save(updatedTask);
    }

    public void deleteTask(Long id) {
        if (!taskRepository.existsById(id)) {
            throw new IllegalArgumentException("Tarefa não encontrada");
        }
        taskRepository.deleteById(id);
    }

    // --- Novo método para o histórico de tarefas concluídas ---
    public List<Task> getCompletedTasks() {
        return taskRepository.findByCompletedTrue();
    }
}