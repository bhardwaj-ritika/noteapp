import { connectToDatabase } from '../lib/mongodb';
import jwt from 'jsonwebtoken';
import bcrypt from 'bcrypt';

const secret = process.env.JWT_SECRET;

export default async function handler(req, res) {
  const { method } = req;

  await connectToDatabase();

  if (method === 'POST') {
    const { email, password } = req.body;

    // Handle login
    if (req.url.includes('/login')) {
      // Find user in database
      const user = await findUserByEmail(email); // Implement this function to find user

      if (!user) {
        return res.status(401).json({ message: 'User not found' });
      }

      // Compare passwords
      const isMatch = await bcrypt.compare(password, user.password);
      if (!isMatch) {
        return res.status(401).json({ message: 'Invalid password' });
      }

      // Generate JWT token
      const token = jwt.sign({ email }, secret, { expiresIn: '1h' });
      res.status(200).json({ token });
    }
  } else {
    res.setHeader('Allow', ['POST']);
    res.status(405).end(`Method ${method} Not Allowed`);
  }
}

async function findUserByEmail(email) {
  const client = await connectToDatabase();
  const db = client.db();
  const user = await db.collection('users').findOne({ email });
  return user;
}
