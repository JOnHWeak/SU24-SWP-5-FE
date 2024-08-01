import { useState } from 'react';
import { Space, Table, TableProps } from 'antd';

import { useSelector } from 'react-redux';
import { selectCommonState } from '@/store/common-slice';

import { ServiceRequest } from '@/models/account';
import DiamondButton from '@/component/common/button';

import ServicesDetailModal from './services-detail';
import { formatMoney } from '@/utils/utils';

const INIT_VALUES: ServiceRequest = {
  serviceId: '1',
  description: '',
  servicePrice: 0,
  serviceType: '',
};

const ListServices = () => {
  const { listServices } = useSelector(selectCommonState);

  const [isOpenDetailService, setIsOpenDetailService] = useState(false);

  const [initServiceData, setInitServiceData] = useState(INIT_VALUES);

  const handleEditService = (rowData: ServiceRequest) => {
    setIsOpenDetailService(true);
    setInitServiceData({ ...rowData });
  };

  const servicesColumns: TableProps<ServiceRequest>['columns'] = [
    {
      title: 'Id',
      dataIndex: 'serviceId',
      key: 'serviceId',
      width: 100,
    },
    {
      title: 'Tên gói',
      dataIndex: 'serviceType',
      key: 'serviceType',
    },
    {
      title: 'Chi tiết gói',
      dataIndex: 'description',
      key: 'description',
    },
    {
      title: 'Giá gói',
      dataIndex: 'servicePrice',
      key: 'servicePrice',
      render: (_, rowData) => <>{formatMoney(rowData.servicePrice)}</>,
    },
    {
      title: 'Action',
      key: '',
      width: 180,
      render: (_, rowData) => (
        <Space size='middle'>
          <DiamondButton content='Chỉnh sửa' onClick={() => handleEditService(rowData)} />
        </Space>
      ),
    },
  ];
  return (
    <>
      <Table columns={servicesColumns} dataSource={listServices} />;
      <ServicesDetailModal
        initServiceData={initServiceData}
        isOpenDetailService={isOpenDetailService}
        setIsOpenDetailService={setIsOpenDetailService}
      />
    </>
  );
};

export default ListServices;
