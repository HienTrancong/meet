import React from 'react';
import { shallow } from 'enzyme';
import App from '../App';

import EventList from '../EventList';
import CitySearch from '../CitySearch';
import NumberOfEvents from '../NumberOfEvents';

//scope App component, by describe function
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

