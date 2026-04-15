import { Injectable } from '@nestjs/common';
import { DatabaseService } from '../database/database.service';
import { QuestionsGateway } from '../gateway/websocket.gateway';
import { v4 as uuidv4 } from 'uuid';

@Injectable()
export class QuestionsService {
  constructor(
    private db: DatabaseService,
    private questionsGateway: QuestionsGateway,
  ) {}

  private toNullableString(value: unknown) {
    if (value === null || value === undefined) return null;
    const stringValue = String(value);
    return stringValue.trim().length > 0 ? stringValue : null;
  }

  private pickValue(row: any, ...keys: string[]) {
    for (const key of keys) {
      if (row?.[key] !== undefined) {
        return row[key];
      }
    }
    return undefined;
  }

  private normalizeQuestionRow(row: any) {
    const createdByModeratorValue = this.pickValue(
      row,
      'CREATED_BY_MODERATOR',
      'created_by_moderator',
      'createdByModerator',
    );

    return {
      id: this.pickValue(row, 'ID', 'id'),
      content: this.pickValue(row, 'CONTENT', 'content'),
      categoryId: this.toNullableString(
        this.pickValue(row, 'CATEGORY_ID', 'category_id', 'categoryId'),
      ),
      category: this.pickValue(
        row,
        'CATEGORY_NAME',
        'category_name',
        'categoryName',
      )
        ? {
            id: this.toNullableString(
              this.pickValue(row, 'CATEGORY_ID', 'category_id', 'categoryId'),
            ),
            name: this.pickValue(
              row,
              'CATEGORY_NAME',
              'category_name',
              'categoryName',
            ),
            color: this.toNullableString(
              this.pickValue(
                row,
                'CATEGORY_COLOR',
                'category_color',
                'categoryColor',
              ),
            ),
          }
        : undefined,
      status: this.toNullableString(this.pickValue(row, 'STATUS', 'status')),
      createdAt: this.pickValue(row, 'CREATED_AT', 'created_at', 'createdAt'),
      moderatorResponse: this.toNullableString(
        this.pickValue(
          row,
          'MODERATOR_RESPONSE',
          'moderator_response',
          'moderatorResponse',
        ),
      ),
      createdByModerator:
        createdByModeratorValue === 1 ||
        createdByModeratorValue === '1' ||
        createdByModeratorValue === true,
    };
  }

  async createQuestion(data: any) {
    const id = uuidv4();
    const createdByModerator = data.createdByModerator ? 1 : 0;

    const question = {
      id,
      content: data.content,
      createdByModerator: createdByModerator === 1,
      categoryId: null,
      moderatorResponse: null,
      status: 'PENDING',
      createdAt: new Date(),
    };

    const query = `
    INSERT INTO RENCUE.QUESTIONS
    (ID, CONTENT, CREATED_BY_MODERATOR, STATUS)
    VALUES (
      '${id}',
      '${data.content}',
      ${createdByModerator},
      'PENDING'
    )
  `;

    await this.db.sqlQuery(query);

    this.questionsGateway.emitNewQuestion(question);

    return question;
  }

  async getAllQuestions() {
    const query = `
      SELECT q.*, c.NAME AS CATEGORY_NAME, c.COLOR AS CATEGORY_COLOR
      FROM RENCUE.QUESTIONS q
      LEFT JOIN RENCUE.CATEGORIES c ON c.ID = q.CATEGORY_ID
      ORDER BY q.CREATED_AT DESC
    `;

    const rows = await this.db.sqlQuery(query);
    return rows.map((row: any) => this.normalizeQuestionRow(row));
  }

  async getFiltered(categoryId?: string) {
    let query = `
      SELECT q.*, c.NAME AS CATEGORY_NAME, c.COLOR AS CATEGORY_COLOR
      FROM RENCUE.QUESTIONS q
      LEFT JOIN RENCUE.CATEGORIES c ON c.ID = q.CATEGORY_ID
    `;

    if (categoryId) {
      query += ` WHERE q.CATEGORY_ID = '${categoryId}'`;
    }

    query += ` ORDER BY q.CREATED_AT DESC`;

    const rows = await this.db.sqlQuery(query);
    return rows.map((row: any) => this.normalizeQuestionRow(row));
  }

  async updateQuestion(
    id: string,
    data: {
      status?: string;
      categoryId?: string | null;
      moderatorResponse?: string | null;
    },
  ) {
    let updates: string[] = [];

    if (data.status) {
      updates.push(`STATUS='${data.status}'`);
    }

    if (data.categoryId !== undefined) {
      updates.push(
        `CATEGORY_ID=${data.categoryId ? `'${data.categoryId}'` : 'NULL'}`,
      );
    }

    if (data.moderatorResponse !== undefined) {
      updates.push(
        `MODERATOR_RESPONSE=${
          data.moderatorResponse === null
            ? 'NULL'
            : `'${data.moderatorResponse}'`
        }`,
      );
    }

    if (updates.length === 0) {
      return { ok: true };
    }

    const query = `
      UPDATE RENCUE.QUESTIONS
      SET ${updates.join(', ')}
      WHERE ID='${id}'
    `;

    await this.db.sqlQuery(query);

    const result = await this.db.sqlQuery(`
  SELECT q.*, c.NAME AS CATEGORY_NAME, c.COLOR AS CATEGORY_COLOR
  FROM RENCUE.QUESTIONS q
  LEFT JOIN RENCUE.CATEGORIES c ON c.ID = q.CATEGORY_ID
  WHERE q.ID='${id}'
`);

    const updatedQuestion = this.normalizeQuestionRow(result[0]);

    this.questionsGateway.emitQuestionUpdated(updatedQuestion);

    return updatedQuestion;
  }

  async deleteQuestion(id: string) {
    const query = `
      DELETE FROM RENCUE.QUESTIONS
      WHERE ID='${id}'
    `;

    await this.db.sqlQuery(query);

    this.questionsGateway.emitQuestionDeleted(id);

    return { ok: true };
  }
}
