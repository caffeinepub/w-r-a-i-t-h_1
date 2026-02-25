import { Link } from '@tanstack/react-router';
import { Shield, Target, Eye, Zap, Lock, ChevronRight, AlertTriangle } from 'lucide-react';

const departments = [
  {
    code: 'D.K.S.',
    name: 'Directorate of Kinetic Solutions',
    description: 'Direct action, special reconnaissance, and high-value target operations.',
    icon: Target,
    clearance: 3,
    navigable: true,
    to: '/departments/dks' as const,
  },
  {
    code: 'D.I.S.',
    name: 'Directorate of Intelligence & Surveillance',
    description: 'Human intelligence, signals intelligence, and covert surveillance operations.',
    icon: Eye,
    clearance: 4,
    navigable: false,
  },
  {
    code: 'D.T.O.',
    name: 'Directorate of Technical Operations',
    description: 'Cyber warfare, electronic countermeasures, and technical asset deployment.',
    icon: Zap,
    clearance: 4,
    navigable: false,
  },
  {
    code: 'D.C.O.',
    name: 'Directorate of Covert Operations',
    description: 'Deep cover infiltration, asset recruitment, and long-term strategic operations.',
    icon: Shield,
    clearance: 5,
    navigable: false,
  },
];

const quickLinks = [
  { label: 'Agent Roster', to: '/agents' as const, icon: Shield },
  { label: 'Active Missions', to: '/missions' as const, icon: Target },
  { label: 'Asset Registry', to: '/assets' as const, icon: Zap },
  { label: 'Most Wanted', to: '/most-wanted' as const, icon: AlertTriangle },
];

export default function Home() {
  return (
    <div className="min-h-screen bg-background text-foreground">
      {/* Hero */}
      <div className="relative border-b border-border overflow-hidden">
        <div
          className="absolute inset-0 opacity-10"
          style={{
            backgroundImage: 'url(/assets/generated/classified-bg.dim_1920x1080.png)',
            backgroundSize: 'cover',
            backgroundPosition: 'center',
          }}
        />
        <div className="relative max-w-6xl mx-auto px-6 py-16 md:py-24 text-center">
          <div className="flex justify-center mb-6">
            <img
              src="/assets/generated/wraith-emblem.dim_400x400.png"
              alt="W.R.A.I.T.H. Emblem"
              className="w-20 h-20 opacity-80"
            />
          </div>
          <p className="text-xs font-mono text-primary tracking-widest uppercase mb-3">
            Classified Portal — Authorized Personnel Only
          </p>
          <h1 className="text-4xl md:text-6xl font-bold tracking-tight mb-4">W.R.A.I.T.H.</h1>
          <p className="text-lg text-muted-foreground font-mono mb-2">
            Worldwide Reconnaissance & Advanced Intelligence Taskforce Headquarters
          </p>
          <p className="text-sm text-muted-foreground max-w-xl mx-auto">
            Access to this system is restricted to cleared personnel. All activity is monitored and
            logged. Unauthorized access will be prosecuted.
          </p>
        </div>
      </div>

      <div className="max-w-6xl mx-auto px-6 py-12 space-y-14">
        {/* Quick Access */}
        <section>
          <h2 className="text-xs font-mono text-primary tracking-widest uppercase mb-5">
            Quick Access
          </h2>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            {quickLinks.map((link) => (
              <Link
                key={link.label}
                to={link.to}
                className="group bg-card border border-border rounded p-5 flex flex-col items-center gap-3 hover:border-primary/60 hover:bg-primary/5 transition-all"
              >
                <link.icon className="w-6 h-6 text-primary group-hover:scale-110 transition-transform" />
                <span className="text-sm font-mono text-foreground">{link.label}</span>
              </Link>
            ))}
          </div>
        </section>

        {/* Organizational Structure */}
        <section>
          <h2 className="text-xs font-mono text-primary tracking-widest uppercase mb-5">
            Organizational Structure
          </h2>
          <div className="grid md:grid-cols-2 gap-4">
            {departments.map((dept) => {
              const cardContent = (
                <div
                  className={`bg-card border rounded p-5 space-y-3 transition-all ${
                    dept.navigable
                      ? 'border-primary/40 hover:border-primary hover:bg-primary/5 cursor-pointer group'
                      : 'border-border opacity-70'
                  }`}
                >
                  <div className="flex items-start justify-between">
                    <div className="flex items-center gap-3">
                      <div
                        className={`w-10 h-10 rounded border flex items-center justify-center ${
                          dept.navigable
                            ? 'border-primary/40 bg-primary/10'
                            : 'border-border bg-muted'
                        }`}
                      >
                        <dept.icon
                          className={`w-5 h-5 ${dept.navigable ? 'text-primary' : 'text-muted-foreground'}`}
                        />
                      </div>
                      <div>
                        <p className="font-bold text-sm text-foreground">{dept.code}</p>
                        <p className="text-xs text-muted-foreground">{dept.name}</p>
                      </div>
                    </div>
                    <div className="flex items-center gap-1">
                      {dept.navigable ? (
                        <ChevronRight className="w-4 h-4 text-primary group-hover:translate-x-1 transition-transform" />
                      ) : (
                        <Lock className="w-4 h-4 text-muted-foreground" />
                      )}
                    </div>
                  </div>
                  <p className="text-xs text-muted-foreground leading-relaxed">{dept.description}</p>
                  <div className="flex items-center gap-1 text-xs font-mono text-muted-foreground">
                    <Lock className="w-3 h-3" />
                    Clearance Level {dept.clearance}+
                    {!dept.navigable && (
                      <span className="ml-2 text-destructive/70">— ACCESS RESTRICTED</span>
                    )}
                  </div>
                </div>
              );

              return dept.navigable ? (
                <Link key={dept.code} to={dept.to!}>
                  {cardContent}
                </Link>
              ) : (
                <div key={dept.code}>{cardContent}</div>
              );
            })}
          </div>
        </section>

        {/* System Notice */}
        <section className="border border-destructive/30 bg-destructive/5 rounded p-5">
          <div className="flex items-start gap-3">
            <AlertTriangle className="w-5 h-5 text-destructive shrink-0 mt-0.5" />
            <div>
              <p className="text-sm font-semibold text-destructive mb-1">Security Notice</p>
              <p className="text-xs text-muted-foreground">
                This portal contains classified information. Access is logged and monitored. Any
                attempt to access information beyond your clearance level will trigger an automatic
                security alert. Report suspicious activity to your department security officer
                immediately.
              </p>
            </div>
          </div>
        </section>
      </div>
    </div>
  );
}
