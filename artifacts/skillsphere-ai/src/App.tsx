import { useEffect, useMemo, useState, type FormEvent, type ReactNode } from 'react';
import { QueryClient, QueryClientProvider, useQueryClient } from '@tanstack/react-query';
import { ErrorBoundary } from '@/components/error-boundary';
import { Toaster } from '@/components/ui/toaster';
import { TooltipProvider } from '@/components/ui/tooltip';
import NotFound from '@/pages/not-found';
import {
  Award, BarChart3, BriefcaseBusiness, Check, ChevronDown, CircleDot, Compass, FileBadge,
  GraduationCap, LayoutDashboard, Map, Menu, Pencil, Plus, Search, Settings2, Sparkles,
  Target, Trash2, TrendingUp, UserRound, X, ArrowUpRight, Clock3, CheckCircle2, Circle,
} from 'lucide-react';
import {
  getGetCertificatesQueryKey, getGetDashboardQueryKey, getGetOpportunitiesQueryKey, getGetProfileQueryKey,
  getGetRoadmapQueryKey, getGetSkillsQueryKey, useCreateCertificate, useCreateSkill, useDeleteCertificate,
  useDeleteSkill, useGetCertificates, useGetDashboard, useGetOpportunities, useGetProfile, useGetRoadmap,
  useGetSkills, useUpdateProfile, useUpdateRoadmapItem, useUpdateSkill,
  type Certificate, type Opportunity, type RoadmapItem, type Skill,
} from '@workspace/api-client-react';
import {
  Route,
  Switch,
  Link,
  useLocation,
  Router as WouterRouter,
} from 'wouter';

const queryClient = new QueryClient();

const navItems = [
  { href: '/', label: 'Overview', icon: LayoutDashboard },
  { href: '/skills', label: 'Skills', icon: BarChart3 },
  { href: '/roadmap', label: 'Roadmap', icon: Map },
  { href: '/opportunities', label: 'Opportunities', icon: BriefcaseBusiness },
  { href: '/certificates', label: 'Certificates', icon: Award },
];

function initials(name?: string) {
  return name?.split(' ').map((part) => part[0]).join('').slice(0, 2).toUpperCase() || 'SS';
}

function Shell({ children }: { children: ReactNode }) {
  const [location] = useLocation();
  const [mobileOpen, setMobileOpen] = useState(false);
  const profileQuery = useGetProfile();
  const profile = profileQuery.data;
  const pageTitle = location === '/' ? 'Overview' : navItems.find((item) => item.href === location)?.label || (location === '/profile' ? 'Profile' : 'Workspace');
  return (
    <div className="app-noise app-shell min-h-[100dvh] text-foreground">
      <aside className={`fixed inset-y-0 left-0 z-40 flex w-[252px] flex-col border-r border-sidebar-border bg-sidebar px-4 py-5 text-sidebar-foreground transition-transform duration-300 md:translate-x-0 ${mobileOpen ? 'translate-x-0' : '-translate-x-full'}`}>
        <div className="flex items-center gap-3 px-3">
          <div className="grid h-9 w-9 place-items-center rounded-xl bg-accent text-accent-foreground"><Compass size={19} strokeWidth={2.5} /></div>
          <div><div className="font-display text-[17px] font-bold tracking-tight text-white">SkillSphere</div><div className="font-mono-ui text-[9px] uppercase tracking-[.18em] text-sidebar-foreground/60">career cockpit</div></div>
        </div>
        <div className="mt-10 px-3 font-mono-ui text-[10px] uppercase tracking-[.18em] text-sidebar-foreground/45">Navigate</div>
        <nav className="mt-3 space-y-1" aria-label="Main navigation">
          {navItems.map(({ href, label, icon: Icon }) => (
            <Link key={href} href={href} onClick={() => setMobileOpen(false)} data-testid={`link-${label.toLowerCase()}`} className={`nav-link focus-ring flex items-center gap-3 rounded-xl px-3 py-2.5 text-sm font-semibold ${location === href ? 'bg-sidebar-primary text-sidebar-primary-foreground shadow-sm' : 'text-sidebar-foreground/70 hover:bg-white/7 hover:text-white'}`}>
              <Icon size={17} strokeWidth={location === href ? 2.4 : 1.8} /><span>{label}</span>
              {href === '/opportunities' && <span className="ml-auto rounded-full bg-accent/20 px-1.5 py-0.5 font-mono-ui text-[9px] text-accent">new</span>}
            </Link>
          ))}
        </nav>
        <div className="mt-auto">
          <div className="mb-3 rounded-2xl border border-white/10 bg-white/5 p-4">
            <div className="flex items-center gap-2 text-accent"><Sparkles size={14} /><span className="font-mono-ui text-[10px] uppercase tracking-wider">Your north star</span></div>
            <p className="mt-2 text-xs leading-relaxed text-sidebar-foreground/70">Small, visible progress compounds into a career you can name.</p>
          </div>
          <Link href="/profile" data-testid="link-profile" className={`focus-ring flex items-center gap-3 rounded-xl px-3 py-3 ${location === '/profile' ? 'bg-white/10' : 'hover:bg-white/7'}`}>
            <Avatar label={profile?.avatarInitials || initials(profile?.name)} small />
            <div className="min-w-0 flex-1"><div className="truncate text-sm font-semibold text-white">{profile?.name || 'Your profile'}</div><div className="truncate text-[11px] text-sidebar-foreground/55">{profile?.headline || 'Shape your next move'}</div></div>
            <Settings2 size={15} className="text-sidebar-foreground/45" />
          </Link>
        </div>
      </aside>
      {mobileOpen && <button aria-label="Close navigation" data-testid="button-close-navigation" onClick={() => setMobileOpen(false)} className="fixed inset-0 z-30 bg-slate-950/35 md:hidden" />}
      <main className="min-h-[100dvh] md:pl-[252px]">
        <header className="sticky top-0 z-20 flex h-[74px] items-center justify-between border-b border-border/80 bg-background/85 px-5 backdrop-blur-xl md:px-10">
          <div className="flex items-center gap-3"><button aria-label="Open navigation" data-testid="button-open-navigation" onClick={() => setMobileOpen(true)} className="focus-ring rounded-lg p-2 hover:bg-muted md:hidden"><Menu size={19} /></button><div><div className="font-mono-ui text-[10px] uppercase tracking-[.18em] text-muted-foreground">Workspace / <span className="text-primary">{pageTitle}</span></div><h1 className="mt-0.5 font-display text-xl font-bold tracking-tight">{pageTitle}</h1></div></div>
          <div className="flex items-center gap-3"><div className="hidden items-center gap-2 rounded-full border border-border bg-card px-3 py-2 text-xs text-muted-foreground sm:flex"><CircleDot size={12} className="text-accent" />Focus mode active</div><Link href="/profile" data-testid="link-header-profile" className="focus-ring"><Avatar label={profile?.avatarInitials || initials(profile?.name)} /></Link></div>
        </header>
        <div className="mx-auto max-w-[1440px] px-5 py-7 md:px-10 md:py-9">{children}</div>
      </main>
    </div>
  );
}

