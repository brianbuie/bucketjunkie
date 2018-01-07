import React from 'react';
import { PageHeading } from 'components/UI';
import CenteredLayout from 'components/Layout/CenteredLayout';

const NotFound = () => (
  <CenteredLayout>
    <PageHeading eyebrow="Error" headline="404" subhead="That page doesn't exist!" />
  </CenteredLayout>
);

export default NotFound;