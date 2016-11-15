import fetch from 'isomorphic-fetch';

const CLICK_DAY = "CLICK_DAY";
const clickDay = (day) => {
	return {
		type: CLICK_DAY,
		day: day
	};
};

const SUBMIT_FORM = "SUBMIT_FORM";
const submitForm = (med) => {
	return {
		type: SUBMIT_FORM,
		medications: med
	}
}

const DELETE_BUTTON = "DELETE_BUTTON";
const deleteButton = () => {
	return {
		type: DELETE_BUTTON
	}
}

const FETCH_MEDICATION_REQUEST = "FETCH_MEDICATION_REQUEST";
const fetchMedicationRequest = () => {
	return {
		type: FETCH_MEDIATION_REQUEST
	};
};

const FETCH_MEDICATION_SUCCESS = "FETCH_MEDICATION_SUCCESS";
const fetchMedicationSuccess = (medications) => {
	return {
		type: FETCH_MEDICATION_SUCCESS,
		medications: medications
	};
};

const FETCH_MEDICATION_ERROR = "FETCH_MEDICATION_ERROR";
const fetchMedicationError = (error) => {
	return {
		type: FETCH_MEDICATION_ERROR,
		error: error
	};
};

const fetchMedications = () => {
	return (dispatch) => {
		var url = '/medication';
		dispatch(fetchMedicationRequest());
		return fetch(url).then((response) => {
			if (response.status < 200 || response.status >= 300) {
				let error = new Error(response.statusText);
				error.response = response;
				throw error;
			}
			return response.json();
		})
		.then((data) => {
			return dispatch(fetchMedicationSuccess(data));
		})
		.catch((error) => {
			return dispatch(fetchMedicationError(error));
		});
	}
};

exports.CLICK_DAY = CLICK_DAY
exports.clickDay = clickDay

exports.SUBMIT_FORM = SUBMIT_FORM
exports.submitForm = submitForm

exports.DELETE_BUTTON = DELETE_BUTTON
exports.deleteButton = deleteButton

exports.FETCH_MEDICATION_REQUEST = FETCH_MEDICATION_REQUEST
exports.fetchMedicationRequest = fetchMedicationRequest

exports.FETCH_MEDICATION_SUCCESS = FETCH_MEDICATION_SUCCESS
exports.fetchMedicationSuccess = fetchMedicationSuccess

exports.FETCH_MEDICATION_ERROR = FETCH_MEDICATION_ERROR
exports.fetchMedicationError = fetchMedicationError

exports.fetchMedications