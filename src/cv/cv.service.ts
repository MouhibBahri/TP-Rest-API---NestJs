import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { CreateCvDto } from './dto/create-cv.dto';
import { UpdateCvDto } from './dto/update-cv.dto';
import { Cv } from './entities/cv.entity';

@Injectable()
export class CvService {
  constructor(
    @InjectRepository(Cv)
    private readonly cvRepository: Repository<Cv>,
  ) {}

  create(createCvDto: CreateCvDto) {
    const cv = this.cvRepository.create(createCvDto);
    return this.cvRepository.save(cv);
  }

  findAll() {
    return this.cvRepository.find();
  }

  findOne(id: number) {
    return this.cvRepository.findOne({ where: { id } });
  }

  async update(id: number, updateCvDto: UpdateCvDto) {
    await this.cvRepository.update(id, updateCvDto);
    return this.cvRepository.findOne({ where: { id } });
  }

  async remove(id: number) {
    const cv = await this.cvRepository.findOne({ where: { id } });
    if (cv) {
      await this.cvRepository.remove(cv);
    }
    return cv;
  }
}
