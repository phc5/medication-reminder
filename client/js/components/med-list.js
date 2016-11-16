/**
 * @summary med-list.js will render an unordered list of all the medicine that is in the props. 
 * First, map the state to the props to receive the list of medication and then map through 
 * this.props.meds and create a Medicine component for each med in this.props.meds. 
 * 
 * @require react, react-redux, ./medicine.
 */
import React from 'react';
import {connect} from 'react-redux';
import Medicine from './medicine';
// import actions from '../actions/medication';

/**
 * MedList is a React Component that renders an unordered list of Medicine components based on
 * the number of medicines in this.props.med (which is mapped from state.medications).
 */
class MedList extends React.Component {
	constructor(props) {
	    super(props);
	}
	render() {
		let array = this.props.meds.map((med, index) => {
			return (<Medicine key={index} medicine={med[0]} days={med[1]} time={med[2]} />);
		});
		return <div>
				 <table>
				 	<thead>
				 		<tr>
				 			<th>Name</th>
				 			<th>Days</th>
				 			<th>Time</th>
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
		meds: state.medications
	};
};

let Container = connect(mapStateToProps)(MedList);
export default Container;