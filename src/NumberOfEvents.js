import React, { Component } from 'react';
import { ErrorAlert } from './Alert';

class NumberOfEvents extends Component {
  state = {
    numberOfEvents: 32,
    errorText: ''
  };

  handleInputChanged = (event) => {
    // let number = event.target.value;
    const value = event.target.value;
    this.props.updateEvents(null, value);
    this.setState({ numberOfEvents: value });
    if (value < 1 || value > 32) {
      this.setState({
        errorText: 'Enter number between 1 and 32',
      });
    } else {
      this.setState({
        errorText: '',
      });
    }
    // if (number === '') { number = undefined };
    // if (number <= 0 || number > 32) {
    //   this.setState({
    //     numberOfEvents: '',
    //     errorText: 'Enter number between 1 and 32',
    //   });
    // } else {
    //   this.setState({
    //     numberOfEvents: number,
    //     errorText: ''
    //   });
    //   this.props.updateNumberOfEvents(number);
    // }
  };

  render() {
    const { numberOfEvents } = this.state;
    return (
      <div className='NumberOfEvents'>
        <label>Specify number of events shown test</label>
        <br />
        <input
          type="text"
          value={numberOfEvents}
          id="numberOfEvents__input"
          onChange={this.handleInputChanged}
        />
        <ErrorAlert text={this.state.errorText} />
      </div>
    );
  }
}


export default NumberOfEvents;