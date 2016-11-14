import React from 'react';
import {connect} from 'react-redux';
import actions from '../actions/medication';

let createHandlers = (dispatch) => {
	let dayClick = (event) => {
		event.preventDefault();
		dispatch(actions.clickDay(event.target.name))
	}
	return {
		dayClick
	}
}


class MedForm extends React.Component {
	constructor(props) {
	    super(props);
	    this.handlers = createHandlers(this.props.dispatch);
	}
	render() {
		console.log(this.props.sunFlag);
		return <form>
					<input type="text" name="medication"/>&nbsp;
					<span>
						<button onClick={this.handlers.dayClick} name="Sunday">Sun</button>
						<button onClick={this.handlers.dayClick} name="Monday">Mon</button>
						<button onClick={this.handlers.dayClick} name="Tuesday">Tue</button>
						<button onClick={this.handlers.dayClick} name="Wednesday">Wed</button>
						<button onClick={this.handlers.dayClick} name="Thursday">Thu</button>
						<button onClick={this.handlers.dayClick} name="Friday">Fri</button>
						<button onClick={this.handlers.dayClick} name="Saturday">Sat</button>
					</span>&nbsp;
					<input type="time" name="Time"/>
					<input type="submit"/>
			   </form>
	}
}


let mapStateToProps = (state, props) => {
	return {
		sunFlag: state.sunFlag,
		monFlag: state.monFlag,
		tueFlag: state.tueFlag,
		wedFlag: state.wedFlag,
		thuFlag: state.thuFlag,
		friFlag: state.friFlag,
		satFlag: state.satFlag
	};
};

let Container = connect(mapStateToProps)(MedForm);
export default Container;