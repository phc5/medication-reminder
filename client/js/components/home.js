/**
 * @summary med-container.js is the container that holds MedForm and MedList components. It 
 * is rendered in index.js.
 * 
 * @require react, med-list, med-form
 */
import React from 'react';
import Login from './login-form'
import Signup from './signup-form'

/**
 * MedContainer is a React Component that renders a MedForm Component and MedList
 * Component.
 */
class Home extends React.Component {
	constructor(props) {
	    super(props);
	}
	render() {
		return (<div>
					<Login />
					<Signup />
				</div>
		)
	}
}

export default Home;