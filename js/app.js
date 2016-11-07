var util = {
	store: function ( namespace, data ) {
		if ( arguments.length > 1 ) {
			// Save data
			return localStorage.setItem( namespace, JSON.stringify( data ) );
		} else {
			// get data
			var store = localStorage.getItem( namespace );
			return store && JSON.parse( store ) || [ ];
		}
	},
	router: function ( ) {
		app.filter = document.location.hash.substr( 2 );
		app.render( );
	},
	renderOnRefresh: function ( ) {
		app.render( );
	},
	pluralize: function ( todos, text ) {
		if ( todos.length === 1 ) {
			return text;
		}
		return text + 's';
	},
	uuid: function ( ) {
		var d = new Date( ).getTime( );
		var uuid = 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace( /[xy]/g, function ( c ) {
			var r = ( d + Math.random( ) * 16 ) % 16 | 0;
			d = Math.floor( d / 16 );
			return ( c == 'x' ? r : ( r & 0x3 | 0x8 ) ).toString( 16 );
		} );

		return uuid;
	}
};
var app = {
	todos: [ ],
	todoUl: getElement( 'todo-list' ),
	filter: 'all',
	init: function ( ) {
		this.todos = util.store( 'todoList' );
		this.checkCompleted( );
		getElement( 'toggle-all' ).addEventListener( 'click', this.toggleAll.bind( this ) );
		getElement( 'new-todo' ).addEventListener( 'keyup', this.addTodo.bind( this ) );
		getElement( 'todo-list' ).addEventListener( 'dblclick', this.editTodo.bind( this ) );
		getElement( 'todo-list' ).addEventListener( 'click', this.deleteTodo.bind( this ) );
		getElement( 'todo-list' ).addEventListener( 'click', this.toggleCompleted.bind( this ) );
		getElement( 'todo-list' ).addEventListener( 'keyup', this.changeTodo.bind( this ) );
		getElement( 'clearCompleted' ).addEventListener( 'click', this.clearCompleted.bind( this ) );
		window.addEventListener( 'hashchange', util.router );
		window.addEventListener( 'load', util.renderOnRefresh );
		window.location.hash = app.filter;
	},
	todosTemplate: function ( todo ) {
		todo.text = todo.text.trim( );
		var checkbox = createElement( 'input', { className: 'toggle', type: 'checkbox' } );
		var todoLi = createElement( 'li' );
		if ( todo.completed ) {
			checkbox.setAttribute( 'checked', '' );
			todoLi.className = 'completed';
		}
		var todoText = createElement( 'label', { innerHTML: todo.text } );
		var destroyButton = createElement( 'button', { className: 'destroy' } );
		var div = createElement( 'div', { className: 'main' } );
		div.appendChild( checkbox );
		div.appendChild( todoText );
		div.appendChild( destroyButton );
		todoLi.id = todo.id;
		todoLi.appendChild( div );
		this.todoUl.appendChild( todoLi );
	},
	countTodos: function ( ) {
		// Set 'item' or 'items'
		var count = getElement( 'todo-count' );
		count.innerHTML = '<strong>' + this.getActiveTodos( ).length + '</strong> ' + util.pluralize( this.getActiveTodos( ), 'item' ) + ' left';
	},
	getTodoIndex: function ( uuid ) {
		var indexFound = -1;
		this.todos.forEach( function ( todo, index ) {
			if ( todo.id === uuid ) {
				indexFound = index;
			}
		} );
		return indexFound;
	},
	checkCompleted: function ( ) {
		var totalTodos = this.getFilteredTodos( ).length;
		var completedTodos = 0;
		var checkBox = getElement( 'toggle-all' );
		this.todos.forEach( function ( todo ) {
			if ( todo.completed ) completedTodos++;
		} );
		if ( completedTodos === totalTodos ) {
			checkBox.checked = true;
		} else {
			checkBox.checked = false;
		}
	},
	getFilteredTodos: function ( ) {
		var hrefAll = document.querySelector( 'a[href="#/"]' );
		var hrefActive = document.querySelector( 'a[href="#/active"]' );
		var hrefCompleted = document.querySelector( 'a[href="#/completed"]' );
		hrefAll.className = '';
		hrefActive.className = '';
		hrefCompleted.className = '';
		if ( this.filter === 'active' ) {
			var activeTodos = this.getActiveTodos( );
			if ( activeTodos ) {
				hrefActive.className = 'selected';
				return activeTodos;
			}
		}
		if ( this.filter === 'completed' ) {
			var completedTodos = this.getCompletedTodos( );
			if ( completedTodos ) {
				hrefCompleted.className = 'selected';
				return completedTodos;
			}
		}
		this.filter = 'all';
		hrefAll.className = 'selected';
		return this.todos;
	},
	getActiveTodos: function ( ) {
		return this.todos.filter( function ( todo ) {
			return !todo.completed;
		} );
	},
	getCompletedTodos: function ( ) {
		return this.todos.filter( function ( todo ) {
			return todo.completed;
		} );
	},
	render: function ( ) {
		var todos = this.getFilteredTodos( );
		this.countTodos( );
		this.checkCompleted( );
		this.todoUl.innerHTML = '';
		todos.forEach( this.todosTemplate, this );
		util.store( 'todoList', this.todos );

		// Hide the main and footer sections
		var sectionMain = getElement( 'main' );
		var sectionFooter = getElement( 'footer' );
		if ( !this.todos.length ) {
			sectionMain.className += ' hidden';
			sectionFooter.className += ' hidden';
		} else {
			sectionMain.className = 'main';
			sectionFooter.className = 'footer';
		}
		var clearCompletedButton = getElement( 'clearCompleted' );
		var completedTodos = this.getCompletedTodos( ).length;
		if ( completedTodos > 0 ) {
			clearCompletedButton.className = 'clear-completed';
		} else {
			clearCompletedButton.className = 'hidden';
		}
	},
	addTodo: function ( event ) {
		var triggerKey = 'Enter';
		var pressedKey = event.key;
		var target = event.target;

		if ( pressedKey === triggerKey && target.value.length > 0 ) {
			var todoText = target.value.trim( );
			var todo = {
				completed: false,
				text: todoText,
				id: util.uuid( )
			};
			this.todos.push( todo );
			target.value = '';
			app.render( );
		}
	},
	deleteTodo: function ( event ) {
		var target = event.target;
		if ( target.className === 'destroy' ) {
			var todoId = this.getTodoIndex( event.path[ 2 ].id );
			this.todos.splice( todoId, 1 );
			app.render( );
		}
	},
	toggleAll: function ( ) {
		var totalTodos = this.getFilteredTodos( ).length;
		var completedTodos = 0;
		this.getFilteredTodos( ).forEach( function ( todo ) {
			if ( todo.completed ) completedTodos++;
		} );

		this.getFilteredTodos( ).forEach( function ( todo ) {
			if ( totalTodos === completedTodos ) {
				todo.completed = !todo.completed;
			} else {
				todo.completed = true;
			}
		} );
		this.render( );
	},
	toggleCompleted: function ( event ) {
		var target = event.target;
		if ( target.className === 'toggle' ) {
			var todoId = this.getTodoIndex( event.path[ 2 ].id );
			this.todos[ todoId ].completed = !this.todos[ todoId ].completed;
			app.render( );
		}
	},
	editTodo: function ( event ) {
		var target = event.target;
		if ( target.nodeName.toLowerCase( ) === 'label' ) {
			// target === label element!
			// create an input element
			var input = createElement( 'input', { className: 'new-todo', type: 'text', value: target.innerHTML } );
			input.onblur = this.changeTodo.bind( this );
			var parent = target.parentNode;
			// replace label with input element
			// input.focus();
			parent.replaceChild( input, target );
			// Add the .editing class to the li(parent of the div)
			var li = parent.parentNode;
			li.className = 'editing';
			input.select( );
		}
	},
	changeTodo: function ( event ) {
		var target = event.target;
		var confirmKey = 'Enter';
		var escapeKey = 'Escape';
		// if Enter is pressed, update the todoText
		if ( event.key === confirmKey || event.type === 'blur' ) {
			var todoId = this.getTodoIndex( event.path[ 2 ].id );
			if ( target.value === '' ) {
				this.todos.splice( todoId, 1 );
				this.render( );
			} else {
				this.todos[ todoId ].text = target.value;
				this.render( );
			}
		} else if ( event.key === escapeKey ) {
			this.render( );
		}
		// if esc is pressed, render the list
	},
	clearCompleted: function ( ) {
		var todos = this.getCompletedTodos( );
		todos.forEach( function ( todo ) {
			this.todos.splice( this.getTodoIndex( todo.id ), 1 );
		}, this );
		this.render( );
	}
};
app.init( );
