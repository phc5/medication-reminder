/**
 * @summary medicine.js will render a list item with the name of the medicine, the days of 
 * the week needed, the time, and a delete button. 
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
class Medicine extends React.Component {
	constructor(props) {
	    super(props);
	    this.handlers = createHandlers(this.props.dispatch);
	}
	render() {
		return (
			<li>
				<span>{this.props.medicine}&nbsp;</span>
				<span>{this.props.days}&nbsp;</span>
				<span>{this.props.time}&nbsp;</span>
				<button name={this.props.medicine} className="delete" onClick={this.handlers.delClick}>Delete</button>
			</li>
		);
	}
}

export default Medicine;