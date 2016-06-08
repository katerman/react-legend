var React = require('react');

var Navbar = require('../components/_navbar.jsx');

var Legend = require('../react-legend');

var $ = window.jQuery; //for testing ajax

var App = React.createClass({
	componentWillMount: function() {
		// Set any initial store
		Legend.UpdateStore({date: new Date().toString()});
	},
	componentDidMount: function() {
		var _this = this;

		// A jQuery ajax specific actionType
		Legend.ActionType('$ajax', function(quest, questData){
			//console.log('$ajax arguments: ', arguments);
			$.ajax({
				'url': 'https://httpbin.org/get',
				'method': 'get'
			}).then(
				function(data){
					questData.actions[0](data);
					quest.updateStore(data);
				},
				function(err){
					questData.actions[1].call(err);
					quest.reject(JSON.stringify(arguments));
				}
			)
		});

		// test action type updates store
		Legend.ActionType('test', function(quest, questData){
			questData.actions[0].call();
			//console.log('test arguments: ' , questData);
			quest.updateStore({'test':'test'});
		});

		// date specific action type
		Legend.ActionType('date', function(quest, questData){
			//console.log('date type called');
			quest.updateStore({'date': new Date().toString()});
		});

		// an action type that re-renders the container
		Legend.ActionType('render', function(quest, questData){
			_this.forceUpdate(); // or setState({})
			quest.next();
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
				"type": "$ajax",
				"action": [
					function(data){
						console.log('data', data);
					},
					function(err, errt){
						console.error('err', err);
					}
				]
			},
			{
				"type": "test",
				"action": [
					function(){
						console.log('test');
					}
				]
			},
			{
				"type": "date"
			},
			{
				"type": "render"
			}
		]
	),
	render: function() {
		console.log(Legend.GetStore());
		var btnQuest = this._btnQuest;
		return (
			<div>
				<Navbar />
				<div className="container">
					<p>App</p>
					<button onClick={Legend.Quest(btnQuest)}>Test</button>

					<pre style={{whiteSpace: 'normal'}}>
						{
							JSON.stringify(Legend.GetStore())
						}
					</pre>

					<p>Date: {Legend.GetStore().date}</p>
				</div>
			</div>
		);
	}

});

module.exports = App;
