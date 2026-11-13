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
import { type CollectionKind, collections } from "@/lib/collections";
import type { AboutContent, SiteLinks } from "@/lib/db/schema";
import { getCollection, type ProjectInput } from "@/services/projects";
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

// Any change can reach every project page: neighbours' prev/next links move
// on reorder, and a rename or delete changes which URLs exist. The home page
// shows works only, so only works revalidate it.
function revalidateCollection(kind: CollectionKind) {
  const { publicPath } = collections[kind];
  revalidatePath(publicPath);
  revalidatePath(`${publicPath}/[slug]`, "page");
  if (kind === "works") revalidatePath("/");
}

export async function saveProject(
  kind: CollectionKind,
  input: ProjectInput,
): Promise<{ id: string }> {
  await requireAdmin();
  const saved = await getCollection(kind).upsert(input);
  revalidateCollection(kind);
  return { id: saved.id };
}

export async function removeProject(
  kind: CollectionKind,
  id: string,
): Promise<void> {
  await requireAdmin();
  await getCollection(kind).remove(id);
  revalidateCollection(kind);
}

export async function saveProjectOrder(
  kind: CollectionKind,
  orderedIds: string[],
): Promise<void> {
  await requireAdmin();
  await getCollection(kind).reorder(orderedIds);
  revalidateCollection(kind);
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
