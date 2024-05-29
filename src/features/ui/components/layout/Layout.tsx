import { ReactElement, ReactNode } from 'react';
import Header from '../header/Header';
import './Layout.scss';

function Layout({ children }: { children: ReactNode }): ReactElement {
  return (
    <>
      <Header />

      <main className="main-content">{children}</main>
    </>
  );
}

export default Layout;
