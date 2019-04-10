export default store => {
  const saveBeer = async ({ _image, ...beer }) =>
    store
      .collection('beers')
      .post(beer)
      .then(
        ({ id, rev }) =>
          _image &&
          store
            .collection('beers')
            .putAttachment(id, 'image', rev, _image.data, _image.type)
      );

  const removeBeer = beer => store.collection('beers').remove(beer);

  const getBeers = () =>
    store
      .collection('beers')
      .allDocs({
        include_docs: true,
        descending: true,
        attachments: true,
      })
      .then(doc => doc.rows.map(row => row.doc));

  return {
    saveBeer,
    removeBeer,
    getBeers,
  };
};
