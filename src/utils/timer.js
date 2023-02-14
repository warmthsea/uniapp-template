const delay = (function () {
  let timer = 0;
  return function (callback, ms) {
    clearTimeout(timer);
    timer = setTimeout(callback, ms);
  };
})();

const timers = (f, time) => {
  let timer;
  return function walk() {
    clearTimeout(timer);
    timer = setTimeout(function () {
      f();
      walk();
    }, time);
  };
};

export { delay, timers };
