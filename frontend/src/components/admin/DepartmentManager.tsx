import { Link } from '@tanstack/react-router';
import { Target, Eye, Zap, Shield, Lock, ChevronRight, ExternalLink } from 'lucide-react';

type DepartmentRoute = '/departments/dks';

interface Department {
  code: string;
  name: string;
  description: string;
  icon: React.ElementType;
  clearance: number;
  route: DepartmentRoute | null;
  available: boolean;
}

const departments: Department[] = [
  {
    code: 'D.K.S.',
    name: 'Directorate of Kinetic Solutions',
    description:
      'Direct action, special reconnaissance, and high-value target operations. Primary kinetic arm of W.R.A.I.T.H.',
    icon: Target,
    clearance: 3,
    route: '/departments/dks',
    available: true,
  },
  {
    code: 'D.I.S.',
    name: 'Directorate of Intelligence & Surveillance',
    description:
      'Human intelligence, signals intelligence, and covert surveillance operations. Eyes and ears of the organization.',
    icon: Eye,
    clearance: 4,
    route: null,
    available: false,
  },
  {
    code: 'D.T.O.',
    name: 'Directorate of Technical Operations',
    description:
      'Cyber warfare, electronic countermeasures, and technical asset deployment. Digital battlefield dominance.',
    icon: Zap,
    clearance: 4,
    route: null,
    available: false,
  },
  {
    code: 'D.C.O.',
    name: 'Directorate of Covert Operations',
    description:
      'Deep cover infiltration, asset recruitment, and long-term strategic operations. The shadow arm.',
    icon: Shield,
    clearance: 5,
    route: null,
    available: false,
  },
];

function DepartmentCard({ dept }: { dept: Department }) {
  const Icon = dept.icon;

  return (
    <div
      className={`terminal-border bg-ops-dark p-5 space-y-4 transition-all h-full ${
        dept.available
          ? 'border-ops-green/60 hover:border-ops-green hover:bg-ops-green/5 cursor-pointer group'
          : 'border-ops-green-dim/40 opacity-80 hover:opacity-100 hover:border-ops-green-dim/70'
      }`}
    >
      {/* Top row */}
      <div className="flex items-start justify-between">
        <div className="flex items-center gap-3">
          <div
            className={`w-10 h-10 border flex items-center justify-center shrink-0 ${
              dept.available
                ? 'border-ops-green/50 bg-ops-green/10'
                : 'border-ops-green-dim/40 bg-ops-green-dim/5'
            }`}
          >
            <Icon
              className={`w-5 h-5 ${dept.available ? 'text-ops-green' : 'text-ops-green-dim'}`}
            />
          </div>
          <div>
            <p
              className={`font-orbitron text-sm font-black tracking-widest ${
                dept.available ? 'text-ops-green glow-green' : 'text-ops-green-dim'
              }`}
            >
              {dept.code}
            </p>
            <p className="font-mono text-[10px] text-ops-text-dim tracking-wide mt-0.5">
              {dept.name}
            </p>
          </div>
        </div>
        <div className="flex items-center gap-2 shrink-0">
          {dept.available ? (
            <ExternalLink className="w-4 h-4 text-ops-green group-hover:translate-x-0.5 group-hover:-translate-y-0.5 transition-transform" />
          ) : (
            <ChevronRight className="w-4 h-4 text-ops-green-dim" />
          )}
        </div>
      </div>

      {/* Description */}
      <p className="font-mono text-[10px] text-ops-text-dim leading-relaxed tracking-wide">
        {dept.description}
      </p>

      {/* Footer */}
      <div className="flex items-center justify-between pt-1 border-t border-ops-green-dim/20">
        <div className="flex items-center gap-1.5 font-mono text-[9px] tracking-widest">
          <Lock className="w-3 h-3 text-ops-green-dim" />
          <span className="text-ops-green-dim">CLEARANCE LEVEL {dept.clearance}+</span>
        </div>
        {dept.available ? (
          <span className="font-mono text-[9px] text-ops-green tracking-widest border border-ops-green/40 px-2 py-0.5">
            ACCESSIBLE
          </span>
        ) : (
          <span className="font-mono text-[9px] text-ops-amber tracking-widest border border-ops-amber/40 px-2 py-0.5">
            PORTAL PENDING
          </span>
        )}
      </div>

      {/* Under construction notice for non-available */}
      {!dept.available && (
        <div className="bg-ops-amber/5 border border-ops-amber/20 p-2">
          <p className="font-mono text-[9px] text-ops-amber/70 tracking-widest">
            ⚠ DEDICATED PORTAL UNDER CONSTRUCTION — ADMIN ACCESS GRANTED VIA OVERRIDE
          </p>
        </div>
      )}
    </div>
  );
}

export default function DepartmentManager() {
  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h2 className="font-orbitron text-sm font-black text-ops-green tracking-widest">
            DIRECTORATE ACCESS — ADMIN OVERRIDE
          </h2>
          <p className="font-mono text-[10px] text-ops-text-dim tracking-widest mt-1">
            ALL CLEARANCE LEVELS UNLOCKED — ADMIN CREDENTIALS VERIFIED
          </p>
        </div>
        <div className="flex items-center gap-1.5 border border-ops-green/40 bg-ops-green/10 px-3 py-1.5">
          <div className="h-1.5 w-1.5 rounded-full bg-ops-green animate-pulse" />
          <span className="font-mono text-[9px] text-ops-green tracking-widest">FULL ACCESS</span>
        </div>
      </div>

      {/* Access notice */}
      <div className="bg-ops-green/5 border border-ops-green/30 p-3 font-mono text-[10px] text-ops-green/70 tracking-widest">
        <span className="text-ops-green">$</span> ADMIN OVERRIDE ACTIVE — CLEARANCE RESTRICTIONS BYPASSED FOR ALL DIRECTORATES
      </div>

      {/* Department cards */}
      <div className="grid md:grid-cols-2 gap-4">
        {departments.map((dept) =>
          dept.available && dept.route ? (
            <Link key={dept.code} to={dept.route} className="block h-full">
              <DepartmentCard dept={dept} />
            </Link>
          ) : (
            <div key={dept.code} className="h-full">
              <DepartmentCard dept={dept} />
            </div>
          )
        )}
      </div>

      {/* Summary bar */}
      <div className="terminal-border bg-ops-dark p-4">
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          {departments.map((dept) => {
            const Icon = dept.icon;
            return (
              <div key={dept.code} className="flex items-center gap-2">
                <Icon className="w-3.5 h-3.5 text-ops-green-dim shrink-0" />
                <div>
                  <p className="font-orbitron text-[9px] font-black text-ops-green tracking-widest">
                    {dept.code}
                  </p>
                  <p className="font-mono text-[8px] text-ops-text-dim tracking-wide">
                    LVL {dept.clearance}+
                  </p>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}
