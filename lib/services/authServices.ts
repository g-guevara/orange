import bcrypt from 'bcryptjs';
import { getDatabase } from '@/lib/mongodb';
import { UserDocument, UserResponse, transformUser } from '@/lib/models/User';

export class AuthService {
  private static async getUsersCollection() {
    const db = await getDatabase();
    return db.collection<UserDocument>('users');
  }

  static async findUserByEmail(email: string): Promise<UserDocument | null> {
    const users = await this.getUsersCollection();
    return await users.findOne({ email: email.toLowerCase() });
  }

  static async createUser(name: string, email: string, password: string): Promise<UserResponse> {
    const users = await this.getUsersCollection();
    
    // Check if user already exists
    const existingUser = await this.findUserByEmail(email);
    if (existingUser) {
      throw new Error('User already exists with this email');
    }

    // Hash password
    const saltRounds = 12;
    const hashedPassword = await bcrypt.hash(password, saltRounds);

    // Create user document
    const userDoc: Omit<UserDocument, '_id'> = {
      name,
      email: email.toLowerCase(),
      password: hashedPassword,
      createdAt: new Date(),
      updatedAt: new Date(),
    };

    const result = await users.insertOne(userDoc);
    
    const newUser: UserDocument = {
      ...userDoc,
      _id: result.insertedId,
    };

    return transformUser(newUser);
  }

  static async authenticateUser(email: string, password: string): Promise<UserResponse> {
    const user = await this.findUserByEmail(email);
    
    if (!user) {
      throw new Error('Invalid email or password');
    }

    const isPasswordValid = await bcrypt.compare(password, user.password);
    
    if (!isPasswordValid) {
      throw new Error('Invalid email or password');
    }

    return transformUser(user);
  }
}