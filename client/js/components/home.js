/**
 * @summary med-container.js is the container that holds MedForm and MedList components. It 
 * is rendered in index.js.
 * 
 * @require react, med-list, med-form
 */
import React, {Component} from 'react';
import Login from './login-form'

/**
 * MedContainer is a React Component that renders a MedForm Component and MedList
 * Component.
 */
class Home extends Component {
	constructor(props) {
	    super(props);
	}
	render() {
		return (<div>
					<Login />
				</div>
		)
	}
}

export default Home;