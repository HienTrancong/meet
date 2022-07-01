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
    expect(AppWrapper.find(EventList)).toHaveLength(1);
  });

  test('render CitySearch', () => {
    const AppWrapper = shallow(<App />);
    expect(AppWrapper.find(CitySearch)).toHaveLength(1);
  });

  test('render NumberOfEvents', () => {
    const AppWrapper = shallow(<App />);
    expect(AppWrapper.find(NumberOfEvents)).toHaveLength(1);
  });
});


//scope App component for integration testing, by describe function
describe('<App /> integration', () => {
  test('App passes "events" state as a prop to EventList', () => {
    //const for rendering, call shallow function using App as paramete
    const AppWrapper = mount(<App />);
    const AppEventsState = AppWrapper.state('events');
    expect(AppEventsState).not.toEqual(undefined);
    expect(AppWrapper.find(EventList).props().events).toEqual(AppEventsState);
    AppWrapper.unmount();
  });

  test('App passes "locations" state as a prop to EventList', () => {
    //const for rendering, call shallow function using App as paramete
    const AppWrapper = mount(<App />);
    const AppLocationsState = AppWrapper.state('locations');
    expect(AppLocationsState).not.toEqual(undefined);
    expect(AppWrapper.find(EventList).props().events).toEqual(AppLocationsState);
    AppWrapper.unmount();
  });

  test('get list of events matching the city selected by the user', async () => {
    const AppWrapper = mount(<App />);
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
    const suggestionItems = AppWrapper.find(CitySearch).find('.suggestions li');
    await suggestionItems.at(suggestionItems.length - 1).simulate('click');
    //async API function to get all events
    const allEvents = await getEvents();
    //check if states events in App is same with allEvents
    expect(AppWrapper.state('events')).toEqual(allEvents);
    AppWrapper.unmount();
  });


});

