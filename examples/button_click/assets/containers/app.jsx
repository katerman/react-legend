var React = require('react');

var Navbar = require('../components/_navbar.jsx');

var Legend = require('../../../../react-legend');

var App = React.createClass({
	componentWillMount: function() {
		// Set any initial store
		Legend.UpdateStore({date: new Date().toString()});
	},
	componentDidMount: function() {
		var _this = this;

		// date specific action type
		Legend.ActionType('date', function(quest, questData){
			quest.updateStore({'date': new Date().toString()});
		});

		// an action type that re-renders the container
		Legend.ActionType('render', function(quest, questData){
			_this.forceUpdate(); // or setState({})
			quest.next();
		});

	},

	// my button quest to update the date
	_btnQuest: Legend.NewQuest(
		{
			name: 'buttonQuest',
		},
		[
			{
				"type": "date"
			},
			{
				"type": "render"
			}
		]
	),
	_btnClick: function(){
		Legend.Quest('buttonQuest');
	},
	render: function() {
		var store = Legend.GetStore();
		return (
			<div>
				<Navbar />
				<div className="container">
					<a href="../../index.html">{"< Examples"}</a>
					<p>Button Click App</p>
					<button onClick={this._btnClick}>Click Me</button>

					<p><strong>Date is:</strong> {Legend.GetStore().date}</p>
				</div>
			</div>
		);
	}

});

module.exports = App;
