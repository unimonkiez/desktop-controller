export default () => {
  document.body.addEventListener('touchmove', e => {
    e.preventDefault();
  });
};
