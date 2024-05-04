import React from 'react';
import Header from '@/app/components/header';

export interface PageProps {}

export default function Page({}: PageProps) {
  return (
    <>
      <Header>Dashboard / new Companies</Header>
      <div>Some additional info</div>
    </>
  );
}
