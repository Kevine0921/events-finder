import React, { FC } from 'react';

export interface IServerComponentProps {
  children?: React.ReactNode;
}

const ServerComponent: FC<IServerComponentProps> = ({ children }) => {
  console.log('Server Component');

  return (
    <div>
      <span>Server Component</span>
      {children}
    </div>
  );
};

export default ServerComponent;
