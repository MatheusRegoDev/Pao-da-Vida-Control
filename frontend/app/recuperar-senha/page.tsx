"use client"

import Link from "next/link"
import { ArrowLeft, CheckCircle2, Mail, Sparkles } from "lucide-react"
import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"

export default function RecoverPasswordPage() {
  const [sent, setSent] = useState(false)
  return <main className="flex min-h-screen items-center justify-center bg-[#fbf7f1] px-5 py-10"><div className="w-full max-w-md"><Link href="/login" className="mb-10 inline-flex items-center gap-2 text-sm font-medium text-[#8b4f36]"><ArrowLeft data-icon="inline-start" /> Voltar para login</Link><div className="rounded-[2rem] border border-[#eadbce] bg-white p-6 shadow-xl shadow-[#6f3c2a]/5 sm:p-10"><span className="flex size-12 items-center justify-center rounded-2xl bg-[#f3e5d7] text-[#8b4f36]"><Sparkles /></span>{sent ? <div className="mt-7"><CheckCircle2 className="size-10 text-[#6c9a65]" /><h1 className="mt-5 text-3xl font-bold text-[#34231d]">Verifique seu e-mail</h1><p className="mt-3 text-sm leading-6 text-[#70594e]">Enviamos um link de recuperação para o endereço informado. O link expira em 30 minutos.</p><Button render={<Link href="/login" />} className="mt-7 h-12 w-full rounded-xl bg-[#8b4f36] text-white hover:bg-[#6f3c2a]">Voltar para login</Button></div> : <div className="mt-7"><h1 className="text-3xl font-bold text-[#34231d]">Recupere sua senha</h1><p className="mt-3 text-sm leading-6 text-[#70594e]">Informe seu e-mail de acesso e enviaremos as instruções para criar uma nova senha.</p><form className="mt-7 flex flex-col gap-5" onSubmit={(event) => { event.preventDefault(); setSent(true) }}><div className="flex flex-col gap-2"><Label htmlFor="recover-email" className="text-[#4b2e25]">E-mail cadastrado</Label><div className="relative"><Mail className="pointer-events-none absolute left-3 top-1/2 size-4 -translate-y-1/2 text-[#a98775]" /><Input id="recover-email" type="email" placeholder="voce@padaria.com" className="h-12 rounded-xl border-[#e2cdbb] bg-white pl-10 focus-visible:ring-[#8b4f36]" required /></div></div><Button type="submit" className="h-12 rounded-xl bg-[#8b4f36] text-white hover:bg-[#6f3c2a]">Enviar instruções</Button></form></div>}</div><p className="mt-6 text-center text-xs text-[#9a7c6c]">PadariaGest · Gestão que acompanha seu crescimento.</p></div></main>
}
