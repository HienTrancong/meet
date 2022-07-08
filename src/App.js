import React, { Component } from 'react';

//Import style sheets
import './App.css';
import './nprogress.css';

//Import children components
import EventList from './EventList';
import CitySearch from './CitySearch';
import NumberOfEvents from './NumberOfEvents';
import WelcomeScreen from './WelcomeScreen';

//Import api functions to extract locations and get events
import { extractLocations, getEvents, checkToken, getAccessToken } from './api';


class App extends Component {

  state = {
    events: [],
    locations: [],
    currentLocation: 'all',
    numberOfEvents: 32,
    showWelcomeScreen: undefined
  };

  // To use in data visualization
  getData = () => {
    const { locations, events } = this.state;
    const data = locations.map((location) => {
      const number = events.filter((event) => event.location === location).length;
      const city = location.split(', ').shift();
      return { city, number };
    });
    return data;
  };





  // to update state, used in <NumberOfEvents />
  updateNumberOfEvents = (eventCount) => {
    this.setState({
      numberOfEvents: eventCount,
    });
    console.log(eventCount);
    console.log(this.state.locations);
    this.updateEvents(this.state.currentLocation, eventCount);
  };

  updateEvents = (location, eventCount) => {
    getEvents().then((events => {
      if (eventCount !== undefined) {
        this.setState({
          numberOfEvents: eventCount
        })
      }
      // filter event list by location
      let eventList = location !== 'all' ?
        events.filter(event => event.location === location) :
        events

      // Shorten event list
      let shortEventList = eventList.slice(0, this.state.numberOfEvents)

      // Assign value to events state, assign currentLocation
      this.setState({
        events: shortEventList,
        currentLocation: location
      });
    }));
  }

  async componentDidMount() {
    this.mounted = true;
    if (navigator.onLine && !window.location.href.startsWith('http://localhost')) {
      const accessToken = localStorage.getItem('access_token');
      const isTokenValid = (await checkToken(accessToken)).error ? false : true;
      const searchParams = new URLSearchParams(window.location.search);
      const code = searchParams.get('code');
      this.setState({ showWelcomeScreen: !(code || isTokenValid) });

      if ((code || isTokenValid) && this.mounted) {
        getEvents().then((events) => {
          if (this.mounted) {
            this.setState({
              events,
              locations: extractLocations(events),
            });
          }
        });
      }
    } else {
      getEvents().then((events) => {
        if (this.mounted) {
          this.setState({
            events,
            locations: extractLocations(events),
            showWelcomeScreen: false
          });
        }
      });
    }
  }


  componentWillUnmount() {
    this.mounted = false;
  }




  render() {
    const { showWelcomeScreen, locations, events } = this.state;

    if (showWelcomeScreen === undefined)
      return <div className="App" />;

    console.log(this.state.numberOfEvents);
    console.log(this.state.showWelcomeScreen);
    console.log('test 3');
    console.log(this.state.locations);
    console.log(this.state.events);

    return (
      <>
        <div>

        </div>

        <div className="App">
          <h4>Welcome to Meet app!</h4>
          <CitySearch
            locations={locations}
            updateEvents={this.updateEvents}
          />

          <NumberOfEvents
            updateNumberOfEvents={this.updateNumberOfEvents}
          />

          <EventList
            events={events}
          />

          <WelcomeScreen
            showWelcomeScreen={this.state.showWelcomeScreen}
            getAccessToken={() => { getAccessToken(); }}
          />

        </div>
      </>
    );
  }
}

export default App;
