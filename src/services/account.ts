import {
  AccountDetailRequest,
  BookingServicesRequest,
  ChangePasswordAccountRequest,
  CreateEmployeeRequest,
  PaymentDoneRequest,
  ServiceRequest,
} from '@/models/account';
import api from '../api';

export const getListCustomersApi = async () => {
  try {
    const res = await api.get('api/Account/list-customers');
    return res;
  } catch (error) {
    return undefined;
  }
};

export const getListEmployeeApi = async () => {
  try {
    const res = await api.get('api/Account/list-employees-except-role1');
    return res;
  } catch (error) {
    return undefined;
  }
};

export const getDetailAccountCustomerApi = async (id: number) => {
  try {
    const res = await api.get(`api/Profile/customer/${id}`);
    return res;
  } catch (error) {
    return undefined;
  }
};

export const updateDetailAccountCustomerApi = async (payload: AccountDetailRequest) => {
  try {
    const { customerId, ...request } = payload;
    const res = await api.post(`api/Profile/update-profile/${customerId}`, { ...request });
    return res;
  } catch (error) {
    return undefined;
  }
};

export const changePasswordAccountApi = async (payload: ChangePasswordAccountRequest) => {
  try {
    const res = await api.put('api/Profile/change-password', { ...payload });
    return res;
  } catch (error) {
    return undefined;
  }
};

export const bookingServiceApi = async (payload: BookingServicesRequest) => {
  try {
    const res = await api.post('api/CreateRequests/CreateRequest', { ...payload });
    return res;
  } catch (error) {
    return undefined;
  }
};

export const paymentDoneApi = async (payload: PaymentDoneRequest) => {
  try {
    const res = await api.post('api/Payment/UpdatePaymentStatus', { ...payload });
    return res;
  } catch (error) {
    return undefined;
  }
};

export const getListBookingCustomerApi = async (id: number) => {
  try {
    const res = await api.get(`api/HistoryofRequest/ByCustomer/${id}`);
    return res;
  } catch (error) {
    return undefined;
  }
};

export const downloadCertificateApi = async (requestId: number) => {
  try {
    const res = await api.get(`api/Certificate/generate-certificate-pdf-by-request/${requestId}`, {
      responseType: 'blob',
    });
    return res;
  } catch (error) {
    return undefined;
  }
};

export const getListResultAdminApi = async () => {
  try {
    const res = await api.get('api/ListAllResult/list-results-Admin');
    return res;
  } catch (error) {
    return undefined;
  }
};

export const getListResultStaffApi = async (serviceId?: string) => {
  try {
    const res = await api.get(`api/Result/get-by-serviceid/${serviceId}`);
    return res;
  } catch (error) {
    return undefined;
  }
};

export const acceptResultApi = async (requestId: number) => {
  try {
    const res = await api.put(`api/ListAllResult/update-request-status/${requestId}`);
    return res;
  } catch (error) {
    return undefined;
  }
};

export const cancelResultApi = async (requestId: number) => {
  try {
    const res = await api.put(`api/ListAllResult/reject-request-status/${requestId}`);
    return res;
  } catch (error) {
    return undefined;
  }
};

export const createEmployeeApi = async (payload: CreateEmployeeRequest) => {
  try {
    const res = await api.post('api/Account/create-employee', { ...payload });
    return res;
  } catch (error) {
    return undefined;
  }
};

export const updateEmployeeApi = async (payload: CreateEmployeeRequest) => {
  try {
    const res = await api.put(`api/Account/update-employee/${payload.employeeId}`, { ...payload });
    return res;
  } catch (error) {
    return undefined;
  }
};

export const deleteEmployeeApi = async (employeeId: number) => {
  try {
    const res = await api.delete(`api/Account/delete-employee/${employeeId}`);
    return res;
  } catch (error) {
    return undefined;
  }
};

export const getListServicesApi = async () => {
  try {
    const res = await api.get('api/Services');
    return res;
  } catch (error) {
    return undefined;
  }
};

export const updateServiceApi = async (payload: ServiceRequest) => {
  try {
    const res = await api.put(`api/Services/${payload.serviceId}`, { ...payload });
    return res;
  } catch (error) {
    return undefined;
  }
};

export const sealServiceApi = async (requestId: number, employeeId: number) => {
  try {
    const res = await api.put(`api/AcceptStatus/Update-status-sealed/${requestId}/${employeeId}`);
    return res;
  } catch (error) {
    return undefined;
  }
};
