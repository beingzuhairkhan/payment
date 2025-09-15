
export interface ILogin {
  name: string;
  id: string;
  email: string;
  password: string
}


export interface School {
  _id: string;
  name: string;
  email: string;
}

export type PaymentStatus = "pending" | "success" | "failed"

export interface PaymentData {
  _id: string;
  custom_order_id: string;
  amount: number;
  method: string;
  status: PaymentStatus
  userId: string;
  payment_url: string;
  created_at: string;
  expires_at: string;
}

export interface createPaymentTypes {
  school_id: string;
  trustee_id: string;
  student_info: {
    name: string;
    id: string;
    email: string;
  },
  gateway_name: string;
  order_amount: Number;

}
export interface PaymentResult {
  custom_order_id: string;
  payment_url: string;
  expires_at: number;
  status: "pending" | "success" | "failed";
  order_amount: number;
  gateway_name: string;
  school_id: string;
  trustee_id: string;
  student_info: {
    name: string;
    id: string;
    email: string;
  };
}

type ColorKey = "primary" | "secondary" | "success" | "pending" | "error";

export interface Stat {
  title: string;
  value: string | number;
  icon: React.ComponentType<any>;
  color: ColorKey;
}


export interface ISchoolId {
  school_id: string;
}

export interface ISchoolData {
  student_info: {
    name: string;
    id: string;
    email: string;
  };
  collect_id: string;
  custom_order_id: string;
  transaction_amount: Number;
  gateway: String;
  payment_mode: string
  status: PaymentStatus
  payment_time: string
}


export interface ITransactionStatus {
  customOrderId: string

}
export type  Filters = {
  page: number
  limit: number
  sort: string
  order: 'asc' | 'desc'
  status: string[]        
  gateway: string[]        
  search: string
  from_date: string
  to_date: string
}

export type TransactionStatus = 'success' | 'failed' | 'pending' | 'cancelled';

export interface ITransaction {
  collect_id:string
  school_name:string;
  custom_order_id:string;
  student_info: {
    name: string;
    id: string;
    email: string;
  };
  payment_mode:string;
  order_amount:number;
  transaction_amount:number;
  status:PaymentStatus
  payment_time:string
}