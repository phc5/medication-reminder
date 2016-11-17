/**
 * @summary login-form.js will render a login component.
 * 
 * @require react, react-redux, ../actions/medication.
 */
import React, {Component} from 'react';
import {connect} from 'react-redux';
import actions from '../actions/medication';

/**
 * createHandlers() will handle all the events that can occur on this component. There is one
 * event handler called delClick, which handles the click on the delete button.
 *
 * @params {function} dispatch - dispatches a payload to all registered callbacks
 * @return {object} handlers - the event handlers specified in this function.
 */
let createHandlers = (dispatch) => {
	/**
	 * delClick() will handle the clicking of the delete button. This will dispatch the 
	 * deleteButton actions which takes in the name of the medicine (event.target.name).
	 * 
	 * @params {object} event - the event that occurred.
	 */
	let delClick = (event) => {
		event.preventDefault();
		dispatch(actions.deleteButton(event.target.name));
	}
	let logInSubmit = (event) => {
		event.preventDefault();
		dispatch(actions.login(event.target.username.value, event.target.password.value));
	}
		return {
		delClick,
		logInSubmit
	}
}

/**
 * Medicine is a React Component that renders a list item that contains the name of the medicine,
 * the days of the week, the time that the medicine should be taken, and a delete button.
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
			        <p>Don't have an account? Click <a href="#/signup">here</a> to register!</p>
			    </div>
			 </form>
		);
	}
}

let mapStateToProps = (state, props) => {
	return {

	};
};

let Container = connect(mapStateToProps)(Login);
export default Container;