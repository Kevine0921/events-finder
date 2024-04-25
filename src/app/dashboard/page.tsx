import Link from 'next/link';
import React from 'react';

export interface IPageDashboardProps {}

const PageDashboard = () => {
  return (
    <main className="text-xl flex flex-col">
      <p>Dashboard</p>
      <Link href="/dashboard/settings" className="text-orange-500">
        Settings
      </Link>
      <Link href="/dashboard/_privatFolder" className="text-orange-500">
        _privatFolder
      </Link>
    </main>
  );
};

export default PageDashboard;
