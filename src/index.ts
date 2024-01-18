import "./styles.css";
import {
  registerApplication,
  start,
  navigateToUrl,
} from "single-spa/lib/es2015/esm/single-spa.dev.js";
// some setup stuff that can mostly be ignored
const appOneNode = document.getElementById("applicationOne");
const appTwoNode = document.getElementById("applicationTwo");
const parcelNode = document.getElementById("parcel-node");
let app1MountParcel;
let parcel;

// @ts-ignore
window.navigateToAppOne = global_navigateToAppOne;
// @ts-ignore
window.navigateToAppTwo = global_navigateToAppTwo;
// @ts-ignore
window.mountParcelInAppOneContext = global_mountParcelInAppOneContext;
// @ts-ignore
window.parcelNavToTwo = global_parcelNavToTwo;
function global_navigateToAppOne() {
  navigateToUrl("app1");
}
function global_navigateToAppTwo() {
  navigateToUrl("app2");
}
function global_mountParcelInAppOneContext() {
  if (app1MountParcel) {
    parcel = app1MountParcel(parcel, { domElement: parcelNode });
  }
}
function global_parcelNavToTwo() {
  parcel.unmount();
  global_navigateToAppTwo();
}

// defining applications and single spa parcel
const applicationOne = {
  bootstrap: () => Promise.resolve(),
  mount: (applicationProps) => {
    app1MountParcel = applicationProps.mountParcel;
    if (appOneNode) {
      appOneNode.innerHTML = `
      <div>
        <p>application one is mounted</p>
        <button onclick="mountParcelInAppOneContext()">Mount parcel</button>
      </div>
      `;
    }
    return Promise.resolve();
  },
  unmount: () => {
    if (appOneNode) {
      appOneNode.innerHTML = ``;
    }
    return Promise.resolve();
  },
};
const applicationTwo = {
  bootstrap: () => Promise.resolve(),
  mount: () => {
    if (appTwoNode) {
      appTwoNode.innerHTML = `<p>application Two is mounted</p>`;
    }
    return Promise.resolve();
  },
  unmount: () => {
    if (appTwoNode) {
      appTwoNode.innerHTML = ``;
    }
    return Promise.resolve();
  },
};

const parcel = {
  bootstrap: () => Promise.resolve(),
  mount: () => {
    if (parcelNode) {
      parcelNode.innerHTML = `
      <div>
        <p>Parcel is mounted</p>
        <button onclick="parcelNavToTwo()">Unmount parcel and navigate to app 2</button>
      </div>`;
    }
    return Promise.resolve();
  },
  unmount: () => {
    // add an arbitrary delay here to make the bug more visible
    return new Promise((r) => {
      return setTimeout(r, 500);
    }).then(() => {
      if (parcelNode) {
        parcelNode.innerHTML = ``;
      }
    });
  },
};

// registering applications
registerApplication({
  name: "AppOne",
  app: applicationOne,
  activeWhen: `/app1`,
});

registerApplication({
  name: "AppTwo",
  app: applicationTwo,
  activeWhen: `/app2`,
});

// calling single-spa start
start();
