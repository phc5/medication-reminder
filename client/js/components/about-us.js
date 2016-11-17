/**
 * @summary about-us.js will render a About Us component.
 * 
 * @require react, react-redux, ../actions/medication.
 */
import React, {Component} from 'react';
import {connect} from 'react-redux';
import actions from '../actions/medication';

/**
 * createHandlers() will handle all the events that can occur on this component. There is one
 * event handler called delClick, which handles the click on the delete button.
 *
 * @params {function} dispatch - dispatches a payload to all registered callbacks
 * @return {object} handlers - the event handlers specified in this function.
 */
let createHandlers = (dispatch) => {
  /**
   * delClick() will handle the clicking of the delete button. This will dispatch the 
   * deleteButton actions which takes in the name of the medicine (event.target.name).
   * 
   * @params {object} event - the event that occurred.
   */
  let delClick = (event) => {
    event.preventDefault();
    dispatch(actions.deleteButton(event.target.name));
  }
  return {
    delClick
  }
}

/**
 * Medicine is a React Component that renders a list item that contains the name of the medicine,
 * the days of the week, the time that the medicine should be taken, and a delete button.
 */
class AboutUs extends Component {
  constructor(props) {
      super(props);
      this.handlers = createHandlers(this.props.dispatch);
  }
  render() {
    return (
      <div id="profile">
        <div className="content">
          <h3>What is this about?</h3>
          <div>
            <p>Let's be honest, there are times when you accidentally forget to take your medication.  I know I have.  This app is designed to make our lives easier by setting a reminder to take all of your medications at any given time.  It also keeps the medication list handy where you can take it to your doctor's appointment and won't have to memorize any names that are difficult to pronouce.  If you fill that you can benefit from this, look no further, just click on Sign Up and let's get started</p>
            <button className="closeButton">Close</button>
          </div>
        </div>
      </div>
    );
  }
}

export default AboutUs;