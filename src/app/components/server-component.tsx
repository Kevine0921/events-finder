import React, { FC } from 'react';

export interface ServerComponentProps {
  children?: React.ReactNode;
}

const ServerComponent: FC<ServerComponentProps> = ({ children }) => {
  console.log('Server Component');

  return (
    <div>
      <span>Server Component</span>
      {children}
    </div>
  );
};

export default ServerComponent;
