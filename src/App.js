import React, { Component } from 'react';
import { ScatterChart, Scatter, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';

//Import style sheets
import './App.css';
import './nprogress.css';

//Import children components
import EventList from './EventList';
import CitySearch from './CitySearch';
import NumberOfEvents from './NumberOfEvents';
import WelcomeScreen from './WelcomeScreen';
import EventGenre from './EventGenre';

//Import api functions to extract locations and get events
import { extractLocations, getEvents, checkToken, getAccessToken } from './api';

import { OfflineAlert } from './Alert';


class App extends Component {

  state = {
    events: [],
    locations: [],
    currentLocation: 'all',
    numberOfEvents: 32,
    showWelcomeScreen: undefined,
    offlineAlert: ''
  };

  // To use in data visualization
  getData = () => {
    const { locations, events } = this.state;
    const data = locations.map((location) => {
      const number = events.filter((event) => event.location === location).length
      const city = location.split(', ').shift()
      return { city, number }
    })
    return data;
  };

  // to update state, used in <NumberOfEvents />
  updateNumberOfEvents = (eventCount) => {
    this.setState({
      numberOfEvents: eventCount,
    });
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
  //reactivate later after styling welcome screen
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
    } else if (!navigator.onLine) {
      getEvents().then((events) => {
        if (this.mounted) {
          this.setState({
            events,
            locations: extractLocations(events),
            showWelcomeScreen: false,
            offlineAlert: 'You are offline, data may be not updated',
          });
        }
      });
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

  // async componentDidMount() {
  //   this.mounted = true;
  //   const accessToken = localStorage.getItem('access_token');
  //   const isTokenValid = (await checkToken(accessToken)).error ? false :
  //     true;
  //   const searchParams = new URLSearchParams(window.location.search);
  //   const code = searchParams.get("code");
  //   this.setState({ showWelcomeScreen: !(code || isTokenValid) });
  //   if ((code || isTokenValid) && this.mounted) {
  //     getEvents().then((events) => {
  //       if (this.mounted) {
  //         this.setState({ events, locations: extractLocations(events) });
  //       }
  //     });
  //   }
  // }



  componentWillUnmount() {
    this.mounted = false;
  }


  render() {
    const { showWelcomeScreen, locations, events } = this.state;

    if (showWelcomeScreen === undefined) return <div className="App" />

    return (
      <div className="App">
        <OfflineAlert text={this.state.offlineAlert} />
        <h4>Welcome to Meet app!</h4>
        <CitySearch
          locations={locations}
          updateEvents={this.updateEvents}
        />

        <NumberOfEvents
          updateNumberOfEvents={this.updateNumberOfEvents}
        />
        <div className="data-vis-wrapper">
          <EventGenre events={events}
          />
          <h4>Events in each city</h4>
          <ResponsiveContainer height={400}>
            <ScatterChart margin={{ top: 20, right: 20, bottom: 10, left: 10 }}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis type="category" dataKey="city" name="city" />
              <YAxis type="number" dataKey="number" name="number of events" allowDecimals={false} />
              <Tooltip cursor={{ strokeDasharray: '3 3' }} />
              <Scatter data={this.getData()} fill="#8884d8" />
            </ScatterChart>
          </ResponsiveContainer></div>

        <EventList
          events={events}
        />

        <WelcomeScreen
          showWelcomeScreen={showWelcomeScreen}
          getAccessToken={() => { getAccessToken() }}
        />
      </div>
    );
  }
}

export default App;
