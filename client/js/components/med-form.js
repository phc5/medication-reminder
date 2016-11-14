import React from 'react';
// import {connect} from 'react-redux';
// import actions from '../actions/cheese';

class MedForm extends React.Component {
	constructor(props) {
	    super(props);
	    // Operations usually carried out in componentWillMount go here
	}
	render() {
		return <form>
					<input type="text" name="medication"/>
					<input type="text" name="days"/>
					<input type="text" name="Time"/>
				</form>
	}
}

// let mapStateToProps = (state, props) => {
// 	return {
// 		cheeses: state.cheeses
// 	};
// };

// let Container = connect(mapStateToProps)(CheeseList);
// module.exports = Container;

export default MedForm;