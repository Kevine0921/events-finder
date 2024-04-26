'use client';

import React, { FC } from 'react';

export interface ClientComponentProps {
  children?: React.ReactNode;
}

const ClientComponent: FC<ClientComponentProps> = ({ children }) => {
  console.log('Client Component');

  return (
    <div>
      <span>Client Component</span>
      {children}
    </div>
  );
};

export default ClientComponent;
