import { Request, Response } from 'express';
import admin from 'firebase-admin';

admin.initializeApp();

export const signup = async (req: Request, res: Response) => {
    const { email, password } = req.body;

    try {
        const userRecord = await admin.auth().createUser({
            email,
            password,
        });
        res.status(201).json({ uid: userRecord.uid });
    } catch (error) {
        res.status(400).json({ error: error.message });
    }
};

export const login = async (req: Request, res: Response) => {
    const { email, password } = req.body;

    try {
        const userRecord = await admin.auth().getUserByEmail(email);
        // Here you would typically verify the password using a custom method
        // For simplicity, we are just returning the user record
        res.status(200).json({ uid: userRecord.uid });
    } catch (error) {
        res.status(400).json({ error: error.message });
    }
};