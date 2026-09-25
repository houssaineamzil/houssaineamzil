"use server";

import { revalidatePath } from "next/cache";
import { cookies } from "next/headers";
import { redirect } from "next/navigation";
import {
  checkPassword,
  createSessionCookie,
  requireAdmin,
  SESSION_COOKIE_MAX_AGE_SECONDS,
  SESSION_COOKIE_NAME,
} from "@/lib/auth";
import type { AboutContent, SiteLinks } from "@/lib/db/schema";
import {
  deleteProject,
  type ProjectInput,
  reorderProjects,
  upsertProject,
} from "@/services/projects";
import { updateAboutContent, updateSiteLinks } from "@/services/settings";

const FAILED_LOGIN_DELAY_MS = 750;

export async function login(
  _prevState: { error?: string } | undefined,
  formData: FormData,
): Promise<{ error?: string }> {
  const password = String(formData.get("password") ?? "");

  if (!checkPassword(password)) {
    // A fixed delay on every failed attempt — simple, stateless throttling
    // against brute-force guessing. This route is public (proxy.ts
    // exempts /admin/login), so it has no other rate limiting.
    await new Promise((resolve) => setTimeout(resolve, FAILED_LOGIN_DELAY_MS));
    return { error: "Incorrect password" };
  }

  const token = await createSessionCookie();
  const cookieStore = await cookies();
  cookieStore.set(SESSION_COOKIE_NAME, token, {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: "lax",
    maxAge: SESSION_COOKIE_MAX_AGE_SECONDS,
    path: "/",
  });

  redirect("/admin");
}

export async function logout(): Promise<void> {
  const cookieStore = await cookies();
  cookieStore.delete(SESSION_COOKIE_NAME);
  redirect("/admin/login");
}

export async function saveProject(
  input: ProjectInput,
): Promise<{ id: string }> {
  await requireAdmin();
  const saved = await upsertProject(input);
  revalidatePath("/works");
  revalidatePath(`/works/${saved.slug}`);
  revalidatePath("/");
  revalidatePath("/archive");
  return { id: saved.id };
}

export async function removeProject(id: string): Promise<void> {
  await requireAdmin();
  await deleteProject(id);
  revalidatePath("/works");
  revalidatePath("/");
  revalidatePath("/archive");
}

export async function saveProjectOrder(orderedIds: string[]): Promise<void> {
  await requireAdmin();
  await reorderProjects(orderedIds);
  revalidatePath("/works");
  revalidatePath("/");
  revalidatePath("/archive");
}

export async function saveAbout(content: AboutContent): Promise<void> {
  await requireAdmin();
  await updateAboutContent(content);
  revalidatePath("/about");
}

export async function saveSiteLinks(links: SiteLinks): Promise<void> {
  await requireAdmin();
  await updateSiteLinks(links);
  revalidatePath("/", "layout");
}
