"use strict";

import wrapper from '../constants/wrapper';

const constants = [];

const requests = [
  "LOAD_ASSESSMENT",
  "ASSESSMENT_POST_ANALYTICS",
  "ASSESSMENT_POST_LTI_OUTCOME"
];

export const Constants = wrapper(constants, requests);

export const loadAssessment = (payload) => {
  return {
    type: Constants.LOAD_ASSESSMENT,
    payload
  };
};

export const assessmentPostAnalytics = (resultsId, userId='', contextId='') => ({
  type:Constants.ASSESSMENT_POST_ANALYTICS,
  resultsId,
  userId,
  contextId
});

export const assessmentPostLtiOutcome = (resultsId) => ({
  type:Constants.ASSESSMENT_POST_LTI_OUTCOME,
  resultsId,
});