import React from 'react';
import MedList from './med-list'
import MedForm from './med-form'
// import {connect} from 'react-redux';
// import actions from '../actions/cheese';

class MedContainer extends React.Component {
	constructor(props) {
	    super(props);
	    // Operations usually carried out in componentWillMount go here
	}
	render() {
		return (<div>
					<MedForm />
					<MedList meds={this.props.meds}/>
				</div>
		)
	}
}

// let mapStateToProps = (state, props) => {
// 	return {
// 		cheeses: state.cheeses
// 	};
// };

// let Container = connect(mapStateToProps)(CheeseList);
// module.exports = Container;

export default MedContainer;