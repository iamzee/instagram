import express from "express";
import * as z from "zod";
import { prisma } from "./db.js";
import bcrypt from "bcrypt";
import crypto from "node:crypto";
import cookieParser from "cookie-parser";
import cors from "cors";

const app = express();
app.use(express.json());
app.use(cookieParser());
app.use(cors());

app.get("/health", (_, res) => {
  res.json({ data: "OK" });
});

app.post("/api/auth/signup", async (req, res) => {
  try {
    const Body = z.object({
      username: z.string().trim().min(1, "Username is empty"),
      email: z.email("Invalid email"),
      password: z
        .string()
        .trim()
        .min(6, "Password should be atleast 6 characters"),
      name: z.string().trim().min(1, "Name is empty"),
    });

    const body = await Body.parseAsync(req.body);

    const userFound = await prisma.user.findFirst({
      where: {
        OR: [{ username: body.username }, { email: body.email }],
      },
    });

    if (userFound) {
      return res.status(409).json({ error: "User already exists" });
    }

    const passwordHash = await bcrypt.hash(body.password, 10);

    const user = await prisma.user.create({
      data: {
        username: body.username,
        email: body.email,
        passwordHash,
        name: body.name,
      },
    });

    const session = await prisma.session.create({
      data: {
        id: crypto.randomBytes(16).toString("hex"),
        expiresAt: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000),
        user: {
          connect: { id: user.id },
        },
      },
    });

    res.cookie("sid", session.id, {
      sameSite: "lax",
      secure: false,
      maxAge: 7 * 24 * 60 * 60 * 1000,
      httpOnly: true,
    });

    delete user.passwordHash;
    res.status(201).json({ user });
  } catch (err) {
    console.log(err);
    if (err instanceof z.ZodError) {
      res.status(400).json({ error: err.issues[0].message });
    } else {
      res
        .status(500)
        .json({ error: "Something went wrong. Contact tech support." });
    }
  }
});

app.get("/api/auth/me", async (req, res) => {
  const sessionId = req.cookies.sid;

  if (!sessionId) {
    return res.status(401).json({ error: "Unauthorized" });
  }

  const session = await prisma.session.findUnique({
    where: {
      id: sessionId,
    },
    include: {
      user: true,
    },
  });

  if (!session || session.expiresAt < new Date()) {
    return res.status(401).json({ error: "Unauthorized" });
  }

  delete session.user.passwordHash;
  return res.json({ user: session.user });
});

app.listen(3000, () => {
  console.log("Server started on port 3000");
});
