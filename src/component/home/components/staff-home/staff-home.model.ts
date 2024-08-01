export type ListRequest = {
  requestId: number;
  customerId: number;
  customerName: string;
  idCard: string;
  email: string;
  phoneNumber: string;
  address: string;
  serviceId: string;
  status: string;
};

export type ListResult = {
  requestStatus?: string;
  resultId: number;
  diamondId: string;
  requestId?: number | string;
  diamondOrigin: string;
  shape: string;
  measurements: string;
  caratWeight: string;
  color: string;
  clarity: string;
  cut: string;
  proportions: string;
  polish: string;
  symmetry: string;
  fluorescence: string;
};
