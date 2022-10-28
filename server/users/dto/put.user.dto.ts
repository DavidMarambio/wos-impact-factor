export interface PutUserDto{
    id: string;
    email: string;
    password: string;
    firstname: string;
    lastname: string;
    permissionFlags: number;
}