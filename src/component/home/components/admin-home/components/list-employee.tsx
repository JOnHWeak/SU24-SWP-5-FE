import { Dispatch, SetStateAction, useState } from 'react';
import { Popconfirm, Space, TableProps } from 'antd';

import { CreateEmployeeRequest, Employee } from '@/models/account';
import DiamondButton from '@/component/common/button';
import useToast from '@/hooks/use-toast';

import CustomTable from '../../custom-table/custom-table';
import { PlusOutlined } from '@ant-design/icons';
import CreateEmployeeModal from './create-employee';
import Loading from '@/component/common/loading/loading';
import { deleteEmployeeApi } from '@/services/account';
import { CODE_SUCCESS } from '@/constant/common';

type Props = {
  dataSource: Employee[];
  setLoadDataEmployeeKey: Dispatch<SetStateAction<number>>;
};

const INIT_VALUES: CreateEmployeeRequest = {
  email: '',
  employeeName: '',
  password: '',
  phone: '',
  serviceId: '1',
};

export const PASSWORD_DEFAULT = '4234fsdgdfw4%#$%#$fsdf';

const ListEmployee = ({ dataSource, setLoadDataEmployeeKey }: Props) => {
  const { notify } = useToast();

  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [isEdit, setIsEdit] = useState(false);
  const [isOpenCreateEmployeeModal, setIsOpenCreateEmployeeModal] = useState(false);
  const [initEmployeeData, setInitEmployeeData] = useState(INIT_VALUES);

  const handleCreateEmployee = () => {
    setIsOpenCreateEmployeeModal(true);
    setIsEdit(false);
    setInitEmployeeData(INIT_VALUES);
  };

  const handleEditEmployee = (rowData: CreateEmployeeRequest) => {
    setIsOpenCreateEmployeeModal(true);
    setIsEdit(true);
    setInitEmployeeData({ ...rowData, password: PASSWORD_DEFAULT });
  };

  const handleDeleteEmployee = async (employeeId: number) => {
    setIsLoading(true);
    const res = await deleteEmployeeApi(employeeId);
    if (res?.status === CODE_SUCCESS) {
      notify('success', 'Xóa nhân viên thành công!');
      setLoadDataEmployeeKey(Date.now());
    } else {
      notify('error', 'Nhân viên đang có đơn!');
    }
    setIsLoading(false);
  };

  const employeeColumns: TableProps<Employee>['columns'] = [
    {
      title: 'Id',
      dataIndex: 'employeeId',
      key: 'employeeId',
      width: 100,
    },
    {
      title: 'Tên nhân viên',
      dataIndex: 'employeeName',
      key: 'employeeName',
    },
    {
      title: 'Email',
      dataIndex: 'email',
      key: 'email',
    },
    {
      title: 'Số điện thoại',
      dataIndex: 'phone',
      key: 'phone',
    },
    {
      title: 'Action',
      key: '',
      width: 240,
      render: (_, rowData) => (
        <Space size='middle'>
          <DiamondButton content='Chỉnh sửa' onClick={() => handleEditEmployee(rowData)} />
          <Popconfirm
            title='Xóa nhân viên'
            description='Bạn có muốn xóa nhân viên?'
            onConfirm={() => handleDeleteEmployee(rowData.employeeId)}
            okText='Xóa'
            cancelText='Hủy'
          >
            <DiamondButton danger content='Xóa' />
          </Popconfirm>
        </Space>
      ),
    },
  ];
  return (
    <>
      <Loading loading={isLoading} />
      <div className='d-flex flex-column'>
        <div className='d-flex flex-row-reverse my-2'>
          <DiamondButton
            icon={<PlusOutlined />}
            content='Thêm nhân viên'
            onClick={handleCreateEmployee}
          />
        </div>
        <CustomTable columns={employeeColumns} dataSource={dataSource} />;
      </div>
      <CreateEmployeeModal
        isEdit={isEdit}
        initEmployeeData={initEmployeeData}
        isOpenCreateEmployeeModal={isOpenCreateEmployeeModal}
        setIsOpenCreateEmployeeModal={setIsOpenCreateEmployeeModal}
        setLoadDataEmployeeKey={setLoadDataEmployeeKey}
      />
    </>
  );
};

export default ListEmployee;