function Avatar({ label, small = false }: { label: string; small?: boolean }) {
  return <div data-testid="img-avatar" className={`grid shrink-0 place-items-center rounded-full bg-secondary font-display font-bold text-secondary-foreground ring-2 ring-background ${small ? 'h-8 w-8 text-[10px]' : 'h-9 w-9 text-xs'}`}>{label}</div>;
}

function LoadingState({ label = 'Loading your workspace' }: { label?: string }) {
  return <div className="space-y-5 animate-pulse"><div className="h-8 w-56 rounded-lg bg-muted" /><div className="grid gap-4 md:grid-cols-3"><div className="h-32 rounded-2xl bg-muted" /><div className="h-32 rounded-2xl bg-muted" /><div className="h-32 rounded-2xl bg-muted" /></div><div className="h-72 rounded-2xl bg-muted" /><p className="font-mono-ui text-xs text-muted-foreground">{label}</p></div>;
}

function ErrorState({ retry }: { retry: () => void }) {
  return <div className="rounded-2xl border border-destructive/25 bg-destructive/5 p-8 text-center"><div className="mx-auto grid h-11 w-11 place-items-center rounded-full bg-destructive/10 text-destructive"><X size={20} /></div><h2 className="mt-4 font-display text-lg font-bold">Could not load this view</h2><p className="mt-1 text-sm text-muted-foreground">Your progress is safe. Try refreshing the connection.</p><button onClick={retry} data-testid="button-retry" className="mt-5 rounded-xl bg-primary px-4 py-2 text-sm font-bold text-primary-foreground">Try again</button></div>;
}

function EmptyState({ icon: Icon, title, detail, action }: { icon: typeof Award; title: string; detail: string; action?: ReactNode }) {
  return <div className="rounded-2xl border border-dashed border-border bg-card/60 px-5 py-14 text-center"><div className="mx-auto grid h-12 w-12 place-items-center rounded-2xl bg-secondary text-primary"><Icon size={22} /></div><h3 className="mt-4 font-display text-lg font-bold">{title}</h3><p className="mx-auto mt-1 max-w-sm text-sm leading-relaxed text-muted-foreground">{detail}</p>{action && <div className="mt-5">{action}</div>}</div>;
}

function Button({ children, onClick, secondary = false, type = 'button', disabled = false, testId }: { children: ReactNode; onClick?: () => void; secondary?: boolean; type?: 'button' | 'submit'; disabled?: boolean; testId: string }) {
  return <button type={type} onClick={onClick} disabled={disabled} data-testid={testId} className={`focus-ring inline-flex items-center justify-center gap-2 rounded-xl px-4 py-2.5 text-sm font-bold transition-transform hover:-translate-y-0.5 disabled:cursor-not-allowed disabled:opacity-50 disabled:hover:translate-y-0 ${secondary ? 'border border-border bg-card text-foreground hover:bg-muted' : 'bg-primary text-primary-foreground shadow-sm'}`}>{children}</button>;
}

