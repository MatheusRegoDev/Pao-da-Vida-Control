"use client"

import Link from "next/link"
import { ArrowRight, BarChart3, Check, Package, ShieldCheck, Sparkles, TrendingUp, Users } from "lucide-react"
import { Button } from "@/components/ui/button"

const features = [
  { icon: Package, title: "Estoque sob controle", text: "Acompanhe níveis, entradas e alertas antes que falte produto." },
  { icon: BarChart3, title: "Decisões com dados", text: "Visualize produção, vendas e receita em relatórios simples." },
  { icon: Users, title: "Equipe conectada", text: "Organize acessos e responsabilidades em um só lugar." },
]

export default function LandingPage() {
  return (
    <main className="min-h-screen overflow-hidden bg-[#fbf7f1] text-[#34231d]">
      <header className="mx-auto flex w-full max-w-7xl items-center justify-between px-5 py-5 sm:px-8 lg:px-12">
        <Link href="/landing" className="flex items-center gap-3" aria-label="PadariaGest início">
          <span className="flex size-10 items-center justify-center rounded-2xl bg-[#8b4f36] text-white shadow-lg shadow-[#8b4f36]/20"><Sparkles /></span>
          <span className="text-lg font-bold tracking-tight">Padaria<span className="text-[#b97943]">Gest</span></span>
        </Link>
        <nav className="hidden items-center gap-8 text-sm font-medium text-[#70594e] md:flex">
          <a href="#recursos" className="transition-colors hover:text-[#8b4f36]">Recursos</a>
          <a href="#beneficios" className="transition-colors hover:text-[#8b4f36]">Benefícios</a>
          <Link href="/login" className="text-[#8b4f36] hover:text-[#6f3c2a]">Entrar</Link>
        </nav>
        <Button render={<Link href="/login" />} className="rounded-full bg-[#8b4f36] px-5 text-white hover:bg-[#6f3c2a]">Começar agora <ArrowRight data-icon="inline-end" /></Button>
      </header>

      <section className="mx-auto grid max-w-7xl items-center gap-12 px-5 pb-20 pt-12 sm:px-8 sm:pt-20 lg:grid-cols-[1.05fr_.95fr] lg:px-12 lg:pb-28">
        <div>
          <div className="mb-6 inline-flex items-center gap-2 rounded-full border border-[#e9d6c1] bg-white/70 px-3 py-1.5 text-xs font-semibold text-[#8b4f36]"><span className="size-2 rounded-full bg-[#d28a4d]" /> Gestão mais leve para sua padaria</div>
          <h1 className="max-w-3xl text-4xl font-bold leading-[1.08] tracking-tight sm:text-6xl lg:text-7xl">Mais tempo para criar. <span className="text-[#b97943]">Mais controle</span> para crescer.</h1>
          <p className="mt-6 max-w-xl text-base leading-7 text-[#70594e] sm:text-lg">O PadariaGest reúne estoque, produção, vendas e sua equipe em uma experiência simples, feita para a rotina real da sua padaria.</p>
          <div className="mt-8 flex flex-col gap-3 sm:flex-row"><Button render={<Link href="/login" />} size="lg" className="rounded-full bg-[#8b4f36] px-7 text-white hover:bg-[#6f3c2a]">Acessar sistema <ArrowRight data-icon="inline-end" /></Button><Button render={<a href="#recursos" />} variant="outline" size="lg" className="rounded-full border-[#d9bda5] bg-transparent text-[#8b4f36] hover:bg-[#f3e5d7]">Conheça os recursos</Button></div>
          <div className="mt-9 flex flex-wrap gap-x-6 gap-y-3 text-sm text-[#70594e]"><span className="flex items-center gap-2"><Check className="text-[#b97943]" /> Feito para padarias</span><span className="flex items-center gap-2"><Check className="text-[#b97943]" /> Visão em tempo real</span></div>
        </div>
        <div className="relative mx-auto w-full max-w-md lg:max-w-none">
          <div className="absolute -inset-6 rounded-[3rem] bg-[#e9c9a9]/30 blur-3xl" />
          <div className="relative rounded-[2rem] border border-white/80 bg-[#4b2e25] p-4 shadow-2xl shadow-[#6f3c2a]/20 sm:p-6">
            <div className="mb-5 flex items-center justify-between text-white"><div><p className="text-xs text-[#dcbda5]">Visão geral</p><p className="font-semibold">Sua padaria hoje</p></div><TrendingUp className="text-[#e5a66e]" /></div>
            <div className="grid grid-cols-2 gap-3"><div className="rounded-2xl bg-white/10 p-4"><p className="text-xs text-[#dcbda5]">Produção hoje</p><p className="mt-2 text-2xl font-bold text-white">1.248</p><p className="mt-1 text-xs text-[#e5a66e]">+12,5%</p></div><div className="rounded-2xl bg-white/10 p-4"><p className="text-xs text-[#dcbda5]">Vendas hoje</p><p className="mt-2 text-2xl font-bold text-white">R$ 4.890</p><p className="mt-1 text-xs text-[#e5a66e]">+8,2%</p></div></div>
            <div className="mt-3 rounded-2xl bg-[#fbf7f1] p-4"><div className="flex items-center justify-between"><p className="text-sm font-semibold text-[#4b2e25]">Produção x vendas</p><span className="rounded-full bg-[#f3e5d7] px-2 py-1 text-[10px] text-[#8b4f36]">Esta semana</span></div><div className="mt-5 flex h-28 items-end gap-2">{[35, 55, 48, 80, 62, 92, 72, 100, 78, 88, 66, 95].map((height, index) => <div key={index} className="flex flex-1 items-end gap-0.5"><div className="w-1/2 rounded-t bg-[#d28a4d]" style={{ height: `${height}%` }} /><div className="w-1/2 rounded-t bg-[#8b4f36]/70" style={{ height: `${Math.max(height - 22, 12)}%` }} /></div>)}</div></div>
          </div>
        </div>
      </section>

      <section id="recursos" className="border-y border-[#eadbce] bg-white/60 px-5 py-16 sm:px-8 lg:px-12"><div className="mx-auto max-w-7xl"><div className="max-w-xl"><p className="text-sm font-bold uppercase tracking-[0.2em] text-[#b97943]">Tudo em um só lugar</p><h2 className="mt-3 text-3xl font-bold tracking-tight sm:text-4xl">A rotina fica mais simples quando a informação está organizada.</h2></div><div className="mt-10 grid gap-4 md:grid-cols-3">{features.map(({ icon: Icon, title, text }) => <div key={title} className="rounded-3xl border border-[#eadbce] bg-[#fbf7f1] p-6"><span className="flex size-11 items-center justify-center rounded-2xl bg-[#f3e5d7] text-[#8b4f36]"><Icon /></span><h3 className="mt-5 text-lg font-bold">{title}</h3><p className="mt-2 text-sm leading-6 text-[#70594e]">{text}</p></div>)}</div></div></section>
      <footer className="mx-auto flex max-w-7xl flex-col gap-3 px-5 py-8 text-sm text-[#70594e] sm:flex-row sm:items-center sm:justify-between sm:px-8 lg:px-12"><p>© 2026 PadariaGest. Gestão que acompanha seu crescimento.</p><Link href="/login" className="font-semibold text-[#8b4f36]">Entrar no sistema <ArrowRight className="ml-1 inline size-4" /></Link></footer>
    </main>
  )
}
