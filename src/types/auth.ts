export type UserRole = 'admin' | 'staff' | 'cashier';

export interface User {
  id: string;
  email: string;
  role: UserRole;
}