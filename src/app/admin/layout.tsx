import type { ReactNode } from "react";
import { logout } from "@/app/admin/actions";

const AdminLayout: React.FC<{ children: ReactNode }> = ({ children }) => {
  return (
    <div className="min-h-screen bg-white">
      <div className="flex justify-end gap-4 border-b border-black/10 p-2 text-xs uppercase">
        <a href="/admin">Dashboard</a>
        <a href="/admin/about">About</a>
        <a href="/admin/settings">Settings</a>
        <form action={logout}>
          <button type="submit">Log out</button>
        </form>
      </div>
      {children}
    </div>
  );
};

export default AdminLayout;
