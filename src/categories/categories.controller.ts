import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
} from '@nestjs/common';
import { CategoriesService } from './categories.service';

@Controller('categories')
export class CategoriesController {
  constructor(private readonly categoriesService: CategoriesService) {}

  @Get()
  async list() {
    return this.categoriesService.findAll();
  }

  @Post()
  async create(
    @Body() data: { name: string; color: string },
  ) {
    return this.categoriesService.create(data);
  }

  @Patch(':id')
  async update(
    @Param('id') id: string,
    @Body() data: { name?: string; color?: string },
  ) {
    return this.categoriesService.update(id, data);
  }

  @Delete(':id')
  async remove(@Param('id') id: string) {
    return this.categoriesService.remove(id);
  }
}
