import { headers } from 'next/headers';
import React, { FC } from 'react';

export interface IServerComponentCopyProps {
  children?: React.ReactNode;
}

const ServerComponentCopy: FC<IServerComponentCopyProps> = ({ children }) => {
  console.log('Server Component Copy');
  // console.log(headers());

  return (
    <div>
      <span>Server Component Copy</span>
      {children}
    </div>
  );
};

export default ServerComponentCopy;
