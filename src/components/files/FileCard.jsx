// export default function FileCard({title,count,color,tags,tagSingle}){
//   const colorMap = { blue:"from-[#3730a3] to-[#4c1d95]", yellow:"from-yellow-400 to-yellow-600", green:"from-green-400 to-green-600", red:"from-red-400 to-red-600" };
//   return (
//     <div className={`rounded-2xl p-5 relative bg-gradient-to-br ${colorMap[color] || colorMap.blue} shadow-lg`}>
//       <h3 className="text-lg font-semibold">{title}</h3>
//       <p className="text-sm opacity-80">{count}</p>
//       { (tags || tagSingle) && <div className="absolute top-4 right-4 flex gap-1">{ tags?.map(t=> <div key={t} className="bg-black/30 px-2 py-1 text-xs rounded-full">{t}</div>) } {tagSingle && <div className="bg-black/30 px-2 py-1 text-xs rounded-full">{tagSingle}</div>}</div> }
//     </div>
//   );
// }
"use client";

export default function FileCard({ file, onPreview, onShare, onDelete }) {
  return (
    <div className="flex items-center justify-between gap-3 p-2 rounded-md hover:bg-white/3 transition">
      <div className="flex items-center gap-3">
        <div className="w-9 h-9 rounded-md bg-white/5 flex items-center justify-center text-sm">{file.name.split(".").pop()}</div>
        <div>
          <div className="text-sm font-medium text-white">{file.name}</div>
          <div className="text-xs text-muted-foreground">{Math.round((file.size||0)/1024)} KB</div>
        </div>
      </div>

      <div className="flex items-center gap-2 text-sm">
        <button onClick={onPreview} className="text-muted-foreground">Preview</button>
        <button onClick={onShare} className="text-muted-foreground">Share</button>
        <button onClick={onDelete} className="text-red-400">Delete</button>
      </div>
    </div>
  );
}
