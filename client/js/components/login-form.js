/**
 * @summary login-form.js will render a login component.
 * 
 * @require react, react-redux, ../actions/medication.
 */
import React, {Component} from 'react';
import {Router} from 'react-router';
import {connect} from 'react-redux';
import actions from '../actions/medication';

/**
 * createHandlers() will handle all the events that can occur on this component. There is one
 * event handler called logInSubmit, which handles the click on the submit button.
 *
 * @params {function} dispatch - dispatches a payload to all registered callbacks
 * @return {object} handlers - the event handlers specified in this function.
 */
let createHandlers = (dispatch) => {
	let logInSubmit = (event) => {
		event.preventDefault();
		dispatch(actions.login(event.target.username.value, event.target.password.value));
	}
		return {
		logInSubmit
	}
}

/**
 * Login is a React Component that renders a login form.
 */
class Login extends Component {
	constructor(props) {
	    super(props);
	    this.handlers = createHandlers(this.props.dispatch);
	}
	render() {
		return (
			<form id="loginForm" onSubmit={this.handlers.logInSubmit}>
			    <div id="border-form" className="form-group">
			    <h1>LOGIN</h1>
			        <input type="text" name="username" id="username" className="form-control input-sm" placeholder="Username" autoComplete="off" required/>
			        <input type="password" name="password" className="form-control input-sm" placeholder="Password" required/>
			        <input type="submit" value="Login" className="btn btn-info btn-block"/>
			        <p>No account? Click <a href="#/signup">here</a> to register!</p>
			    </div>
			 </form>
		);
	}
}

/**
 * mapStateToProps will map state to the props of this component.
 * 
 * @params {object} state - the state of the application taken from the store.
 * @params {object} props - the props of this component.
 */
let mapStateToProps = (state, props) => {
	return {

	};
};

let Container = connect(mapStateToProps)(Login);
export default Container;