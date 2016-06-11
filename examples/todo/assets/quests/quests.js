var Legend = require('../../../../react-legend');

//set up all our quests to call inside our components
module.exports = {
	addTodo: Legend.NewQuest(
		{
			'name': 'addTodoQuest'
		},
		[
			{'type': 'addTodo'},
			{'type': 'render'}
		]
	),

	inputUpdate: Legend.NewQuest(
		{
			'name': 'inputUpdate'
		},
		[
			{'type': 'updateInputText'},
			{'type': 'render'}
		]
	),

	doneATodo: Legend.NewQuest(
		{
			'name': 'doneATodo'
		},
		[
			{'type': 'crossOutTodo'},
			{'type': 'render'}
		]
	)
};
