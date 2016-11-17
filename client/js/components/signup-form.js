/**
 * @summary signup-form.js will render a signup component.
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
	let signupSubmit = (event) => {
		event.preventDefault();
		dispatch(actions.signup(event.target.username.value, event.target.email.value, event.target.password.value));
		event.target.reset();
	}
	return {
		delClick,
		signupSubmit
	}
}

/**
 * Medicine is a React Component that renders a list item that contains the name of the medicine,
 * the days of the week, the time that the medicine should be taken, and a delete button.
 */
class SignUp extends Component {
	constructor(props) {
	    super(props);
	    this.handlers = createHandlers(this.props.dispatch);
	}
	render() {
		return (
		 	<form id="signupForm" onSubmit={this.handlers.signupSubmit}>
		      <div id="border-signup">
		      <h1>Sign Up</h1>
		        <input type="text" name="username" className="form-control input-sm" placeholder="Username" autoComplete="off" required/>
		        <input type="text" name="email" className="form-control input-sm" placeholder="Email Address" autoComplete="off" required/>
		        <input type="password" name="password" className="form-control input-sm" placeholder="Password" autoComplete="off" required/>
		        <input type="submit" value="Sign Up" className="btn btn-info btn-block"/>
		        <p>Already have an account? Click <a href="#/login">here</a> to login!</p>
		      </div>
		    </form>
		);
	}
}

let mapStateToProps = (state, props) => {
	return {
		signUpSuccess: state.signUpSuccess
	};
};

let Container = connect(mapStateToProps)(SignUp);
export default Container;