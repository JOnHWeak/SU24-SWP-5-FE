import { Dispatch, SetStateAction, useState } from 'react';
import { Popconfirm, Space, TableProps } from 'antd';

import { useSelector } from 'react-redux';
import { selectCommonState } from '@/store/common-slice';

import useToast from '@/hooks/use-toast';
import useGetAccountInfo from '@/hooks/use-get-account-info';

import DiamondButton from '@/component/common/button';
import Loading from '@/component/common/loading/loading';
import { CODE_SUCCESS } from '@/constant/common';

import CustomTable from '../../custom-table/custom-table';
import { ListRequest } from '../staff-home.model';
import { updateStatusDoneDiamondApi, updateStatusWhenReceivedDiamondApi } from '@/services/staff';
import CreateResultModal from './create-result';
import { transformServiceBooking } from '@/component/history-request/history-request.utils';
import { RESULT_STATUS } from '@/component/home/home.constant';

type Props = {
  isRequestAccepted?: boolean;
  dataSource: ListRequest[];
  setLoadDataRequestKey?: Dispatch<SetStateAction<number>>;
  setLoadDataRequestAcceptedKey?: Dispatch<SetStateAction<number>>;
};

const ListRequestTable = ({
  isRequestAccepted,
  dataSource,
  setLoadDataRequestKey,
  setLoadDataRequestAcceptedKey,
}: Props) => {
  const { notify } = useToast();
  const { employeeId } = useGetAccountInfo();
  const { listServices } = useSelector(selectCommonState);

  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [isOpenCreateResultModal, setIsOpenCreateResultModal] = useState<boolean>(false);
  const [requestId, setRequestId] = useState(0);

  const handleAcceptRequest = async (requestId: number) => {
    setIsLoading(true);
    const res = await updateStatusWhenReceivedDiamondApi(requestId, employeeId);

    if (res?.status === CODE_SUCCESS) {
      notify('success', 'Xác nhận thành công!');
      setLoadDataRequestKey?.(Date.now());
    } else {
      notify('error', 'Error!');
    }
    setIsLoading(false);
  };

  const handleClickAction = async (rowData: ListRequest) => {
    if (rowData.status === RESULT_STATUS.ACCEPTED_RESULT) {
      const res = await updateStatusDoneDiamondApi(rowData.requestId, employeeId);
      if (res?.status === CODE_SUCCESS) {
        notify('success', 'Khách hàng đã nhận kim cương!');
        setLoadDataRequestAcceptedKey?.(Date.now());
      } else {
        notify('error', 'Error!');
      }
      return;
    }
    setRequestId(rowData.requestId);
    setIsOpenCreateResultModal(true);
  };

  const listRequestColumns: TableProps<ListRequest>['columns'] = [
    {
      title: 'Mã đơn hàng',
      dataIndex: 'requestId',
      key: 'requestId',
    },
    {
      title: 'Tên khách hàng',
      dataIndex: 'customerName',
      key: 'customerName',
    },
    {
      title: 'CMND/CCCD',
      dataIndex: 'idCard',
      key: 'idCard',
    },
    {
      title: 'Email',
      dataIndex: 'email',
      key: 'email',
    },
    {
      title: 'Địa chỉ',
      dataIndex: 'address',
      key: 'address',
    },
    {
      title: 'Gói',
      dataIndex: 'serviceId',
      key: '',
      render: (_, rowData) => <>{transformServiceBooking(listServices, rowData.serviceId)}</>,
    },
    {
      title: 'Trạng thái',
      dataIndex: 'status',
      key: 'status',
    },
    {
      title: 'Action',
      width: '200px',
      render: (_, rowData) => (
        <Space size='middle'>
          {isRequestAccepted ? (
            <DiamondButton
              content={
                rowData.status === RESULT_STATUS.ACCEPTED_RESULT
                  ? 'Đã giao kim cương'
                  : 'Nhập kết quả'
              }
              onClick={() => handleClickAction(rowData)}
            />
          ) : (
            <Popconfirm
              title='Xác nhận đơn'
              description='Bạn có muốn nhận đơn này?'
              onConfirm={() => handleAcceptRequest(rowData.requestId)}
              okText='Xác nhận'
              cancelText='Hủy'
            >
              <DiamondButton content='Đã nhận kim cương' />
            </Popconfirm>
          )}
        </Space>
      ),
    },
  ];

  return (
    <>
      <Loading loading={isLoading} />
      <div className='d-flex flex-column'>
        <CustomTable columns={listRequestColumns} dataSource={dataSource} />
      </div>
      <CreateResultModal
        requestId={requestId}
        isOpenCreateResultModal={isOpenCreateResultModal}
        setIsOpenCreateResultModal={setIsOpenCreateResultModal}
        setLoadDataRequestAcceptedKey={setLoadDataRequestAcceptedKey}
      />
    </>
  );
};

export default ListRequestTable;
