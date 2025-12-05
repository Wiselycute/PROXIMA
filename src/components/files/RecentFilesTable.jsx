"use client";
export default function RecentFilesTable(){
  const rows = [
    { name:"Proposal.docx", size:"2.9 MB", date:"Feb 25, 2022", members:4 },
    { name:"Background.jpg", size:"3.5 MB", date:"Feb 24, 2022", members:3 },
    { name:"Apex website.fig", size:"23.5 MB", date:"Feb 22, 2022", members:5 },
    { name:"Illustration.ai", size:"7.2 MB", date:"Feb 20, 2022", members:2 },
  ];
  return (
    <table className="w-full">
      <thead className="text-left text-xs text-white/70">
        <tr>
          <th className="py-2">Name</th>
          <th>Size</th>
          <th>Last Modified</th>
          <th>Members</th>
        </tr>
      </thead>
      <tbody>
        {rows.map((r, i) => (
          <tr key={i} className="border-t border-white/4">
            <td className="py-3">{r.name}</td>
            <td>{r.size}</td>
            <td>{r.date}</td>
            <td>
              <div className="flex -space-x-2">
                {Array.from({length:r.members}).map((_, idx) => (
                  <div key={idx} className="w-6 h-6 bg-white/8 rounded-full border border-white/6"></div>
                ))}
              </div>
            </td>
          </tr>
        ))}
      </tbody>
    </table>
  );
}
