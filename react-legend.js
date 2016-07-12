var Q = require('q');

var Legend = function(){

	var _public = this;
	var _private = {};
	_private.quests = {};
	_private.actions = {};
	_private.store = {};
	_private.doneCallbacks = {};

	/* QuestStepIntoPromise Private Method
	 * @desc Takes the quest object and a current index. Used to return the promised needed to walk through each quest action.
	 * @Argument obj (object) - object of all quest data
	 * @Argument index(number) - number of current quest index in the above object.
	 * @Argument data(any) - If you pass a second argument into Legend.Quest this is it. It will return this data in the ActionType creator.
	 * @return promise
	*/
	_private.QuestStepIntoPromise = function(obj, index, data){
		var currentArray = obj[index];
		return Q.promise(function(resolve, reject, notify){
			var definedData = {actions: currentArray.action};

			//good for passing back any defined data we need
			if(typeof data !== 'undefined'){
				definedData.data = data;
			}
			if(typeof _private.actions[currentArray.type] !== 'function'){
				return console.error(currentArray.type, 'does not exist as an ActionType, define it.')
			}

			return _private.actions[currentArray.type].apply(currentArray, [
				{next: resolve, updateStore: resolve, reject: reject, notify: notify},
				definedData
			]);
		});
	};

	/* QuestStepWalk Private Method
	 * @desc takes the quest action array, starting index (generally 0), and max amount of actions in the quest. It will recursively goes one by one throught he quest object until all steps are done. (called in Quest()).
	 * @Argument thisQuest (array) - array of all quest action objects
	 * @Argument index(number) - starting from 0 going up to max of the thisQuest array length
	 * @Argument maxKeys(number) - maximum amount of actions in the thisQuest array
	 * @return function
	*/
	_private.QuestStepWalk = function(thisQuest, index, maxKeys, data){

		return QuestStepIntoPromise(thisQuest, index, data).then(function(doneData){

			if(doneData && typeof doneData === 'object' && Object.keys(doneData).length > 0){
				_public.UpdateStore(doneData);
			}

			index++;

			if(index === parseInt(maxKeys) ){
				// Done with this quest check for done callbacks
				return typeof _private.doneCallbacks[name] === 'function' ? _private.doneCallbacks[name].call() : true;
			} else if(index < maxKeys){
				// recursively go through each quest step and wait for it to be done
				return _private.QuestStepWalk(thisQuest, index, maxKeys, data);
			}

		}).catch(function(err){
			// return any errors they pass into reject()
			console.error(err);
		}).done();

	};

	/* updateStore Public Method
	 * @desc Updates the store using object.assign
	 * @Argument data(object) - data to merge/update into store
	 * @return object
	*/
	this.UpdateStore = function(data){
		return Object.assign(_private.store, data);
	}

	/* NewQuest Public Method
	 * @Argument optsObject(object) - unique name of quest
	 * @Argument obj(array) - array of logic to fire when a quest is activated
	 * @return name (string) - to make it convinent to call a quest NewQuest returns its own name.
	*/
	this.NewQuest = function(optsObject, arr){
		if(!optsObject || !optsObject.name){console.error('name is required to create a new quest. {"name": "something"}')}
		if(!arr){console.error('quest object is required to create a new quest.')}

		var name = optsObject.name;

		if(optsObject.done && typeof optsObject.done === 'function'){ _private.doneCallbacks[name] = optsObject.done }

		_private.quests[name] = {};
		_private.quests[name] = arr;

		return name;
	}

	/* Quest Public Method
	 * @desc Takes the quest name and walks the quest actions until completed or a failure (failure is thrown by ActionType).
	 * @Argument name(string) - string matching the name of the quest you want to call.
	 * @Argument data(any) - data to pass through to your ActionType very good for updating fields based on events.
	 * @return function
	*/
	this.Quest = function(name, data){
		if(typeof _private.quests[name] === 'undefined'){
			return console.error('Quest: ', name, ' is not defined.');
		}

		var index = 0,
			thisQuest = _private.quests[name]
			questKeys = Object.keys(thisQuest),
			maxKeys = questKeys.length,
			QuestStepIntoPromise = _private.QuestStepIntoPromise;

		if(questKeys.length > 0 ){

			_private.QuestStepWalk(thisQuest, index, maxKeys, data);

		}else{
			console.warn('Your Quest: ', name, ' has no actions.')
		}
	}

	/* ActionType Public Method
	 * @desc Takes a name and function and sets that function to that name. Actions are essentially a model for how an action will be called in a quest.
	 * @Argument name(string) - name of the action
	 * @Argument func(function) - a function that will be called when a quest reaches this type of action
	 * @return void
	*/
	this.ActionType = function(name, func){
		return _private.actions[name] = func;
	}

	/* getStore Public Method
	 * @desc returns the Legend store
	 * @return object
	*/
	this.GetStore = function(){
		return _private.store;
	}

	this.private = _private;

};

module.exports = new Legend();
