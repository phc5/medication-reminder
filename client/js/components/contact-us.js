/**
 * @summary login-form.js will render a div.
 * 
 * @require react, react-redux, ../actions/medication.
 */
import React, {Component} from 'react';
import {connect} from 'react-redux';
import actions from '../actions/medication';
/**
 * ContactUs is a React Component that renders a div with information on how to contact the creators of this application.
 */
class ContactUs extends Component {
	constructor(props) {
	    super(props);
	}
	render() {
		return (
		    <div className="form-group contact">
		      <p>If you have any questions, please contact us at medi_reminder@example.com</p>
		    </div>
		);
	}
}

export default ContactUs;