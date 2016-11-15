import React from 'react';
import {connect} from 'react-redux';
import actions from '../actions/medication';

let createHandlers = (dispatch) => {
	let delClick = (event) => {
		event.preventDefault();
		dispatch(actions.deleteButton(event.target.name));
	}
	return {
		delClick
	}
}

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

let mapStateToProps = (state, props) => {
	return {
		//something here
	}
}

let Container = connect(mapStateToProps)(Medicine);

export default Container;