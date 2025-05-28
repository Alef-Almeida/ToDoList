package br.com.ifba.todolist.repository;

import br.com.ifba.todolist.model.Task;
import org.springframework.data.jpa.repository.JpaRepository;
import java.util.List;

public interface TaskIRepository extends JpaRepository<Task, Long> {
    List<Task> findByCompletedTrue();

    List<Task> findByCompletedFalse();
}