export default function Card({title,value,children}){
  return (
    <div className="card-glass p-4 rounded-xl">
      {title && (
        <div className="flex items-center justify-between mb-3">
          <div className="text-sm font-medium">{title}</div>
          {value && <div className="text-xl font-bold">{value}</div>}
        </div>
      )}
      {children}
    </div>
  );
}
