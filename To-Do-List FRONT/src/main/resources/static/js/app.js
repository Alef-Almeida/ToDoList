// Configuração da URL base da API (ajuste a porta conforme necessário)
const API_BASE_URL = 'http://localhost:8080/api';

// Variável para controlar o filtro atual
let currentFilter = 'all'; // 'all', 'pending', 'completed'

// Função para exibir a caixa de mensagem personalizada
function showMessageBox(message) {
    document.getElementById('messageBoxText').innerText = message;
    document.getElementById('messageBox').classList.remove('hidden');
}

// Função para esconder a caixa de mensagem personalizada
function hideMessageBox() {
    document.getElementById('messageBox').classList.add('hidden');
}

// Função para carregar e exibir tarefas com base no filtro
async function loadTasks() {
    let endpoint = `${API_BASE_URL}/tasks`; // Padrão: todas as tarefas

    if (currentFilter === 'pending') {
        endpoint = `${API_BASE_URL}/tasks/pending`;
    } else if (currentFilter === 'completed') {
        endpoint = `${API_BASE_URL}/tasks/history`;
    }

    try {
        const response = await fetch(endpoint);
        if (!response.ok) throw new Error('Erro ao carregar tarefas');
        const tasks = await response.json();
        const taskList = document.getElementById('taskList');
        taskList.innerHTML = ''; // Limpa a lista atual

        if (tasks.length === 0) {
            const messageLi = document.createElement('li');
            messageLi.className = 'text-center text-gray-500 text-lg py-4';
            if (currentFilter === 'all') {
                messageLi.textContent = 'Nenhuma tarefa encontrada. Adicione uma nova!';
            } else if (currentFilter === 'pending') {
                messageLi.textContent = 'Parabéns! Nenhuma tarefa pendente.';
            } else if (currentFilter === 'completed') {
                messageLi.textContent = 'Nenhuma tarefa concluída no histórico ainda.';
            }
            taskList.appendChild(messageLi);
            return;
        }

        tasks.forEach(task => {
            const li = document.createElement('li');
            li.className = 'flex flex-col sm:flex-row items-start sm:items-center justify-between bg-gray-50 p-4 rounded-lg shadow-sm border border-gray-200';
            li.innerHTML = `
                <span class="text-lg font-medium ${task.completed ? 'completed-task-description' : 'text-gray-700'} mb-2 sm:mb-0">
                    ${task.description} - <span class="text-sm font-normal text-gray-500">${task.completed ? 'Concluída' : 'Pendente'}</span>
                </span>
                <div class="flex gap-2 flex-wrap">
                    <button
                        class="toggle-btn px-4 py-2 rounded-md text-white text-sm font-semibold transition duration-200 ease-in-out
                        ${task.completed ? 'bg-yellow-500 hover:bg-yellow-600' : 'bg-green-500 hover:bg-green-600'}"
                        onclick="toggleTask(${task.id}, ${!task.completed})"
                    >
                        Marcar como ${task.completed ? 'Pendente' : 'Concluída'}
                    </button>
                    <button
                        class="bg-red-500 text-white px-4 py-2 rounded-md hover:bg-red-600 text-sm font-semibold transition duration-200 ease-in-out"
                        onclick="deleteTask(${task.id})"
                    >
                        Deletar
                    </button>
                </div>
            `;
            taskList.appendChild(li);
        });
        updateFilterButtons(); // Atualiza o estilo dos botões de filtro
    } catch (error) {
        console.error('Erro:', error);
        showMessageBox('Erro ao carregar tarefas. Verifique se o backend está rodando.');
    }
}

// Função para adicionar uma nova tarefa
async function addTask() {
    const description = document.getElementById('taskInput').value.trim();
    if (!description) {
        showMessageBox('A descrição da tarefa não pode ser vazia.');
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
        currentFilter = 'all'; // Volta para a visualização de todas as tarefas ao adicionar
        loadTasks(); // Recarrega a lista
    } catch (error) {
        console.error('Erro:', error);
        showMessageBox('Erro ao adicionar tarefa.');
    }
}

// Função para marcar tarefa como concluída/pendente
async function toggleTask(id, completed) {
    try {
        // Primeiro, obtenha a tarefa existente para manter a descrição
        const existingTaskResponse = await fetch(`${API_BASE_URL}/tasks/${id}`);
        if (!existingTaskResponse.ok) throw new Error('Tarefa não encontrada para atualização.');
        const existingTask = await existingTaskResponse.json();

        const response = await fetch(`${API_BASE_URL}/tasks/${id}`, {
            method: 'PUT',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ description: existingTask.description, completed: completed }) // Envia a descrição original e o novo status
        });
        if (!response.ok) throw new Error('Erro ao atualizar tarefa');
        loadTasks(); // Recarrega a lista
    } catch (error) {
        console.error('Erro:', error);
        showMessageBox('Erro ao atualizar tarefa.');
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
        showMessageBox('Erro ao deletar tarefa.');
    }
}

// Define o filtro e recarrega as tarefas
function setFilter(filter) {
    currentFilter = filter;
    loadTasks();
}

// Atualiza o estilo dos botões de filtro para indicar o filtro ativo
function updateFilterButtons() {
    document.querySelectorAll('.filter-btn').forEach(button => {
        button.classList.remove('bg-blue-600', 'text-white');
        button.classList.add('bg-gray-200', 'text-gray-800');
    });
    const activeButton = document.getElementById(`filter${currentFilter.charAt(0).toUpperCase() + currentFilter.slice(1)}`);
    if (activeButton) {
        activeButton.classList.remove('bg-gray-200', 'text-gray-800');
        activeButton.classList.add('bg-blue-600', 'text-white');
    }
}

// Carrega as tarefas quando a página é carregada
document.addEventListener('DOMContentLoaded', () => {
    loadTasks();
    updateFilterButtons(); // Garante que o botão "Todas" esteja ativo no carregamento inicial
});
