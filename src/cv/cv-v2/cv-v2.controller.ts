import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  Query,
  Req,
  ForbiddenException,
  Version,
  UploadedFile,
  UseInterceptors,
  BadRequestException,
  HttpStatus,
} from '@nestjs/common';
import path from 'node:path';
import { CvService } from '../cv.service';
import { FileUploadService } from 'src/common/fileUpload.service';
import { CreateCvDto } from '../dto/create-cv.dto';
import { UpdateCvDto } from '../dto/update-cv.dto';
import { FilterCvDto } from '../dto/filter-cv.dto';
import { Request } from 'express';
import { User } from '../../user/entities/user.entity';
import { paginate } from 'src/common/pagination.utils';
import { FileInterceptor } from '@nestjs/platform-express';
import { diskStorage } from 'multer';
import { extname } from 'path';
import { ParseFilePipeBuilder } from '@nestjs/common';
import { SkipAuth } from 'src/auth/decorators/skip-auth.decorator';

@SkipAuth()
@Controller({
  path: 'cv',
  version: '2',
})
export class CvV2Controller {
  constructor(
    private readonly cvService: CvService,
    private readonly fileUploadService: FileUploadService,
  ) {}

  @Post()
  create(@Body() createCvDto: CreateCvDto, @Req() req: Request) {
    const user = new User();
    user.id = req['userId'];
    createCvDto.user = user;
    return this.cvService.create(createCvDto);
  }

  @Post(':id/upload')
  @UseInterceptors(
    FileInterceptor('file', {
      storage: diskStorage({
        destination: './public/uploads', // Save files in the public/uploads directory
        filename: (req, file, callback) => {
          const uniqueSuffix =
            Date.now() + '-' + Math.round(Math.random() * 1e9);
          const ext = extname(file.originalname); // Get the file extension
          callback(null, `cv-${uniqueSuffix}${ext}`); // Generate a unique filename
        },
      }),
    }),
  )
  async uploadFile(
    @Param('id') id: string,
    @UploadedFile(
      new ParseFilePipeBuilder()
        .addFileTypeValidator({ fileType: /image\/(jpeg|jpg|png)/ })
        .addMaxSizeValidator({ maxSize: 10_000_000 })
        .build({ errorHttpStatusCode: HttpStatus.UNPROCESSABLE_ENTITY }),
    )
    file: Express.Multer.File,
  ) {
    console.log('Uploaded File:', file);

    // Save the file path to the database (optional)
    await this.cvService.updateImage(+id, file.filename);

    return {
      message: 'File uploaded successfully',
      filename: file.filename,
    };
  }

  @SkipAuth()
  @Get()
  async getAll(
    @Query('page') page: string = '1', // Default to '1' if not provided
    @Query('limit') limit: string = '10', // Default to '10' if not provided
    @Query() query: Record<string, any>, // Capture all query parameters
  ) {
    const pageNumber = parseInt(page, 10) || 1; // Parse and fallback to 1 if invalid
    const limitNumber = parseInt(limit, 10) || 10; // Parse and fallback to 10 if invalid

    // Exclude `page` and `limit` from the filter object
    const { page: _, limit: __, ...filterCvDto } = query;

    console.log(
      'Page:',
      pageNumber,
      'Limit:',
      limitNumber,
      'Filters:',
      filterCvDto,
    );

    const allCvs = await this.cvService.findAll(filterCvDto as FilterCvDto);
    return paginate(allCvs, pageNumber, limitNumber);
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.cvService.findOne(+id);
  }

  @Patch(':id')
  async update(
    @Param('id') id: string,
    @Body() updateCvDto: UpdateCvDto,
    @Req() req: Request,
  ) {
    const cv = await this.cvService.findOne(+id);
    if (cv.user.id !== req['userId']) {
      throw new ForbiddenException('You can only update your own CV');
    }
    return this.cvService.update(+id, updateCvDto);
  }

  @Delete(':id')
  async remove(@Param('id') id: string, @Req() req: Request) {
    const cv = await this.cvService.findOne(+id);
    if (cv.user.id !== req['userId']) {
      throw new ForbiddenException('You can only delete your own CV');
    }
    return this.cvService.remove(+id);
  }
}
