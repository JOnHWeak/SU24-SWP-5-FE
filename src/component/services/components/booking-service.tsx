import { Dispatch, SetStateAction, useEffect, useRef, useState } from 'react';
import { Modal, Radio, RadioChangeEvent } from 'antd';

import * as Yup from 'yup';
import { Form, Formik, FormikProps } from 'formik';

import useToast from '@/hooks/use-toast';
import useGetAccountInfo from '@/hooks/use-get-account-info';

import { ID_CARD_REG_EXP, PHONE_REG_EXP } from '@/constant/auth';
import { BookingServicesRequest } from '@/models/account';

import InputField from '@/component/input-field/input-field';
import DiamondButton from '@/component/common/button';
import Loading from '@/component/common/loading/loading';
import PaymentDialog, { BillDetail } from './payment-dialog';
import { CODE_SUCCESS, CODE_SUCCESS_2 } from '@/constant/common';
import { bookingServiceApi, getDetailAccountCustomerApi } from '@/services/account';

const INIT_VALUES: BookingServicesRequest = {
  phoneNumber: '',
  idCard: '',
  address: '',
  serviceId: '1',
};

type Props = {
  isOpenBookServiceModal: boolean;
  setIsOpenBookServiceModal: Dispatch<SetStateAction<boolean>>;
};

const BookingServiceModal = ({ isOpenBookServiceModal, setIsOpenBookServiceModal }: Props) => {
  const { notify } = useToast();
  const { customerId } = useGetAccountInfo();

  const validate = Yup.object({
    phoneNumber: Yup.string()
      .matches(PHONE_REG_EXP, 'Số điện thoại không hợp lệ')
      .required('Bắt buộc'),
    idCard: Yup.string().matches(ID_CARD_REG_EXP, 'Không hợp lệ').required('Bắt buộc'),
    address: Yup.string()
      .min(3, 'Tối thiểu 3 ký tự')
      .max(100, 'Tối đa 100 ký tự')
      .required('Bắt buộc'),
  });

  const formRef = useRef<FormikProps<BookingServicesRequest>>(null);

  const [isOpenPaymentDialog, setIsOpenPaymentDialog] = useState(false);
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [requestId, setRequestId] = useState(0);
  const [initValues, setInitValues] = useState<BookingServicesRequest>(INIT_VALUES);
  const [serviceId, setServiceId] = useState(INIT_VALUES.serviceId);

  const [billDetail, setBillDetail] = useState<BillDetail | undefined>(undefined);

  useEffect(() => {
    formRef.current?.resetForm();
    isOpenBookServiceModal && setServiceId(INIT_VALUES.serviceId);
  }, [isOpenBookServiceModal]);

  useEffect(() => {
    if (isOpenBookServiceModal) {
      const getDetailAccount = async () => {
        if (customerId) {
          setIsLoading(true);
          const res = await getDetailAccountCustomerApi(Number(customerId));
          if (res?.status === CODE_SUCCESS) {
            const data = res.data;
            setInitValues((prev) => ({
              ...prev,
              phoneNumber: data.phoneNumber,
              idCard: data.idCard,
              address: data.address,
              serviceId: '1',
            }));
          } else {
            notify('error', 'Something error!');
          }
          setIsLoading(false);
        }
      };

      getDetailAccount();
    }
  }, [isOpenBookServiceModal]);

  const handleChangeService = (
    e: RadioChangeEvent,
    setFieldValue: (field: string, value: string) => void
  ) => {
    setFieldValue('serviceId', e.target.value);
    setServiceId(e.target.value);
  };

  const handleSubmitForm = async (values: BookingServicesRequest) => {
    setIsLoading(true);
    setIsOpenBookServiceModal(false);
    const res = await bookingServiceApi({ ...values, customerId });

    if (res?.status === CODE_SUCCESS_2) {
      notify('success', 'Đặt lịch thành công, bạn vui lòng kiểm tra lại thông tin và thanh toán!');
      setIsOpenPaymentDialog(true);
      setRequestId(res.data.request.requestId);
      setBillDetail(res.data.request);
    } else {
      notify('error', 'Error!');
    }
    setIsLoading(false);
  };

  return (
    <>
      <Loading loading={isLoading} />
      <Formik
        innerRef={formRef}
        initialValues={initValues}
        validationSchema={validate}
        onSubmit={handleSubmitForm}
        enableReinitialize
      >
        {({ values, handleSubmit, handleReset, setFieldValue }) => (
          <Form>
            <Modal
              open={isOpenBookServiceModal}
              title='Đặt lịch hẹn'
              okText='Đặt lịch ngay'
              cancelText='Hủy'
              onOk={() => handleSubmit()}
              onCancel={() => setIsOpenBookServiceModal(false)}
              footer={(_, { OkBtn, CancelBtn }) => (
                <>
                  <DiamondButton content='Xóa' type='text' htmlType='reset' onClick={handleReset} />
                  <CancelBtn />
                  <OkBtn />
                </>
              )}
            >
              <div className='form__field'>
                <InputField readOnly name='idCard' type='text' placeholder='CCCD/CMND' />
              </div>
              <div className='form__field'>
                <InputField readOnly name='phoneNumber' type='text' placeholder='Số điện thoại' />
              </div>
              <div className='form__field'>
                <InputField readOnly name='address' type='text' placeholder='Địa chỉ' />
              </div>
              <Radio.Group
                onChange={(e: RadioChangeEvent) => handleChangeService(e, setFieldValue)}
                value={values.serviceId}
              >
                <Radio value='1'>Gói Cơ Bản</Radio>
                <Radio value='2'>Gói Nâng Cao</Radio>
                <Radio value='3'>Gói Cao Cấp</Radio>
              </Radio.Group>
            </Modal>
            <PaymentDialog
              serviceId={serviceId}
              requestId={requestId}
              isOpenPaymentDialog={isOpenPaymentDialog}
              billDetail={billDetail}
              setIsOpenPaymentDialog={setIsOpenPaymentDialog}
            />
          </Form>
        )}
      </Formik>
    </>
  );
};

export default BookingServiceModal;
