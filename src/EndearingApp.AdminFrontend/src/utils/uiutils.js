import LoaderToast from "../components/sharedComponents/loaderToast.svelte";
import LoadingScreen from "../components/sharedComponents/loadingScreen.svelte";
import { mount } from "svelte"

/**
 * @param {string | null} loaderTitle
 * @param {HTMLElement | null} container
 * @returns {Function}
 **/
const showBlockingLoader = (loaderTitle, container = null) => {
  /** @type {Function} */
  let removeLoader = () => { };
  // @ts-ignore
  const awaitedPromise = new Promise((res, rej) => {
    removeLoader = res;
  });
  const prop = {
    target: container ?? document.body,
    props: { msg: loaderTitle, awaitedPromise: awaitedPromise }
  };
  // @ts-ignore
  const component = mount(LoadingScreen, prop);
  return removeLoader;
}
/**
 * @param {string | null} loaderTitle
 * @param {Promise<any>} awaitedPromise
 * @param {HTMLElement | null} container
 **/
const assignBlockingLoader = (loaderTitle, awaitedPromise, container = null) => {
  const prop = {
    target: container ?? document.body,
    props: { msg: loaderTitle, awaitedPromise: awaitedPromise }
  };
  // @ts-ignore
  const component = mount(LoadingScreen, prop);
}
/**
 * @param {string | null} loaderTitle
 * @param {Promise<any>} awaitedPromise
 * @returns {Promise<any>}
 * */
const assignLoader = (loaderTitle, awaitedPromise) => {
  const container = document.querySelector(".globalToastContainer");
  const prop = {
    target: container ?? document.body,
    props: { msg: loaderTitle, awaitedPromise: awaitedPromise }
  };
  // @ts-ignore
  const component = mount(LoaderToast, prop);
  return awaitedPromise;
}
/** @param {string} msg
 *  @param {number | null | undefined} showMs */
const alertError = (msg, showMs = null) => {
  const container = document.querySelector(".globalToastContainer");
  const awaitedPromise = getWaitPromise(showMs ?? 10000);
  const prop = {
    target: container ?? document.body,
    props: { msg: msg, awaitedPromise: awaitedPromise, dismissable: true, type: 2 }
  };
  // @ts-ignore
  const component = mount(LoaderToast, prop);
}
/** @param {string} msg
 *  @param {number | null | undefined} showMs */
const alertSuccsess = (msg, showMs = null) => {
  const container = document.querySelector(".globalToastContainer");
  const awaitedPromise = getWaitPromise(showMs ?? 10000);
  const prop = {
    target: container ?? document.body,
    props: { msg: msg, awaitedPromise: awaitedPromise, dismissable: true, type: 1 }
  };
  // @ts-ignore
  const component = mount(LoaderToast, prop);
}
/** @param {number}  time 
 *  @returns {Promise<boolean>} */
const getWaitPromise = (time) => {
  // @ts-ignore
  return new Promise((res, rej) => {
    try {
      setTimeout(() => {
        res(true);
      }, time)
    } catch {
      res(false);
    }
  })
}


export { assignLoader, alertError, alertSuccsess, assignBlockingLoader, showBlockingLoader };
export default { assignLoader, alertError, alertSuccsess, assignBlockingLoader, showBlockingLoader };
