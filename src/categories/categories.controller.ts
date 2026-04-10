import { Controller, Get, Post, Body, Patch, Param, Delete } from '@nestjs/common';
import { CategoriesService } from './categories.service';

@Controller('categories')
export class CategoriesController {
    constructor(private readonly categoriesService: CategoriesService) { }

    @Get()
    async list() {
        return this.categoriesService.findAll();
    }

    @Post()
    create(@Body() data: any) { return this.categoriesService.create(data); }
    @Patch(':id')
    update(@Param('id') id: string, @Body() data: any) {
        return this.categoriesService.update(id, data);
    }

    @Delete(':id')
    remove(@Param('id') id: string) { return this.categoriesService.remove(id); }
}