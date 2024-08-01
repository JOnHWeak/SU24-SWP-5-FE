import { Dispatch, SetStateAction, useEffect, useState } from 'react';
import { Popconfirm, Space, TableProps } from 'antd';

import useToast from '@/hooks/use-toast';

import CustomTable from '../../custom-table/custom-table';
import DiamondButton from '@/component/common/button';
import { ListResult } from '../staff-home.model';
import { acceptResultApi, cancelResultApi, sealServiceApi } from '@/services/account';
import { CODE_SUCCESS } from '@/constant/common';
import Loading from '@/component/common/loading/loading';
import { RESULT_STATUS } from '@/component/home/home.constant';
import CreateResultModal from './create-result';
import { CreateResultRequest } from '@/models/account';

type Props = {
  isAdmin?: boolean;
  dataSource: ListResult[];
  setLoadListResultKey?: Dispatch<SetStateAction<number>>;
};

const ListResultTable = ({ isAdmin, dataSource, setLoadListResultKey }: Props) => {
  const { notify } = useToast();

  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [resultColumns, setResultColumns] = useState<TableProps<ListResult>['columns']>([]);

  const [isOpenCreateResultModal, setIsOpenCreateResultModal] = useState<boolean>(false);
  const [initValues, setInitValues] = useState<CreateResultRequest | undefined>(undefined);

  const handleAcceptOrCancelResult = async (requestId?: number | string, isAccept = true) => {
    setIsLoading(true);
    const res = isAccept
      ? await acceptResultApi(Number(requestId))
      : await cancelResultApi(Number(requestId));

    if (res?.status === CODE_SUCCESS) {
      notify('success', isAccept ? 'Duyệt kết quả thành công!' : 'Hủy kết quả thành công!');
      setLoadListResultKey?.(Date.now());
    } else {
      notify('error', 'Error!');
    }
    setIsLoading(false);
  };

  const handleOpenChangeResult = (rowData: ListResult) => {
    setIsOpenCreateResultModal(true);
    setInitValues({ ...rowData, requestId: String(rowData.requestId) });
  };

  const handleSealService = async (requestId: number) => {
    const employeeId = localStorage.getItem('EMPLOYEE_ID');
    setIsLoading(true);
    const res = await sealServiceApi(requestId, Number(employeeId));

    if (res?.status === CODE_SUCCESS) {
      notify('success', 'Niêm phong thành công!');
      setLoadListResultKey?.(Date.now());
    } else {
      notify('error', 'Error!');
    }
    setIsLoading(false);
  };

  const customColumnStaffAction = (rowData: ListResult) => {
    if (rowData.requestStatus === RESULT_STATUS.CANCEL_RESULT) {
      return (
        <DiamondButton content='Sửa kết quả' onClick={() => handleOpenChangeResult(rowData)} />
      );
    } else if (rowData.requestStatus === RESULT_STATUS.ACCEPTED_RESULT) {
      return (
        <Popconfirm
          title='Niêm phong'
          description='Bạn có muốn niêm phong quả này?'
          onConfirm={() => handleSealService(Number(rowData?.requestId))}
          okText='Xác nhận'
          cancelText='Đóng'
        >
          <DiamondButton content='Niêm phong' />
        </Popconfirm>
      );
    }
    return <></>;
  };

  useEffect(() => {
    const columns: TableProps<ListResult>['columns'] = [
      {
        title: 'Mã kết quả',
        dataIndex: 'resultId',
        key: 'resultId',
        width: 140,
        fixed: 'left',
      },
      {
        title: 'Mã yêu cầu',
        dataIndex: 'requestId',
        key: 'requestId',
        width: 140,
        fixed: 'left',
      },
      {
        title: 'Mã kim cương',
        dataIndex: 'diamondId',
        key: 'diamondId',
        width: 160,
      },
      {
        title: 'Nguồn gốc kim cương',
        dataIndex: 'diamondOrigin',
        key: 'diamondOrigin',
        width: 220,
      },
      {
        title: 'Hình dạng',
        dataIndex: 'shape',
        key: 'shape',
        width: 140,
      },
      {
        title: 'Kích thước',
        dataIndex: 'measurements',
        key: 'measurements',
        width: 140,
      },
      {
        title: 'Trọng lượng carat',
        dataIndex: 'caratWeight',
        key: 'caratWeight',
        width: 200,
      },
      {
        title: 'Màu sắc',
        dataIndex: 'color',
        key: 'color',
        width: 140,
      },
      {
        title: 'Độ trong',
        dataIndex: 'clarity',
        key: 'clarity',
        width: 140,
      },
      {
        title: 'Chất lượng cắt',
        dataIndex: 'cut',
        key: 'cut',
        width: 200,
      },
      {
        title: 'Tỷ lệ',
        dataIndex: 'proportions',
        key: 'proportions',
        width: 140,
      },
      {
        title: 'Đánh bóng',
        dataIndex: 'polish',
        key: 'polish',
        width: 140,
      },
      {
        title: 'Đối xứng',
        dataIndex: 'symmetry',
        key: 'symmetry',
        width: 140,
      },
      {
        title: 'Độ huỳnh quang',
        dataIndex: 'fluorescence',
        key: 'fluorescence',
        width: 200,
      },
      {
        title: 'Trạng thái',
        dataIndex: 'requestStatus',
        key: 'requestStatus',
        width: 140,
        fixed: 'right',
      },
    ];
    if (isAdmin) {
      columns.push({
        title: 'Action',
        key: '',
        width: 240,
        fixed: 'right',
        render: (_, rowData) => (
          <>
            {rowData?.requestStatus?.toLocaleLowerCase() !==
              RESULT_STATUS.ACCEPTED_RESULT.toLocaleLowerCase() &&
            rowData?.requestStatus?.toLocaleLowerCase() !==
              RESULT_STATUS.CANCEL_RESULT.toLocaleLowerCase() ? (
              <Space size='middle'>
                <Popconfirm
                  title='Duyệt kết quả'
                  description='Bạn có muốn duyệt kết quả này?'
                  onConfirm={() => handleAcceptOrCancelResult(rowData?.requestId)}
                  okText='Xác nhận'
                  cancelText='Đóng'
                >
                  <DiamondButton content='Duyệt kết quả' />
                </Popconfirm>
                <Popconfirm
                  title='Hủy kết quả'
                  description='Bạn có muốn hủy kết quả này?'
                  onConfirm={() => handleAcceptOrCancelResult(rowData?.requestId, false)}
                  okText='Xác nhận'
                  cancelText='Đóng'
                >
                  <DiamondButton danger content='Hủy' />
                </Popconfirm>
              </Space>
            ) : (
              <></>
            )}
          </>
        ),
      });
    } else {
      columns.push({
        title: 'Action',
        key: '',
        width: 160,
        fixed: 'right',
        render: (_, rowData) => <>{customColumnStaffAction(rowData)}</>,
      });
    }

    setResultColumns(columns);
  }, [isAdmin]);

  return (
    <>
      <Loading loading={isLoading} />
      <div className='d-flex flex-column'>
        <CustomTable columns={resultColumns || []} dataSource={dataSource} />
      </div>
      <CreateResultModal
        isUpdate
        initValues={initValues}
        isOpenCreateResultModal={isOpenCreateResultModal}
        setIsOpenCreateResultModal={setIsOpenCreateResultModal}
        setLoadDataRequestAcceptedKey={setLoadListResultKey}
      />
    </>
  );
};

export default ListResultTable;
