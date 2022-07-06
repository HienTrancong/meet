import { mockData } from "./mock-data";
import axios from "axios";
import NProgress from "nprogress";



// Check token if valid
export const checkToken = async (accessToken) => {
  const result = await fetch(`https://www.googleapis.com/oauth2/v1/tokeninfo?access_token=${accessToken}`)
    .then((res => res.json()))
    .catch((error) => error.json());
  return result;
};

//Get token when the token doesn't exist or invalid
const getToken = async (code) => {
  const encodeCode = encodeURIComponent(code);
  const { access_token } = await fetch("https://vgs1s9ofpi.execute-api.eu-central-1.amazonaws.com/dev/api/token" + "/" + encodeCode)
    .then((res) => {
      return res.json();
    })
    .catch((error) => error);
  access_token && localStorage.setItem("access_token", access_token);
  return access_token;
};


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


// return API or mock data of events
export const getEvents = async () => {
  NProgress.start();

  if (window.location.href.startsWith("http://localhost")) {
    console.log(mockData);
    NProgress.done();
    return mockData;
  }

  if (!navigator.onLine) {
    console.log('Im offline!');
    const data = localStorage.getItem("lastEvents");
    NProgress.done();
    return data ? JSON.parse(data).events : [];;
  }

  const token = await getAccessToken();

  if (token) {
    console.log(token);
    removeQuery();
    const url = "https://vgs1s9ofpi.execute-api.eu-central-1.amazonaws.com/dev/api/get-events" + "/" + token;
    const result = await axios.get(url);

    if (result.data) {
      var locations = extractLocations(result.data.events);
      localStorage.setItem('lastEvents', JSON.stringify(result.data));
      localStorage.setItem('locations', JSON.stringify(locations));
    }

    NProgress.done(result.data.events);
    console.log(mockData);
    return result.data.events;
  }
};

export const extractLocations = (events) => {//takes an events array
  var extractLocations = events.map((event) => event.location);//then uses map to create a new array with only locations.
  var locations = [...new Set(extractLocations)];//Set will remove all duplicates from the array
  console.log(locations);
  return locations;
};


export const getAccessToken = async () => {
  const accessToken = localStorage.getItem('access_token');
  const tokenCheck = accessToken && (await checkToken(accessToken));

  if (!accessToken || tokenCheck.error) {
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