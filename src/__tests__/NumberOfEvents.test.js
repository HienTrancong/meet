import React from 'react';
import { shallow } from 'enzyme';
import NumberOfEvents from '../NumberOfEvents';

describe('<NumberOfEvents /> component', () => {
  let NumberOfEventsWrapper;
  beforeAll(() => {
    NumberOfEventsWrapper = shallow(<NumberOfEvents />);
  });

  // render label, text box with 32 as default value
  test('render label', () => {
    expect(NumberOfEventsWrapper.find('.NumberOfEvents label')).toHaveLength(1);
  });

  test('render textbox', () => {
    expect(NumberOfEventsWrapper.find('.NumberOfEvents')).toHaveLength(1);
  });

  test('default numberOfEvents is 32', () => {
    expect(NumberOfEventsWrapper.state('numberOfEvents')).toBe(32);
  });

  //
  test('render text input correctly', () => {
    const numberOfEvents = NumberOfEventsWrapper.state('numberOfEvents');
    expect(NumberOfEventsWrapper.find('.numberOfEventsInput').prop('value')).toBe(numberOfEvents);
  });

  // test('change state when text input changes', () => {
  //   NumberOfEventsWrapper.setState({ numberOfEvents: 32 });
  //   const eventObject = { target: { value: 10 } };
  //   NumberOfEventsWrapper.find('.numberOfEventsInput').simulate('change', eventObject);
  //   expect(NumberOfEventsWrapper.state('numberOfEvents')).toBe(10);
  // });

});