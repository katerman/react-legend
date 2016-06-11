var React = require('react');

var Navbar = require('../components/_navbar.jsx');

var Legend = require('../../../../react-legend');

var ActionTypeCreators = require('../actions/todo-actions'); //set up all actions
var Quests = require('../quests/quests')

var App = React.createClass({
	componentWillMount: function() {
		// set up all our actions
		ActionTypeCreators(this);
		// Set any initial store values
		Legend.UpdateStore({todos: [], inputText: ''});
	},
	_inputChange: function(e){
		var value = typeof e.target.value !== 'undefined' ? e.target.value : '';
		Legend.Quest('inputUpdate', value);
	},
	_onClickFireQuest: function(){
		// fire addTodoQuest by its name
		Legend.Quest('addTodoQuest');
	},
	_submitForm: function(e){
		// fire addTodoQuest by its name
		Legend.Quest('addTodoQuest');
		e.preventDefault(); //make sure the page doesn't submit
	},
	_doneATodo: function(index){
		// fire doneATodo by its name
		Legend.Quest('doneATodo', index);
	},
	render: function() {
		var store = Legend.GetStore();
		var _this = this;
		return (
			<div>
				<Navbar />
				<div className="container">
					<a href="../../index.html">{"< Examples"}</a>
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
