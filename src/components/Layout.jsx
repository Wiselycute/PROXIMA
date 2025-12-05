import Sidebar from "./Sidebar";
import Topbar from "./Topbar";


export default function Layout({ children }) {
return (
<div className="flex bg-[#0F0B26] text-white min-h-screen dark:bg-[#0A091C]">
<Sidebar />


<main className="ml-64 w-full">
<Topbar />
<div className="pt-20 px-8 pb-8">{children}</div>
</main>
</div>
);
}