import React, { Component } from 'react';
import { ErrorAlert } from './Alert';

class NumberOfEvents extends Component {
  state = {
    numberOfEvents: 32,
    errorText: ''
  };

  handleInputChanged = (event) => {
    let number = event.target.value;
    if (number === '') { number = undefined };
    if (number <= 0 || number > 32) {
      this.setState({
        numberOfEvents: '',
        errorText: 'Enter number between 1 and 32',
      });
    } else {
      this.setState({
        numberOfEvents: number,
        errorText: ''
      });
      this.props.updateNumberOfEvents(number);
    }
  };

  render() {
    return (
      <div className='NumberOfEvents'>

        <ErrorAlert text={this.state.errorText} />

        <label>Specify number of events shown test</label>
        <br />
        <input
          type='number'
          value={this.state.numberOfEvents}
          placeholder='Number of events to show'
          className='numberOfEventsInput'
          onChange={this.handleInputChanged}
        />
      </div>
    );
  }
}


export default NumberOfEvents;