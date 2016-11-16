'use strict';

const {logger} = require('./utilities/logger');
const {sendEmail} = require('./emailer');

// For deployment on Hyper dev, these env vars are in `.env`.
// Never commit a `.env` file toto git
// because it's a place for storing sensitive config variables.
const {ALERT_FROM_EMAIL, ALERT_FROM_NAME, ALERT_TO_EMAIL} = process.env;
// we log some errors if these env vars aren't set
if (!(ALERT_FROM_EMAIL && ALERT_FROM_NAME && ALERT_TO_EMAIL)) {
  logger.error('Missing required config var in `.env`');
}

// this is a closure that creates a middleware function bound to `errorTypes`,
// which is an array of error objects. If the middleware encounters an 
// error of type in ErrorTypes it sends email alert
const makeEmailAlertMiddleware = (errorTypes) => (err, req, res, next) => {
  // if the `err` is one of the `errorTypes` we specified,
  // send an alert email
  if ((errorTypes).find(eType => err instanceof eType) !== undefined) {
    logger.info(`Attempting to send error alert email to ${ALERT_TO_EMAIL}`);
    const data = {
      'FromEmail': ALERT_FROM_EMAIL,
      'FromName': ALERT_FROM_NAME,
      'Subject': `SERVICE ALERT: ${err.name}`,
      'Text-part': `Something went wrong. Here's what we know: \n\n${err.message}\n\n${err.stack}`,
      'Recipients': [{'Email': ALERT_TO_EMAIL},]
    };
    sendEmail(data);
  }
  // this causes the error to be passed to additional middleware functions
  next(err);
};

module.exports = {makeEmailAlertMiddleware};
