"use client";

import { useActionState } from "react";
import { login } from "@/app/admin/actions";

const Page = () => {
  const [state, formAction, pending] = useActionState(login, undefined);

  return (
    <div className="flex min-h-screen items-center justify-center bg-black text-white">
      <form action={formAction} className="flex w-72 flex-col gap-4">
        <input
          type="password"
          name="password"
          placeholder="Password"
          className="border border-white/30 bg-transparent p-2 text-sm outline-none"
        />
        {state?.error && <p className="text-xs text-red-400">{state.error}</p>}
        <button
          type="submit"
          disabled={pending}
          className="border border-white/30 p-2 text-sm uppercase disabled:opacity-50"
        >
          {pending ? "Checking…" : "Enter"}
        </button>
      </form>
    </div>
  );
};

export default Page;
