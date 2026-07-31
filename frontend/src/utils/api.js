import { baseURL } from "../constant/url";

export const fetchWithAuth = async (url, options = {}) => {
  let token = null;
  if (window.Clerk && window.Clerk.session) {
    token = await window.Clerk.session.getToken();
  }

  const headers = {
    ...options.headers,
  };

  if (token) {
    headers["Authorization"] = `Bearer ${token}`;
  }

  // Set default content type if not present and body is not FormData
  if (options.body && !(options.body instanceof FormData) && !headers["Content-Type"]) {
    headers["Content-Type"] = "application/json";
  }

  // Ensure absolute URL resolution
  const cleanUrl = url.startsWith("/") ? url.slice(1) : url;
  const absoluteUrl = url.startsWith("http") ? url : `${baseURL}${cleanUrl}`;

  return fetch(absoluteUrl, {
    ...options,
    headers,
  });
};
