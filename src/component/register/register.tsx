import { useState } from 'react';
import Link from 'next/link';

import { Formik, Form } from 'formik';
import * as Yup from 'yup';

import {
  ContactsOutlined,
  LockOutlined,
  MailOutlined,
  UnlockOutlined,
  PhoneOutlined,
} from '@ant-design/icons';
import { Input, Typography } from 'antd';

import { RegisterType } from '@/models/auth';
import { EMAIL_REG_EXP, ID_CARD_REG_EXP, PHONE_REG_EXP } from '@/constant/auth';

import InputField from '../input-field/input-field';

import './register.scss';
import DiamondButton from '../common/button';

type Props = {
  isVerify: boolean;
  onRegister: (values: RegisterType) => void;
  onVerifyMail: (verifyCode: string) => void;
};

const Register = ({ isVerify, onRegister, onVerifyMail }: Props) => {
  const validate = Yup.object({
    email: Yup.string().matches(EMAIL_REG_EXP, 'Định dạng email sai').required('Bắt buộc'),
    customerName: Yup.string()
      .min(3, 'Tối thiểu 3 ký tự')
      .max(50, 'Tối đa 50 ký tự')
      .required('Bắt buộc'),
    phoneNumber: Yup.string()
      .matches(PHONE_REG_EXP, 'Số điện thoại không hợp lệ')
      .required('Bắt buộc'),
    idCard: Yup.string().matches(ID_CARD_REG_EXP, 'Không hợp lệ').required('Bắt buộc'),
    address: Yup.string()
      .min(3, 'Tối thiểu 3 ký tự')
      .max(100, 'Tối đa 100 ký tự')
      .required('Bắt buộc'),
    password: Yup.string().min(8, 'Mật khẩu phải tối thiểu 8 ký tự').required('Bắt buộc'),
    confirmPassword: Yup.string()
      .oneOf([Yup.ref('password'), ''], 'Mật khẩu không khớp')
      .required('Bắt buộc'),
  });

  const [verifyCode, setVerifyCode] = useState('');

  const handleChangeOTP = (text: string) => {
    setVerifyCode(text);
  };

  return (
    <>
      {isVerify ? (
        <div className='d-flex align-items-center flex-column gap-4'>
          <Typography.Title level={2}>Vui lòng nhập mã xác nhận</Typography.Title>
          <Input.OTP length={6} onChange={handleChangeOTP} />
          <DiamondButton content='Xác nhận' size='large' onClick={() => onVerifyMail(verifyCode)} />
        </div>
      ) : (
        <Formik
          initialValues={{
            email: '',
            customerName: '',
            phoneNumber: '',
            idCard: '',
            address: '',
            password: '',
            confirmPassword: '',
          }}
          validationSchema={validate}
          onSubmit={(values) => onRegister(values)}
        >
          {() => (
            <div className='d-flex justify-content-center'>
              <div className='form-container' style={{ width: '518px' }}>
                <div className='form__content'>
                  <Form>
                    <div className='form'>
                      <h1 className='my-4 font-weight-bold'>Đăng ký</h1>
                      <div className='d-flex gap-2'>
                        <div className='form__field-special'>
                          <InputField
                            name='email'
                            type='email'
                            placeholder='Email'
                            prefix={<MailOutlined />}
                          />
                        </div>
                        <div className='form__field-special'>
                          <InputField
                            name='customerName'
                            type='text'
                            placeholder='Tên đầy đủ'
                            prefix={<ContactsOutlined />}
                          />
                        </div>
                      </div>

                      <div className='d-flex gap-2'>
                        <div className='form__field-special'>
                          <InputField
                            name='idCard'
                            type='text'
                            placeholder='CCCD/CMND'
                            prefix={<ContactsOutlined />}
                          />
                        </div>
                        <div className='form__field-special'>
                          <InputField
                            name='phoneNumber'
                            type='text'
                            placeholder='Số điện thoại'
                            prefix={<PhoneOutlined />}
                          />
                        </div>
                      </div>
                      <div className='form__field-special-2'>
                        <InputField
                          name='address'
                          type='text'
                          placeholder='Địa chỉ'
                          prefix={<ContactsOutlined />}
                        />
                      </div>
                      <div className='d-flex gap-2'>
                        <div className='form__field-special-3'>
                          <InputField
                            name='password'
                            type='password'
                            placeholder='Mật khẩu'
                            prefix={<LockOutlined />}
                          />
                        </div>
                        <div className='form__field-special-3'>
                          <InputField
                            name='confirmPassword'
                            type='password'
                            placeholder='Xác nhận mật khẩu'
                            prefix={<UnlockOutlined />}
                          />
                        </div>
                      </div>
                      <div className='d-flex gap-4 button-register'>
                        <DiamondButton
                          content='Đăng ký'
                          width='254px'
                          size='large'
                          className='mt-2'
                          htmlType='submit'
                        />
                        <DiamondButton
                          content='Xóa'
                          type='default'
                          width='180px'
                          size='large'
                          className='mt-2'
                          htmlType='reset'
                        />
                      </div>

                      <div className='mt-4'>
                        <Link href='/login' style={{ color: '#000' }}>
                          Bạn đã có tài khoản?
                        </Link>
                      </div>
                    </div>
                  </Form>
                </div>
                <div className='screen__background'>
                  <span className='screen__background__shape screen__background__shape4'></span>
                  <span className='screen__background__shape screen__background__shape3'></span>
                  <span className='screen__background__shape screen__background__shape2'></span>
                  <span className='screen__background__shape screen__background__shape1'></span>
                </div>
              </div>
            </div>
          )}
        </Formik>
      )}
    </>
  );
};

export default Register;
