import React, { Component } from 'react';

class NumberOfEvents extends Component {
  state = {
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
      this.props.updateNumberOfEvents(number);
      this.setState({
        errorText: ''
      });
    }
  };

  render() {
    return (
      <div className='NumberOfEvents'>
        <label>Specify number of events shown test</label>
        <br />
        <input
          type='number'
          placeholder='Number of events to show'
          className='numberOfEventsInput'
          onChange={this.handleInputChanged}
        />
      </div>
    );
  }
}


export default NumberOfEvents;