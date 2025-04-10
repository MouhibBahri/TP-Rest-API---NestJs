import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { CreateSkillDto } from './dto/create-skill.dto';
import { UpdateSkillDto } from './dto/update-skill.dto';
import { Skill } from './entities/skill.entity';

@Injectable()
export class SkillService {
  constructor(
    @InjectRepository(Skill)
    private readonly skillRepository: Repository<Skill>,
  ) {}

  create(createSkillDto: CreateSkillDto) {
    const skill = this.skillRepository.create(createSkillDto);
    return this.skillRepository.save(skill);
  }

  findAll() {
    return this.skillRepository.find();
  }

  findOne(id: number) {
    return this.skillRepository.findOne({ where: { id } });
  }

  async update(id: number, updateSkillDto: UpdateSkillDto) {
    await this.skillRepository.update(id, updateSkillDto);
    return this.skillRepository.findOne({ where: { id } });
  }

  async remove(id: number) {
    const skill = await this.skillRepository.findOne({ where: { id } });
    if (skill) {
      await this.skillRepository.remove(skill);
    }
    return skill;
  }
}
