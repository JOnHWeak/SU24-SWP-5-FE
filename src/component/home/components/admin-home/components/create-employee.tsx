import { Dispatch, SetStateAction, useEffect, useRef, useState } from 'react';
import { Form, Formik, FormikProps } from 'formik';
import * as Yup from 'yup';
import { Modal, Select } from 'antd';

import useToast from '@/hooks/use-toast';

import DiamondButton from '@/component/common/button';
import Loading from '@/component/common/loading/loading';
import InputField from '@/component/input-field/input-field';
import { EMAIL_REG_EXP, PHONE_REG_EXP } from '@/constant/auth';
import { CreateEmployeeRequest } from '@/models/account';
import { createEmployeeApi, updateEmployeeApi } from '@/services/account';
import { CODE_SUCCESS } from '@/constant/common';
import { PASSWORD_DEFAULT } from './list-employee';

type Props = {
  isEdit: boolean;
  initEmployeeData: CreateEmployeeRequest;
  isOpenCreateEmployeeModal: boolean;
  setIsOpenCreateEmployeeModal: Dispatch<SetStateAction<boolean>>;
  setLoadDataEmployeeKey: Dispatch<SetStateAction<number>>;
};

const CreateEmployeeModal = ({
  isEdit,
  initEmployeeData,
  isOpenCreateEmployeeModal,
  setIsOpenCreateEmployeeModal,
  setLoadDataEmployeeKey,
}: Props) => {
  const { notify } = useToast();

  const formRef = useRef<FormikProps<CreateEmployeeRequest>>(null);

  const [isLoading, setIsLoading] = useState<boolean>(false);

  const validate = Yup.object({
    email: Yup.string().matches(EMAIL_REG_EXP, 'Định dạng email sai').required('Bắt buộc'),
    password: Yup.string().min(8, 'Mật khẩu có ít nhất 8 ký tự').required('Bắt buộc'),
    phone: Yup.string().matches(PHONE_REG_EXP, 'Số điện thoại không hợp lệ').required('Bắt buộc'),
    employeeName: Yup.string()
      .min(3, 'Tối thiểu 3 ký tự')
      .max(100, 'Tối đa 100 ký tự')
      .required('Bắt buộc'),
  });

  useEffect(() => {
    formRef.current?.resetForm();
  }, [isOpenCreateEmployeeModal]);

  const handleSubmitForm = async (values: CreateEmployeeRequest) => {
    setIsLoading(true);
    setIsOpenCreateEmployeeModal(false);

    if (isEdit) {
      const res = await updateEmployeeApi({
        ...values,
        password: values.password === PASSWORD_DEFAULT ? undefined : values.password,
      });
      if (res?.status === CODE_SUCCESS) {
        notify('success', 'Cập nhật thông tin nhân viên thành công!');
        setLoadDataEmployeeKey(Date.now());
      } else {
        notify('error', 'Error!');
      }
    } else {
      const res = await createEmployeeApi({ ...values });
      if (res?.status === CODE_SUCCESS) {
        notify('success', 'Tạo nhân viên thành công!');
        setLoadDataEmployeeKey(Date.now());
      } else {
        notify('error', 'Error!');
      }
    }

    setIsLoading(false);
  };

  return (
    <>
      <Loading loading={isLoading} />
      <Formik
        enableReinitialize
        innerRef={formRef}
        initialValues={initEmployeeData}
        validationSchema={validate}
        onSubmit={handleSubmitForm}
      >
        {({ values, handleSubmit, handleReset, setFieldValue }) => (
          <Form>
            <Modal
              open={isOpenCreateEmployeeModal}
              title={isEdit ? 'Chỉnh sửa thông tin nhân viên' : 'Tạo mới nhân viên mới'}
              okText={isEdit ? 'Cập nhật' : 'Tạo mới'}
              cancelText='Hủy'
              onOk={() => handleSubmit()}
              onCancel={() => setIsOpenCreateEmployeeModal(false)}
              footer={(_, { OkBtn, CancelBtn }) => (
                <>
                  <DiamondButton content='Xóa' type='text' htmlType='reset' onClick={handleReset} />
                  <CancelBtn />
                  <OkBtn />
                </>
              )}
            >
              <div className='form__field'>
                <InputField name='email' type='text' placeholder='Email' />
              </div>
              <div className='form__field'>
                <InputField name='password' type='password' placeholder='Mật khẩu' />
              </div>
              <div className='form__field'>
                <InputField name='employeeName' type='text' placeholder='Tên nhân viên' />
              </div>
              <div className='form__field'>
                <InputField name='phone' type='text' placeholder='Số điện thoại' />
              </div>
              <div style={{ width: '100%' }}>
                <Select
                  style={{ width: '100%' }}
                  size='large'
                  defaultValue={values.serviceId}
                  options={[
                    { value: '1', label: 'Nhân viên cơ bản' },
                    { value: '2', label: 'Nhân viên nâng cao' },
                    { value: '3', label: 'Nhân viên cao cấp' },
                  ]}
                  onChange={(value: string) => {
                    setFieldValue('serviceId', value);
                  }}
                />
              </div>
            </Modal>
          </Form>
        )}
      </Formik>
    </>
  );
};

export default CreateEmployeeModal;
