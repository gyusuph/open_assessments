import Immutable from 'immutable';
import { createSelector } from "reselect";

import { getItems, loadOutcomes } from "./qti";

export const questionsPerSection = (state, props) => state.settings.get('questions_per_section');
export const assessment             = (state, props) => state.assessment;
export const shuffleQuestionAnswers = (state, props) => state.settings.get('shuffle_question_answers');

// Memoized selectors. These selectors transform state. Since the transformation might be
// expensive the results are memoized. The transform function will only be called if the
// input selectors change.

export const sections = createSelector(
  [ assessment ],
  (assessment) => assessment.get('sections')
);

export const questions = createSelector(
  [ sections, questionsPerSection ],
  (sections, questionsPerSection) => getItems(
    sections.toJS(),
    null, // Return all of the sections 
    shuffleQuestionAnswers
  )
);

export const outcomes = createSelector(
  [ sections ],
  (sections) => loadOutcomes(sections)
);

export const questionCount = createSelector(
  [ questions ],
  (questions) => questions.length
);
