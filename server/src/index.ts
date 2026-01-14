import cors from "cors";
import express, { NextFunction, Request, Response } from "express";
import morgan from "morgan";
import dotenv from "dotenv";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import { z } from "zod";
import mongoose, { InferSchemaType, Schema, HydratedDocument } from "mongoose";

import seedDrivers from "../data/drivers.json";
import seedRides from "../data/rides.json";

dotenv.config();

const PORT = process.env.PORT ? Number(process.env.PORT) : 5000;
const CLIENT_ORIGIN = process.env.CLIENT_ORIGIN ?? "http://localhost:5173";
const JWT_SECRET = process.env.JWT_SECRET || "rideconnect-local-secret";
const MONGODB_URI = process.env.MONGODB_URI ?? "";

if (!MONGODB_URI) {
  throw new Error("MONGODB_URI is required. Please set it in your environment variables.");
}

const participantSchema = new Schema(
  {
    userId: { type: Schema.Types.ObjectId, ref: "User", required: true },
    name: { type: String, required: true },
    joinedAt: { type: Date, default: Date.now },
  },
  { _id: false },
);

const rideSchema = new Schema(
  {
    from: { type: String, required: true },
    to: { type: String, required: true },
    date: { type: String, required: true },
    time: { type: String, required: true },
    seats: { type: Number, required: true, min: 1, max: 4 },
    totalFare: { type: Number, required: true, min: 100 },
    note: { type: String },
    postedBy: { type: String, required: true },
    verified: { type: Boolean, default: true },
    status: { type: String, enum: ["upcoming", "completed"], default: "upcoming" },
    hostId: { type: Schema.Types.ObjectId, ref: "User", required: true },
    participants: [participantSchema],
  },
  { timestamps: true },
);

const driverSchema = new Schema(
  {
    name: { type: String, required: true },
    rating: { type: Number, required: true },
    totalRides: { type: Number, required: true },
    vehicleType: { type: String, required: true },
    vehicleNumber: { type: String, required: true },
    experience: { type: String, required: true },
    phone: { type: String, required: true },
    languages: { type: [String], required: true },
    isVerified: { type: Boolean, default: true },
    pricePerKm: { type: Number, required: true },
    availability: { type: String, default: "Available" },
    routes: { type: [String], required: true },
  },
  { timestamps: true },
);

const userSchema = new Schema(
  {
    name: { type: String, required: true },
    email: { type: String, required: true, lowercase: true, unique: true },
    passwordHash: { type: String, required: true },
    securityQuestion: { type: String, required: true },
    securityAnswerHash: { type: String, required: true },
  },
  { timestamps: true },
);

type UserDocument = HydratedDocument<InferSchemaType<typeof userSchema>>;
type RideDocument = HydratedDocument<InferSchemaType<typeof rideSchema>>;
type DriverDocument = HydratedDocument<InferSchemaType<typeof driverSchema>>;

const UserModel = mongoose.model<UserDocument>("User", userSchema);
const RideModel = mongoose.model<RideDocument>("Ride", rideSchema);
const DriverModel = mongoose.model<DriverDocument>("Driver", driverSchema);

const app = express();

app.use(cors({
  origin: true,
  credentials: true
}));
app.use(express.json());
app.use(morgan("dev"));

interface AuthRequest extends Request {
  user?: UserDocument;
}

const authMiddleware = async (req: AuthRequest, res: Response, next: NextFunction) => {
  const header = req.headers.authorization;
  if (!header) {
    return res.status(401).json({ message: "Missing authorization header" });
  }

  const [, token] = header.split(" ");
  if (!token) {
    return res.status(401).json({ message: "Invalid authorization header" });
  }

  try {
    const payload = jwt.verify(token, JWT_SECRET) as { userId: string };
    const user = await UserModel.findById(payload.userId);
    if (!user) {
      return res.status(401).json({ message: "User not found" });
    }

    req.user = user;
    next();
  } catch (error) {
    return res.status(401).json({ message: "Invalid token" });
  }
};

const toPublicUser = (user: UserDocument) => ({
  id: user._id.toString(),
  name: user.name,
  email: user.email,
  createdAt: user.createdAt?.toISOString() ?? new Date().toISOString(),
});

