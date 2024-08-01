import { ServiceRequest } from '@/models/account';
import { formatMoney } from '@/utils/utils';

export const transformServiceBooking = (listServices: ServiceRequest[], serviceId: string) => {
  const service = listServices.find((item) => item.serviceId === serviceId);
  return service?.serviceType ?? 'Gói không xác định';
};

export const transformCost = (listServices: ServiceRequest[], serviceId: string) => {
  const service = listServices.find((item) => item.serviceId === serviceId);
  return formatMoney(service?.servicePrice ?? 0) ?? 'Không xác định';
};
