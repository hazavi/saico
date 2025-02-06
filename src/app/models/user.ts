export class User{
    userId: string = '';
    username: string = '';
    email: string = ''; 
    passwordHash: string | null = null;
    passwordSalt: string | null = null;
    isAdmin: boolean = false  
}