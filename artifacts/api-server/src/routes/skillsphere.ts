import { and, asc, count, desc, eq, ilike } from "drizzle-orm";
import { Router, type IRouter } from "express";
import { db } from "@workspace/db";
import {
  activitiesTable,
  certificatesTable,
  opportunitiesTable,
  profilesTable,
  roadmapTable,
  skillsTable,
} from "@workspace/db";
import {
  CreateCertificateBody,
  CreateCertificateResponse,
  CreateSkillBody,
  CreateSkillResponse,
  DeleteCertificateParams,
  DeleteSkillParams,
  GetCertificatesResponse,
  GetDashboardResponse,
  GetOpportunitiesQueryParams,
  GetOpportunitiesResponse,
  GetProfileResponse,
  GetRoadmapResponse,
  GetSkillsResponse,
  UpdateProfileBody,
  UpdateProfileResponse,
  UpdateRoadmapItemBody,
  UpdateRoadmapItemParams,
  UpdateRoadmapItemResponse,
  UpdateSkillBody,
  UpdateSkillParams,
  UpdateSkillResponse,
} from "@workspace/api-zod";

const router: IRouter = Router();

let seedPromise: Promise<void> | undefined;

function ensureSeeded(): Promise<void> {
  if (!seedPromise) {
    seedPromise = seedDatabase().catch((error) => {
      seedPromise = undefined;
      throw error;
    });
  }
  return seedPromise;
}

async function seedDatabase(): Promise<void> {
  const [existingProfile] = await db.select().from(profilesTable).limit(1);
  if (existingProfile) return;

  await db.insert(profilesTable).values({
    name: "Maya Patel",
    email: "maya.patel@example.com",
    headline: "Product designer transitioning into AI",
    location: "Bengaluru, India",
    goal: "AI Product Manager",
    avatarInitials: "MP",
  });

  await db.insert(skillsTable).values([
    { name: "Product strategy", category: "Product", level: "Advanced", progress: 86, verified: true },
    { name: "User research", category: "Design", level: "Advanced", progress: 78, verified: true },
    { name: "Python", category: "Technical", level: "Intermediate", progress: 54, verified: false },
    { name: "Data storytelling", category: "Technical", level: "Intermediate", progress: 48, verified: false },
    { name: "AI fundamentals", category: "Technical", level: "Beginner", progress: 32, verified: false },
    { name: "Stakeholder management", category: "Leadership", level: "Advanced", progress: 81, verified: true },
  ]);

  await db.insert(certificatesTable).values([
    { name: "Google UX Design Professional Certificate", issuer: "Google", issuedDate: "2024-09-14", credentialId: "GUX-2048-9182", status: "Verified" },
    { name: "Product Management Foundations", issuer: "Reforge", issuedDate: "2025-02-02", credentialId: "RF-PMF-7821", status: "Verified" },
    { name: "Responsible AI: Principles and Practice", issuer: "DeepLearning.AI", issuedDate: "2025-04-27", credentialId: "DLAI-RAI-5540", status: "Verified" },
  ]);

  await db.insert(roadmapTable).values([
    { phase: "01", title: "Build your AI foundation", description: "Learn the core concepts behind modern AI products and how to explain them with confidence.", status: "completed", duration: "3 weeks", skills: ["AI fundamentals", "Product strategy"] },
    { phase: "02", title: "Strengthen your data fluency", description: "Turn messy signals into clear product decisions through hands-on data storytelling.", status: "in-progress", duration: "4 weeks", skills: ["Data storytelling", "Python"] },
    { phase: "03", title: "Lead AI product discovery", description: "Practice evaluating opportunities, defining responsible experiences, and aligning stakeholders.", status: "up-next", duration: "5 weeks", skills: ["User research", "Stakeholder management"] },
    { phase: "04", title: "Make the career move", description: "Package your story, build proof of impact, and start conversations with the right teams.", status: "locked", duration: "2 weeks", skills: ["Product strategy", "Portfolio"] },
  ]);

  await db.insert(opportunitiesTable).values([
    { title: "Associate Product Manager, AI", company: "Mosaic Labs", type: "Full-time", location: "Bengaluru · Hybrid", match: 94, posted: "2 days ago", tags: ["AI", "Product", "0–2 years"], description: "Help shape AI-powered workflow products from discovery through launch." },
    { title: "AI Product Intern", company: "Northstar", type: "Internship", location: "Remote · India", match: 91, posted: "4 days ago", tags: ["AI", "Research", "Internship"], description: "Partner with product and research teams to explore new AI experiences." },
    { title: "Product Analyst Apprentice", company: "Kite Systems", type: "Apprenticeship", location: "Pune · On-site", match: 83, posted: "1 week ago", tags: ["Analytics", "Growth", "Apprenticeship"], description: "Build the analytical foundation for a fast-growing B2B product team." },
    { title: "Product Operations Associate", company: "Lumen Health", type: "Full-time", location: "Remote · APAC", match: 78, posted: "1 week ago", tags: ["Operations", "Strategy", "Remote"], description: "Create the systems that help a cross-functional team make better decisions." },
  ]);

  await db.insert(activitiesTable).values([
    { title: "You completed AI foundations", description: "Your first roadmap milestone is now complete.", time: "Today", kind: "milestone" },
    { title: "New opportunity match", description: "Associate Product Manager, AI at Mosaic Labs", time: "Yesterday", kind: "opportunity" },
    { title: "Skill verified", description: "Product strategy was verified from your portfolio.", time: "3 days ago", kind: "skill" },
    { title: "Roadmap refreshed", description: "Your next steps were updated for AI Product Manager.", time: "1 week ago", kind: "roadmap" },
  ]);
}

