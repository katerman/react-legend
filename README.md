### React-legend
#####*Questing now done in React*
---

#### What is React-Legend?
React-Legend is a small library designed to be used with React. Legend is used to create reusable pieces of logic. That logic can then update a global store to update the rest of your React app.

####Legend Life Cycle
![alt text](https://raw.githubusercontent.com/katerman/react-legend/master/images/lifecycle.png "React-Legend lifecycle image")

#####ActionTypes

*What is an ActionType?*

An ActionType is predefined logic designed to create reusable code models. Any Quest can then use that ActionType to fire logic.

*How is an ActionType created?*

Below is a sample ActionType creator that when called will `console.log` "test".

```
//first argument is name, second argument is a callback that returns quest information and questData passed in from the Quest
Legend.ActionType('test', function(quest, questData){
	console.log('test');
	quest.next();
});
```

*What is quest.next()?*

`quest.next()` is an alias of `quest.updateStore()` you can use these to update the store by passing in an object (see store section below).

The ActionType itself is actually automatically coated into a promise. It will only finish and go onto the next action in the quest only when told to. Next() here tells Legend that its completed its action and its ready to move on to the next action. This is useful for any async calls that are made inside of an ActionType.

#####Quests
*What is a Quest?*

A Quest is a method of Legend that will decide what logic is needed to be used. These Quest's take an array of objects that have a `type` value. Each object in this array is a action that takes place during the Quest. The ActionType (such as defined above) will decide how the first action reaches the second action.

Below is a sample quest creator.

```
var quest = Legend.NewQuest(
	{
		name: 'testQuest',
		done: function(){
			console.log(Legend.GetStore());
		}
	},
	[
		{
			"type": "test"
		},
		{
			"type": "test"
		}
	]
); //when called will console "test" twice.
```

#####Store
*What is the Store?*

The store is a object internal to Legend that holds any information you pass to it.
This could be one of two ways:
* using `Legend.UpdateStore({something: something})`.
* using `quest.updateStore` or `quest.next()` will automatically update the store tells the quest to call the next action.

*Notice `Legend.UpdateStore()` is capitalized to help you know its a static function.*

#####With React

```
var React = require('react');
var ReactDOM = require('react-dom');
var Legend = require('react-legend');

var App = React.createClass({
	componentWillMount: function() {
		// Set any initial store for date
		Legend.UpdateStore({number: 0});
	},
	componentDidMount: function() {
		var _this = this;

		// add one to our number
		Legend.ActionType('addOne', function(quest, questData){
			var store = Legend.GetStore();
			quest.updateStore({number: store.number + 1}); //or next()
		});

		// an action type that re-renders the component
		Legend.ActionType('render', function(quest, questData){
			_this.forceUpdate(); // or setState({})
			quest.next(); //or updateStore()
		});

	},

	// My Button quest, whenever i click on a button i want all the following actions to fire in order (and wait for the first to be done before moving on to the next)
	_btnQuest: Legend.NewQuest(
		{
			name: 'buttonQuest',
			done: function(){
				console.log(Legend.GetStore());
			}
		},
		[
			{
				"type": "addOne"
			},
			{
				"type": "render"
			}
		]
	),
	_onClick: function(){
		Legend.Quest('buttonQuest');
		return false;
	},
	render: function() {
		var store = Legend.GetStore();
		return (
			<div>
				<p>Example Button App</p>
				<button onClick={this._onClick}>Add One</button>
				<p>Number:{store.number}</p>
			</div>
		);
	}
});

ReactDOM.render( <App />, document.getElementById('app'));
```

1. In the above example we're creating a react component called app.
2. We then define our ActionTypes in `componentDidMount`. We have 2 one for re-rendering our component and one to update the global state to the add one to our number.
3. Next we set up our first quest inside the react component (not necessary: it could even be in its own file and required or imported). Using `Legend.NewQuest()`;
4. We call the quest 'buttonQuest' its first argument will be a config object that as of now only takes 2 things. A name and a done callback.
5. The next argument for _btnQuest is an array of specified actions. Each action is an object that only requires one thing a `type`. Anything else will be passed into the ActionType creator its defined to (this could be a callback, or any other data).
6. In our render function we have a button with an onClick that calls a funciton which calls our our Quest.
7. Whenever we click our button it starts its Quest starting with our addOne ActionType its job is to add one to the number value in the store.
8. After the number has finished updating we tell our ActionType to move to the next action. The next one it calls will be render which will re-render the component.


#####Misc
*Should i use state?*

Legend is designed to be used with stateless components using the legend store to keep track of all data.

*I need some examples!*

As of now there are only 3 examples. Button clicker, Todo, and async. These examples show a basic usage of react-legend.