function SectionHeading({ eyebrow, title, detail, action }: { eyebrow: string; title: string; detail?: string; action?: ReactNode }) {
  return <div className="mb-5 flex flex-col justify-between gap-4 sm:flex-row sm:items-end"><div><div className="font-mono-ui text-[10px] uppercase tracking-[.18em] text-primary">{eyebrow}</div><h2 className="mt-1 font-display text-2xl font-bold tracking-tight">{title}</h2>{detail && <p className="mt-1 text-sm text-muted-foreground">{detail}</p>}</div>{action}</div>;
}

function Router() {
  return (
    // Keep a shared shell (sidebar, navbar) outside the boundary so it
    // survives a page crash.
    <RoutedErrorBoundary>
      <Switch>
        <Route path="/" component={Overview} />
        <Route path="/skills" component={SkillsPage} />
        <Route path="/certificates" component={CertificatesPage} />
        <Route path="/roadmap" component={RoadmapPage} />
        <Route path="/opportunities" component={OpportunitiesPage} />
        <Route path="/profile" component={ProfilePage} />
        <Route component={NotFound} />
      </Switch>
    </RoutedErrorBoundary>
  );
}

function DashboardStat({ label, value, detail, icon: Icon, accent = 'primary' }: { label: string; value: ReactNode; detail: string; icon: typeof Award; accent?: 'primary' | 'accent' | 'secondary' }) {
  const color = accent === 'accent' ? 'text-accent bg-accent/12' : accent === 'secondary' ? 'text-sky-700 bg-sky-100' : 'text-primary bg-primary/10';
  return <div className="card-lift rounded-2xl border border-border bg-card p-5"><div className="flex items-start justify-between"><div className={`grid h-9 w-9 place-items-center rounded-xl ${color}`}><Icon size={18} /></div><ArrowUpRight size={16} className="text-muted-foreground/50" /></div><div className="mt-4 font-display text-3xl font-bold tracking-tight">{value}</div><div className="mt-0.5 text-sm font-semibold">{label}</div><div className="mt-2 font-mono-ui text-[10px] uppercase tracking-wider text-muted-foreground">{detail}</div></div>;
}

function Overview() {
  const query = useGetDashboard();
  if (query.isLoading) return <Shell><LoadingState /></Shell>;
  if (query.isError || !query.data) return <Shell><ErrorState retry={() => query.refetch()} /></Shell>;
  const dashboard = query.data;
  return <Shell><div className="animate-enter space-y-8">
    <section className="relative overflow-hidden rounded-3xl bg-sidebar px-6 py-7 text-white shadow-[var(--shadow-soft)] md:px-9 md:py-8"><div className="absolute -right-8 -top-20 h-64 w-64 rounded-full border-[32px] border-accent/10" /><div className="absolute -bottom-28 right-32 h-52 w-52 rounded-full border-[20px] border-primary/25" /><div className="relative max-w-3xl"><div className="flex items-center gap-2 font-mono-ui text-[10px] uppercase tracking-[.2em] text-accent"><Sparkles size={13} /> A clear next move</div><h2 className="mt-4 max-w-2xl font-display text-3xl font-bold leading-tight tracking-tight md:text-4xl">Good morning, {dashboard.profile.name.split(' ')[0]}. Your path to <span className="text-accent">{dashboard.targetRole}</span> is taking shape.</h2><p className="mt-4 max-w-xl text-sm leading-relaxed text-sidebar-foreground/72">You have momentum. Keep your attention on the few skills that will create the biggest change next.</p><Link href="/roadmap" data-testid="link-view-roadmap" className="focus-ring mt-6 inline-flex items-center gap-2 rounded-xl bg-accent px-4 py-2.5 text-sm font-bold text-accent-foreground transition-transform hover:-translate-y-0.5">View your roadmap <ArrowUpRight size={16} /></Link></div></section>
    <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4"><DashboardStat label="Skills in your orbit" value={dashboard.skillCount} detail={`${dashboard.verifiedSkillCount} verified`} icon={BarChart3} /><DashboardStat label="Roadmap progress" value={`${dashboard.roadmapProgress}%`} detail="towards your next role" icon={TrendingUp} accent="accent" /><DashboardStat label="Certificates earned" value={dashboard.certificateCount} detail="proof points collected" icon={Award} accent="secondary" /><DashboardStat label="Target role" value={<span className="text-2xl">{dashboard.targetRole}</span>} detail="your north star" icon={Target} /></div>
    <div className="grid gap-7 xl:grid-cols-[1.25fr_.75fr]">
      <section className="rounded-2xl border border-border bg-card p-5 md:p-6"><SectionHeading eyebrow="Skill health" title="Where to place your energy" detail="Your current gaps, ranked by career impact." action={<Link href="/skills" data-testid="link-manage-skills" className="text-xs font-bold text-primary hover:underline">Manage skills <ArrowUpRight size={13} className="ml-1 inline" /></Link>} />{dashboard.skillGap.length ? <div className="space-y-4">{dashboard.skillGap.map((gap, index) => <div key={gap} data-testid={`row-skill-gap-${index}`} className="flex items-center gap-4 rounded-xl border border-border/70 p-3"><div className="font-mono-ui text-xs text-muted-foreground">0{index + 1}</div><div className="h-2 w-2 rounded-full bg-accent" /><div className="flex-1 text-sm font-semibold">{gap}</div><span className="hidden rounded-full bg-accent/12 px-2 py-1 font-mono-ui text-[10px] text-accent-foreground sm:block">{index === 0 ? 'high impact' : 'worth building'}</span><ArrowUpRight size={15} className="text-muted-foreground" /></div>)}</div> : <EmptyState icon={CheckCircle2} title="No gaps on your radar" detail="Your skills are well aligned. Keep building proof through your roadmap." />}</section>
      <section className="rounded-2xl border border-border bg-card p-5 md:p-6"><SectionHeading eyebrow="Recent signal" title="Your activity" /><div className="space-y-5">{dashboard.activities.length ? dashboard.activities.slice(0, 5).map((item) => <div key={item.id} data-testid={`activity-${item.id}`} className="flex gap-3"><div className="mt-1 grid h-7 w-7 shrink-0 place-items-center rounded-lg bg-secondary text-primary"><CircleDot size={13} /></div><div className="min-w-0"><div className="text-sm font-bold">{item.title}</div><p className="mt-0.5 text-xs leading-relaxed text-muted-foreground">{item.description}</p><div className="mt-1 font-mono-ui text-[10px] text-muted-foreground/70">{item.time}</div></div></div>) : <EmptyState icon={Clock3} title="Your story starts here" detail="Complete a skill or roadmap milestone to see your progress appear." />}</div></section>
    </div>
  </div></Shell>;
}

