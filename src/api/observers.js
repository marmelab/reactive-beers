export default store => {
  const onBeersChange = callback =>
    store
      .collection('beers')
      .changes({ since: 'now', live: true })
      .on('change', callback);

  return {
    onBeersChange,
  };
};
