
export interface ILogin{
    password:string,
    id:string;
}
export interface ISignUp extends ILogin{
    id_type?:string
}

