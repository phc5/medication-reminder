/**
 * @summary med-container.js is the container that holds MedForm and MedList components. It 
 * is rendered in index.js.
 * 
 * @require react, med-list, med-form
 */
import React from 'react';
import MedList from './med-list'
import MedForm from './med-form'

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
					<MedForm />
					<MedList />
				</div>
		)
	}
}

export default MedContainer;