function FormField({ label, value, onChange, placeholder, type = 'text', testId }: { label: string; value: string; onChange: (value: string) => void; placeholder?: string; type?: string; testId: string }) {
  return <label className="block"><span className="mb-1.5 block text-xs font-bold text-foreground/75">{label}</span><input type={type} value={value} placeholder={placeholder} onChange={(event) => onChange(event.target.value)} data-testid={testId} className="focus-ring w-full rounded-xl border border-input bg-background px-3.5 py-2.5 text-sm outline-none transition-colors placeholder:text-muted-foreground/60 focus:border-primary" /></label>;
}

function Modal({ title, children, onClose }: { title: string; children: ReactNode; onClose: () => void }) {
  return <div className="fixed inset-0 z-50 grid place-items-center bg-slate-950/35 p-4 backdrop-blur-sm"><div role="dialog" aria-modal="true" className="animate-enter max-h-[90dvh] w-full max-w-lg overflow-auto rounded-2xl border border-border bg-card p-5 shadow-2xl md:p-6"><div className="flex items-center justify-between"><h2 className="font-display text-xl font-bold">{title}</h2><button onClick={onClose} data-testid="button-close-modal" className="focus-ring rounded-lg p-2 text-muted-foreground hover:bg-muted"><X size={18} /></button></div>{children}</div></div>;
}

function SkillForm({ initial, onClose, onSaved }: { initial?: Skill; onClose: () => void; onSaved: () => void }) {
  const create = useCreateSkill(); const update = useUpdateSkill(); const qc = useQueryClient();
  const [name, setName] = useState(initial?.name || ''); const [category, setCategory] = useState(initial?.category || ''); const [level, setLevel] = useState(initial?.level || ''); const [progress, setProgress] = useState(String(initial?.progress ?? 50)); const [verified, setVerified] = useState(initial?.verified ?? false);
  const save = (event: FormEvent) => { event.preventDefault(); const data = { name, category, level, progress: Number(progress), verified }; const options = { onSuccess: () => { qc.invalidateQueries({ queryKey: getGetSkillsQueryKey() }); qc.invalidateQueries({ queryKey: getGetDashboardQueryKey() }); onSaved(); onClose(); } }; if (initial) update.mutate({ id: initial.id, data }, options); else create.mutate({ data }, options); };
  return <form onSubmit={save} className="mt-5 space-y-4"><FormField label="Skill name" value={name} onChange={setName} placeholder="e.g. TypeScript" testId="input-skill-name" /><div className="grid gap-4 sm:grid-cols-2"><FormField label="Category" value={category} onChange={setCategory} placeholder="e.g. Engineering" testId="input-skill-category" /><label className="block"><span className="mb-1.5 block text-xs font-bold text-foreground/75">Level</span><select value={level} onChange={(e) => setLevel(e.target.value)} data-testid="select-skill-level" className="focus-ring w-full rounded-xl border border-input bg-background px-3.5 py-2.5 text-sm outline-none"><option value="">Choose level</option><option>Beginner</option><option>Intermediate</option><option>Advanced</option><option>Expert</option></select></label></div><label className="block"><div className="mb-1.5 flex justify-between text-xs font-bold text-foreground/75"><span>Confidence</span><span className="font-mono-ui text-primary">{progress}%</span></div><input type="range" min="0" max="100" value={progress} onChange={(e) => setProgress(e.target.value)} data-testid="input-skill-progress" className="w-full accent-[hsl(var(--primary))]" /></label><label className="flex cursor-pointer items-center gap-3 rounded-xl border border-border p-3"><input type="checkbox" checked={verified} onChange={(e) => setVerified(e.target.checked)} data-testid="input-skill-verified" className="h-4 w-4 accent-[hsl(var(--primary))]" /><span className="text-sm font-semibold">Mark as verified</span></label><div className="flex justify-end gap-2 pt-2"><Button secondary onClick={onClose} testId="button-cancel-skill">Cancel</Button><Button type="submit" disabled={create.isPending || update.isPending || !name || !category || !level} testId="button-save-skill">{create.isPending || update.isPending ? 'Saving…' : initial ? 'Save changes' : 'Add skill'}</Button></div></form>;
}

