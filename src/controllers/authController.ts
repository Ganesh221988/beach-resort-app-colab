import { Request, Response } from "express";
import jwt, { SignOptions } from "jsonwebtoken";
import bcrypt from "bcryptjs";
import User from "../models/User"; // Sequelize User model

const JWT_SECRET = process.env.JWT_SECRET as string;
const JWT_EXPIRES_IN = process.env.JWT_EXPIRES_IN || "15m";
const REFRESH_TOKEN_EXPIRES_IN = process.env.REFRESH_TOKEN_EXPIRES_IN || "7d";

// -------------------- REGISTER --------------------
export const register = async (req: Request, res: Response) => {
  try {
    const { 
      name, 
      email, 
      password, 
      role,
      phone,
      whatsapp,
      companyName,
      location,
      documents = {}
    } = req.body;

    if (!name || !email || !password || !role) {
      return res.status(400).json({ error: "Name, email, password and role are required" });
    }

    // Check if user exists
    const existingUser = await User.findOne({ where: { email } });
    if (existingUser) {
      return res.status(409).json({ error: "User already exists" });
    }

    // Validate role-specific requirements
    if (role === 'owner') {
      if (!companyName || !location) {
        return res.status(400).json({ error: "Company name and location are required for property owners" });
      }
    }

    if (role === 'broker') {
      if (!phone || !documents.aadharNumber || !documents.panNumber) {
        return res.status(400).json({ 
          error: "Phone number, Aadhar number and PAN number are required for brokers" 
        });
      }
    }

    const hashedPassword = await bcrypt.hash(password, 10);

    // Create user with all provided fields
    const newUser = await User.create({
      name,
      email,
      password: hashedPassword,
      role,
      phone,
      whatsapp: whatsapp || phone, // Use phone as whatsapp if not provided
      status: 'ACTIVE',
      isVerified: false,
      companyName,
      location,
      ...documents, // This will spread aadharNumber, panNumber, etc.
      notificationPreferences: {
        email: true,
        whatsapp: !!whatsapp || !!phone,
        sms: !!phone
      }
    });

    // Generate verification token
    const verificationToken = jwt.sign(
      { userId: newUser.id },
      JWT_SECRET,
      { expiresIn: '24h' }
    );

    // TODO: Send verification email with token
    // await sendVerificationEmail(email, verificationToken);

    res.status(201).json({ 
      message: "User registered successfully. Please check your email for verification.", 
      user: { 
        id: newUser.id, 
        name, 
        email, 
        role,
        isVerified: false,
        companyName,
        location 
      } 
    });
  } catch (error) {
    console.error("Register error:", error);
    res.status(500).json({ error: "Server error" });
  }
};

// -------------------- LOGIN --------------------
export const login = async (req: Request, res: Response) => {
  try {
    const { email, password } = req.body;
    if (!email || !password) return res.status(400).json({ error: "Email & password required" });

    const user = await User.findOne({ where: { email } });
    if (!user) return res.status(401).json({ error: "Invalid credentials" });

    if (user.status === 'BLOCKED') {
      return res.status(403).json({ error: "Your account has been blocked. Please contact support." });
    }

    if (user.role !== 'customer' && !user.isVerified) {
      return res.status(403).json({ 
        error: "Please verify your account. Check your email for verification instructions." 
      });
    }

    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) return res.status(401).json({ error: "Invalid credentials" });

    const accessToken = jwt.sign(
      { id: user.id, role: user.role },
      JWT_SECRET,
      { expiresIn: JWT_EXPIRES_IN } as SignOptions
    );

    const refreshToken = jwt.sign(
      { id: user.id, role: user.role },
      JWT_SECRET,
      { expiresIn: REFRESH_TOKEN_EXPIRES_IN } as SignOptions
    );

    // Optionally store refresh token in DB or httpOnly cookie
    res.json({ accessToken, refreshToken });
  } catch (error) {
    console.error("Login error:", error);
    res.status(500).json({ error: "Server error" });
  }
};

// -------------------- REFRESH TOKEN --------------------
export const refreshToken = async (req: Request, res: Response) => {
  try {
    const { token } = req.body;
    if (!token) return res.status(401).json({ error: "No token provided" });

    jwt.verify(token, JWT_SECRET, (err: jwt.VerifyErrors | null, decoded: any) => {
      if (err) return res.status(403).json({ error: "Invalid token" });

      const { id, role } = decoded;
      const newAccessToken = jwt.sign(
        { id, role },
        JWT_SECRET,
        { expiresIn: JWT_EXPIRES_IN } as SignOptions
      );

      res.json({ accessToken: newAccessToken });
    });
  } catch (error) {
    console.error("Refresh token error:", error);
    res.status(500).json({ error: "Server error" });
  }
};

// -------------------- VERIFY EMAIL --------------------
export const verifyEmail = async (req: Request, res: Response) => {
  try {
    const { token } = req.params;
    if (!token) return res.status(400).json({ error: "Verification token is required" });

    const decoded = jwt.verify(token, JWT_SECRET) as { userId: string };
    const user = await User.findByPk(decoded.userId);

    if (!user) return res.status(404).json({ error: "User not found" });
    if (user.isVerified) return res.status(400).json({ error: "Email already verified" });

    await user.update({ isVerified: true });
    res.json({ message: "Email verified successfully" });
  } catch (error) {
    console.error("Email verification error:", error);
    res.status(500).json({ error: "Invalid or expired verification token" });
  }
};

// -------------------- UPLOAD DOCUMENTS --------------------
export const uploadDocuments = async (req: Request, res: Response) => {
  try {
    const userId = (req as any).user.id; // Set by auth middleware
    const user = await User.findByPk(userId);
    if (!user) return res.status(404).json({ error: "User not found" });

    const files = req.files as { [fieldname: string]: Express.Multer.File[] };
    const documents: Record<string, string> = {};

    // Process each uploaded file
    for (const [key, fileArray] of Object.entries(files)) {
      const file = fileArray[0]; // Get first file from array
      documents[`${key}Url`] = `/uploads/documents/${file.filename}`;
    }

    // Update user document URLs
    await user.update(documents);

    // If all required documents are uploaded, update verification status
    if (user.role === 'broker' || user.role === 'owner') {
      const requiredDocs = {
        broker: ['aadharFrontUrl', 'aadharBackUrl', 'panCardUrl'],
        owner: ['aadharFrontUrl', 'panCardUrl', 'businessProofUrl']
      };

      const required = requiredDocs[user.role as keyof typeof requiredDocs];
      const hasAllDocs = required.every(doc => !!user.get(doc));

      if (hasAllDocs) {
        await user.update({ 
          isVerified: true,
          status: 'ACTIVE'
        });
      }
    }

    res.json({ 
      message: "Documents uploaded successfully",
      documents,
      isVerified: user.isVerified
    });
  } catch (error) {
    console.error("Document upload error:", error);
    res.status(500).json({ error: "Failed to upload documents" });
  }
};
