import { ObjectId } from 'mongodb';

export interface UserDocument {
  _id?: ObjectId;
  name: string;
  email: string;
  password: string;
  createdAt: Date;
  updatedAt: Date;
}

export interface UserResponse {
  id: string;
  name: string;
  email: string;
  createdAt: Date;
}

export function transformUser(user: UserDocument): UserResponse {
  return {
    id: user._id?.toString() || '',
    name: user.name,
    email: user.email,
    createdAt: user.createdAt,
  };
}