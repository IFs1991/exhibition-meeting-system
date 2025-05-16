import { AppService } from './app.service';
export declare class AppController {
    private readonly appService;
    constructor(appService: AppService);
    getHello(): {
        message: string;
    };
    getProfile(): {
        user: {
            id: number;
            name: string;
            email: string;
            role: string;
        };
    };
    login(loginData: {
        email: string;
        password: string;
    }): {
        user: {
            id: number;
            name: string;
            email: string;
            role: string;
        };
        token: string;
    };
}
