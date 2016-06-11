var React = require('react');

var Navbar = require('../components/_navbar.jsx');

var Legend = require('../../../../react-legend');

var $ = window.jQuery; // for testing ajax

var App = React.createClass({
	componentDidMount: function() {
		var _this = this;

		Legend.UpdateStore({isPending: false});

		// ajax pending action
		Legend.ActionType('$ajaxIsPending', function(quest, questData){
			quest.next({isPending: true});
		});

		// A jQuery ajax specific actionType
		Legend.ActionType('$ajax', function(quest, questData){
			//console.log('$ajax arguments: ', arguments);
			setTimeout(function(){
				$.ajax({
					'url': 'https://httpbin.org/get',
					'method': 'get'
				}).then(
					function(data){
						questData.actions[0](data);
						// Set the isPending back to false to hide the ajax Spinner
						data.isPending = false;
						quest.updateStore(data);
					},
					function(err){
						questData.actions[1].call(err);
						quest.reject(JSON.stringify(arguments));
					}
				)
			}, 2500);
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
			name: 'buttonQuest'
		},
		[
			{
				"type": "$ajaxIsPending"
			},
			{
				"type": "render"
			},
			{
				"type": "$ajax",
				"action": [
					function(data){
						// you could call it passed quest from here. You would remove the render from the end of this as well.
						console.log('passed', data);
					},
					function(err){
						// you could call it failed quest from here.
						console.error('err', err);
					}
				]
			},
			{
				"type": "render"
			}
		]
	),

	_btnClick: function(){
		Legend.Quest('buttonQuest');
		return false;
	},

	render: function() {
		var store = Legend.GetStore();
		return (
			<div>
				<Navbar />
				<div className="container">
					<a href="../../index.html">{"< Examples"}</a>
					<p>Async App</p>
					<button onClick={this._btnClick}>Click For Async</button>
					<span className={store.isPending === true ? "ajax-loader" : "ajax-loader hidden"}></span>

					<pre>
						{
							JSON.stringify(Legend.GetStore())
						}
					</pre>

				</div>
			</div>
		);
	}

});

module.exports = App;