const mapRide = (ride: RideDocument) => ({
  id: ride._id.toString(),
  from: ride.from,
  to: ride.to,
  date: ride.date,
  time: ride.time,
  seats: ride.seats,
  totalFare: ride.totalFare,
  postedBy: ride.postedBy,
  note: ride.note,
  verified: ride.verified,
  status: ride.status,
  hostId: ride.hostId.toString(),
  participants: ride.participants.map((participant) => ({
    userId: participant.userId.toString(),
    name: participant.name,
    joinedAt: participant.joinedAt?.toISOString() ?? new Date().toISOString(),
  })),
});

const signupSchema = z.object({
  name: z.string().min(2),
  email: z.string().email(),
  password: z.string().min(6),
  securityQuestion: z.string().min(5),
  securityAnswer: z.string().min(2),
});

const loginSchema = z.object({
  email: z.string().email(),
  password: z.string().min(6),
});

const ridePayloadSchema = z.object({
  from: z.string().min(2),
  to: z.string().min(2),
  date: z.string(),
  time: z.string(),
  seats: z.number().min(1).max(4),
  totalFare: z.number().min(100),
  note: z.string().optional(),
});

app.get("/api/health", (_req, res) => {
  res.json({ status: "ok" });
});

app.post("/api/auth/signup", async (req, res) => {
  const parsed = signupSchema.safeParse(req.body);
  if (!parsed.success) {
    return res.status(400).json({ message: "Invalid payload", errors: parsed.error.flatten() });
  }

  const { name, email, password, securityQuestion, securityAnswer } = parsed.data;
  const normalizedEmail = email.toLowerCase();
  const existing = await UserModel.findOne({ email: normalizedEmail });
  if (existing) {
    return res.status(409).json({ message: "Email already registered" });
  }

  const passwordHash = await bcrypt.hash(password, 10);
  const securityAnswerHash = await bcrypt.hash(securityAnswer.toLowerCase(), 10);
  const newUser = await UserModel.create({
    name,
    email: normalizedEmail,
    passwordHash,
    securityQuestion,
    securityAnswerHash,
  });

  const token = jwt.sign({ userId: newUser._id.toString() }, JWT_SECRET, { expiresIn: "7d" });
  return res.status(201).json({ user: toPublicUser(newUser), token });
});

app.post("/api/auth/login", async (req, res) => {
  const parsed = loginSchema.safeParse(req.body);
  if (!parsed.success) {
    return res.status(400).json({ message: "Invalid credentials" });
  }

  const { email, password } = parsed.data;
  const user = await UserModel.findOne({ email: email.toLowerCase() });
  if (!user) {
    return res.status(401).json({ message: "Invalid credentials" });
  }

  const isValid = await bcrypt.compare(password, user.passwordHash);
  if (!isValid) {
    return res.status(401).json({ message: "Invalid credentials" });
  }

  const token = jwt.sign({ userId: user._id.toString() }, JWT_SECRET, { expiresIn: "7d" });
  return res.json({ user: toPublicUser(user), token });
});

app.get("/api/auth/security-question/:email", async (req, res) => {
  const { email } = req.params;
  const user = await UserModel.findOne({ email: email.toLowerCase() });
  if (!user) {
    return res.status(404).json({ message: "User not found" });
  }
  // For older users without a security question, handle gracefully or return error
  if (!user.securityQuestion) {
    return res.status(400).json({ message: "No security question set for this account" });
  }
  res.json({ question: user.securityQuestion });
});

app.post("/api/auth/reset-password", async (req, res) => {
  const { email, securityAnswer, newPassword } = req.body;
  if (!email || !securityAnswer || !newPassword) {
    return res.status(400).json({ message: "Missing required fields" });
  }

  const user = await UserModel.findOne({ email: email.toLowerCase() });
  if (!user) {
    return res.status(404).json({ message: "User not found" });
  }

  if (!user.securityAnswerHash) {
    return res.status(400).json({ message: "Security answer not set" });
  }

  const isValid = await bcrypt.compare(securityAnswer.toLowerCase(), user.securityAnswerHash);
  if (!isValid) {
    return res.status(401).json({ message: "Incorrect security answer" });
  }

  const passwordHash = await bcrypt.hash(newPassword, 10);
  user.passwordHash = passwordHash;
  await user.save();

  res.json({ message: "Password reset successfully" });
});

app.get("/api/auth/me", authMiddleware, (req: AuthRequest, res) => {
  return res.json({ user: toPublicUser(req.user!) });
});

app.get("/api/rides", async (_req, res) => {
  const rides = await RideModel.find().sort({ date: 1, time: 1, createdAt: 1 });
  res.json(rides.map(mapRide));
});

