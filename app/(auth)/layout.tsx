export default function AuthLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-slate-800 to-indigo-950 flex items-center justify-center p-4">
      <div className="absolute inset-0 bg-[url('/noise.png')] opacity-20 pointer-events-none mix-blend-overlay" />
      <div className="w-full max-w-md animate-in fade-in slide-in-from-bottom-10 duration-700">
        <div className="mb-8 text-center">
          <h1 className="text-4xl font-extrabold tracking-tight text-white mb-2">FinX</h1>
          <p className="text-slate-400">Next-Generation Cooperative Banking</p>
        </div>
        {children}
      </div>
    </div>
  );
}
