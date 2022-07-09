import React from 'react';
import { shallow, mount } from 'enzyme';

import App from '../App';

import EventList from '../EventList';
import CitySearch from '../CitySearch';
import NumberOfEvents from '../NumberOfEvents';

import { mockData } from '../mock-data';
import { extractLocations, getEvents } from '../api';

//scope App component for unit testing, by describe function
describe('<App /> component', () => {

  test('render list of events', () => {
    //const for rendering, call shallow function using App as paramete
    const AppWrapper = shallow(<App />);
    AppWrapper.setState({ showWelcomeScreen: false });
    expect(AppWrapper.find(EventList)).toHaveLength(1);
  });

  test('render CitySearch', () => {
    const AppWrapper = shallow(<App />);
    AppWrapper.setState({ showWelcomeScreen: false });
    expect(AppWrapper.find(CitySearch)).toHaveLength(1);
  });

  test('render NumberOfEvents', () => {
    const AppWrapper = shallow(<App />);
    AppWrapper.setState({ showWelcomeScreen: false });
    expect(AppWrapper.find(NumberOfEvents)).toHaveLength(1);
  });
});


//scope App component for integration testing, by describe function
describe('<App /> integration', () => {
  test('App passes "events" state as a prop to EventList', () => {
    //const for rendering, call shallow function using App as paramete
    const AppWrapper = mount(<App />);
    AppWrapper.setState({ showWelcomeScreen: false });
    const AppEventsState = AppWrapper.state('events');
    expect(AppEventsState).not.toEqual(undefined);
    expect(AppWrapper.find(EventList).props().events).toEqual(AppEventsState);
    AppWrapper.unmount();
  });

  test('App passes "locations" state as a prop to EventList', () => {
    //const for rendering, call shallow function using App as paramete
    const AppWrapper = mount(<App />);
    AppWrapper.setState({ showWelcomeScreen: false });
    const AppLocationsState = AppWrapper.state('locations');
    expect(AppLocationsState).not.toEqual(undefined);
    expect(AppWrapper.find(EventList).props().events).toEqual(AppLocationsState);
    AppWrapper.unmount();
  });

  test('get list of events matching the city selected by the user', async () => {
    const AppWrapper = mount(<App />);
    AppWrapper.setState({ showWelcomeScreen: false });
    const CitySearchWrapper = AppWrapper.find(CitySearch);
    const locations = extractLocations(mockData);
    //add locations to CitySearch state suggessions
    CitySearchWrapper.setState({ suggestions: locations });
    const suggestions = CitySearchWrapper.state('suggestions');
    const selectedIndex = Math.floor(Math.random() * (suggestions.length));
    const selectedCity = suggestions[selectedIndex];
    //mimick item clicked
    await CitySearchWrapper.instance().handleItemClicked(selectedCity);
    //async API function to get all events
    const allEvents = await getEvents();
    //filter events from allEvents to match with selected
    const eventsToShow = allEvents.filter(event => event.location === selectedCity);
    //check if states events in App is same with eventstoShow
    expect(AppWrapper.state('events')).toEqual(eventsToShow);
    AppWrapper.unmount();
  });

  test('get list of all events when user selects "See all cities', async () => {
    const AppWrapper = mount(<App />);
    AppWrapper.setState({ showWelcomeScreen: false });
    const suggestionItems = AppWrapper.find(CitySearch).find('.suggestions li');
    await suggestionItems.at(suggestionItems.length - 1).simulate('click');
    //async API function to get all events
    const allEvents = await getEvents();
    //check if states events in App is same with allEvents
    expect(AppWrapper.state('events')).toEqual(allEvents);
    AppWrapper.unmount();
  });

  test('get list of all events matching number of events selected by user', async () => {
    const AppWrapper = mount(<App />);
    AppWrapper.setState({ showWelcomeScreen: false });
    const NumberOfEventsWrapper = AppWrapper.find(NumberOfEvents);
    const typedNumber = 2;
    NumberOfEventsWrapper.find('.numberOfEventsInput').simulate('change', { target: { value: typedNumber } });
    const allEvents = await getEvents();
    const eventToShow = allEvents.slice(0, typedNumber);
    expect(AppWrapper.state('events')).toEqual(eventToShow);
    AppWrapper.unmount();
  });

  test('get list of all events when user clear value in number field', async () => {
    const AppWrapper = mount(<App />);
    AppWrapper.setState({ showWelcomeScreen: false });
    const NumberOfEventsWrapper = AppWrapper.find(NumberOfEvents);
    NumberOfEventsWrapper.find('.numberOfEventsInput').simulate('change', { target: { value: '' } });
    const allEvents = await getEvents();
    expect(AppWrapper.state('events')).toEqual(allEvents);
    AppWrapper.unmount();
  });


});

// appwrapper, number of event wrapper, assign typedNumber to a number, simulate change of typeNumber, const all events from getEvents, eventToShow all event s,lide expct app wrapper state event equal to events to show

// appwrapper, number of event wrapper, find number input, simulate change, const all events from getEvents, expct app wrapper state event equal to all events

