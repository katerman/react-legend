var Legend = require('../../../../react-legend');

module.exports = function(component){ // pass the component in so we can re-render it

	// add todo specific action type
	Legend.ActionType('addTodo', function(quest, questData){
		var store = Legend.GetStore();

		if(store.inputText.length > 0){
			var newTodoArray = store.todos.concat({text: store.inputText, done: false});
			return quest.updateStore({
				'todos': newTodoArray,
				'inputText': ''
			});
		}
		return quest.next();
	});

	// an action type that re-renders the container/component
	Legend.ActionType('render', function(quest, questData){
		component.forceUpdate(); // or setState({})
		quest.next();
	});

	// keeps the input for todo updated
	Legend.ActionType('updateInputText', function(quest, questData){
		quest.updateStore({inputText: questData.data})
	});

	// returns a todo as done
	Legend.ActionType('crossOutTodo', function(quest, questData){
		var store = Legend.GetStore();
		var newTodoStore = store.todos.slice(0); //recreate the todo array
		newTodoStore[questData.data].done = true; //set the correct index of the array as done
		quest.updateStore({todos: newTodoStore}); //return the new array
	});

};
