export interface IUser {
  id?: number;
  username?: string;
  firstName?: string;
  lastName?: string;
  token?: string;
}

export interface IUserInfo extends IUser {
  email?: string;
  roles: string[];
  activity: boolean;
}

export interface IUserSave extends IUserInfo {
  password: string;
}

export interface IUserId {
  id: number;
}
