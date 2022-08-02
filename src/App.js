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

import { OfflineAlert } from './Alert';


class App extends Component {

  state = {
    events: [],
    locations: [],
    currentLocation: 'all',
    numberOfEvents: 32,
    showWelcomeScreen: undefined,
    offlineAlert: '',
    tokenCheck: false
  };

  // async componentDidMount() {
  //   this.mounted = true;
  //   if (navigator.onLine && !window.location.href.startsWith('http://localhost')) {
  //     const accessToken = localStorage.getItem('access_token');
  //     const isTokenValid = (await checkToken(accessToken)).error ? false : true;
  //     const searchParams = new URLSearchParams(window.location.search);
  //     const code = searchParams.get('code');
  //     this.setState({ showWelcomeScreen: !(code || isTokenValid) });
  //     if ((code || isTokenValid) && this.mounted) {
  //       getEvents().then((events) => {
  //         if (this.mounted) {
  //           this.setState({
  //             events,
  //             locations: extractLocations(events),
  //           });
  //         }
  //       });
  //     }
  //   } else if (!navigator.onLine) {
  //     getEvents().then((events) => {
  //       if (this.mounted) {
  //         this.setState({
  //           events,
  //           locations: extractLocations(events),
  //           showWelcomeScreen: false,
  //           offlineAlert: 'You are offline, data may be not updated',
  //         });
  //       }
  //     });
  //   } else {
  //     getEvents().then((events) => {
  //       if (this.mounted) {
  //         this.setState({
  //           events,
  //           locations: extractLocations(events),
  //           showWelcomeScreen: false

  //         });
  //       }
  //     });
  //   }
  // }

  // Verifying document codes
  async componentDidMount() {
    // this.mounted = true;
    const accessToken = localStorage.getItem('access_token');
    const validToken = accessToken !== null ? await checkToken(accessToken) : false;
    this.setState({ tokenCheck: validToken });
    if (validToken === true) this.updateEvents();
    const searchParams = new URLSearchParams(window.location.search);
    const code = searchParams.get("code");
    this.mounted = true;
    if (code && this.mounted === true && validToken === false) {
      this.setState({ tokenCheck: true });
      this.updateEvents()
    }
    // const isTokenValid = (await checkToken(accessToken)).error ? false : true;
    // const searchParams = new URLSearchParams(window.location.search);
    // const code = searchParams.get("code");
    // this.setState({ showWelcomeScreen: !(code || isTokenValid) });
    // if ((code || isTokenValid) && this.mounted) {
    //   getEvents().then((events) => {
    //     if (this.mounted) {
    //       this.setState({ events, locations: extractLocations(events) });
    //     }
    //   });
    // }
  }

  componentWillUnmount() {
    this.mounted = false;
  }


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
  // updateNumberOfEvents = (eventCount) => {
  //   this.setState({
  //     numberOfEvents: eventCount,
  //   });
  //   this.updateEvents(this.state.currentLocation, eventCount);
  // };

  // updateEvents = (location, eventCount) => {
  //   getEvents().then((events => {
  //     if (eventCount !== undefined) {
  //       this.setState({
  //         numberOfEvents: eventCount
  //       })
  //     }
  //     // filter event list by location
  //     let eventList = location !== 'all' ?
  //       events.filter(event => event.location === location) :
  //       events

  //     // Shorten event list
  //     let shortEventList = eventList.slice(0, this.state.numberOfEvents)

  //     // Assign value to events state, assign currentLocation
  //     this.setState({
  //       events: shortEventList,
  //       currentLocation: location
  //     });
  //   }));
  // }

  //new code
  updateEvents = (location, eventCount) => {
    console.log('update events token valid: ', this.state.tokenCheck);
    const { currentLocation, numberOfEvents } = this.state;
    if (location) {
      getEvents().then((response) => {
        const locationEvents =
          location === 'all'
            ? response.events
            : response.events.filter(event => event.location === location);
        const events = locationEvents.slice(0, numberOfEvents);
        return this.setState({
          events: events,
          currentLocation: location,
          locations: response.locations,
        });
      });
    } else {
      getEvents().then((response) => {
        const locationEvents =
          currentLocation === 'all'
            ? response.events
            : response.events.filter(event => event.location === currentLocation);
        const events = locationEvents.slice(0, eventCount);
        return this.setState({
          events: events,
          numberOfEvents: eventCount,
          locations: response.locations,
        });
      });
    }
  };




  render() {
    const { numberOfEvents, locations, events, tokenCheck } = this.state;

    // if (showWelcomeScreen === undefined) return <div className="App" />

    return tokenCheck === false ? (
      <div className="App">
        <WelcomeScreen />
      </div>
    ) : (
      <div className="App">
        <OfflineAlert text={this.state.offlineAlert} />
        <h4>Welcome to Meet app!</h4>

        <CitySearch
          locations={locations}
          updateEvents={this.updateEvents}
        />

        <NumberOfEvents
          updateEvents={this.updateEvents}
          numberOfEvents={numberOfEvents}
        />

        <EventList
          events={events}
        />

        {/* <WelcomeScreen
          showWelcomeScreen={showWelcomeScreen}
          getAccessToken={() => { getAccessToken(); }}
        /> */}
      </div>
    );
  }
}

export default App;
