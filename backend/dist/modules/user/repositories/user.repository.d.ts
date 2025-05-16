import { Repository, DataSource } from 'typeorm';
import { DatabaseConfig } from '../../config/database-config';
import { User } from '../entities/user.entity';
import { CreateUserDto, UpdateUserDto } from '../dto/user.dto';
export declare class UserRepository {
    private readonly userRepository;
    private readonly dataSource;
    private readonly dbConfig;
    constructor(userRepository: Repository<User>, dataSource: DataSource, dbConfig: DatabaseConfig);
    findById(id: string): Promise<User | null>;
    findByEmail(email: string): Promise<User | null>;
    create(createUserDto: CreateUserDto): Promise<User>;
    update(id: string, updateUserDto: UpdateUserDto): Promise<User>;
    delete(id: string): Promise<void>;
    findAllWithPagination(page: number, limit: number): Promise<[User[], number]>;
    findByRole(role: string): Promise<User[]>;
    updateLastLogin(id: string): Promise<void>;
    private withTransaction;
}
