/**
 * @summary signup-form.js will render a signup component.
 * 
 * @require react, react-redux, ../actions/medication.
 */
import React from 'react';
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
	return {
		delClick
	}
}

/**
 * Medicine is a React Component that renders a list item that contains the name of the medicine,
 * the days of the week, the time that the medicine should be taken, and a delete button.
 */
class SignUp extends React.Component {
	constructor(props) {
	    super(props);
	    this.handlers = createHandlers(this.props.dispatch);
	}
	render() {
		return (
			 <form id="signupForm">
		      <div id="border-signup">
		      <h1>Sign Up</h1>
		        <input type="text" name="firstname" value="" className="form-control input-sm" placeholder="First Name"  />
		        <input type="text" name="lastname" value="" className="form-control input-sm" placeholder="Last Name"  />
		        <input type="text" name="username" value="" className="form-control input-sm" placeholder="Username"  />
		        <input type="text" name="email" value="" className="form-control input-sm" placeholder="Email Address"  />
		        <input type="password" name="password" value="" className="form-control input-sm" placeholder="Password"  />
		        <input type="password" name="confirm_password" value="" className="form-control input-sm" placeholder="Confirm Password"  />
		        <label><input type="checkbox" name="terms"/> I agree with the <a href="#">Terms and Conditions</a>.</label>
		        <input type="submit" value="Sign Up" className="btn btn-info btn-block"/>
		      </div>
		    </form>
		);
	}
}

export default SignUp;