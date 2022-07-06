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
    showWelcomeScreen: undefined,
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


  async componentDidMount() {
    this.mounted = true;

    const accessToken = localStorage.getItem('access_token');
    const isTokenValid = (await checkToken(accessToken)).error ? false : true;
    const searchParams = new URLSearchParams(window.location.search);
    const code = searchParams.get('code');

    this.setState({ showWelcomeScreen: !(code || isTokenValid) });//dont show welcome if code or tokenvalid
    if ((code || isTokenValid) || this.mounted) {
      getEvents().then((events) => {
        if (this.mounted) {
          this.setState({
            events,
            locations: extractLocations(events)
          });
        }
      });
    }
  }

  componentWillUnmount() {
    this.mounted = false;
  }

  // to update state, used in <NumberOfEvents />
  updateNumberOfEvents = (numberOfEvents) => {
    this.setState({
      numberOfEvents,
    });
    console.log(numberOfEvents);
    console.log(this.state.locations);
    this.updateEvents(this.state.currentLocation, numberOfEvents);
  };


  // used in <CitySearch />
  updateEvents = (location, eventCount) => {
    console.log(this.mounted);
    console.log(location);
    console.log(eventCount);
    getEvents().then((events) => {
      const locationEvents = location === "all"
        ? events
        : events.filter((event) => event.location === location);
      console.log(this.mounted);
      if (this.mounted) {
        console.log(locationEvents);
        this.setState({
          events: locationEvents.slice(0, eventCount),
          currentLocation: location,
          numberOfEvents: eventCount,
        });
      }
    });
  }


  render() {
    if (this.state.showWelcomeScreen === undefined) return <div className="App" />;
    console.log(this.state.numberOfEvents);
    console.log(this.state.showWelcomeScreen);
    console.log('test 3');
    console.log(this.state.locations);
    console.log(this.state.events);
    return (
      <div className="App">
        <h1>Welcome to Meet app!</h1>

        <CitySearch
          locations={this.state.locations}
          updateEvents={this.updateEvents}
        />

        <NumberOfEvents
          numberOfEvents={this.state.numberOfEvents}
          updateNumberOfEvents={this.updateNumberOfEvents}
        />

        <EventList
          events={this.state.events}
          numberOfEvents={this.state.numberOfEvents}
        />

        <WelcomeScreen
          showWelcomeScreen={this.state.showWelcomeScreen}
          getAccessToken={() => { getAccessToken(); }}
        />

      </div>

    );
  }
}

export default App;
