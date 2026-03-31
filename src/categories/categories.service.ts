import { Injectable } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';

@Injectable()
export class CategoriesService {
    constructor(private prisma: PrismaService) { }

    async findAll() {
        return this.prisma.category.findMany({
            include: {
                _count: {
                    select: { questions: true },
                },
            },
            orderBy: { name: 'asc' },
        });
    }

    async create(data: { name: string; color: string; iconUrl?: string }) {
        return this.prisma.category.create({ data });
    }

    async update(id: string, data: { name?: string; color?: string; iconUrl?: string }) {
        return this.prisma.category.update({
            where: { id },
            data,
        });
    }

    async remove(id: string) {
        return this.prisma.category.delete({ where: { id } });
    }
}