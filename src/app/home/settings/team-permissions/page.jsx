import Sidebar from "@/components/Sidebar";
import Topbar from "@/components/Topbar";
import TeamPermissions from "@/components/settings/TeamPermissions";

export default function Page() {
  return (
    <div className="min-h-screen flex">
      <Sidebar />
      <div className="flex-1">
        <Topbar   />
        <main className="p-8">
          <TeamPermissions />
        </main>
      </div>
    </div>
  );
}