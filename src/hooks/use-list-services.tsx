import { Dispatch, SetStateAction, useEffect, useState } from 'react';

import { useDispatch } from 'react-redux';
import { setIsLoading, setListServices } from '@/store/common-slice';

import useToast from './use-toast';

import { CODE_SUCCESS } from '@/constant/common';
import { getListServicesApi, updateServiceApi } from '@/services/account';
import { ServiceRequest } from '@/models/account';

const useListServices = () => {
  const dispatch = useDispatch();
  const { notify } = useToast();

  const [loadDataServicesKey, setLoadDataServicesKey] = useState(0);

  useEffect(() => {
    const getListServices = async () => {
      dispatch(setIsLoading(true));
      const res = await getListServicesApi();
      if (res?.status === CODE_SUCCESS) {
        dispatch(setListServices(res?.data || []));
      }
      dispatch(setIsLoading(false));
    };

    getListServices();
  }, [loadDataServicesKey]);

  const handleUpdateService = async (
    values: ServiceRequest,
    setIsOpenDetailService: Dispatch<SetStateAction<boolean>>
  ) => {
    dispatch(setIsLoading(true));
    setIsOpenDetailService(false);
    const res = await updateServiceApi({ ...values });
    if (res?.status === CODE_SUCCESS) {
      notify('success', 'Cập nhật thành công!');
      setLoadDataServicesKey(Date.now());
    } else {
      notify('error', 'Error!');
    }

    dispatch(setIsLoading(false));
  };

  return { handleUpdateService };
};

export default useListServices;
