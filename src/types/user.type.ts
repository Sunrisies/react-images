export interface UserFormData {
  user_name: string;
  pass_word: string;
}
export interface UserUpdateParams {
  user_name: string;
  pass_word?: string;
}

export interface User {
  id: number;
  user_name: string;
  email: string | null;
  phone: string | null;
  image: string | null;
  created_at: string;
  updated_at: string;
}