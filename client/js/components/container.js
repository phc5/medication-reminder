/**
 * @summary med-container.js is the container that holds MedForm and MedList components. It 
 * is rendered in index.js.
 * 
 * @require react, med-list, med-form
 */
import React from 'react';
import MedList from './med-list'
import MedForm from './med-form'
import Login from './login-form'
import Signup from './signup-form'
import AboutUs from './about-us'
import ContactUs from './contact-us'

/**
 * MedContainer is a React Component that renders a MedForm Component and MedList
 * Component.
 */
class MedContainer extends React.Component {
	constructor(props) {
	    super(props);
	}
	render() {
		return (<div>
					<Login />
					<Signup />
					<AboutUs />
					<ContactUs />
					<MedForm />
					<MedList />
				</div>
		)
	}
}

export default MedContainer;