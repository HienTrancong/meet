import { loadFeature, defineFeature } from "jest-cucumber";
import React from "react";
import { shallow } from "enzyme";

import Event from '../Event';

import { mockData } from "../mock-data";




const feature = loadFeature('./src/features/showHideAnEventsDetails.feature');

defineFeature(feature, test => {

  test('An event element is collapsed by default', ({ given, when, then }) => {
    let EventWrapper;
    let event;
    given('upcoming events are shown on screen', () => {
    });

    when('the user hasn’t clicked on show details button on an event element', () => {
      event = mockData[0];
      EventWrapper = shallow(<Event event={event} />);
    });

    then('the event element should be collapsed by default and show only main information', () => {
      expect(EventWrapper.find('.eventDetail')).toEqual({});
    });
  });


  test('User can expand an event to see its details', ({ given, when, then }) => {
    let EventWrapper;
    let event;
    given('upcoming events are shown on screen', () => {
      event = mockData[0];
      EventWrapper = shallow(<Event event={event} />);
    });

    when('the user clicks on show details button on an event element', () => {
      EventWrapper.find('.buttonDetail').simulate('click');
    });

    then('the event element should be expanded to show more detail information', () => {
      expect(EventWrapper.find('.eventDetail').text()).toEqual(mockData[0].description);
    });
  });

  test('User can collapse an event to hide its detail', ({ given, when, then }) => {
    let EventWrapper;
    let event;
    given('the user has clicked on show details button and more detail information is being shown', () => {
      event = mockData[0];
      EventWrapper = shallow(<Event event={event} />);
      EventWrapper.find('.buttonDetail').simulate('click');
    });

    when('the user click on hide detail button on the expanded event element', () => {
      EventWrapper.find('.buttonDetail').simulate('click');
    });

    then('the event element should be collapsed to and show only main information', () => {
      expect(EventWrapper.find('.eventDetail')).toEqual({});
    });
  });
});

