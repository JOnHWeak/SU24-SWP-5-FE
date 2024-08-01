import { useState } from 'react';
import { Card } from 'antd';

import { useSelector } from 'react-redux';
import { selectCommonState } from '@/store/common-slice';

import DiamondButton from '../common/button';
import BookingServiceModal from './components/booking-service';
import { formatMoney } from '@/utils/utils';

const Services = () => {
  const { listServices } = useSelector(selectCommonState);
  const [isOpenBookServiceModal, setIsOpenBookServiceModal] = useState(false);

  const handleShowModal = () => {
    setIsOpenBookServiceModal(true);
  };

  return (
    <div className='d-flex flex-column align-items-center'>
      <div className='d-flex gap-4 mb-2'>
        {listServices.map((item) => (
          <Card key={item.serviceId} title={item.serviceType}>
            <p>
              {item.description.split('+').map((sentence, index) => (
                <span key={index}>
                  {sentence.trim()}
                  <br />
                  {index < item.description.split('+').length - 1 && '+'}
                </span>
              ))}
            </p>
            <p>{formatMoney(item.servicePrice)}</p>
          </Card>
        ))}
      </div>

      <DiamondButton width='200px' content='Đặt lịch ngay' onClick={handleShowModal} />

      <BookingServiceModal
        isOpenBookServiceModal={isOpenBookServiceModal}
        setIsOpenBookServiceModal={setIsOpenBookServiceModal}
      />
    </div>
  );
};

export default Services;
