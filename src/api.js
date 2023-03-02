// cryptonomicon

const API_KEY =
  "78a4d592e46e25fe95ee36e71fd7bccf9e2cabf14c8b8dac0e27be61dae23790";

const tickersHandlers = new Map(); // {}
const socket = new WebSocket(
  `wss://streamer.cryptocompare.com/v2?api_key=${API_KEY}`
);

const AGGREGATE_INDEX = "5";

socket.addEventListener("message", (e) => {
  const {
    TYPE: type,
    FROMSYMBOL: currency,
    PRICE: newPrice,
  } = JSON.parse(e.data);
  if (type !== AGGREGATE_INDEX || newPrice === undefined) {
    return;
  }

  const handlers = tickersHandlers.get(currency) ?? [];
  handlers.forEach((fn) => fn(newPrice));
});

function sendToWebSocket(message) {
  const stringifiedMessage = JSON.stringify(message);

  if (socket.readyState === WebSocket.OPEN) {
    socket.send(stringifiedMessage);
    return;
  }

  socket.addEventListener(
    "open",
    () => {
      socket.send(stringifiedMessage);
    },
    { once: true }
  );
}

function subscribeToTickerOnWs(ticker) {
  sendToWebSocket({
    action: "SubAdd",
    subs: [`5~CCCAGG~${ticker}~USD`],
  });
}

function unsubscribeFromTickerOnWs(ticker) {
  sendToWebSocket({
    action: "SubRemove",
    subs: [`5~CCCAGG~${ticker}~USD`],
  });
}

export const subscribeToTicker = (ticker, cb) => {
  const subscribers = tickersHandlers.get(ticker) || [];
  tickersHandlers.set(ticker, [...subscribers, cb]);
  subscribeToTickerOnWs(ticker);
};

export const unsubscribeFromTicker = (ticker) => {
  tickersHandlers.delete(ticker);
  unsubscribeFromTickerOnWs(ticker);
};

//users
export function loadUsers() {
  return fetch("https://jsonplaceholder.typicode.com/users")
    .then((r) => r.json())
    .then((data) => {
      return data;
    });
}

//todo
export function loadTodos() {
  return fetch("https://jsonplaceholder.typicode.com/todos")
    .then((r) => r.json())
    .then((data) => {
      return data;
    });
}
//techcrunch techcrunch.com
export function getPosts({ page = 1, filters = {} } = {}) {
  const url = new URL("https://techcrunch.com/wp-json/wp/v2/posts");
  Object.entries({
    page,
    per_page: 10,
    ...filters,
  }).forEach(([key, value]) => {
    if (value !== null) {
      url.searchParams.append(key, value);
    }
  });
  return fetch(url).then((r) => r.json());
}

export function getCategories() {
  const url = new URL("https://techcrunch.com/wp-json/wp/v2/categories");
  return fetch(url).then((r) => r.json());
}
//swapi
export function getPlanets({ page = 1, search } = {}) {
  const url = new URL("https://swapi.dev/api/planets");
  Object.entries({
    page,
    search,
  }).forEach(([key, value]) => {
    if (value != null) {
      url.searchParams.append(key, value);
    }
  });
  return fetch(url).then((r) => r.json());
}
