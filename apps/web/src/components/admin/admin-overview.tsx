import { ArrowRight, CalendarDays, Clock3, Inbox, Mail } from "lucide-react";

export type DashboardStats = {
  today: number;
  thisWeek: number;
  thisMonth: number;
  pending: number;
  messages: number;
  trend: { date: string; count: number }[];
  statuses: { status: string; count: number }[];
  services: { label: string; count: number }[];
};

type Props = {
  stats: DashboardStats;
  onNavigate: (section: "appointments" | "contacts") => void;
};

const statusInfo = [
  { key: "PENDING", label: "En attente", color: "#f1b65b" },
  { key: "CONFIRMED", label: "Confirmés", color: "#44b5af" },
  { key: "COMPLETED", label: "Terminés", color: "#267a91" },
  { key: "CANCELLED", label: "Annulés", color: "#c9d8dc" },
];

export function AdminOverview({ stats, onNavigate }: Props) {
  const maxTrend = Math.max(1, ...stats.trend.map((point) => point.count));
  const total = stats.statuses.reduce((sum, item) => sum + item.count, 0);
  const counts = statusInfo.map((item) => ({ ...item, count: stats.statuses.find((status) => status.status === item.key)?.count ?? 0 }));
  let angle = 0;
  const segments = counts.map((item) => {
    const nextAngle = angle + (total ? item.count / total * 360 : 0);
    const segment = `${item.color} ${angle}deg ${nextAngle}deg`;
    angle = nextAngle;
    return segment;
  });
  const maxService = Math.max(1, ...stats.services.map((service) => service.count));

  return <div className="admin-overview">
    <section className="admin-stats" aria-label="Indicateurs clés">
      <article><CalendarDays /><strong>{stats.today}</strong><span>Rendez-vous aujourd&apos;hui</span></article>
      <article><Clock3 /><strong>{stats.thisWeek}</strong><span>Rendez-vous cette semaine</span></article>
      <article><Inbox /><strong>{stats.pending}</strong><span>Demandes en attente</span></article>
      <article><Mail /><strong>{stats.messages}</strong><span>Nouveaux messages</span></article>
    </section>

    <div className="admin-chart-grid">
      <section className="admin-chart-card admin-chart-card-wide" aria-labelledby="admin-trend-title">
        <div className="admin-chart-head"><div><span>ACTIVITÉ</span><h2 id="admin-trend-title">Demandes reçues</h2><p>Nombre de demandes de rendez-vous sur les 7 derniers jours</p></div><strong>{stats.trend.reduce((sum, point) => sum + point.count, 0)} <small>sur 7 jours</small></strong></div>
        <div className="admin-bar-chart" role="img" aria-label={stats.trend.map((point) => `${point.date} : ${point.count} demande${point.count > 1 ? "s" : ""}`).join(", ")}>
          {stats.trend.map((point) => <div className="admin-bar-item" key={point.date}>
            <span className="admin-bar-value">{point.count}</span>
            <div className="admin-bar-track"><span style={{ height: `${point.count ? Math.max(8, point.count / maxTrend * 100) : 3}%` }} /></div>
            <time dateTime={point.date}>{new Intl.DateTimeFormat("fr-MA", { weekday: "short", day: "numeric" }).format(new Date(`${point.date}T12:00:00`))}</time>
          </div>)}
        </div>
      </section>

      <section className="admin-chart-card" aria-labelledby="admin-status-title">
        <div className="admin-chart-head"><div><span>RÉPARTITION</span><h2 id="admin-status-title">Statut des rendez-vous</h2><p>Ensemble des demandes</p></div></div>
        <div className="admin-donut-layout">
          <div className="admin-donut" role="img" aria-label={counts.map((item) => `${item.label} : ${item.count}`).join(", ")} style={{ background: total ? `conic-gradient(${segments.join(", ")})` : "#e8eff0" }}><div><strong>{total}</strong><span>au total</span></div></div>
          <ul className="admin-chart-legend">{counts.map((item) => <li key={item.key}><i style={{ background: item.color }} /><span>{item.label}</span><strong>{item.count}</strong></li>)}</ul>
        </div>
      </section>

      <section className="admin-chart-card admin-chart-card-wide" aria-labelledby="admin-services-title">
        <div className="admin-chart-head"><div><span>SERVICES</span><h2 id="admin-services-title">Services les plus demandés</h2><p>Nombre total de rendez-vous par service</p></div></div>
        {stats.services.length ? <div className="admin-service-chart">{stats.services.map((service) => <div className="admin-service-row" key={service.label}><span title={service.label}>{service.label}</span><div><span style={{ width: `${service.count / maxService * 100}%` }} /></div><strong>{service.count}</strong></div>)}</div> : <p className="admin-chart-empty">Les services apparaîtront après les premières demandes.</p>}
      </section>

      <section className="admin-chart-card admin-actions-card" aria-labelledby="admin-actions-title">
        <div className="admin-chart-head"><div><span>À TRAITER</span><h2 id="admin-actions-title">Actions rapides</h2><p>Accédez aux éléments qui attendent une réponse</p></div></div>
        <button type="button" onClick={() => onNavigate("appointments")}><span><CalendarDays size={19} /> Rendez-vous en attente</span><strong>{stats.pending}</strong><ArrowRight size={18} /></button>
        <button type="button" onClick={() => onNavigate("contacts")}><span><Mail size={19} /> Nouveaux messages</span><strong>{stats.messages}</strong><ArrowRight size={18} /></button>
        <p>{stats.thisMonth} rendez-vous prévus ce mois-ci.</p>
      </section>
    </div>
  </div>;
}
