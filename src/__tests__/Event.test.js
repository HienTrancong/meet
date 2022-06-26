import React from 'react';
import { shallow } from 'enzyme';
import Event from '../Event';

import { mockData } from '../mock-data';

describe('<Event /> component', () => {
  let EventWrapper;
  beforeAll(() => {
    EventWrapper = shallow(<Event event={mockData[0]} />);
  });

  // Test if all elements rendered

  test('render event', () => {
    expect(EventWrapper.find('.event')).toHaveLength(1);
  });

  test('render event summary', () => {
    expect(EventWrapper.find('.summary')).toHaveLength(1);
  });


  test('render event start time', () => {
    expect(EventWrapper.find('.startTime')).toHaveLength(1);
  });

  test('render event button detail', () => {
    expect(EventWrapper.find('.buttonDetail')).toHaveLength(1);
  });


  // Test if event collapsed by default, expand with click, collapse with click

  test('detail collapsed by default', () => {
    expect(EventWrapper.state('showDetail')).toBe(false);
  });

  test('showDetail state change to TRUE when button is clicked', () => {
    EventWrapper.setState({ showDetail: false });
    EventWrapper.find('.collapsedEventDetail').simulate('click');
    expect(EventWrapper.state('showDetail')).toBe(true);
  });

  test('showDetail state change to FASLE when button is clicked', () => {
    EventWrapper.setState({ showDetail: true });
    EventWrapper.find('.expandedEventDetail').simulate('click');
    expect(EventWrapper.state('showDetail')).toBe(false);
  });

  test('render eventDetail when state is true', () => {
    EventWrapper.setState({ showDetail: true });
    expect(EventWrapper.find('.eventDetail')).toHaveLength(1);
  });

  test('hide eventDetail when state is false', () => {
    EventWrapper.setState({ showDetail: false });
    expect(EventWrapper.find('.eventDetail')).toHaveLength(0);
  });







})


