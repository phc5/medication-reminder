/**
 * @summary med-list.js will render an unordered list of all the medicine that is in the props. 
 * First, map the state to the props to receive the list of medication and then map through 
 * this.props.meds and create a Medicine component for each med in this.props.meds. 
 * 
 * @require react, react-redux, ./medicine.
 */
import React, {Component}from 'react';
import {connect} from 'react-redux';
import Medicine from './medicine';
import actions from '../actions/medication';

const changeToAMPM = (time) => {
	time = time.split(':'); // convert to array

	// fetch
	var hours = Number(time[0]);
	var minutes = Number(time[1]);

	// calculate
	var timeValue = "" + ((hours >12) ? hours - 12 : hours);  // get hours
	timeValue += (minutes < 10) ? ":0" + minutes : ":" + minutes;  // get minutes
	timeValue += (hours >= 12) ? " P.M." : " A.M.";  // get AM/PM
	return timeValue;
}

/**
 * MedList is a React Component that renders an unordered list of Medicine components based on
 * the number of medicines in this.props.med (which is mapped from state.medications).
 */
class MedList extends Component {
	constructor(props) {
	    super(props);
	}
	componentDidMount() {
		this.props.dispatch(actions.fetchMedications(this.props.username, this.props.password));
	}
	render() {
		let array = this.props.meds.map((med, index) => {
			let time = changeToAMPM(med[2]);
			return (<Medicine key={index} medicine={med[0]} days={med[1]} time={time} />);
		});
		return <div>
				 <table>
				 	<thead>
				 		<tr>
				 			<th>Name</th>
				 			<th>Days</th>
				 			<th>Time</th>
				 			<th></th>
				 		</tr>
				 	</thead>
				 	<tbody>
				 		{array}
				 	</tbody>
				 </table>
			   </div>	
	}
}

/**
 * mapStateToProps will map the state.medications to the components meds prop.
 * 
 * @params {object} state - the state of the application taken from the store.
 * @params {object} props - the props of this component.
 */
let mapStateToProps = (state, props) => {
	return {
		meds: state.medications,
		sunFlag: state.sunFlag,
		monFlag: state.monFlag,
		tueFlag: state.tueFlag,
		wedFlag: state.wedFlag,
		thuFlag: state.thuFlag,
		friFlag: state.friFlag,
		satFlag: state.satFlag,
		username: state.username,
		password: state.password
	};
};

let Container = connect(mapStateToProps)(MedList);
export default Container;

