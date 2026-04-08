import { Injectable } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { Status } from '@prisma/client';
import { QuestionsGateway } from '../gateway/websocket.gateway';

@Injectable()
export class QuestionsService {
  constructor(private prisma: PrismaService, private questionsGateway: QuestionsGateway) { }
                                                                                                                                                                                                                                                                                                                                                                                                                                                                  
  async createQuestion(
    data: { content: string; createdByModerator?: boolean },
  ) {
    const question = await this.prisma.question.create({
      data: {
        content: data.content,
        createdByModerator: data.createdByModerator ?? false,
        status: 'PENDING',
      },
    });
    this.questionsGateway.emitNewQuestion(question);
    return question;
  }

  async getFiltered(categoryId?: string, unassigned: boolean = false) {
    return this.prisma.question.findMany({
      where: {
        ...(unassigned ? { categoryId: null } : {}),
        ...(categoryId ? { categoryId } : {}),
      },
      include: { category: true },
      orderBy: { createdAt: 'desc' },
    });
  }

  async updateQuestion(
    id: string,
    data: {
      category?: string;
      categoryId?: string;
      status?: Status;
      moderatorResponse?: string | null;
    },
  ) {
    const question = await this.prisma.question.update({
      where: { id },
      data: {
        category: data.categoryId
          ? { connect: { id: data.categoryId } }
          : data.category
            ? {
              connectOrCreate: {
                where: { name: data.category },
                create: { name: data.category },
              },
            }
            : undefined,
        status: data.status,
        moderatorResponse:
          data.moderatorResponse !== undefined
            ? data.moderatorResponse
            : undefined,
      },
      include: { category: true },
    });
    this.questionsGateway.emitQuestionUpdated(question);
    return question;
  }

  async getAllQuestions(onlyUnread: boolean = false) {
    return this.prisma.question.findMany({
      where: onlyUnread ? { NOT: { status: 'READ' } } : {},
      include: { category: true },
      orderBy: { createdAt: 'desc' },
    });
  }

  async createCategorizedQuestion(content: string, category: string) {
    return this.prisma.question.create({
      data: {
        content,
        createdByModerator: true,
        category: {
          connectOrCreate: {
            where: { name: category },
            create: { name: category },
          },
        },
        status: 'APPROVED',
      },
    });
  }

  async deleteQuestion(id: string) {
    const deletedQuestion = await this.prisma.question.delete({
      where: { id },
    });

    this.questionsGateway.emitQuestionDeleted(id);
    return deletedQuestion;
  }
}