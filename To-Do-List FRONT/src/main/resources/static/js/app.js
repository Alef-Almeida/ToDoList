// Configuração da URL base da API (ajuste a porta conforme necessário)
const API_BASE_URL = 'http://localhost:8080/api';

// Função para carregar e exibir todas as tarefas
async function loadTasks() {
    try {
        const response = await fetch(`${API_BASE_URL}/tasks`);
        if (!response.ok) throw new Error('Erro ao carregar tarefas');
        const tasks = await response.json();
        const taskList = document.getElementById('taskList');
        taskList.innerHTML = ''; // Limpa a lista atual
        tasks.forEach(task => {
            const li = document.createElement('li');
            li.innerHTML = `
    <span>${task.description} - ${task.completed ? 'Concluída' : 'Pendente'}</span>
    <div>
        <button 
            class="toggle-btn ${task.completed ? 'completed-btn' : ''}" 
            onclick="toggleTask(${task.id}, ${!task.completed})"
        >
            Marcar como ${task.completed ? 'Pendente' : 'Concluída'}
        </button>
        <button onclick="deleteTask(${task.id})">Deletar</button>
    </div>
`;

            taskList.appendChild(li);
        });
    } catch (error) {
        console.error('Erro:', error);
        alert('Erro ao carregar tarefas');
    }
}

// Função para adicionar uma nova tarefa
async function addTask() {
    const description = document.getElementById('taskInput').value.trim();
    if (!description) {
        alert('A descrição da tarefa não pode ser vazia');
        return;
    }
    try {
        const response = await fetch(`${API_BASE_URL}/tasks`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ description, completed: false })
        });
        if (!response.ok) throw new Error('Erro ao adicionar tarefa');
        document.getElementById('taskInput').value = ''; // Limpa o campo
        loadTasks(); // Recarrega a lista
    } catch (error) {
        console.error('Erro:', error);
        alert('Erro ao adicionar tarefa');
    }
}

// Função para marcar tarefa como concluída/pendente
async function toggleTask(id, completed) {
    try {
        const response = await fetch(`${API_BASE_URL}/tasks/${id}`, {
            method: 'PUT',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ completed }) // Atualiza apenas o status
        });
        if (!response.ok) throw new Error('Erro ao atualizar tarefa');
        loadTasks(); // Recarrega a lista
    } catch (error) {
        console.error('Erro:', error);
        alert('Erro ao atualizar tarefa');
    }
}

// Função para deletar uma tarefa
async function deleteTask(id) {
    try {
        const response = await fetch(`${API_BASE_URL}/tasks/${id}`, {
            method: 'DELETE'
        });
        if (!response.ok) throw new Error('Erro ao deletar tarefa');
        loadTasks(); // Recarrega a lista
    } catch (error) {
        console.error('Erro:', error);
        alert('Erro ao deletar tarefa');
    }
}

// Carrega as tarefas quando a página é carregada
document.addEventListener('DOMContentLoaded', loadTasks);