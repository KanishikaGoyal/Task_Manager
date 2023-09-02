window.addEventListener('load', () => {
	todos = JSON.parse(localStorage.getItem('todos')) || [];
	const nameInput = document.querySelector('#name');
	const newTodoForm = document.querySelector('#new-todo-form');
	const username = localStorage.getItem('username') || '';

	nameInput.value = username;

	nameInput.addEventListener('change', (e) => {
		localStorage.setItem('username', e.target.value);
	})

	newTodoForm.addEventListener('submit', e => {
		e.preventDefault();

		const todo = {
			content: e.target.elements.content.value,
			category: e.target.elements.category.value,
			done: false,
			dueDate: e.target.elements.dueDate.value, // New field for due date
			createdAt: new Date().getTime()
		}

		todos.push(todo);

		localStorage.setItem('todos', JSON.stringify(todos));

		e.target.reset();

		DisplayTodos()
	})

	DisplayTodos()
})

function DisplayTodos (todoArray=todos) {
	const todoList = document.querySelector('#todo-list');
	todoList.innerHTML = "";

	
	const searchInput = document.querySelector('#search-input');

    searchInput.addEventListener('input', () => {
        const searchQuery = searchInput.value.trim().toLowerCase();
        const filteredTodos = todos.filter(todo =>
            todo.content.toLowerCase().includes(searchQuery)
        );

        RenderTodos(filteredTodos);
    });




	const sortingSelect = document.querySelector('#sort-by');
    sortingSelect.addEventListener('change', () => {
        const sortBy = sortingSelect.value;
        let sortedTodos = [...todoArray];

        if (sortBy === 'completion-status') {
            sortedTodos.sort((a, b) => a.done - b.done);
        } else if (sortBy === 'category') {
            sortedTodos.sort((a, b) => a.category.localeCompare(b.category));
        }
        RenderTodos(sortedTodos);
    });
	
    RenderTodos(todoArray);
}

function RenderTodos(todoArray) {
    const todoList = document.querySelector('#todo-list');
    todoList.innerHTML = '';

	todoArray.forEach(todo => {
		const todoItem = document.createElement('div');
		todoItem.classList.add('todo-item');

		const label = document.createElement('label');
		const input = document.createElement('input');
		const span = document.createElement('span');
		const content = document.createElement('div');
		const actions = document.createElement('div');
		const edit = document.createElement('button');
		const deleteButton = document.createElement('button');
        
		const dueDate = document.createElement('div');
		const dueDateDays = document.createElement('div'); // New element for days left
		dueDate.classList.add('due-date');
		dueDateDays.classList.add('due-date-days');

		// Calculate the days left
        const currentDate = new Date();
        const dueDateTime = new Date(todo.dueDate);
        const timeDiff = dueDateTime - currentDate;
        const daysLeft = Math.ceil(timeDiff / (1000 * 60 * 60 * 24));
		

        // Set content for dueDate
		dueDate.textContent = `Due Date: ${new Date(todo.dueDate).toLocaleDateString()}`;
		dueDateDays.textContent = `Due in ${daysLeft} days`;

		input.type = 'checkbox';
		input.checked = todo.done;
		span.classList.add('bubble');
		if (todo.category == 'personal') {
			span.classList.add('personal');
		} else {
			span.classList.add('business');
		}
		content.classList.add('todo-content');
		actions.classList.add('actions');
		edit.classList.add('edit');
		deleteButton.classList.add('delete');

		content.innerHTML = `<input type="text" value="${todo.content}" readonly>`;
		edit.innerHTML = 'Edit';
		deleteButton.innerHTML = 'Delete';

		label.appendChild(input);
		label.appendChild(span);
		actions.appendChild(edit);
		actions.appendChild(deleteButton);
		todoItem.appendChild(label);
		todoItem.appendChild(content);
		todoItem.appendChild(dueDate); // Display due date
		todoItem.appendChild(dueDateDays); // Display due in days
		todoItem.appendChild(actions);

		todoList.appendChild(todoItem);

		if (todo.done) {
			todoItem.classList.add('done');
		}
		
		input.addEventListener('change', (e) => {
			todo.done = e.target.checked;
			localStorage.setItem('todos', JSON.stringify(todos));

			if (todo.done) {
				todoItem.classList.add('done');
			} else {
				todoItem.classList.remove('done');
			}

			DisplayTodos()

		})

		edit.addEventListener('click', (e) => {
			const input = content.querySelector('input');
			input.removeAttribute('readonly');
			input.focus();
			input.addEventListener('blur', (e) => {
				input.setAttribute('readonly', true);
				todo.content = e.target.value;
				localStorage.setItem('todos', JSON.stringify(todos));
				DisplayTodos()

			})
		})

		deleteButton.addEventListener('click', (e) => {
			todos = todos.filter(t => t != todo);
			localStorage.setItem('todos', JSON.stringify(todos));
			DisplayTodos()
		})
	})

    

}

