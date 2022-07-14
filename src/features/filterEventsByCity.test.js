import { loadFeature, defineFeature } from "jest-cucumber";
import React from "react";
import { mount, shallow } from "enzyme";

import App from '../App';
import CitySearch from '../CitySearch';

import { mockData } from "../mock-data";
import { extractLocations } from '../api';

//loadFeature to load a gherkin file
const feature = loadFeature('./src/features/filterEventsByCity.feature');

//define code for the feature file
defineFeature(feature, test => {

  test('When user hasn’t searched for a city, show upcoming events from all cities.', ({ given, when, then }) => {
    given('user hasn’t searched for any city', () => {

    });

    let AppWrapper;
    when('the user opens the app', () => {
      //Use mount because need to render childeren (EventList -> Event)
      AppWrapper = mount(<App />);
    });

    then('the user should see a list of all upcoming events.', () => {
      //Because getting events is asychronous
      AppWrapper.update();
      expect(AppWrapper.find('.event')).toHaveLength(mockData.length);
    });
  });

  test('User should see a list of suggestions when they search for a city.', ({ given, when, then }) => {
    let CitySearchWrapper;
    let locations = extractLocations(mockData);
    given('the main page is open', () => {
      CitySearchWrapper = shallow(<CitySearch locations={locations} updateEvents={() => { }} />);
    });
    when('the user starts typing in the city search textbox', () => {
      CitySearchWrapper.find('.city').simulate('change', { target: { value: 'Berlin' } });
    });

    then('the user should receive a list of cities (suggestions) that match what they have typed', () => {
      expect(CitySearchWrapper.find('.suggestions li')).toHaveLength(2);
    });
  });

  test('User can select a city from suggested list.', ({ given, and, when, then }) => {
    let AppWrapper;
    given('user was typing “Berlin” in the city search textbox', async () => {
      AppWrapper = await mount(<App />);
      AppWrapper.setState({ showWelcomeScreen: false });
      AppWrapper.find('.city').simulate('change', { target: { value: 'Berlin' } });
    });

    and('the list of suggested cities us showing', () => {
      AppWrapper.update();
      expect(AppWrapper.find('.suggestions li')).toHaveLength(2);
    });

    when('the user selects a city (e.g. “Berlin, Germany”) from the list', () => {
      AppWrapper.find('.suggestions li').at(0).simulate('click');
    });

    then('their city should be changed to that city (i.e. “Berlins, Germany”)', () => {
      const CitySearchWrapper = AppWrapper.find(CitySearch);
      expect((CitySearchWrapper).state('query')).toBe('Berlin, Germany');
    });

    and('user should receive a list of upcoming events in that city.', () => {
      expect(AppWrapper.find('.event')).toHaveLength(mockData.length);
    });
  });
});