function SkillsPage() {
  const query = useGetSkills(); const [modal, setModal] = useState<'new' | Skill | null>(null); const remove = useDeleteSkill(); const qc = useQueryClient();
  if (query.isLoading) return <Shell><LoadingState label="Mapping your skill set" /></Shell>; if (query.isError) return <Shell><ErrorState retry={() => query.refetch()} /></Shell>;
  const skills = query.data || []; const categories = [...new Set(skills.map((s) => s.category))];
  const deleteSkill = (skill: Skill) => { if (window.confirm(`Remove ${skill.name} from your skills?`)) remove.mutate({ id: skill.id }, { onSuccess: () => { qc.invalidateQueries({ queryKey: getGetSkillsQueryKey() }); qc.invalidateQueries({ queryKey: getGetDashboardQueryKey() }); } }); };
  return <Shell><div className="animate-enter"><SectionHeading eyebrow="Capability map" title="Your skills" detail={`${skills.length} skills tracked · ${skills.filter((s) => s.verified).length} verified`} action={<Button onClick={() => setModal('new')} testId="button-add-skill"><Plus size={16} />Add skill</Button>} />{skills.length === 0 ? <EmptyState icon={BarChart3} title="Build your capability map" detail="Add the skills you already use. A clear baseline makes your next move easier to see." action={<Button onClick={() => setModal('new')} testId="button-empty-add-skill"><Plus size={16} />Add your first skill</Button>} /> : <div className="space-y-7">{categories.map((category) => <section key={category}><div className="mb-3 flex items-center gap-2 font-mono-ui text-[10px] uppercase tracking-[.16em] text-muted-foreground"><span className="h-px w-5 bg-accent" />{category}</div><div className="grid gap-3 lg:grid-cols-2">{skills.filter((s) => s.category === category).map((skill) => <div key={skill.id} data-testid={`card-skill-${skill.id}`} className="card-lift rounded-2xl border border-border bg-card p-5"><div className="flex items-start justify-between gap-4"><div><div className="flex items-center gap-2"><h3 className="font-display text-lg font-bold">{skill.name}</h3>{skill.verified && <span title="Verified skill" className="grid h-5 w-5 place-items-center rounded-full bg-primary/10 text-primary"><Check size={12} strokeWidth={3} /></span>}</div><div className="mt-1 text-xs text-muted-foreground">{skill.level} · {skill.verified ? 'Verified evidence' : 'Self-reported'}</div></div><div className="flex gap-1"><button onClick={() => setModal(skill)} data-testid={`button-edit-skill-${skill.id}`} className="focus-ring rounded-lg p-2 text-muted-foreground hover:bg-muted hover:text-foreground"><Pencil size={15} /></button><button onClick={() => deleteSkill(skill)} data-testid={`button-delete-skill-${skill.id}`} className="focus-ring rounded-lg p-2 text-muted-foreground hover:bg-destructive/10 hover:text-destructive"><Trash2 size={15} /></button></div></div><div className="mt-5 flex items-center gap-3"><div className="h-2 flex-1 overflow-hidden rounded-full bg-muted"><div className="meter-fill h-full rounded-full bg-primary" style={{ width: `${skill.progress}%` }} /></div><span className="font-mono-ui text-xs font-medium text-primary">{skill.progress}%</span></div></div>)}</div></section>)}</div>}{modal && <Modal title={modal === 'new' ? 'Add a skill' : 'Edit skill'} onClose={() => setModal(null)}><SkillForm initial={modal === 'new' ? undefined : modal} onClose={() => setModal(null)} onSaved={() => {}} /></Modal>}</div></Shell>;
}

function CertificateForm({ onClose }: { onClose: () => void }) {
  const create = useCreateCertificate(); const qc = useQueryClient(); const [name, setName] = useState(''); const [issuer, setIssuer] = useState(''); const [issuedDate, setIssuedDate] = useState(''); const [credentialId, setCredentialId] = useState('');
  const save = (event: FormEvent) => { event.preventDefault(); create.mutate({ data: { name, issuer, issuedDate, credentialId } }, { onSuccess: () => { qc.invalidateQueries({ queryKey: getGetCertificatesQueryKey() }); qc.invalidateQueries({ queryKey: getGetDashboardQueryKey() }); onClose(); } }); };
  return <form onSubmit={save} className="mt-5 space-y-4"><FormField label="Certificate name" value={name} onChange={setName} placeholder="e.g. Google UX Design" testId="input-certificate-name" /><FormField label="Issuer" value={issuer} onChange={setIssuer} placeholder="e.g. Coursera" testId="input-certificate-issuer" /><div className="grid gap-4 sm:grid-cols-2"><FormField label="Issued date" value={issuedDate} onChange={setIssuedDate} type="date" testId="input-certificate-date" /><FormField label="Credential ID" value={credentialId} onChange={setCredentialId} placeholder="e.g. ABC-123" testId="input-certificate-id" /></div><div className="flex justify-end gap-2 pt-2"><Button secondary onClick={onClose} testId="button-cancel-certificate">Cancel</Button><Button type="submit" disabled={create.isPending || !name || !issuer || !issuedDate || !credentialId} testId="button-save-certificate">{create.isPending ? 'Saving…' : 'Add certificate'}</Button></div></form>;
}

