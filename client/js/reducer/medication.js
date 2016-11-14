import actions from '../actions/medication';

const initialState = {
	medications: [],
	loading: false,
	error: null
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
	}

	return state;
};

exports.gameReducer = gameReducer;