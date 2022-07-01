import { mockData } from "./mock-data";
import axios from "axios";
import NProgress from "nprogress";



// check if token is valid
const checkToken = async (accessToken) => {
  const result = await fetch(`https://www.googleapis.com/oauth2/v1/tokeninfo?access_token=${accessToken}`)
    .then((res => res.json()))
    .catch((error) => error.json());
  return result;
};

//remove code from URL once finished, used in App
const removeQuery = () => {
  // check if there is a path in the url, if had then build URL with current path, or without a path
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

//Get token when the token doesn't exist or invalid
const getToken = async (code) => {
  try {
    const encodeCode = encodeURIComponent(code);
    const response = await fetch("https://vgs1s9ofpi.execute-api.eu-central-1.amazonaws.com/dev/api/token" + "/" + encodeCode);
    if (!response.ok) { throw new Error(`HTTP error! status: ${response.status}`) }
    const { access_token } = await response.json();
    access_token && localStorage.setItem("access_token", access_token);
    return access_token;
  }
  catch (error) {
    error.json();
  }
}



// return API or mock data
export const getEvents = async () => {
  //Node package to show progress bar
  NProgress.start();

  if (window.location.href.startsWith('http://localhost')) {
    NProgress.done();
    return mockData;
  }

  //wait to get the token
  const token = await getAccessToken();

  if (token) {
    //remove the code from URL once finished, will be in api.js
    removeQuery();
    const url = "https://vgs1s9ofpi.execute-api.eu-central-1.amazonaws.com/dev/api/get-events" + "/" + token;
    const result = await axios.get(url);

    if (result.data) {
      var locations = extractLocations(result.data.events);
      localStorage.setItem('lastEvents', JSON.stringify(result.date));
      localStorage.setItem('locations', JSON.stringify(locations));
    }

    NProgress.done();
    return result.data.events;
  }
};

/* takes an events array, then uses map to create a new array with only locations.
 * It will also remove all duplicates by creating another new array using the spread operator and spreading a Set.
 * The Set will remove all duplicates from the array.
 */

export const extractLocations = (events) => {
  var extractLocations = events.map((event) => event.location);
  var locations = [...new Set(extractLocations)];
  return locations;
};

export const getAccessToken = async () => {
  const accessToken = localStorage.getItem('access_token');
  const tokenCheck = accessToken && (await checkToken(accessToken));
  // if no token - check code, if no code as well - return to Google auth screen
  if (!accessToken || tokenCheck.error) {
    await localStorage.removeItem('access_token');
    //return search query part of URL including ?
    const searchParams = new URLSearchParams(window.location.search);
    // get the code part from the param
    const code = await searchParams.get('code');
    if (!code) {
      const results = await axios.get('https://vgs1s9ofpi.execute-api.eu-central-1.amazonaws.com/dev/api/get-auth-url');
      const { authUrl } = results.data;
      // put current windows URL as the auth URL
      return (window.location.href = authUrl);
    }
    return code && getToken(code);
  }
  return accessToken;
};