router.use(async (_req, _res, next): Promise<void> => {
  await ensureSeeded();
  next();
});

router.get("/dashboard", async (_req, res): Promise<void> => {
  const [[profile], skills, certificates, roadmap, activities] = await Promise.all([
    db.select().from(profilesTable).limit(1),
    db.select().from(skillsTable),
    db.select().from(certificatesTable),
    db.select().from(roadmapTable).orderBy(asc(roadmapTable.id)),
    db.select().from(activitiesTable).orderBy(desc(activitiesTable.id)).limit(5),
  ]);
  const completed = roadmap.filter((item) => item.status === "completed").length;
  const roadmapProgress = roadmap.length ? Math.round((completed / roadmap.length) * 100) : 0;
  const payload = {
    profile,
    skillCount: skills.length,
    verifiedSkillCount: skills.filter((skill) => skill.verified).length,
    certificateCount: certificates.length,
    roadmapProgress,
    targetRole: profile.goal,
    skillGap: ["AI product discovery", "Data storytelling", "Experiment design"],
    activities,
  };
  res.json(GetDashboardResponse.parse(payload));
});

router.get("/profile", async (_req, res): Promise<void> => {
  const [profile] = await db.select().from(profilesTable).limit(1);
  res.json(GetProfileResponse.parse(profile));
});

router.patch("/profile", async (req, res): Promise<void> => {
  const parsed = UpdateProfileBody.safeParse(req.body);
  if (!parsed.success) {
    res.status(400).json({ error: parsed.error.message });
    return;
  }
  const [profile] = await db.update(profilesTable).set(parsed.data).where(eq(profilesTable.id, 1)).returning();
  if (!profile) {
    res.status(404).json({ error: "Profile not found" });
    return;
  }
  res.json(UpdateProfileResponse.parse(profile));
});

router.get("/skills", async (_req, res): Promise<void> => {
  const skills = await db.select().from(skillsTable).orderBy(desc(skillsTable.progress));
  res.json(GetSkillsResponse.parse(skills));
});

router.post("/skills", async (req, res): Promise<void> => {
  const parsed = CreateSkillBody.safeParse(req.body);
  if (!parsed.success) {
    res.status(400).json({ error: parsed.error.message });
    return;
  }
  const [skill] = await db.insert(skillsTable).values(parsed.data).returning();
  res.status(201).json(CreateSkillResponse.parse(skill));
});

