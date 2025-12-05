"use client";
import clsx from "clsx";
import { useState } from "react";
const items = [{id:"profile",label:"Profile Settings"},{id:"preferences",label:"Preferences"},{id:"account",label:"Account Management"},{id:"team",label:"Team & Permissions"}];
export default function SettingsSidebar({onChange}){ const [active,setActive]=useState("profile"); function sel(id){setActive(id); onChange && onChange(id);} return (
  <div className="card-glass p-4 max-w-[320px]">
    <div className="text-sm font-semibold mb-4">Settings</div>
    <nav className="flex flex-col gap-2">{items.map(it=>(
      <button key={it.id} onClick={()=>sel(it.id)} className={clsx("p-3 rounded-lg text-sm", active===it.id? "bg-primary/10 ring-1 ring-primary/30":"bg-transparent text-muted-foreground")}>{it.label}</button>
    ))}</nav>
  </div>
);}
