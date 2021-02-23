import { html } from "lit-html";
import { until } from "lit-html/directives/until";
import { unsafeHTML } from "lit-html/directives/unsafe-html";
import { ifDefined } from "lit-html/directives/if-defined";
import { repeat } from "lit-html/directives/repeat";
import filter from "lodash-es/filter";
import { compile } from "lit-jinja";
import createRuntime from "lit-jinja/runtime";
const runtime = createRuntime({ html, unsafeHTML, repeat });

const templateNames = [
  "change-shipment-date",
  "main",
  "send-shipment-now-button",
  "skip-shipment-button",
  "payment-shipping",
  "order-pricing",
  "order-items",
  "upsell-first-item",
  "product-image",
  "sku-swap",
  "unsent-order",
];
const filters = {
  ifDefined: ifDefined,
  date: (val) => val,
  log: (val) => console.log(val),
  currency: (val) => "$ " + val,
  translate: (val, ...extra) => {
    return val;
  },
  action(name, payload) {
    return (ev) => {
      console.log(name, payload);
    };
  },
  filter(val, predicate) {
    console.log(val, predicate);
    return filter(val, predicate);
  },
};

const templates = new Promise((res) =>
  Promise.all(
    templateNames.map((name) =>
      fetch(`../views/${name}.liquid`)
        .then((res) => res.text())
        .then((source) => [name, source])
    )
  ).then((sources) => {
    const partials = Object.fromEntries(sources);

    const templates = Object.fromEntries(
      sources.map(([name, source]) => {
        const fn = compile(source, { partials });
        // console.log(name, fn.toString())
        return [name, fn];
      })
    );
    res(templates);
  })
);

const useTemplate = (name, state) => (templates) => {
  return templates[name](
    runtime(state, { filters, stack: [state.translations] })
  );
};
const mainTemplate = (state) =>
  until(templates.then(useTemplate("main", state)));

export default mainTemplate;
