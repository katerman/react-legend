var React = require('react');

var Navbar = require('../components/_navbar.jsx');

var Legend = require('../../../../react-legend');

var App = React.createClass({
	componentWillMount: function() {
		// Set any initial store
		Legend.UpdateStore({todos: [], inputText: ''});
	},
	componentDidMount: function() {
		var _this = this;

		// date specific action type
		Legend.ActionType('addTodo', function(quest, questData){
			var store = Legend.GetStore();
			var newTodoArray = store.todos.concat({text: store.inputText, done: false});
			quest.updateStore({
				'todos': newTodoArray,
				'inputText': ''
			});
		});

		// an action type that re-renders the container
		Legend.ActionType('render', function(quest, questData){
			_this.forceUpdate(); // or setState({})
			quest.next();
		});

		Legend.ActionType('updateInputText', function(quest, questData){
			quest.updateStore({inputText: questData.data})
		});

		Legend.ActionType('crossOutTodo', function(quest, questData){
			var store = Legend.GetStore();
			var newTodoStore = store.todos.slice(0);
			newTodoStore[questData.data].done = true;
			quest.updateStore({todos: newTodoStore});
		});

	},

	_addTodo: Legend.NewQuest(
		{
			name: 'addTodoQuest'
		},
		[
			{
				"type": "addTodo",
			},
			{
				"type": "render"
			}
		]
	),

	_inputUpdate: Legend.NewQuest(
		{
			'name': 'inputUpdate'
		},
		[
			{
				"type": "updateInputText"
			},
			{
				"type": "render"
			}
		]
	),

	_doneATodo: Legend.NewQuest(
		{
			'name': 'doneATodo'
		},
		[
			{
				"type": "crossOutTodo"
			},
			{
				"type": "render"
			}
		]
	),

	_inputChange: function(e){
		var value = typeof e.target.value !== 'undefined' ? e.target.value : '';
		Legend.Quest('inputUpdate', value);
	},
	_onClickFireQuest: function(){
		Legend.Quest('addTodoQuest');
	},
	_submitForm: function(e){
		Legend.Quest('addTodoQuest');
		e.preventDefault();
	},
	_doneATodo: function(index){
		Legend.Quest('doneATodo', index);
	},
	render: function() {
		var store = Legend.GetStore();
		var _this = this;
		return (
			<div>
				<Navbar />
				<div className="container">
					<p>Todo App</p>

					<ul>
						{
							store.todos.map(function(todo, index){
								return (
									<li key={index} className={ todo.done === true ? 'strikeout' : '' }>
										{todo.text}
										{todo.done === true ? null : <button className="btn btn-danger btn-sm" onClick={_this._doneATodo.bind(_this, index)}>X</button> }
									</li>
								);
							})
						}
					</ul>

					<form onSubmit={this._submitForm}>
						<input onChange={this._inputChange} value={store.inputText}/>
						<button onClick={this._onClickFireQuest}>Add Todo</button>
					</form>

				</div>
			</div>
		);
	}

});

module.exports = App;
