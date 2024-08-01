import { useEffect, useState } from 'react';
import { Tabs, type TabsProps } from 'antd';

import { Customer } from '@/models/account';
import { getListCustomersApi, getListResultStaffApi } from '@/services/account';
import { getListRequestAcceptedApi, getListRequestApi } from '@/services/staff';

import { CODE_SUCCESS } from '@/constant/common';
import Loading from '@/component/common/loading/loading';

import { getUserInfo } from '@/utils/utils';

import { TAB_STAFF_KEY } from '../../home.constant';
import ListRequestTable from './components/list-request';
import ListCustomerTable from './components/list-customer';
import { ListRequest, ListResult } from './staff-home.model';
import { transformListRequestData, transformListResultData } from './staff-home.utils';
import ListResultTable from './components/list-result';

const StaffHome = () => {
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [loadDataRequestKey, setLoadDataRequestKey] = useState(0);
  const [loadDataRequestAcceptedKey, setLoadDataRequestAcceptedKey] = useState(0);
  const [loadListResultKey, setLoadListResultKey] = useState(0);

  const [listCustomers, setListCustomers] = useState<Customer[]>([]);
  const [listRequestCustomers, setListRequestCustomers] = useState<ListRequest[]>([]);
  const [listRequestAcceptedCustomers, setListRequestAcceptedCustomers] = useState<ListRequest[]>(
    []
  );
  const [listResult, setListResult] = useState<ListResult[]>([]);

  const getListCustomer = async () => {
    setIsLoading(true);
    const res = await getListCustomersApi();
    if (res?.status === CODE_SUCCESS) {
      setListCustomers(res?.data || []);
    }
    setIsLoading(false);
  };

  const getRequestCustomer = async () => {
    setIsLoading(true);
    const res = await getListRequestApi(getUserInfo().serviceId);
    if (res?.status === CODE_SUCCESS) {
      const dataSourceRevert = transformListRequestData(res.data);
      setListRequestCustomers(dataSourceRevert);
    }
    setIsLoading(false);
  };

  const getRequestAccepted = async () => {
    setIsLoading(true);
    const { employeeId, serviceId } = getUserInfo();
    const res = await getListRequestAcceptedApi(employeeId, serviceId);
    if (res?.status === CODE_SUCCESS) {
      const dataSourceRevert = transformListRequestData(res.data);
      setListRequestAcceptedCustomers(dataSourceRevert);
    }
    setIsLoading(false);
  };

  const getListResult = async () => {
    setIsLoading(true);
    const res = await getListResultStaffApi(getUserInfo().serviceId);
    if (res?.status === CODE_SUCCESS) {
      const dataSourceRevert = transformListResultData(res.data);
      setListResult(dataSourceRevert);
    }
    setIsLoading(false);
  };

  useEffect(() => {
    getListCustomer();
  }, []);

  useEffect(() => {
    getRequestCustomer();
    getRequestAccepted();
  }, [loadDataRequestKey]);

  useEffect(() => {
    loadDataRequestAcceptedKey && getRequestAccepted();
    getListResult();
  }, [loadDataRequestAcceptedKey]);

  useEffect(() => {
    loadListResultKey && getListResult();
  }, [loadListResultKey]);

  const LIST_ACTION_TAB: TabsProps['items'] = [
    {
      key: TAB_STAFF_KEY.CUSTOMERS,
      label: 'Danh sách khách hàng',
      children: <ListCustomerTable key={TAB_STAFF_KEY.CUSTOMERS} dataSource={listCustomers} />,
    },
    {
      key: TAB_STAFF_KEY.REQUEST_ORDER,
      label: 'Danh sách đơn yêu cầu kiểm định',
      children: (
        <ListRequestTable
          dataSource={listRequestCustomers}
          setLoadDataRequestKey={setLoadDataRequestKey}
        />
      ),
    },
    {
      key: TAB_STAFF_KEY.REQUEST_ACCEPT,
      label: 'Danh sách đơn đã xác nhận kiểm định',
      children: (
        <ListRequestTable
          isRequestAccepted
          dataSource={listRequestAcceptedCustomers}
          setLoadDataRequestAcceptedKey={setLoadDataRequestAcceptedKey}
        />
      ),
    },
    {
      key: TAB_STAFF_KEY.RESULT,
      label: 'Danh sách kết quả kiểm định',
      children: (
        <ListResultTable dataSource={listResult} setLoadListResultKey={setLoadListResultKey} />
      ),
    },
  ];

  return (
    <>
      <Loading loading={isLoading} />
      <Tabs defaultActiveKey={TAB_STAFF_KEY.CUSTOMERS} items={LIST_ACTION_TAB} />
    </>
  );
};

export default StaffHome;
