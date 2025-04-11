import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { Repository } from 'typeorm';
import { User } from './user/entities/user.entity';
import { Skill } from './skill/entities/skill.entity';
import { Cv } from './cv/entities/cv.entity';
import { getRepositoryToken } from '@nestjs/typeorm';

async function seed() {
  const app = await NestFactory.createApplicationContext(AppModule);

  const userRepository = app.get<Repository<User>>(getRepositoryToken(User));
  const skillRepository = app.get<Repository<Skill>>(getRepositoryToken(Skill));
  const cvRepository = app.get<Repository<Cv>>(getRepositoryToken(Cv));

  // Seed users
  const user1 = userRepository.create({
    username: 'testuser1',
    email: 'testuser1@example.com',
    password: 'password123',
  });
  const user2 = userRepository.create({
    username: 'testuser2',
    email: 'testuser2@example.com',
    password: 'password456',
  });
  await userRepository.save([user1, user2]);

  // Seed skills
  const skill1 = skillRepository.create({ designation: 'Programming' });
  const skill2 = skillRepository.create({ designation: 'Design' });
  const skill3 = skillRepository.create({ designation: 'Project Management' });
  await skillRepository.save([skill1, skill2, skill3]);

  // Seed CVs
  const cv1 = cvRepository.create({
    name: 'John',
    firstname: 'Doe',
    age: 30,
    cin: 12345678,
    job: 'Developer',
    path: '/path/to/cv1',
    user: user1,
    skills: [skill1, skill2],
  });
  const cv2 = cvRepository.create({
    name: 'Jane',
    firstname: 'Smith',
    age: 28,
    cin: 87654321,
    job: 'Designer',
    path: '/path/to/cv2',
    user: user2,
    skills: [skill2, skill3],
  });
  await cvRepository.save([cv1, cv2]);

  console.log('Seeding completed!');
  await app.close();
}

seed().catch((error) => {
  console.error('Seeding failed!', error);
  process.exit(1);
});
