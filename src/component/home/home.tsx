import useGetAccountInfo from '@/hooks/use-get-account-info';

import AdminHome from './components/admin-home/admin-home';
import { ACCOUNT_ROLE } from '@/constant/auth';
import StaffHome from './components/staff-home/staff-home';
import CustomerHome from './components/customer-home';

const Home = () => {
  const { role } = useGetAccountInfo();

  return (
    <div className='page-container-2'>
      <div className='page-content'>
        {role === ACCOUNT_ROLE.ADMIN ? (
          <AdminHome />
        ) : role === ACCOUNT_ROLE.STAFF ? (
          <StaffHome />
        ) : (
          <CustomerHome />
        )}
      </div>
    </div>
  );
};

export default Home;
