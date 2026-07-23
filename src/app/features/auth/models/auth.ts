// Maps to the response from GET /api/Logins/{username}/{password}
export class LoginResponse {
    userId: number = 0;
    userName: string = '';
    roleId: number = 0;
    token: string = '';
}