function CertificatesPage() {
  const query = useGetCertificates(); const remove = useDeleteCertificate(); const qc = useQueryClient(); const [open, setOpen] = useState(false);
  if (query.isLoading) return <Shell><LoadingState label="Gathering your proof points" /></Shell>; if (query.isError) return <Shell><ErrorState retry={() => query.refetch()} /></Shell>;
  const certificates = query.data || []; const deleteCertificate = (certificate: Certificate) => { if (window.confirm(`Remove ${certificate.name}?`)) remove.mutate({ id: certificate.id }, { onSuccess: () => { qc.invalidateQueries({ queryKey: getGetCertificatesQueryKey() }); qc.invalidateQueries({ queryKey: getGetDashboardQueryKey() }); } }); };
  return <Shell><div className="animate-enter"><SectionHeading eyebrow="Proof of work" title="Certificates" detail="Keep your credentials close and your momentum visible." action={<Button onClick={() => setOpen(true)} testId="button-add-certificate"><Plus size={16} />Add certificate</Button>} />{certificates.length === 0 ? <EmptyState icon={Award} title="No certificates yet" detail="Add the credentials that support your story. They are useful context, not a checklist." action={<Button onClick={() => setOpen(true)} testId="button-empty-add-certificate"><Plus size={16} />Add a certificate</Button>} /> : <div className="grid gap-4 lg:grid-cols-2">{certificates.map((certificate) => <article key={certificate.id} data-testid={`card-certificate-${certificate.id}`} className="card-lift group rounded-2xl border border-border bg-card p-5"><div className="flex gap-4"><div className="grid h-11 w-11 shrink-0 place-items-center rounded-xl bg-accent/15 text-accent-foreground"><FileBadge size={21} /></div><div className="min-w-0 flex-1"><div className="flex items-start justify-between gap-2"><div><h3 className="font-display text-lg font-bold">{certificate.name}</h3><p className="mt-0.5 text-sm text-muted-foreground">{certificate.issuer}</p></div><button onClick={() => deleteCertificate(certificate)} data-testid={`button-delete-certificate-${certificate.id}`} className="focus-ring rounded-lg p-2 text-muted-foreground opacity-70 hover:bg-destructive/10 hover:text-destructive sm:opacity-0 sm:group-hover:opacity-100"><Trash2 size={15} /></button></div><div className="mt-5 flex flex-wrap items-center gap-x-4 gap-y-2 font-mono-ui text-[10px] uppercase tracking-wide text-muted-foreground"><span>{certificate.issuedDate}</span><span className="h-1 w-1 rounded-full bg-border" /><span>{certificate.credentialId}</span><span className="rounded-full bg-primary/10 px-2 py-1 text-primary">{certificate.status}</span></div></div></div></article>)}</div>}{open && <Modal title="Add a certificate" onClose={() => setOpen(false)}><CertificateForm onClose={() => setOpen(false)} /></Modal>}</div></Shell>;
}

