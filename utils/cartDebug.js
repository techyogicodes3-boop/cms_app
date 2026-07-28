

export const logCartState = (label, data) => {
  if (process.env.NODE_ENV === 'development') {
    console.group(`CART DEBUG: ${label}`);
    console.log('Timestamp:', new Date().toISOString());
    console.log('Data:', data);
    console.groupEnd();
  }
};

export const logAuthState = (label, isAuthenticated) => {
  if (process.env.NODE_ENV === 'development') {
    console.log(`AUTH: ${label} - Authenticated: ${isAuthenticated}`);
  }
};

export const logApiCall = (method, url, token) => {
  if (process.env.NODE_ENV === 'development') {
    console.group(` API CALL: ${method} ${url}`);
    console.log('Has Token:', !!token);
    console.log('Token Preview:', token ? `${token.slice(0, 20)}...` : 'None');
    console.groupEnd();
  }
};

export const logEventDispatch = (eventName) => {
  if (process.env.NODE_ENV === 'development') {
    console.log(`EVENT: ${eventName} dispatched`);
  }
};
