import React, { useState, useEffect } from 'react';

import {
  EuiHeader,
  EuiHeaderSection,
  EuiHeaderSectionItem,
  EuiHeaderLogo,
  EuiFlexGrid,
  EuiFlexItem,
  EuiFlyout,
  EuiFlyoutBody,
  EuiFlyoutHeader,
  EuiTitle,
  EuiIcon,
  EuiHeaderSectionItemButton,
  EuiSpacer,
  EuiHeaderLink,
  EuiHeaderLinks,
  EuiEmptyPrompt,
  EuiButton,
} from '@elastic/eui';

import { observers, queries, auth } from '../api';
import { BeerCard } from '../components/BeerCard';
import { BeerForm } from '../components/BeerForm';

export const Home = () => {
  const [beers, setBeers] = useState(null);
  const [beerForm, setBeerForm] = useState(null);

  const refreshBeers = () => queries.getBeers().then(setBeers);

  useEffect(() => {
    refreshBeers();

    const observer = observers.onBeersChange(refreshBeers);

    return () => {
      observer.cancel();
    };
  }, []);

  return (
    <React.Fragment>
      <EuiHeader>
        <EuiHeaderSection grow>
          <EuiHeaderSectionItem border="none">
            <EuiHeaderLogo iconType="beaker">Reactive Beers</EuiHeaderLogo>
          </EuiHeaderSectionItem>
        </EuiHeaderSection>
        <EuiHeaderSection side="right">
          <EuiHeaderLinks>
            <EuiHeaderLink onClick={auth.logout}>LOGOUT</EuiHeaderLink>
          </EuiHeaderLinks>
          <EuiHeaderSectionItem border="none">
            <EuiHeaderSectionItemButton onClick={() => setBeerForm({})}>
              <EuiIcon type="plusInCircleFilled" />
            </EuiHeaderSectionItemButton>
          </EuiHeaderSectionItem>
        </EuiHeaderSection>
      </EuiHeader>
      {beerForm && (
        <EuiFlyout onClose={() => setBeerForm(null)} size="s" ownFocus>
          <EuiFlyoutHeader hasBorder>
            <EuiTitle size="m">
              <h2>Add Beer</h2>
            </EuiTitle>
          </EuiFlyoutHeader>
          <EuiFlyoutBody>
            <BeerForm
              beer={beerForm}
              onSubmit={beer => {
                return queries.saveBeer(beer).then(() => setBeerForm(null));
              }}
            />
          </EuiFlyoutBody>
        </EuiFlyout>
      )}
      <EuiSpacer />
      {Array.isArray(beers) &&
        (beers.length > 0 ? (
          <EuiFlexGrid columns={4}>
            {beers.map(beer => (
              <EuiFlexItem key={beer._id}>
                <BeerCard
                  beer={beer}
                  onRemove={() => queries.removeBeer(beer)}
                  onEdit={() => setBeerForm(beer)}
                />
              </EuiFlexItem>
            ))}
          </EuiFlexGrid>
        ) : (
          <EuiEmptyPrompt
            iconType="starPlusEmpty"
            title={<h2>You have no beer</h2>}
            body={
              <React.Fragment>
                <p>
                  Sadly, You don't have any beer in our registry for the moment
                  =(
                  <br />
                  It's maybe the time to add one?
                </p>
              </React.Fragment>
            }
            actions={
              <EuiButton fill onClick={() => setBeerForm({})}>
                Add New Beer
              </EuiButton>
            }
          />
        ))}
    </React.Fragment>
  );
};
