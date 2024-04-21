'use client';

import React, { FC } from 'react';

export interface IClientComponentProps {
  children?: React.ReactNode;
}

const ClientComponent: FC<IClientComponentProps> = ({ children }) => {
  console.log('Client Component');

  return (
    <div>
      <span>Client Component</span>
      {children}
    </div>
  );
};

export default ClientComponent;
