import LoaderToast from "../components/sharedComponents/loaderToast.svelte";
import LoadingScreen from "../components/sharedComponents/loadingScreen.svelte";
import { mount } from "svelte"

/**
 * @param {string | null} loaderTitle
 * @param {Promise<any>} awaitedPromise
 * @param {HTMLElement | null} container
 **/
const assignBlockingLoader = (loaderTitle, awaitedPromise, container) => {
  const prop = {
    target: container ?? document.body,
    props: { msg: loaderTitle, awaitedPromise: awaitedPromise }
  };
  const component = mount(LoadingScreen, prop);
}
/**
 * @param {string | null} loaderTitle
 * @param {Promise<any>} awaitedPromise
 * */
const assignLoader = (loaderTitle, awaitedPromise) => {
  const container = document.querySelector(".globalToastContainer");
  const prop = {
    target: container ?? document.body,
    props: { msg: loaderTitle, awaitedPromise: awaitedPromise }
  };
  const component = mount(LoaderToast, prop);
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
  const component = mount(LoaderToast, prop);
}
/** @param {number}  time 
 *  @returns {Promise<boolean>} */
const getWaitPromise = (time) => {
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


export { assignLoader, alertError, alertSuccsess, assignBlockingLoader };
export default { assignLoader, alertError, alertSuccsess, assignBlockingLoader };
