import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { CreateCvDto } from './dto/create-cv.dto';
import { UpdateCvDto } from './dto/update-cv.dto';
import { Cv } from './entities/cv.entity';
import { FilterCvDto } from './dto/filter-cv.dto';

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

  async findAll(filterCvDto: FilterCvDto, ownerUsername?: string) {
    const { criteria, age } = filterCvDto;

    const query = this.cvRepository.createQueryBuilder('cv');

    if (criteria) {
      query.where(
        '(cv.name LIKE :criteria OR cv.firstname LIKE :criteria OR cv.job LIKE :criteria)',
        { criteria: `%${criteria}%` },
      );
    }

    if (age !== undefined) {
      query.orWhere('cv.age = :age', { age });
    }

    if (ownerUsername) {
      query
        .innerJoinAndSelect('cv.user', 'user')
        .where('user.username = :ownerUsername', { ownerUsername });
    }

    return query.getMany();
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
