import React from 'react';
import chai from 'chai';
chai.should();
import TestUtils from 'react-addons-test-utils';
import Login from '../../client/js/components/login-form';

describe('Login Form component', function() {
	var renderer, result;
	beforeEach(function() {
		renderer = TestUtils.createRenderer();
		renderer.render(<Login />);
		result = renderer.getRenderOutput();
	});

	it('Renders login form', function() {
		console.log("made it inside", result);
	});
});