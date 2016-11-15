import React from 'react';
import {connect} from 'react-redux';
import Medicine from './medicine';
// import actions from '../actions/medication';

class MedList extends React.Component {
	constructor(props) {
	    super(props);
	    // Operations usually carried out in componentWillMount go here
	}
	render() {
		let array = this.props.meds.map((med, index) => {
			return (<Medicine key={index} medicine={med[0]} days={med[1]} time={med[2]} />);
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