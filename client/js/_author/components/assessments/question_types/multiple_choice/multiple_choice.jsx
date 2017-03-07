import React          from 'react';
import _              from 'lodash';
import Option         from './multiple_choice_option';
import Add            from './add_option';
import Feedback       from '../question_common/single_feedback';
import types          from '../../../../../constants/question_types';

export default class MultipleChoice extends React.Component {
  static propTypes = {
    item: React.PropTypes.shape({
      bankId: React.PropTypes.string,
      answers: React.PropTypes.arrayOf(React.PropTypes.shape),
      id: React.PropTypes.string,
      type: React.PropTypes.string,
      multipleAnswer: React.PropTypes.string,
      question: React.PropTypes.shape({
        choices: React.PropTypes.shape({}),
      }),
    }).isRequired,
    updateItem: React.PropTypes.func.isRequired,
    updateChoice: React.PropTypes.func.isRequired,
    isActive: React.PropTypes.bool,
  };

  deleteChoice(choice) {
    if (confirm('Are you sure you want to delete this option?')) {
      this.props.updateItem({
        question: {
          choices: this.markedForDeletion(choice)
        }
      });
    }
  }

  moveChoice(choice, up) {
    const newChoices = _.cloneDeep(this.props.item.question.choices);
    const oldPosition = choice.order;
    const newPosition = up ? oldPosition - 1 : oldPosition + 1;
    const swapChoice = _.find(newChoices, { order: newPosition });

    newChoices[choice.id].order = newPosition;
    newChoices[swapChoice.id].order = oldPosition;

    this.props.updateItem({
      question: {
        choices: newChoices,
      }
    });
  }

  addNewChoice(id) {
    this.props.updateChoice(id, 'new', { id: 'new' });
  }

  getFeedback() {
    const { question, type } = this.props.item;

    if (type !== types.multipleChoice) {
      return (
        <div className="author--c-question__feedback">
          <Feedback
            updateItem={this.props.updateItem}
            feedbackType="correctFeedback"
            feedback={question.correctFeedback}
            labelText="Correct Feedback"
            bankId={this.props.item.bankId}
          />
          {type === types.reflection || type === types.multipleReflection ?
            null :
            <Feedback
              updateItem={this.props.updateItem}
              feedbackType="incorrectFeedback"
              feedback={question.incorrectFeedback}
              labelText="Incorrect Feedback"
              bankId={this.props.item.bankId}
            />
          }
        </div>
      );
    }

    return null;
  }

  markedForDeletion(choice) {
    const newChoices = _.cloneDeep(this.props.item.question.choices);
    newChoices[choice.id].delete = true;
    return newChoices;
  }

  render() {
    const { question, id, type } = this.props.item;
    return (
      <div className="author--c-question__answers author--c-question__answers--maintain">
        {
          _.map(_.orderBy(question.choices, 'order'), choice => (
            <Option
              key={`assessmentChoice_${choice.id}`}
              {...choice}
              itemType={type}
              multipleAnswer={_.get(question, 'multipleAnswer', false)}
              updateChoice={(newChoice, fileIds) => this.props.updateChoice(id, choice.id, newChoice, fileIds)}
              updateItem={() => this.props.updateItem({ question })}
              deleteChoice={() => this.deleteChoice(choice)}
              shuffle={question.shuffle}
              moveUp={() => this.moveChoice(choice, true)}
              moveDown={() => this.moveChoice(choice)}
              first={choice.order === 0}
              last={question ? choice.order === _.size(question.choices) - 1 : true}
              isActive={this.props.isActive}
              bankId={this.props.item.bankId}
              itemId={this.props.item.id}
              questionFileIds={question.fileIds}
            />
          ))
        }
        {
          this.props.isActive ? <Add
            updateChoice={() => this.addNewChoice(id)}
          /> : null
        }
        <div className="author--c-question__feedback">
          { this.getFeedback() }
        </div>
      </div>
    );
  }
}