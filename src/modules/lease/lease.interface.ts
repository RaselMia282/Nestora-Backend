export interface ICreateLease {
  applicationId: string;
  startDate: string;
  endDate: string;
  monthlyRent: number;
  securityDeposit: number;
}

export interface IUpdateLease {
  startDate?: string;
  endDate?: string;
  monthlyRent?: number;
  securityDeposit?: number;
}