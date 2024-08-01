import { Dispatch, SetStateAction, useEffect, useRef } from 'react';
import { Form, Formik, FormikProps } from 'formik';
import * as Yup from 'yup';
import { Modal } from 'antd';

import useListServices from '@/hooks/use-list-services';

import InputField from '@/component/input-field/input-field';
import { ServiceRequest } from '@/models/account';

type Props = {
  initServiceData: ServiceRequest;
  isOpenDetailService: boolean;
  setIsOpenDetailService: Dispatch<SetStateAction<boolean>>;
};

const ServicesDetailModal = ({
  initServiceData,
  isOpenDetailService,
  setIsOpenDetailService,
}: Props) => {
  const { handleUpdateService } = useListServices();

  const formRef = useRef<FormikProps<ServiceRequest>>(null);

  const validate = Yup.object({
    serviceType: Yup.string().required('Bắt buộc'),
    description: Yup.string().required('Bắt buộc'),
    servicePrice: Yup.string().required('Bắt buộc'),
  });

  useEffect(() => {
    formRef.current?.resetForm();
  }, [isOpenDetailService]);

  const handleSubmitForm = async (values: ServiceRequest) => {
    handleUpdateService(values, setIsOpenDetailService);
  };

  return (
    <Formik
      enableReinitialize
      innerRef={formRef}
      initialValues={initServiceData}
      validationSchema={validate}
      onSubmit={handleSubmitForm}
    >
      {({ handleSubmit }) => (
        <Form>
          <Modal
            open={isOpenDetailService}
            title={'Cập nhập dịch vụ'}
            okText={'Cập nhật'}
            cancelText='Hủy'
            onOk={() => handleSubmit()}
            onCancel={() => setIsOpenDetailService(false)}
          >
            <div className='form__field'>
              <InputField disabled name='serviceId' type='text' />
            </div>
            <div className='form__field'>
              <InputField name='serviceType' type='text' label='Tên gói' placeholder='Tên gói' />
            </div>
            <div className='form__field'>
              <InputField
                name='description'
                type='text'
                label='Chi tiết gói'
                placeholder='Chi tiết gói'
              />
            </div>
            <div className='form__field'>
              <InputField name='servicePrice' type='text' label='Giá gói' placeholder='Giá gói' />
            </div>
          </Modal>
        </Form>
      )}
    </Formik>
  );
};

export default ServicesDetailModal;
