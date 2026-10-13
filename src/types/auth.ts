// src/types/auth.ts
export type UserRole = 'citizen' | 'volunteer' | 'reviewer' | 'moderator' | 'auditor' | 'admin';

export interface UserProfile {
  id: string;
  full_name_bn: string;
  full_name_en: string;
  phone_number?: string;
  nid_verified: boolean;
  role: UserRole;
  created_at: string;
  updated_at: string;
}
