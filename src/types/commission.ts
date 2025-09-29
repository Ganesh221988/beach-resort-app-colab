export interface Commission {
  id: string;
  propertyId: string;
  brokerId: string;
  amount: number;
  rate: number;
  status: 'PENDING' | 'PAID';
  dueDate: string;
  paymentGatewayId?: string;
  paymentDetails?: any;
  notes?: string;
  createdAt: string;
  updatedAt: string;
  broker?: {
    id: string;
    name: string;
    email: string;
    phone: string;
  };
  property?: {
    id: string;
    name: string;
    location: string;
    type: string;
  };
}

export interface CommissionFormData {
  propertyId: string;
  brokerId: string;
  amount: number;
  rate: number;
  dueDate: string;
  notes?: string;
}

export interface CommissionPaymentData {
  paymentGatewayId: string;
  paymentDetails: {
    transactionId?: string;
    paymentMethod?: string;
    amount: number;
    currency: string;
    status: string;
    notes?: string;
  };
}

export interface CommissionStats {
  totalCommissions: number;
  pendingCommissions: number;
  paidCommissions: number;
}
