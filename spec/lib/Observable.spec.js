describe('Observable', function() {
	var obj;

	beforeEach(function() {
		obj = {};
		_.extend(obj, L7.Observable);
	});

	it('should add listeners with on', function() {
		var eventName = 'testevent';
		var scope = {};
		var handler = function() {};
		obj.on(eventName, handler, scope);

		expect(obj._listeners).toBeDefined();
		expect(obj._listeners[eventName].length).toBe(1);
		expect(obj._listeners[eventName][0].handler).toEqual(handler);
		expect(obj._listeners[eventName][0].scope).toEqual(scope);
	});

	it('should invoke the handler on fireEvent', function() {
		var listener = {
			handler: function() {}
		};

		spyOn(listener, 'handler');

		obj.on('foo', listener.handler, listener);

		obj.fireEvent('foo');

		expect(listener.handler).toHaveBeenCalled();
	});

	it('should pass parameters to the handler', function() {
		var arg = 'eventArg';
		var listener = {
			handler: function() {}
		};

		spyOn(listener, 'handler');

		obj.on('foo', listener.handler, listener);

		obj.fireEvent('foo', arg);

		expect(listener.handler).toHaveBeenCalledWith(arg);
	});
});