app.post("/api/rides", authMiddleware, async (req: AuthRequest, res) => {
  const parsed = ridePayloadSchema.safeParse({
    ...req.body,
    seats: Number(req.body?.seats),
    totalFare: Number(req.body?.totalFare),
  });

  if (!parsed.success) {
    return res.status(400).json({ message: "Invalid ride payload", errors: parsed.error.flatten() });
  }

  const payload = parsed.data;
  const ride = await RideModel.create({
    from: payload.from,
    to: payload.to,
    date: payload.date,
    time: payload.time,
    seats: payload.seats,
    totalFare: payload.totalFare,
    note: payload.note,
    postedBy: req.user!.name,
    verified: true,
    status: "upcoming",
    hostId: req.user!._id,
    participants: [],
  });

  res.status(201).json(mapRide(ride));
});

app.post("/api/rides/:rideId/join", authMiddleware, async (req: AuthRequest, res) => {
  const { rideId } = req.params;
  const ride = await RideModel.findById(rideId);
  if (!ride) {
    return res.status(404).json({ message: "Ride not found" });
  }

  if (ride.hostId.toString() === req.user!._id.toString()) {
    return res.status(400).json({ message: "You already host this ride" });
  }

  const alreadyJoined = ride.participants.some((participant) => participant.userId.toString() === req.user!._id.toString());
  if (alreadyJoined) {
    return res.status(400).json({ message: "You already joined this ride" });
  }

  if (ride.participants.length >= ride.seats) {
    return res.status(400).json({ message: "Ride is full" });
  }

  ride.participants.push({
    userId: req.user!._id,
    name: req.user!.name,
    joinedAt: new Date(),
  });

  await ride.save();
  res.json(mapRide(ride));
});

app.get("/api/drivers", async (_req, res) => {
  const drivers = await DriverModel.find().sort({ name: 1 });
  res.json(drivers);
});

app.use((err: Error, _req: Request, res: Response, _next: NextFunction) => {
  console.error(err);
  res.status(500).json({ message: "Unexpected server error" });
});

async function seedInitialData() {
  const driverCount = await DriverModel.estimatedDocumentCount();
  if (driverCount === 0) {
    await DriverModel.insertMany(seedDrivers);
    console.log("Seeded driver profiles");
  }

  const rideCount = await RideModel.estimatedDocumentCount();
  if (rideCount === 0) {
    const seedPasswordHash = await bcrypt.hash("SeedAccount#123", 10);
    for (const ride of seedRides as {
      from: string;
      to: string;
      date: string;
      time: string;
      seats: number;
      totalFare: number;
      note?: string;
      postedBy: string;
      verified: boolean;
      status?: "upcoming" | "completed";
    }[]) {
      const emailSlug =
        ride.postedBy
          .trim()
          .toLowerCase()
          .replace(/[^a-z0-9]+/g, ".")
          .replace(/^\.+|\.+$/g, "") + "@seed.rideconnect";

      let host = await UserModel.findOne({ email: emailSlug });
      if (!host) {
        host = await UserModel.create({
          name: ride.postedBy,
          email: emailSlug,
          passwordHash: seedPasswordHash,
          securityQuestion: "What is your pet's name?",
          securityAnswerHash: await bcrypt.hash("fluffy", 10),
        });
      }

      await RideModel.create({
        from: ride.from,
        to: ride.to,
        date: ride.date,
        time: ride.time,
        seats: ride.seats,
        totalFare: ride.totalFare,
        note: ride.note,
        postedBy: ride.postedBy,
        verified: ride.verified,
        status: ride.status ?? "upcoming",
        hostId: host._id,
        participants: [],
      });
    }
    console.log("Seeded ride listings");
  }
}

async function startServer() {
  try {
    await mongoose.connect(MONGODB_URI);
    await seedInitialData();
    const server = app.listen(PORT, () => {
      console.log(`RideConnect API listening on port ${PORT}`);
    });

    const gracefulShutdown = () => {
      console.log('Received kill signal, shutting down gracefully');
      server.close(() => {
        console.log('Closed out remaining connections');
        process.exit(0);
      });

      setTimeout(() => {
        console.error('Could not close connections in time, forcefully shutting down');
        process.exit(1);
      }, 10000);
    };

    process.on('SIGTERM', gracefulShutdown);
    process.on('SIGINT', gracefulShutdown);
  } catch (error) {
    console.error("Failed to start server:", error);
    process.exit(1);
  }
}

startServer();
