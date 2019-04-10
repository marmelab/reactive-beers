import React, { useState, useEffect } from 'react';
import styled from 'styled-components';

import { EuiButton } from '@elastic/eui';

import { Home } from './screens/Home';
import { auth } from './api';

const AppContainer = styled.div`
  max-width: 1280px;
  margin: 0 auto;
`;

const App = () => {
  const [userState, setUserState] = useState(null);

  useEffect(() => {
    const listener = auth.userStateListener(setUserState);

    return () => {
      listener.unsubscribe();
    };
  }, []);

  if (!userState) {
    return null;
  }

  return (
    <AppContainer>
      {userState.name ? (
        <Home />
      ) : (
        <React.Fragment>
          <EuiButton onClick={() => auth.login('julien', 'julien')}>
            LOGIN
          </EuiButton>
        </React.Fragment>
      )}
    </AppContainer>
  );
};

export default App;
