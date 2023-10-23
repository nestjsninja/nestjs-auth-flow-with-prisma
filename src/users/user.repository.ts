import { Injectable } from '@nestjs/common';
import { Prisma } from '@prisma/client';
import { PrismaService } from '../database/prisma.service';

@Injectable()
export class UserRepository {
    constructor(private prisma: PrismaService) {}

    async findOne(where: Prisma.UserWhereUniqueInput) {
        const user = await this.prisma.user.findUnique({
            where,
        });

        return user;
    }

    async create(data: Prisma.UserCreateInput) {
        const user = await this.prisma.user.create({
            data,
        });

        return user;
    }
}
