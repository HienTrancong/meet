import React, { Component } from 'react';

class Event extends Component {
  state = {
    showDetail: false,
  };

  handleButtonClicked = () => {
    this.setState({ showDetail: !this.state.showDetail });
  }

  render() {

    const { event } = this.props;
    const { showDetail } = this.state;
    console.log(event.description);
    console.log(this.state);
    return (
      <div className='event'>
        <h4 className='summary'>{event.summary}</h4>
        <p className='location'>{event.location}</p>
        <p className='startTime'>{event.start.dateTime}</p>
        <p className='endTime'>{event.end.dateTime}</p>

        <button className={`buttonDetail ${showDetail ? "expanded" : "collapsed"}EventDetail`}
          onClick={() => this.handleButtonClicked()}
        >{showDetail ? 'Show Details' : 'Hide Details'}
        </button>

        {
          showDetail && (
            <div className='eventDetail'>
              <p className='description'>{event.description}</p>
            </div>
          )
        }
      </div>
    );
  }
}

export default Event;