import { Request, Response } from 'express';
import jwt from 'jsonwebtoken';
import { PlatformUser } from "@enterprise-commerce/core/platform/types"
import { createUser } from "../models/User"
import openDb from '../db/db';

export const registerUser = async (req: Request, res: Response): Promise<void> => {
  try {
    const { id, email, password } = req.body;

    if (!email || !password) {
      res.status(400).json({message: "Email and password required"})
      return;
    }

    const db = await openDb();

    // first check if user already exists
    const existing = await db.get("SELECT * FROM users WHERE email = ?", email);

    if (existing) {
      db.close();
      res.status(409).json({message: "User already exists"});
      return;
    }

    // then create user
    const createdUser = await createUser({id, email, password});

    await db.close();

    res.status(201).json({message: "User created succesfully", user: createdUser});
  } catch(err) {
    console.error(err);
    res.status(500).json({message: "Internal Server Error"});
  }

  // please finish this function

};