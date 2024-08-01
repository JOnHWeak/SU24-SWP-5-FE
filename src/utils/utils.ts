import { UserInfo } from '@/models/account';

export const setDataLocalStorage = (data: any) => {
  localStorage.setItem('TOKEN', data.loginToken);
  localStorage.setItem('CUSTOMER_NAME', data.customerName);
  localStorage.setItem('CUSTOMER_ID', data.customerId);
  localStorage.setItem('EMPLOYEE_ID', data.employeeId);
  localStorage.setItem('ROLE', data.role);

  localStorage.setItem(
    'USER_INFO',
    JSON.stringify({
      customerId: data.customerId,
      employeeId: data.employeeId,
      employeeName: data.employeeName,
      customerName: data.customerName,
      customerAddress: data.customerAddress,
      customerIDCard: data.customerIDCard,
      customerPhone: data.customerPhone,
      serviceId: data.serviceId,
      role: data.role,
    })
  );
};

export const setLocalStorageUserInfo = (data: any) => {
  localStorage.setItem(
    'USER_INFO',
    JSON.stringify({
      customerId: data.customerId,
      employeeId: data.employeeId,
      employeeName: data.employeeName,
      customerName: data.customerName,
      customerAddress: data.customerAddress,
      customerIDCard: data.customerIDCard,
      customerPhone: data.customerPhone,
      serviceId: data.serviceId,
      role: data.role,
    })
  );
};

export const formatMoney = (money: number) => {
  return new Intl.NumberFormat('vi-VN', {
    style: 'currency',
    currency: 'VND',
    maximumFractionDigits: 9,
  }).format(money);
};

export const formatDateTime = (dateTime: string) => {
  const date = new Date(dateTime);
  return (
    [date.getMonth() + 1, date.getDate(), date.getFullYear()].join('/') +
    ' ' +
    [date.getHours(), date.getMinutes(), date.getSeconds()].join(':')
  );
};

function convertStringToObject(value: string | null): object | Array<unknown> | null {
  if (!value) {
    return null;
  }

  const valueAsObject = JSON.parse(value);
  if (typeof valueAsObject === 'object') {
    const keys = Object.keys(valueAsObject);
    const regex = /^[\\{]/;
    for (const key of keys) {
      const temp = valueAsObject[key];
      // match first character is '[' - as array or '{' as object
      if (temp && regex.test(temp) && typeof temp === 'string') {
        valueAsObject[key] = JSON.parse(temp);
      }
    }
  }

  return valueAsObject;
}

export function getUserInfo(): UserInfo {
  if (typeof window !== 'undefined') {
    const value = localStorage.getItem('USER_INFO');
    return convertStringToObject(value) || {};
  }
  return {};
}
