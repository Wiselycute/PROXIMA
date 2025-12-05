"use client";
import StorageWidget from "./StorageWidget";
import RecentFilesTable from "./RecentFilesTable";
import ActivityChart from "./ActivityChart";

export default function FilesPage(){
  return (
    <div className="max-w-7xl mx-auto space-y-6">
      <div className="flex items-center justify-between">
        <h2 className="text-2xl font-bold">Files</h2>
        <div className="flex gap-3">
          <button className="px-4 py-2 rounded btn-neon">+ Create New Folder</button>
          <button className="px-4 py-2 rounded bg-white/6">Upload</button>
        </div>
      </div>

      <div className="grid grid-cols-3 gap-6">
        <div className="col-span-2 glass p-6">
          <h3 className="font-semibold mb-3">All Files</h3>
          <div className="grid grid-cols-3 gap-4">
            {["Documents","Music","Work Project","Personal Media","Backup","Root"].map((name,i)=>(
              <div key={i} className="p-4 rounded-lg bg-gradient-to-tr from-[#4b33d9] to-[#3ecadf] text-white glass">
                <div className="font-semibold">{name}</div>
                <div className="text-xs opacity-80 mt-2">{Math.floor(Math.random() * 240)} files</div>
              </div>
            ))}
          </div>
        </div>

        <aside className="glass p-6">
          <StorageWidget />
        </aside>
      </div>

      <div className="grid grid-cols-3 gap-6">
        <div className="col-span-2 glass p-6">
          <h3 className="font-semibold mb-3">Recent Files</h3>
          <RecentFilesTable />
        </div>

        <aside className="glass p-6">
          <h3 className="font-semibold mb-3">Activity Chart</h3>
          <ActivityChart />
        </aside>
      </div>
    </div>
  );
}
