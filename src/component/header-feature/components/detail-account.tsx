import { Dispatch, FormEvent, SetStateAction, useEffect, useRef, useState } from 'react';
import { useDispatch } from 'react-redux';
import { Modal, Skeleton } from 'antd';

import * as Yup from 'yup';
import { Form, Formik, FormikProps } from 'formik';
import useToast from '@/hooks/use-toast';
import useGetAccountInfo from '@/hooks/use-get-account-info';

import { EMAIL_REG_EXP, PHONE_REG_EXP } from '@/constant/auth';
import { CODE_SUCCESS } from '@/constant/common';
import { setLocalStorageUserInfo } from '@/utils/utils';

import { getDetailAccountCustomerApi, updateDetailAccountCustomerApi } from '@/services/account';
import { AccountDetailRequest } from '@/models/account';

import DiamondButton from '@/component/common/button';
import InputField from '@/component/input-field/input-field';
import { setRenderHeaderInfo } from '@/store/auth-slice';
import ChangePasswordModal from './change-password';

const INIT_VALUES: AccountDetailRequest = {
  customerName: '',
  phoneNumber: '',
  idCard: '',
  address: '',
  email: '',
};

type Props = {
  isOpenDetailAccount: boolean;
  setIsOpenDetailAccount: Dispatch<SetStateAction<boolean>>;
};

const DetailAccountModal = ({ isOpenDetailAccount, setIsOpenDetailAccount }: Props) => {
  const dispatch = useDispatch();
  const { notify } = useToast();
  const { customerId } = useGetAccountInfo();

  const validate = Yup.object({
    customerName: Yup.string()
      .min(3, 'Tối thiểu 3 ký tự')
      .max(50, 'Tối đa 50 ký tự')
      .required('Bắt buộc'),
    email: Yup.string().matches(EMAIL_REG_EXP, 'Định dạng email sai').required('Bắt buộc'),
    phoneNumber: Yup.string().matches(PHONE_REG_EXP, 'Số điện thoại không hợp lệ').notRequired(),
    idCard: Yup.string().min(6, 'Tối thiểu 6 ký tự').max(18, 'Tối đa 18 ký tự').notRequired(),
    address: Yup.string().min(3, 'Tối thiểu 3 ký tự').max(100, 'Tối đa 100 ký tự').notRequired(),
  });

  const formRef = useRef<FormikProps<AccountDetailRequest>>(null);

  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [detailAccount, setDetailAccount] = useState<AccountDetailRequest>(INIT_VALUES);
  const [isEdit, setIsEdit] = useState<boolean>(false);
  const [isOpenChangePasswordModal, setIsOpenChangePasswordModal] = useState<boolean>(false);

  const getDetailAccount = async () => {
    if (customerId) {
      setIsLoading(true);
      const res = await getDetailAccountCustomerApi(Number(customerId));
      if (res?.status === CODE_SUCCESS) {
        setDetailAccount(res.data);
      } else {
        notify('error', 'Something error!');
      }
      setIsLoading(false);
    }
  };

  useEffect(() => {
    formRef.current?.resetForm();
    setIsEdit(false);
    if (isOpenDetailAccount) {
      getDetailAccount();
    }
  }, [isOpenDetailAccount]);

  const handleSubmitForm = async (values: AccountDetailRequest) => {
    setIsLoading(true);
    const res = await updateDetailAccountCustomerApi(values);
    if (res?.status === CODE_SUCCESS) {
      notify('success', 'Cập nhật thông tin thành công!');
      localStorage.setItem('CUSTOMER_NAME', values.customerName);
      setLocalStorageUserInfo(res.data);
      dispatch(setRenderHeaderInfo(Date.now()));
      setIsEdit(false);
      setIsOpenDetailAccount(false);
    } else {
      notify('error', 'Something error!');
      setIsOpenDetailAccount(false);
    }
    setIsLoading(false);
  };

  const customFooter = (handleSubmit: (e?: FormEvent<HTMLFormElement>) => void, CancelBtn: any) => {
    return (
      <>
        <DiamondButton
          content='Đổi mật khẩu'
          type='text'
          onClick={() => setIsOpenChangePasswordModal(true)}
        />
        <CancelBtn />
        <DiamondButton content='Sửa' type='dashed' onClick={() => setIsEdit(true)} />
        <DiamondButton
          disabled={!isEdit}
          content='Cập nhật'
          htmlType='submit'
          onClick={() => handleSubmit()}
        />
      </>
    );
  };

  return (
    <>
      <Formik
        innerRef={formRef}
        initialValues={detailAccount}
        enableReinitialize
        validationSchema={validate}
        onSubmit={handleSubmitForm}
      >
        {({ handleSubmit }) => (
          <Form>
            <Modal
              open={isOpenDetailAccount}
              title='Thông tin tài khoản'
              cancelText='Hủy'
              onCancel={() => setIsOpenDetailAccount(false)}
              footer={(_, { CancelBtn }) => customFooter(handleSubmit, CancelBtn)}
            >
              {isLoading ? (
                <Skeleton loading={isLoading} />
              ) : (
                <>
                  <div className='form__field'>
                    <InputField
                      disabled={!isEdit}
                      name='customerName'
                      type='text'
                      label='Họ và tên'
                      placeholder='Họ và tên'
                    />
                  </div>
                  <div className='form__field'>
                    <InputField
                      disabled={!isEdit}
                      name='email'
                      type='text'
                      label='Email'
                      placeholder='Email'
                    />
                  </div>
                  <div className='form__field'>
                    <InputField
                      disabled={!isEdit}
                      name='phoneNumber'
                      type='text'
                      label='Số điện thoại'
                      placeholder='Số điện thoại'
                    />
                  </div>
                  <div className='form__field'>
                    <InputField
                      disabled={!isEdit}
                      name='idCard'
                      type='text'
                      label='CCCD/CMND'
                      placeholder='CCCD/CMND'
                    />
                  </div>
                  <div className='form__field'>
                    <InputField
                      disabled={!isEdit}
                      name='address'
                      type='text'
                      label='Địa chỉ'
                      placeholder='Địa chỉ'
                    />
                  </div>
                </>
              )}
            </Modal>
          </Form>
        )}
      </Formik>

      <ChangePasswordModal
        isOpenChangePasswordModal={isOpenChangePasswordModal}
        setIsOpenChangePasswordModal={setIsOpenChangePasswordModal}
      />
    </>
  );
};

export default DetailAccountModal;
