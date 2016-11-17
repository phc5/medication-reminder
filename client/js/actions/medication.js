/**
 * @summary medication.js holds all the actions that occur in the application. Actions are 
 * payloads of information that send data from the application to the store and are
 * the only source of information for the store. 
 *
 */

import fetch from 'isomorphic-fetch';

/**
 * clickDay() handles the user clicks on a day button in med-form.
 * 
 * @param {string} day - The name of the day
 */
const CLICK_DAY = "CLICK_DAY";
const clickDay = (day) => {
	return {
		type: CLICK_DAY,
		day: day
	};
};

/**
 * submitForm() handles the user submit on the med-form.
 * 
 * @param {string} med - The name of the medicine.
 * @param {string} time - The time filled out in the form.
 * @return {object} action - The action and its properties.
 */
const SUBMIT_FORM = "SUBMIT_FORM";
const submitForm = (med, time) => {
	return {
		type: SUBMIT_FORM,
		medication: med,
		time: time
	}
}

/**
 * deleteButton() handles the user clicks on the delete button.
 * 
 * @param {string} med - The name of the medicine.
 * @return {object} action - The action and its properties.
 */
const DELETE_BUTTON = "DELETE_BUTTON";
const deleteButton = (med) => {
	return {
		type: DELETE_BUTTON,
		medication: med
	}
}

/**
 * fetchMedicationRequest()
 * 
 * @return {object} action - The action and its properties.
 */
const FETCH_MEDICATION_REQUEST = "FETCH_MEDICATION_REQUEST";
const fetchMedicationRequest = () => {
	return {
		type: FETCH_MEDIATION_REQUEST
	};
};

/**
 * fetchMedicationSuccess() handles if fetchMediation succeeded
 * 
 * @param {array} medications - An array of medications [name, days, time].
 * @return {object} action - The action and its properties.
 */
const FETCH_MEDICATION_SUCCESS = "FETCH_MEDICATION_SUCCESS";
const fetchMedicationSuccess = (medications) => {
	return {
		type: FETCH_MEDICATION_SUCCESS,
		medications: medications
	};
};

/**
 * fetchMedicationError() handles if fetchMediation fails
 * 
 * @param {string} error - An error that occurred.
 * @return {object} action - The action and its properties.
 */
const FETCH_MEDICATION_ERROR = "FETCH_MEDICATION_ERROR";
const fetchMedicationError = (error) => {
	return {
		type: FETCH_MEDICATION_ERROR,
		error: error
	};
};

const LOGIN_SUCCESS = "LOGIN_SUCCESS";
const loginSuccess = (username) => {
	return {
		type: LOGIN_SUCCESS,
		username: username
	};
};

const LOGIN_ERROR = "LOGIN_ERROR";
const loginError = (error) => {
	return {
		type: LOGIN_ERROR,
		error: error
	};
};

const SIGNUP_SUCCESS = "SIGNUP_SUCCESS";
const signupSuccess = (username) => {
	return {
		type: SIGNUP_SUCCESS,
		username: username
	};
};

const SIGNUP_ERROR = "SIGNUP_ERROR";
const signupError = (error) => {
	return {
		type: SIGNUP_ERROR,
		error: error
	};
};


/**
 * fetchMedications() fetches the medications of a user.
 * 
 * @return {object} action - The action and its properties.
 */
const fetchMedications = (username) => {
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

const login = (username, password) => {
	return (dispatch) => {
		const url = '/medication';
		let enUserPass = btoa(username + ":" + password);
		return fetch(url, {
			method: 'GET',
			headers: {'Accept':'application/json', Authorization: 'Basic ' + enUserPass} 
		})
		.then((res) => {
			if (res.status < 200 || res.status >= 300) {
				const error = new Error(res.statusText);
				error.res = res;
				throw error;
			}
			return res.json();	
		})
		.then((data) => {
			window.location.replace('http://localhost:8080/#/profile');
			return dispatch(loginSuccess(username));
		})
		.catch((error) => {
			console.log(error);
			return dispatch(loginError(error)); // TODO: SET_NOTIFICATION type, 
		});
	}
}

const signup = (username, email, password) => {
	return (dispatch) => {
		const url = '/user';
		const req = {username, email, password};
		return fetch(url, {
			method: 'POST',
			body: JSON.stringify(req),
			headers: {'content-type': 'application/json', 'Accept':'application/json'}
		})
		.then((res) => {
			if (res.status < 200 || res.status >= 300) {
				const error = new Error(res.statusText);
				error.res = res;
				throw error;
			}
			return res.json();
		})
		.then((data) => {
			wind.location.replace('http://localhost:8080/#/login');
			return dispatch(signupSuccess(data));
		})
		.catch((error) => {
			return dispatch(signupError());
		});
	}
}

const submitMed = (name, time) => {
	return (dispatch) => {
		let state = submitForm(name, time);
		console.log(state);
		const url = '/medication';
		const req = {name};
		return fetch(url, {
			method: 'POST',
			body: JSON.stringify(req),
			headers: {'content-type': 'application/json', 'Accept':'application/json'}
		})
		.then((res) => {
			if (res.status < 200 || res.status >= 300) {
				const error = new Error(res.statusText);
				error.res = res;
				throw error;
			}
			return res.json();
		})
		.then((data) => {
			wind.location.replace('http://localhost:8080/#/login');
			return dispatch(signupSuccess(data));
		})
		.catch((error) => {
			return dispatch(signupError());
		});
	}
}

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

exports.LOGIN_SUCCESS = LOGIN_SUCCESS;
exports.loginSuccess = loginSuccess

exports.LOGIN_ERROR = LOGIN_ERROR;
exports.loginError = loginError

exports.SIGNUP_SUCCESS = SIGNUP_SUCCESS;
exports.signupSuccess = signupSuccess

exports.SIGNUP_ERROR = SIGNUP_ERROR;
exports.signupError = signupError

exports.fetchMedications = fetchMedications
exports.login = login
exports.signup = signup
exports.submitMed = submitMed