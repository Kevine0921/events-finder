'use client';

import React from 'react';
import Button from '@/app/components/button';

export interface ErrorSalesComponentProps {
  error: Error;
  reset: () => void;
}

export default function ErrorComponent({
  error,
  reset,
}: ErrorSalesComponentProps) {
  return (
    <div>
      <p>{`Error inside slot sales. ${error.message}`}</p>
      <Button onClick={() => reset()}>Try again</Button>
    </div>
  );
}