function RoadmapPage() {
  const query = useGetRoadmap(); const update = useUpdateRoadmapItem(); const qc = useQueryClient();
  if (query.isLoading) return <Shell><LoadingState label="Plotting your next milestones" /></Shell>; if (query.isError) return <Shell><ErrorState retry={() => query.refetch()} /></Shell>;
  const items = query.data || []; const done = items.filter((item) => item.status.toLowerCase() === 'completed').length; const toggle = (item: RoadmapItem, status: string) => update.mutate({ id: item.id, data: { status } }, { onSuccess: () => { qc.invalidateQueries({ queryKey: getGetRoadmapQueryKey() }); qc.invalidateQueries({ queryKey: getGetDashboardQueryKey() }); } });
  return <Shell><div className="animate-enter"><SectionHeading eyebrow="Personal route" title="Your roadmap" detail={`${done} of ${items.length} milestones completed`} /><div className="mb-7 overflow-hidden rounded-2xl border border-border bg-card p-5 md:p-6"><div className="flex items-end justify-between"><div><div className="font-mono-ui text-[10px] uppercase tracking-wider text-primary">Trajectory</div><div className="mt-1 font-display text-3xl font-bold">{items.length ? Math.round((done / items.length) * 100) : 0}%</div></div><div className="max-w-xs text-right text-xs leading-relaxed text-muted-foreground">Each milestone turns uncertainty into evidence you can carry forward.</div></div><div className="mt-5 h-3 overflow-hidden rounded-full bg-muted"><div className="meter-fill h-full rounded-full bg-primary" style={{ width: `${items.length ? (done / items.length) * 100 : 0}%` }} /></div></div>{items.length === 0 ? <EmptyState icon={Map} title="Your roadmap is being prepared" detail="Come back soon for the milestones matched to your career goal." /> : <div className="relative space-y-4 before:absolute before:bottom-7 before:left-[20px] before:top-7 before:w-px before:bg-border md:before:left-[23px]">{items.map((item, index) => { const status = item.status.toLowerCase(); const completed = status === 'completed'; const inProgress = status === 'in progress' || status === 'in_progress'; return <article key={item.id} data-testid={`card-roadmap-${item.id}`} className="relative flex gap-4"><div className={`z-10 grid h-10 w-10 shrink-0 place-items-center rounded-full border-4 border-background ${completed ? 'bg-primary text-primary-foreground' : inProgress ? 'bg-accent text-accent-foreground' : 'bg-muted text-muted-foreground'}`}>{completed ? <Check size={16} strokeWidth={3} /> : <span className="font-mono-ui text-[10px]">{String(index + 1).padStart(2, '0')}</span>}</div><div className={`card-lift mb-1 flex-1 rounded-2xl border p-5 ${inProgress ? 'border-primary/35 bg-primary/[.035]' : 'border-border bg-card'}`}><div className="flex flex-col justify-between gap-3 sm:flex-row"><div><div className="font-mono-ui text-[10px] uppercase tracking-[.16em] text-muted-foreground">{item.phase} · {item.duration}</div><h3 className="mt-1 font-display text-xl font-bold">{item.title}</h3><p className="mt-2 max-w-2xl text-sm leading-relaxed text-muted-foreground">{item.description}</p></div><div className="shrink-0"><select value={completed ? 'completed' : inProgress ? 'in progress' : 'not started'} onChange={(e) => toggle(item, e.target.value)} data-testid={`select-roadmap-status-${item.id}`} className="focus-ring rounded-lg border border-input bg-background px-2.5 py-2 text-xs font-bold"><option value="not started">Not started</option><option value="in progress">In progress</option><option value="completed">Completed</option></select></div></div><div className="mt-4 flex flex-wrap gap-2">{item.skills.map((skill) => <span key={skill} className="rounded-full bg-secondary px-2.5 py-1 text-[11px] font-semibold text-secondary-foreground">{skill}</span>)}</div></div></article>; })}</div>}</div></Shell>;
}

function OpportunitiesPage() {
  const [search, setSearch] = useState(''); const [type, setType] = useState(''); const params = useMemo(() => ({ search: search || undefined, type: type || undefined }), [search, type]); const query = useGetOpportunities(params, { query: { queryKey: getGetOpportunitiesQueryKey(params) } });
  if (query.isLoading) return <Shell><LoadingState label="Scanning opportunities for your signal" /></Shell>; if (query.isError) return <Shell><ErrorState retry={() => query.refetch()} /></Shell>;
  const opportunities = query.data || [];
  return <Shell><div className="animate-enter"><SectionHeading eyebrow="Market signal" title="Opportunities" detail="Roles where your current trajectory could create a strong first impression." /><div className="mb-6 flex flex-col gap-3 rounded-2xl border border-border bg-card p-3 sm:flex-row"><label className="relative flex-1"><Search size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground" /><input value={search} onChange={(e) => setSearch(e.target.value)} data-testid="input-opportunity-search" placeholder="Search roles, companies, or skills" className="focus-ring w-full rounded-xl bg-muted/55 py-2.5 pl-9 pr-3 text-sm outline-none placeholder:text-muted-foreground" /></label><select value={type} onChange={(e) => setType(e.target.value)} data-testid="select-opportunity-type" className="focus-ring rounded-xl border border-input bg-background px-3 py-2.5 text-sm font-semibold sm:w-48"><option value="">All opportunity types</option><option value="Internship">Internships</option><option value="Apprenticeship">Apprenticeships</option><option value="Job">Jobs</option></select></div>{opportunities.length === 0 ? <EmptyState icon={BriefcaseBusiness} title="No roles match that search" detail="Try a broader title or clear the filters. New signals appear as your profile sharpens." action={<Button secondary onClick={() => { setSearch(''); setType(''); }} testId="button-clear-opportunity-filters">Clear filters</Button>} /> : <div className="grid gap-4 xl:grid-cols-2">{opportunities.map((opportunity: Opportunity) => <article key={opportunity.id} data-testid={`card-opportunity-${opportunity.id}`} className="card-lift rounded-2xl border border-border bg-card p-5"><div className="flex items-start justify-between gap-4"><div><div className="flex flex-wrap items-center gap-2"><span className="rounded-full bg-accent/15 px-2.5 py-1 font-mono-ui text-[10px] uppercase tracking-wide text-accent-foreground">{opportunity.type}</span><span className="font-mono-ui text-[10px] text-muted-foreground">{opportunity.posted}</span></div><h3 className="mt-3 font-display text-xl font-bold">{opportunity.title}</h3><p className="mt-1 text-sm font-semibold text-muted-foreground">{opportunity.company} · {opportunity.location}</p></div><div className="shrink-0 text-right"><div className="font-display text-2xl font-bold text-primary">{opportunity.match}%</div><div className="font-mono-ui text-[9px] uppercase tracking-wider text-muted-foreground">match</div></div></div><p className="mt-4 text-sm leading-relaxed text-muted-foreground">{opportunity.description}</p><div className="mt-5 flex flex-wrap gap-2">{opportunity.tags.map((tag) => <span key={tag} className="rounded-full bg-secondary px-2.5 py-1 text-[11px] font-semibold text-secondary-foreground">{tag}</span>)}</div><button data-testid={`button-view-opportunity-${opportunity.id}`} onClick={() => window.alert(`Saved ${opportunity.title} to your review list.`)} className="focus-ring mt-5 inline-flex items-center gap-1.5 text-xs font-bold text-primary hover:underline">Review opportunity <ArrowUpRight size={14} /></button></article>)}</div>}</div></Shell>;
}

