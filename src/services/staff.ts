import { CreateResultRequest } from '@/models/account';
import api from '../api';

export const getListRequestApi = async (serviceId?: string) => {
  try {
    const res = await api.get(`api/HistoryRequest/history/paid/?serviceId=${serviceId}`);
    return res;
  } catch (error) {
    return undefined;
  }
};

export const getListRequestAcceptedApi = async (employeeId?: number, serviceId?: string) => {
  try {
    const res = await api.get(
      `api/HistoryRequest/history/processing?employeeId=${employeeId}&serviceId=${serviceId}`
    );
    return res;
  } catch (error) {
    return undefined;
  }
};

export const updateStatusWhenReceivedDiamondApi = async (requestId: number, employeeId: number) => {
  try {
    const res = await api.put(
      `api/AcceptStatus/Update-status-when-received-diamond/${requestId}/${employeeId}`
    );
    return res;
  } catch (error) {
    return undefined;
  }
};

export const createResultApi = async (payload: CreateResultRequest) => {
  try {
    const res = await api.post('api/Result/create', { ...payload });
    return res;
  } catch (error) {
    return undefined;
  }
};

export const updateResultApi = async (payload: CreateResultRequest) => {
  try {
    const res = await api.put(`api/Result/update/${payload.resultId}`, { ...payload });
    return res;
  } catch (error) {
    return undefined;
  }
};

export const updateStatusDoneDiamondApi = async (requestId: number, employeeId: number) => {
  try {
    const res = await api.put(`api/AcceptStatus/Update-status-done/${requestId}/${employeeId}`);
    return res;
  } catch (error) {
    return undefined;
  }
};
