import React, { Component } from 'react';

class NumberOfEvents extends Component {
  state = { numberOfEvents: 32 };

  handleInputChanged = (event) => {
    const value = event.target.value;
    this.setState({ numberOfEvents: value });
  }


  render() {
    const { numberOfEvents } = this.state;
    return (
      <div className='numberOfEvents'>
        <label>Specify number of events shown</label>
        <input
          type='number'
          value={numberOfEvents}
          onChange={this.handleInputChanged}
          className='numberOfEvents__Input'
        />
      </div>
    );
  }
}


export default NumberOfEvents;