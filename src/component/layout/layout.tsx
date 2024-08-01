import { ReactNode } from 'react';
import Head from 'next/head';

import { useSelector } from 'react-redux';
import { selectCommonState } from '@/store/common-slice';

import useListServices from '@/hooks/use-list-services';

import './layout.scss';
import { Header } from './header/header';
import Footer from './footer/footer';
import Loading from '../common/loading/loading';

type LayoutProps = {
  readonly children: ReactNode;
};

const Layout = ({ children }: LayoutProps) => {
  useListServices();
  const { isLoading } = useSelector(selectCommonState);

  return (
    <div style={{ overflow: 'auto' }}>
      <Loading loading={isLoading} />
      <Head>
        <title>Super Diamond</title>
      </Head>
      <Header />
      <main className='main-container'>{children}</main>
      <Footer />
    </div>
  );
};

export default Layout;
