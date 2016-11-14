import actions from '../actions/medication';

const initialState = {
	medications: ["test", "state", "now"],
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
	}

	return state;
};

exports.gameReducer = gameReducer;