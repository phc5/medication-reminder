import React from 'react';
import {connect} from 'react-redux';
import actions from '../actions/medication';

let createHandlers = (dispatch) => {
	let dayClick = (event) => {
		event.preventDefault();
		dispatch(actions.clickDay(event.target.name));
	}
	let formSubmit = (event) => {
		event.preventDefault();
		dispatch(actions.submitForm(event.target.medication.value));
	}
	return {
		dayClick,
		formSubmit
	}
}


class MedForm extends React.Component {
	constructor(props) {
	    super(props);
	    this.handlers = createHandlers(this.props.dispatch);
	}
	render() {
		let sunClass = this.props.sunFlag ? 'highlight' : 'base';
		let monClass = this.props.monFlag ? 'highlight' : 'base';
		let tueClass = this.props.tueFlag ? 'highlight' : 'base';
		let wedClass = this.props.wedFlag ? 'highlight' : 'base';
		let thuClass = this.props.thuFlag ? 'highlight' : 'base';
		let friClass = this.props.friFlag ? 'highlight' : 'base';
		let satClass = this.props.satFlag ? 'highlight' : 'base';
		return <form onSubmit={this.handlers.formSubmit} autoComplete="off">
					<input type="text" name="medication"/>&nbsp;
					<span>
						<button type="button" className={sunClass} onClick={this.handlers.dayClick} name="Sunday">Sun</button>
						<button type="button" className={monClass} onClick={this.handlers.dayClick} name="Monday">Mon</button>
						<button type="button" className={tueClass} onClick={this.handlers.dayClick} name="Tuesday">Tue</button>
						<button type="button"className={wedClass} onClick={this.handlers.dayClick} name="Wednesday">Wed</button>
						<button type="button" className={thuClass} onClick={this.handlers.dayClick} name="Thursday">Thu</button>
						<button type="button" className={friClass} onClick={this.handlers.dayClick} name="Friday">Fri</button>
						<button type="button" className={satClass} onClick={this.handlers.dayClick} name="Saturday">Sat</button>
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
		satFlag: state.satFlag,
	};
};

let Container = connect(mapStateToProps)(MedForm);
export default Container;