router.patch("/skills/:id", async (req, res): Promise<void> => {
  const params = UpdateSkillParams.safeParse(req.params);
  const parsed = UpdateSkillBody.safeParse(req.body);
  if (!params.success) {
    res.status(400).json({ error: params.error.message });
    return;
  }
  if (!parsed.success) {
    res.status(400).json({ error: parsed.error.message });
    return;
  }
  const [skill] = await db.update(skillsTable).set(parsed.data).where(eq(skillsTable.id, params.data.id)).returning();
  if (!skill) {
    res.status(404).json({ error: "Skill not found" });
    return;
  }
  res.json(UpdateSkillResponse.parse(skill));
});

router.delete("/skills/:id", async (req, res): Promise<void> => {
  const params = DeleteSkillParams.safeParse(req.params);
  if (!params.success) {
    res.status(400).json({ error: params.error.message });
    return;
  }
  const [skill] = await db.delete(skillsTable).where(eq(skillsTable.id, params.data.id)).returning();
  if (!skill) {
    res.status(404).json({ error: "Skill not found" });
    return;
  }
  res.sendStatus(204);
});

router.get("/certificates", async (_req, res): Promise<void> => {
  const certificates = await db.select().from(certificatesTable).orderBy(desc(certificatesTable.issuedDate));
  res.json(GetCertificatesResponse.parse(certificates));
});

router.post("/certificates", async (req, res): Promise<void> => {
  const parsed = CreateCertificateBody.safeParse(req.body);
  if (!parsed.success) {
    res.status(400).json({ error: parsed.error.message });
    return;
  }
  const [certificate] = await db.insert(certificatesTable).values(parsed.data).returning();
  res.status(201).json(CreateCertificateResponse.parse(certificate));
});

router.delete("/certificates/:id", async (req, res): Promise<void> => {
  const params = DeleteCertificateParams.safeParse(req.params);
  if (!params.success) {
    res.status(400).json({ error: params.error.message });
    return;
  }
  const [certificate] = await db.delete(certificatesTable).where(eq(certificatesTable.id, params.data.id)).returning();
  if (!certificate) {
    res.status(404).json({ error: "Certificate not found" });
    return;
  }
  res.sendStatus(204);
});

router.get("/roadmap", async (_req, res): Promise<void> => {
  const roadmap = await db.select().from(roadmapTable).orderBy(asc(roadmapTable.id));
  res.json(GetRoadmapResponse.parse(roadmap));
});

router.patch("/roadmap/:id", async (req, res): Promise<void> => {
  const params = UpdateRoadmapItemParams.safeParse(req.params);
  const parsed = UpdateRoadmapItemBody.safeParse(req.body);
  if (!params.success) {
    res.status(400).json({ error: params.error.message });
    return;
  }
  if (!parsed.success) {
    res.status(400).json({ error: parsed.error.message });
    return;
  }
  const [item] = await db.update(roadmapTable).set(parsed.data).where(eq(roadmapTable.id, params.data.id)).returning();
  if (!item) {
    res.status(404).json({ error: "Roadmap item not found" });
    return;
  }
  res.json(UpdateRoadmapItemResponse.parse(item));
});

router.get("/opportunities", async (req, res): Promise<void> => {
  const parsed = GetOpportunitiesQueryParams.safeParse(req.query);
  if (!parsed.success) {
    res.status(400).json({ error: parsed.error.message });
    return;
  }
  const filters = [];
  if (parsed.data.type) filters.push(eq(opportunitiesTable.type, parsed.data.type));
  if (parsed.data.search) {
    const pattern = `%${parsed.data.search}%`;
    filters.push(ilike(opportunitiesTable.title, pattern));
  }
  const opportunities = await db.select().from(opportunitiesTable)
    .where(filters.length ? and(...filters) : undefined)
    .orderBy(desc(opportunitiesTable.match));
  res.json(GetOpportunitiesResponse.parse(opportunities));
});

export default router;