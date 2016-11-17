/**
 * @summary medication.js specifies how the application's state will change in response to an 
 * action. The reducer has to be pure meaning it should calculate the next state and return it. 
 * It shouldn't mutate the state.
 * 
 */

import actions from '../actions/medication';

const initialState = {
	medications: [],
	loading: false,
	error: null, 
	sunFlag: false,
	monFlag: false,
	tueFlag: false,
	wedFlag: false,
	thuFlag: false,
	friFlag: false,
	satFlag: false,
	username: null
}

/** 
 * getNextDayOfWeek() will get the next day of the week based on the date parameter and
 * the dayOfWeek parameter. 
 *
 * @param {date} date - A date in Date format.
 * @param {number} dayOfWeek - A number, 0-6, that represents a day of the week.
 * @return {date} date - A date in Date format.
 */
const getNextDayOfWeek = (date, dayOfWeek) => {
	date = new Date(date.getTime());
	date.setDate(date.getDate() + (dayOfWeek + 7 - date.getDay()) % 7);
	return date;
}

/** 
 * parseTime() parse the time based on ":". So 10:00:00 will equal ["10", "00", "00"]
 *
 * @param {string} time - A time in **:** or **:**:** format.
 * @return {array} timeArray - An array of strings.
 */
const parseTime = (time) => {
	time = time + ":00";
	let timeArray = time.split(":");
	return timeArray;
}

/** 
 * newDay() will take a time, in **:** format, and a number and convert the time into
 * UNIX format.
 *
 * @param {string} actionTime - The time that is in our action.
 * @param {number} dayNum - A number, 0-6, that represents a day of the week.
 * @return {UNIX time} newDate.getTime() - A date in UNIX format.
 */
const newDay = (actionTime, dayNum) => {
	let date = getNextDayOfWeek(new Date() , dayNum);
	let time = parseTime(actionTime);
	let newDate = new Date(date.getFullYear(), date.getMonth(), date.getDate(), time[0], time[1], time[2]);
	return newDate.getTime();
}

/**
 * gameReducer() handles state changes for all actions that occur.
 * 
 * @param {object} state - The state of the application.
 * @param {object} action - An action that occurs.
 * @return {object} state - The state of the application after an action occurs.
 */
const gameReducer = (state, action) => {
	let copyState = state || initialState;
	state = Object.assign({}, copyState);

	if (action.type === actions.FETCH_MEDICATION_REQUEST) {
		state.loading = true;
	} else if (action.type === actions.FETCH_MEDICATION_SUCCESS) {
		state.loading = false;
		state.error = null;
		state.medications = action.medications;
	} else if (action.type === actions.FETCH_MEDICATION_ERROR) {
		state.loading = false;
		state.error = action.error;
	} else if (action.type === actions.CLICK_DAY) {
		switch(action.day) {
			case "Sunday":
				state.sunFlag = !state.sunFlag;
				break;
			case "Monday":
				state.monFlag = !state.monFlag;
				break;
			case "Tuesday":
				state.tueFlag = !state.tueFlag;
				break;
			case "Wednesday":
				state.wedFlag = !state.wedFlag;
				break;
			case "Thursday":
				state.thuFlag = !state.thuFlag;
				break;
			case "Friday":
				state.friFlag = !state.friFlag;
				break;
			case "Saturday":
				state.satFlag = !state.satFlag;
				break;
		}
	} else if (action.type === actions.SUBMIT_FORM) {
		let days = [];
		let dayNum = [];
		let dayUnix = [];
		let date, newDate, time;
		
		if (!state.sunFlag && !state.monFlag && !state.tueFlag && !state.wedFlag && !state.thuFlag && !state.friFlag && !state.satFlag) {
			alert("Please select at least one day");
		} else {
			if (state.sunFlag) {
				days.push("Sun");
				dayNum.push(0);
				dayUnix.push(newDay(action.time, 0));
				state.sunFlag = false;
			}
			if (state.monFlag) {
				days.push("Mon");
				dayNum.push(1);
				dayUnix.push(newDay(action.time, 1));
				state.monFlag = false;
			}
			if (state.tueFlag) {
				days.push("Tue");
				dayNum.push(2);
				dayUnix.push(newDay(action.time, 2));
				state.tueFlag = false;
			}
			if (state.wedFlag) {
				days.push("Wed");
				dayNum.push(3);
				dayUnix.push(newDay(action.time, 3));
				state.wedFlag = false;
			}
			if (state.thuFlag) {
				days.push("Thu");
				dayNum.push(4);
				dayUnix.push(newDay(action.time, 4));
				state.thuFlag = false;
			}
			if (state.friFlag) {
				days.push("Fri");
				dayNum.push(5);
				dayUnix.push(newDay(action.time, 5));
				state.friFlag = false;
			}
			if (state.satFlag) {
				days.push("Sat");
				dayNum.push(6);
				dayUnix.push(newDay(action.time, 6));
				state.satFlag = false;
			}
			state.medications = state.medications.concat([[action.medication, days, action.time, dayNum, dayUnix]]);
		}
		console.log(state.medications);
	} else if (action.type === actions.DELETE_BUTTON) {
		state.medications = state.medications.filter(med => med[0] != action.medication);
	} else if (action.type === actions.LOGIN_SUCCESS) {
		state.username = state.username.concat(action.username);
	}

	return state;
};

exports.gameReducer = gameReducer;