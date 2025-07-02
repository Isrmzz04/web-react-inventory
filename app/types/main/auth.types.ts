export interface IAuthRequest{
  username: string
  password: string
}

export interface IAuthResponse{
  token_type: string
  expires_in: number
  role: string
  access_token?: string
  menus: Array<any>
}