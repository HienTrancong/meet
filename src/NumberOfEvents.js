import React, { Component } from 'react';

class NumberOfEvents extends Component {
  state = { numberOfEvents: 32 };

  handleInputChanged = (event) => {
    const number = event.target.value;
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
    }
    this.props.updateNumberOfEvents(number);
  };


  render() {
    return (
      <div className='NumberOfEvents'>
        <label>Specify number of events shown test</label>
        <input
          type="number"
          value={this.state.numberOfEvents}
          onChange={this.handleInputChanged}
          className="numberOfEventsInput"
        />
      </div>
    );
  }
}


export default NumberOfEvents;