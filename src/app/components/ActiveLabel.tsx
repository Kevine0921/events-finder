import React, { FC } from 'react';

interface IActiveLabelProps {
  children: React.ReactNode;
}

const ActiveLabel: FC<IActiveLabelProps> = ({ children }) => {
  return <span>{children}</span>;
};

export default ActiveLabel;
