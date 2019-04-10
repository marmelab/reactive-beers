import PouchDB from 'pouchdb';

export const remoteDatabase = (name = '') =>
  new PouchDB(`http://localhost:5984/${name}`, {
    skip_setup: true,
  });

const initDatabase = (name, sync = true) => {
  const database = new PouchDB(name);

  if (sync) {
    PouchDB.sync(database, remoteDatabase(name), {
      live: true,
      heartbeat: false,
      timeout: false,
      retry: true,
    });
  }

  return database;
};

const databases = {};

const collection = (name, sync = true) => {
  if (!databases[name]) {
    databases[name] = initDatabase(name, sync);
  }

  return databases[name];
};

export default { collection };
