import React from 'react';

class Medicine extends React.Component {
	constructor(props) {
	    super(props);
	    // Operations usually carried out in componentWillMount go here
	}
	render() {
		return (
			<li key={this.props.index}>
				<span>{this.props.medicine}&nbsp;</span>
				<span>Days of the Week&nbsp;</span>
				<span>Time&nbsp;</span>
				<button className="delete">Delete</button>
			</li>
		);
	}
}

export default Medicine;