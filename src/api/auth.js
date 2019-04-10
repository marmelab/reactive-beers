import PouchDB from 'pouchdb';
import PouchDBAuth from 'pouchdb-authentication';
import mitt from 'mitt';

PouchDB.plugin(PouchDBAuth);

export default database => {
  const emitter = mitt();

  const getUser = async () => {
    const session = await database.getSession();
    return session.userCtx;
  };

  const userStateListener = callback => {
    getUser().then(callback);
    emitter.on('*', (action, user) => {
      callback(action === 'logout' ? { name: null, roles: [] } : user);
    });

    return {
      unsubscribe: () => emitter.off('*'),
    };
  };

  const requireUser = () =>
    new Promise(resolve => {
      const listener = userStateListener(user => {
        if (user && user.name) {
          listener.unsubscribe();
          resolve(user);
        }
      });
    });

  const login = (login, pass) =>
    database.login(login, pass).then(({ ok, ...rest }) => {
      emitter.emit('login', rest);
      return rest;
    });

  const logout = () =>
    database.logout().then(() => {
      emitter.emit('logout');
    });

  return {
    login,
    logout,
    getUser,
    requireUser,
    userStateListener,
  };
};
