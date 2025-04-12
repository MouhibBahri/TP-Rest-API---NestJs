import * as jwt from "jsonwebtoken";

const userId = '2';
const token = jwt.sign({ userId }, 'Banana', { expiresIn: '1h' });
console.log('Token:', token);
