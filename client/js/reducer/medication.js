import actions from '../actions/medication';

const initialState = {
	medications: [["test", "Mon Wed Fri", "8:00 PM"], ["state", "Tue Thurs", "1:00 PM"], ["now", "Sun Sat", "10:00 AM"]],
	loading: false,
	error: null, 
	sunFlag: false,
	monFlag: false,
	tueFlag: false,
	wedFlag: false,
	thuFlag: false,
	friFlag: false,
	satFlag: false
}

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
		console.log("Before push : " + state.medications);
		let days = [];
		if (state.sunFlag) {
			days.push("Sun");
			state.sunFlag = false;
		}
		if (state.monFlag) {
			days.push("Mon");
			state.monFlag = false;
		}
		if (state.tueFlag) {
			days.push("Tue");
			state.tueFlag = false;
		}
		if (state.wedFlag) {
			days.push("Wed");
			state.wedFlag = false;
		}
		if (state.thuFlag) {
			days.push("Thu");
			state.thuFlag = false;
		}
		if (state.friFlag) {
			days.push("Fri");
			state.friFlag = false;
		}
		if (state.satFlag) {
			days.push("Sat");
			state.satFlag = false;
		}
		state.medications = state.medications.concat([[action.medication, days, action.time]]);
	} else if (action.type === actions.DELETE_BUTTON) {
		state.medications = state.medications.filter(med => med[0] != action.medication);
	}

	return state;
};

exports.gameReducer = gameReducer;