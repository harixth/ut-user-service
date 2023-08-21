//define global user array
global.userStore = [];

export enum UserRole {
  ADMIN,
  USER,
}

export class User {
  id: string;
  age?: number;
  email: string;
  name: string;
  role: UserRole;
}
