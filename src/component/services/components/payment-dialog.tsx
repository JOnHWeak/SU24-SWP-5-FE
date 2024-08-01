import { Dispatch, SetStateAction, useState } from 'react';
import Image from 'next/image';
import { Modal, Space, Typography } from 'antd';

import { useSelector } from 'react-redux';
import { selectCommonState } from '@/store/common-slice';

import useToast from '@/hooks/use-toast';
import useGetAccountInfo from '@/hooks/use-get-account-info';
import { getUserInfo } from '@/utils/utils';

import {
  transformCost,
  transformServiceBooking,
} from '@/component/history-request/history-request.utils';
import Loading from '@/component/common/loading/loading';
import { paymentDoneApi } from '@/services/account';
import { CODE_SUCCESS } from '@/constant/common';

import QRCode from '~/assets/images/QRCode.png';

export type BillDetail = {
  requestDate: string;
  email: string;
  phoneNumber: string;
  idCard: string;
  address: string;
  serviceId: string;
  status: string;
  employee: null;
};

enum BILL_DETAIL {
  EMAIL,
  NAME,
  ID_CARD,
  PHONE_NUMBER,
  SERVICE_ID,
  MONEY,
}

const LIST_BILL_DETAIL = [
  {
    title: 'Email',
    value: BILL_DETAIL.EMAIL,
  },
  {
    title: 'Họ và tên',
    value: BILL_DETAIL.NAME,
  },
  {
    title: 'CMND/CCCD',
    value: BILL_DETAIL.ID_CARD,
  },
  {
    title: 'Số điện thoại',
    value: BILL_DETAIL.PHONE_NUMBER,
  },
  {
    title: 'Gói đăng ký',
    value: BILL_DETAIL.SERVICE_ID,
  },
  {
    title: 'Số tiền thanh toán',
    value: BILL_DETAIL.MONEY,
  },
];

type Props = {
  serviceId: string;
  requestId: number;
  isOpenPaymentDialog: boolean;
  billDetail?: BillDetail;
  setIsOpenPaymentDialog: Dispatch<SetStateAction<boolean>>;
  setLoadDataKey?: Dispatch<SetStateAction<number>>;
};

const PaymentDialog = ({
  serviceId,
  requestId,
  isOpenPaymentDialog,
  billDetail,
  setIsOpenPaymentDialog,
  setLoadDataKey,
}: Props) => {
  const { listServices } = useSelector(selectCommonState);
  const { notify } = useToast();
  const { customerId } = useGetAccountInfo();

  const [isLoading, setIsLoading] = useState<boolean>(false);

  const handlePaymentDone = async () => {
    setIsLoading(true);
    setIsOpenPaymentDialog(false);
    const res = await paymentDoneApi({ requestId, customerId });

    if (res?.status === CODE_SUCCESS) {
      notify('success', 'Thanh toán thành công!');
      setLoadDataKey?.(Date.now());
    } else {
      notify('error', 'Error!');
    }
    setIsLoading(false);
  };

  const convertValue = (key: number) => {
    switch (key) {
      case BILL_DETAIL.EMAIL:
        return billDetail?.email;
      case BILL_DETAIL.NAME:
        return getUserInfo().customerName;
      case BILL_DETAIL.ID_CARD:
        return billDetail?.idCard;
      case BILL_DETAIL.PHONE_NUMBER:
        return billDetail?.phoneNumber;
      case BILL_DETAIL.SERVICE_ID:
        return `Gói ${Number(serviceId)} - ${transformServiceBooking(listServices, serviceId)}`;
      case BILL_DETAIL.MONEY:
        return transformCost(listServices, serviceId);
      default:
        return '';
    }
  };

  return (
    <>
      <Loading loading={isLoading} />

      <Modal
        width={800}
        open={isOpenPaymentDialog}
        title='Thanh toán'
        okText='Đã thanh toán'
        cancelText='Hủy'
        onOk={handlePaymentDone}
        onCancel={() => setIsOpenPaymentDialog(false)}
      >
        <Space align='center'>
          <Image width={250} height={250} src={QRCode} alt='Qrcode' />
          <Space direction='vertical'>
            {LIST_BILL_DETAIL.map((item) => (
              <Space key={item.value} align='center'>
                <Typography.Title level={4}>{item.title}:</Typography.Title>
                <Typography.Text style={{ fontSize: '16px' }}>
                  {convertValue(item.value)}
                </Typography.Text>
              </Space>
            ))}
          </Space>
        </Space>
      </Modal>
    </>
  );
};

export default PaymentDialog;
