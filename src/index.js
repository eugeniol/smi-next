import makeStore from "./store";
import { render, html } from "lit-html";
import {
  REQUEST_AUTH,
  REQUEST_ORDERS,
  SET_LOCALE,
  SET_ENVIRONMENT_STAGING,
  SET_MERCHANT_ID,
  SET_AUTH_URL,
  AUTHORIZE,
} from "@ordergroove/smi-store/constants";

const target = document.body;

import mainTemplate from "./main-template";

const store = makeStore();

const action = (type, payload) => store.dispatch({ type, payload });
store.subscribe(() => render(mainTemplate(store.getState()), target));

action(SET_LOCALE, "en-US");
action(SET_ENVIRONMENT_STAGING);
action(SET_MERCHANT_ID, "0e5de2bedc5e11e3a2e4bc764e106cf4");

action(AUTHORIZE, {
// paste hmac here

});
