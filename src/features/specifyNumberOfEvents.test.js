import { loadFeature, defineFeature } from "jest-cucumber";
import React from "react";
import { shallow, mount } from "enzyme";
import NumberOfEvents from '../NumberOfEvents';
import App from '../App';

const feature = loadFeature('./src/features/specifyNumberOfEvents.feature');

defineFeature(feature, test => {
  test('When user hasn’t specified a number, 32 is the default number', ({ given, when, then, and }) => {
    given('events list is shown on screen', () => {

    });
    let AppWrapper;
    when('user hasn’t specified a number of events to show in the Number of Event textbox', () => {
      AppWrapper = mount(<App />);
    });

    then('32 is default number in Number of Event textbox', () => {
      AppWrapper.update();
      expect(AppWrapper.find(NumberOfEvents).state('numberOfEvents')).toBe(32);
    });
  });

  test('User can change the number of events they want to see', ({ given, when, then }) => {
    let AppWrapper;
    given('user has specified a number of events to show', () => {
      AppWrapper = mount(<App />);
      AppWrapper.setState({ numberOfEvents: 10 });
    });

    when('user change number in Number of Event text box to a new number', () => {
      AppWrapper.update();
      AppWrapper.find('.numberOfEventsInput').simulate('change', { target: { value: 15 } });
    });

    then('number of events on events list should be changed to number the user specifies', () => {
      expect(AppWrapper.state('numberOfEvents')).toBe(15);
    });
  });

});
