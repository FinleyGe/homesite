export default defineTask({
  meta: {
    name: 'init',
    description: 'Initialize the app',
  },
  run(_) {
    console.log('Initializing the app');
    return {
      result: 'success',
    }
  },
});
