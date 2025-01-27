import { error } from "@sveltejs/kit";
import { env } from "$env/dynamic/private";

const MY_API_BASE_URL = env.VITE_API_URL;
const PROXY_PATH = "/api";

// @ts-ignore
const handleApiProxy = async ({ event }) => {
  const urlPath = `${MY_API_BASE_URL}${event.url.pathname}${event.url.search}`;
  const proxiedUrl = new URL(urlPath);

  event.request.headers.delete("connection");
  return fetch(proxiedUrl.toString(), {
    body: event.request.body,
    method: event.request.method,
    headers: event.request.headers,
    // @ts-ignore
    duplex: 'half'
  }).catch((err) => {
    console.log("Could not proxy API request: ", err);
    throw err;
  });
};
// @ts-ignore
export const handle = async ({ event, resolve }) => {
  if (event.url.pathname.startsWith(PROXY_PATH)) {
    // @ts-ignore
    return await handleApiProxy({ event, resolve });
  }
  const response = await resolve(event);
  return response;
};
