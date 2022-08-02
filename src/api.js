import { mockData } from "./mock-data";
import axios from "axios";
import NProgress from "nprogress";

// Remove code from URL once finished, used in App
// check if there is a path in the url, if had then build URL with current path, or without a path
const removeQuery = () => {
  if (window.history.pushState && window.location.pathname) {
    var newurl =
      window.location.protocol +
      '//' +
      window.location.host +
      window.location.pathname;
    window.history.pushState("", "", newurl);
  } else {
    newurl =
      window.location.protocol +
      '//' +
      window.location.host;
    window.history.pushState("", "", newurl);
  }
};

// Check token if valid
const checkToken = async (accessToken) => {
  const result = await fetch(`https://www.googleapis.com/oauth2/v1/tokeninfo?access_token=${accessToken}`)
    .then((res => res.json()))
    .catch((error) => error.json());
  return result.error ? false : true;
};

const extractLocations = (events) => {//takes an events array
  var extractLocations = events.map((event) => event.location);//then uses map to create a new array with only locations.
  var locations = [...new Set(extractLocations)];//Set will remove all duplicates from the array
  return locations;
};

// return API or mock data of events
const getEvents = async (max_results = 32) => {
  NProgress.start();
  if (window.location.href.startsWith("http://localhost")) {
    NProgress.done();
    return { events: mockData, locations: extractLocations(mockData) };
  }
  if (!navigator.onLine) {
    console.log('Im offline!');
    const { events } = await localStorage.getItem("lastEvents");
    // const data = localStorage.getItem("lastEvents");
    NProgress.done();
    // return data ? JSON.parse(data).events : [];;
    return { events: JSON.parse(events), locations: extractLocations(events) };
  }
  const token = await getAccessToken();
  console.log('getEvents token: ', token)
  if (token) {
    removeQuery();
    const url = `https://vgs1s9ofpi.execute-api.eu-central-1.amazonaws.com/dev/api/get-events/${token}/${max_results}`;
    const result = await axios.get(url);
    if (result.data) {
      var locations = extractLocations(result.data.events);
      localStorage.setItem('lastEvents', JSON.stringify(result.data.events));
      localStorage.setItem('locations', JSON.stringify(locations));
    }
    // NProgress.done(result.data.events);
    // return result.data.events;
    NProgress.done();
    return { events: result.data.events, locations };
  }
};

const getAccessToken = async () => {
  const accessToken = localStorage.getItem('access_token');
  const tokenCheck = accessToken && (await checkToken(accessToken));

  if (!accessToken || !tokenCheck) {
    await localStorage.removeItem('access_token');
    const searchParams = new URLSearchParams(window.location.search);
    const code = await searchParams.get('code');
    if (!code) {
      const results = await axios.get('https://vgs1s9ofpi.execute-api.eu-central-1.amazonaws.com/dev/api/get-auth-url');
      const { authUrl } = results.data;
      return (window.location.href = authUrl);
    }
    return code && getToken(code);
  }
  return accessToken;
};

//Get token when the token doesn't exist or invalid
const getToken = async (code) => {
  removeQuery();
  const encodeCode = encodeURIComponent(code);
  const { access_token } = await fetch(`https://vgs1s9ofpi.execute-api.eu-central-1.amazonaws.com/dev/api/token/${encodeCode}`)
    .then((res) => {
      return res.json();
    })
    .catch((error) => error);
  access_token && localStorage.setItem("access_token", access_token);
  return access_token;
};



export { getEvents, getAccessToken, extractLocations, getToken, checkToken };