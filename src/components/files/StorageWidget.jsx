"use client";
export default function StorageWidget(){
  const used = 86, total = 120;
  const pct = Math.round((used/total)*100);
  return (
    <div>
      <div className="bg-gradient-to-r from-[#4b33d9] to-[#3ecadf] p-4 rounded text-white">
        <div className="flex items-center justify-between">
          <div>Available Storage</div>
          <div className="font-bold">{pct}%</div>
        </div>
        <div className="h-3 bg-white/20 rounded mt-3 overflow-hidden">
          <div style={{ width: `${pct}%` }} className="h-3 bg-white/70"></div>
        </div>
        <div className="text-xs opacity-80 mt-2">{used}GB / {total}GB used</div>
      </div>

      <div className="mt-4 space-y-3">
        {[
          { name: "Images", size: "86 GB" },
          { name: "Docs", size: "26 GB" },
          { name: "Design", size: "10 GB" },
          { name: "Other", size: "18 GB" },
        ].map((row,i)=>(
          <div key={i} className="flex items-center justify-between p-3 bg-white/3 rounded">
            <div className="flex items-center gap-3">
              <div className="w-9 h-9 rounded bg-white/6 flex items-center justify-center">I</div>
              <div>
                <div className="font-medium">{row.name}</div>
                <div className="text-xs opacity-70">Files</div>
              </div>
            </div>
            <div className="text-sm opacity-80">{row.size}</div>
          </div>
        ))}
      </div>
    </div>
  );
}
