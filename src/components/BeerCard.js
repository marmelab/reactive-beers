import React from 'react';
import styled from 'styled-components';
import { EuiCard, EuiButtonIcon } from '@elastic/eui';

const Illustration = styled.img`
  max-height: 200px;
`;

export const BeerCard = ({ beer, onRemove, onEdit }) => {
  const image = beer._attachments && beer._attachments.image;

  return (
    <EuiCard
      icon={
        image ? (
          <Illustration
            src={`data:${image.content_type};base64,${image.data}`}
            alt={beer.title}
          />
        ) : (
          <Illustration src="./blank-beer.png" alt="beer" />
        )
      }
      title={beer.title}
      description={beer.description}
      footer={
        <React.Fragment>
          <EuiButtonIcon
            aria-label="Remove"
            color="danger"
            iconType="trash"
            onClick={onRemove}
          />
          <EuiButtonIcon
            aria-label="Remove"
            iconType="pencil"
            onClick={onEdit}
          />
        </React.Fragment>
      }
    />
  );
};
