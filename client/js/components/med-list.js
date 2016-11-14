import React from 'react';
import {connect} from 'react-redux';
// import actions from '../actions/medication';

class MedList extends React.Component {
	constructor(props) {
	    super(props);
	    // Operations usually carried out in componentWillMount go here
	}
	render() {
		let array = this.props.meds.map((med, index) => {
			return (
				<li key={index}>
					<span>{med}&nbsp;</span>
					<span>Days of the Week&nbsp;</span>
					<span>Time&nbsp;</span>
					<button className="delete">Delete</button>
				</li>
			);
		});
		return <div><ul>{array}</ul></div>
	}
}

let mapStateToProps = (state, props) => {
	return {
		meds: state.medications
	};
};

let Container = connect(mapStateToProps)(MedList);

export default Container;