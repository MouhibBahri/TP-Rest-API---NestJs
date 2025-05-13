import * as jwt from "jsonwebtoken";

const userId = '1';
const token = jwt.sign({ userId }, 'Banana', { expiresIn: '1h' });
console.log('Token:', token);
