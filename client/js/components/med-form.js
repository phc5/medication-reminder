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
					<input type="text" name="medication"/>&nbsp;
					<span>
						<button>Sun</button>
						<button>Mon</button>
						<button>Tue</button>
						<button>Wed</button>
						<button>Thu</button>
						<button>Fri</button>
						<button>Sat</button>
					</span>&nbsp;
					<input type="time" name="Time"/>
					<input type="submit"/>
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