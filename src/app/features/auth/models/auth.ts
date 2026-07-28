// Maps to the response from GET /api/Logins/{username}/{password}
export class LoginResponse {
    UserId: number = 0;
    UserName: string = '';
    RoleId: number = 0;
    Token: string = '';
}