function ProfilePage() {
  const query = useGetProfile(); const update = useUpdateProfile(); const qc = useQueryClient(); const profile = query.data; const [editing, setEditing] = useState(false);
  if (query.isLoading) return <Shell><LoadingState label="Opening your learner profile" /></Shell>; if (query.isError || !profile) return <Shell><ErrorState retry={() => query.refetch()} /></Shell>;
  return <Shell><div className="animate-enter max-w-4xl"><SectionHeading eyebrow="Your signal" title="Profile" detail="The story behind your next opportunity." action={!editing && <Button onClick={() => setEditing(true)} testId="button-edit-profile"><Pencil size={15} />Edit profile</Button>} />{editing ? <ProfileForm profile={profile} onCancel={() => setEditing(false)} onSaved={(saved) => { qc.setQueryData(getGetProfileQueryKey(), saved); qc.invalidateQueries({ queryKey: getGetDashboardQueryKey() }); setEditing(false); }} mutation={update} /> : <div className="grid gap-6 md:grid-cols-[.8fr_1.2fr]"><section className="rounded-2xl bg-sidebar p-6 text-white"><Avatar label={profile.avatarInitials || initials(profile.name)} /><h2 className="mt-5 font-display text-2xl font-bold">{profile.name}</h2><p className="mt-1 text-sm text-sidebar-foreground/70">{profile.headline}</p><div className="mt-8 space-y-4 border-t border-white/10 pt-5 text-sm"><div><div className="font-mono-ui text-[10px] uppercase tracking-wider text-sidebar-foreground/45">Location</div><div className="mt-1">{profile.location}</div></div><div><div className="font-mono-ui text-[10px] uppercase tracking-wider text-sidebar-foreground/45">Email</div><div className="mt-1 break-all">{profile.email}</div></div></div></section><section className="rounded-2xl border border-border bg-card p-6"><div className="font-mono-ui text-[10px] uppercase tracking-wider text-primary">Career goal</div><h2 className="mt-3 font-display text-2xl font-bold leading-tight">{profile.goal}</h2><div className="mt-7 rounded-xl bg-secondary/60 p-4"><div className="flex items-center gap-2 text-sm font-bold text-secondary-foreground"><Target size={16} /> Keep this close</div><p className="mt-2 text-sm leading-relaxed text-secondary-foreground/75">Your goal is the lens behind your roadmap and opportunity matches. Edit it as your direction becomes clearer.</p></div></section></div>}</div></Shell>;
}

function ProfileForm({ profile, onCancel, onSaved, mutation }: { profile: { name: string; headline: string; location: string; goal: string }; onCancel: () => void; onSaved: (profile: any) => void; mutation: ReturnType<typeof useUpdateProfile> }) {
  const [name, setName] = useState(profile.name); const [headline, setHeadline] = useState(profile.headline); const [location, setLocation] = useState(profile.location); const [goal, setGoal] = useState(profile.goal);
  const save = (event: FormEvent) => { event.preventDefault(); mutation.mutate({ data: { name, headline, location, goal } }, { onSuccess: onSaved }); };
  return <form onSubmit={save} className="rounded-2xl border border-border bg-card p-5 md:p-7"><div className="grid gap-5 sm:grid-cols-2"><FormField label="Name" value={name} onChange={setName} testId="input-profile-name" /><FormField label="Location" value={location} onChange={setLocation} testId="input-profile-location" /><div className="sm:col-span-2"><FormField label="Headline" value={headline} onChange={setHeadline} placeholder="The work you are growing toward" testId="input-profile-headline" /></div><div className="sm:col-span-2"><label className="block"><span className="mb-1.5 block text-xs font-bold text-foreground/75">Career goal</span><textarea value={goal} onChange={(e) => setGoal(e.target.value)} data-testid="input-profile-goal" rows={4} className="focus-ring w-full resize-none rounded-xl border border-input bg-background px-3.5 py-2.5 text-sm outline-none focus:border-primary" /></label></div></div><div className="mt-6 flex justify-end gap-2"><Button secondary onClick={onCancel} testId="button-cancel-profile">Cancel</Button><Button type="submit" disabled={mutation.isPending || !name} testId="button-save-profile">{mutation.isPending ? 'Saving…' : 'Save profile'}</Button></div></form>;
}

function RoutedErrorBoundary({ children }: { children: ReactNode }) {
  const [location] = useLocation();
  return <ErrorBoundary resetKey={location}>{children}</ErrorBoundary>;
}

function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <TooltipProvider>
        <WouterRouter base={import.meta.env.BASE_URL.replace(/\/$/, '')}>
          <Router />
        </WouterRouter>
        <Toaster />
      </TooltipProvider>
    </QueryClientProvider>
  );
}

export default App;
