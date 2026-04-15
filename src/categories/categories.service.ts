import { BadRequestException, Injectable } from '@nestjs/common';
import { DatabaseService } from '../database/database.service';

@Injectable()
export class CategoriesService {
  constructor(private db: DatabaseService) {}

  private escapeSqlValue(value: string) {
    return value.replace(/'/g, "''");
  }

  private normalizeHexColor(rawColor: string) {
    const normalized = rawColor.trim().toUpperCase().replace(/\s+/g, ''); 

    if (!/^#[0-9A-F]{6}$/.test(normalized)) {
      throw new BadRequestException(
        'El color debe tener formato hexadecimal #RRGGBB.',
      );
    }

    return normalized;
  }

  private isCheckConstraintError(error: unknown) {
    const message =
      error instanceof Error ? error.message : String(error ?? '');
    return message.toUpperCase().includes('SQL0545');
  }

  private normalizeName(rawName: string) {
    const normalized = rawName.trim();

    if (!normalized) {
      throw new BadRequestException(
        'El nombre de la categoria es obligatorio.',
      );
    }

    return normalized;
  }

  private normalizeNumericId(rawId: string) {
    const id = Number(rawId);

    if (!Number.isInteger(id) || id <= 0) {
      throw new BadRequestException('El ID de la categoria es invalido.');
    }

    return id;
  }

  private pickValue(row: any, ...keys: string[]) {
    for (const key of keys) {
      if (row?.[key] !== undefined) {
        return row[key];
      }
    }
    return undefined;
  }

  private normalizeCategoryRow(row: any) {
    const rawId = this.pickValue(row, 'ID', 'id');
    const rawColor = this.pickValue(row, 'COLOR', 'color');
    const colorValue =
      typeof rawColor === 'string' ? rawColor.trim().toUpperCase() : null;
    const normalizedColor =
      colorValue && /^[0-9A-F]{6}$/.test(colorValue)
        ? `#${colorValue}`
        : colorValue;

    return {
      id: rawId === undefined || rawId === null ? null : String(rawId),
      name: this.pickValue(row, 'NAME', 'name'),
      color: normalizedColor,
      questionsCount:
        Number(this.pickValue(row, 'QUESTIONS_COUNT', 'questions_count')) || 0,
    };
  }

  async findAll() {
    const query = `
      SELECT c.*,
        (SELECT COUNT(*) 
         FROM RENCUE.QUESTIONS q 
         WHERE q.CATEGORY_ID = c.ID) AS QUESTIONS_COUNT
      FROM RENCUE.CATEGORIES c
      ORDER BY c.NAME ASC
    `;

    const rows = await this.db.sqlQuery(query);
    return rows.map((row: any) => this.normalizeCategoryRow(row));
  }

  async create(data: { name: string; color: string }) {
    const name = this.normalizeName(data.name);
    const color = this.normalizeHexColor(data.color);

    const query = `
      INSERT INTO RENCUE.CATEGORIES (NAME, COLOR)
      VALUES (
        '${this.escapeSqlValue(name)}',
        '${color}'
      )
    `;

    try {
      await this.db.sqlQuery(query);
    } catch (error) {
      if (!this.isCheckConstraintError(error)) {
        throw error;
      }

      const dbMessage =
        error instanceof Error ? error.message : String(error ?? '');

      throw new BadRequestException(
        `DB2 rechazo el INSERT por una restriccion CHECK en RENCUE.CATEGORIES. Detalle: ${dbMessage}`,
      );
    }

    const identityResult = await this.db.sqlQuery(`
      SELECT IDENTITY_VAL_LOCAL() AS ID
      FROM SYSIBM.SYSDUMMY1
    `);

    const createdId = this.pickValue(identityResult?.[0], 'ID', 'id');

    if (createdId === undefined || createdId === null) {
      throw new BadRequestException(
        'No fue posible recuperar el ID de la categoria creada.',
      );
    }

    return {
      id: String(createdId),
      name,
      color,
      questionsCount: 0,
    };
  }

  async update(
    id: string,
    data: { name?: string; color?: string },
  ) {
    const normalizedId = this.normalizeNumericId(id);
    let updates: string[] = [];

    if (data.name !== undefined) {
      const name = this.normalizeName(data.name);
      updates.push(`NAME='${this.escapeSqlValue(name)}'`);
    }

    if (data.color !== undefined) {
      const color = this.normalizeHexColor(data.color);
      updates.push(`COLOR='${color}'`);
    }

    updates.push('UPDATED_AT=CURRENT TIMESTAMP');

    if (updates.length === 1 && updates[0] === 'UPDATED_AT=CURRENT TIMESTAMP') {
      return { ok: true };
    }

    const query = `
      UPDATE RENCUE.CATEGORIES
      SET ${updates.join(', ')}
      WHERE ID=${normalizedId}
    `;

    await this.db.sqlQuery(query);

    const result = await this.db.sqlQuery(`
      SELECT c.*,
        (SELECT COUNT(*)
         FROM RENCUE.QUESTIONS q
         WHERE q.CATEGORY_ID = c.ID) AS QUESTIONS_COUNT
      FROM RENCUE.CATEGORIES c
      WHERE c.ID=${normalizedId}
    `);

    return result[0] ? this.normalizeCategoryRow(result[0]) : { ok: true };
  }

  async remove(id: string) {
    const normalizedId = this.normalizeNumericId(id);
    const query = `
      DELETE FROM RENCUE.CATEGORIES
      WHERE ID=${normalizedId}
    `;

    return this.db.sqlQuery(query);
  }
}
