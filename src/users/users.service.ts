import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import * as bcrypt from 'bcrypt';
import { UserRepository } from './user.repository';
import { User } from '@prisma/client';

@Injectable()
export class UsersService {
    constructor(private readonly userRepository: UserRepository) {}

    private async comparePasswords(
        userPassword: string,
        currentPassword: string,
    ) {
        return await bcrypt.compare(currentPassword, userPassword);
    }

    async validateCredentials({
        username,
        password,
    }: {
        username: string;
        password: string;
    }): Promise<User> {
        const user = await this.userRepository.findOne({ username });

        if (!user) {
            throw new HttpException('User not found', HttpStatus.UNAUTHORIZED);
        }

        const areEqual = await this.comparePasswords(user.password, password);

        if (!areEqual) {
            throw new HttpException(
                'Invalid credentials',
                HttpStatus.UNAUTHORIZED,
            );
        }

        return user;
    }

    async create({
        username,
        password,
    }: {
        username: string;
        password: string;
    }): Promise<User> {
        const userInDb = await this.userRepository.findOne({ username });
        if (userInDb) {
            throw new HttpException(
                'User already exists',
                HttpStatus.BAD_REQUEST,
            );
        }

        const passwordHashed = await bcrypt.hash(password, 10);

        const user: User = this.userRepository.create({
            username,
            password: passwordHashed,
        });

        return user;
    }
}
