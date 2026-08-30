import { Link } from 'wouter';
import { Compass, ArrowLeft } from 'lucide-react';

export default function NotFound() {
  return (
    <div className="app-shell flex min-h-[100dvh] items-center justify-center p-6">
      <div className="max-w-md text-center">
        <div className="mx-auto grid h-14 w-14 place-items-center rounded-2xl bg-sidebar text-accent"><Compass size={24} /></div>
        <div className="mt-8 font-mono-ui text-xs uppercase tracking-[.2em] text-primary">Off course</div>
        <h1 className="mt-3 font-display text-4xl font-bold tracking-tight">This page is not on your route.</h1>
        <p className="mt-3 text-sm leading-relaxed text-muted-foreground">The destination you entered does not exist in your SkillSphere workspace.</p>
        <Link href="/" data-testid="link-back-to-overview" className="focus-ring mt-7 inline-flex items-center gap-2 rounded-xl bg-primary px-4 py-2.5 text-sm font-bold text-primary-foreground"><ArrowLeft size={15} />Back to overview</Link>
      </div>
    </div>
  );
}
