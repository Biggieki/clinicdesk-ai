import { AppShell } from "@/components/app-shell/app-shell";

const stats = [
  { label: "Total Patients", value: "1,284", change: "+12.5%", icon: "♙", tone: "mint" },
  { label: "Appointments", value: "42", change: "Today", icon: "▦", tone: "purple" },
  { label: "Available Doctors", value: "12", change: "On duty", icon: "✚", tone: "coral" },
  { label: "Pending Reports", value: "08", change: "Needs review", icon: "▤", tone: "blue" },
];

const appointments = [
  { name: "Ahmed Mohamed", doctor: "Dr. Hassan", time: "09:00 AM", type: "General Checkup", status: "Confirmed", initials: "AM" },
  { name: "Fatima Ali", doctor: "Dr. Amina", time: "10:30 AM", type: "Dental", status: "Pending", initials: "FA" },
  { name: "Omar Yusuf", doctor: "Dr. Hassan", time: "11:15 AM", type: "Follow-up", status: "Confirmed", initials: "OY" },
  { name: "Maryan Abdi", doctor: "Dr. Sarah", time: "01:00 PM", type: "Consultation", status: "Confirmed", initials: "MA" },
];

export default function Home() {
  return (
    <AppShell section="Overview">
      <section className="welcome-section">
        <div>
          <p className="eyebrow">SATURDAY, NOVEMBER 21, 2026</p>
          <h2>Your clinic, <span>in focus.</span></h2>
          <p className="welcome-subtitle">Here&apos;s what is happening across your clinic today.</p>
        </div>
        <button className="primary-button">＋ <span>New appointment</span></button>
      </section>

      <section className="stats-grid">
        {stats.map((stat, i) => (
          <article key={stat.label} className={`stat-card tone-${stat.tone}`} style={{ animationDelay: `${i * 100}ms` }}>
            <div className="stat-top">
              <span>{stat.label}</span>
              <div className="stat-icon">{stat.icon}</div>
            </div>
            <div className="stat-value">{stat.value}</div>
            <div className="stat-bottom">
              <span className="stat-change">↗ {stat.change}</span>
              <span className="stat-period">vs. last period</span>
            </div>
            <div className="card-decoration" />
          </article>
        ))}
      </section>

      <section className="overview-grid">
        <article className="panel appointment-panel">
          <div className="panel-heading">
            <div>
              <p className="eyebrow">YOUR SCHEDULE</p>
              <h3>Today&apos;s appointments</h3>
              <p className="panel-subtitle">Manage your upcoming patient visits.</p>
            </div>
            <button className="text-button">View schedule ↗</button>
          </div>

          <div className="appointment-list">
            {appointments.map((item, i) => (
              <div className="appointment-row" key={item.name} style={{ animationDelay: `${i * 100 + 300}ms` }}>
                <div className="time-block">{item.time}</div>
                <div className="avatar patient-avatar">{item.initials}</div>
                <div className="patient-info">
                  <strong>{item.name}</strong>
                  <small>{item.doctor} · {item.type}</small>
                </div>
                <span className={`status ${item.status.toLowerCase()}`}>
                  <i /> {item.status}
                </span>
                <button className="more-button" aria-label={`More options for ${item.name}`}>···</button>
              </div>
            ))}
          </div>
        </article>

        <article className="panel activity-panel">
          <div className="panel-heading">
            <div>
              <p className="eyebrow">CLINIC PULSE</p>
              <h3>Daily activity</h3>
            </div>
            <span className="today-tag">Today</span>
          </div>
          <div className="activity-number">86<span>%</span></div>
          <p className="activity-description">Appointment capacity used</p>
          <div className="progress-track"><div className="progress-fill" /></div>
          <div className="progress-labels"><span>36 booked</span><span>42 total slots</span></div>
          <div className="activity-divider" />
          <div className="activity-stat">
            <div className="activity-symbol mint-symbol">✓</div>
            <div><strong>28 completed</strong><small>Patient visits finished</small></div>
          </div>
          <div className="activity-stat">
            <div className="activity-symbol coral-symbol">◷</div>
            <div><strong>6 upcoming</strong><small>Still waiting today</small></div>
          </div>
        </article>
      </section>

      <section className="panel recent-panel">
        <div className="panel-heading">
          <div>
            <p className="eyebrow">PATIENT DIRECTORY</p>
            <h3>Recently registered</h3>
          </div>
          <button className="text-button">All patients ↗</button>
        </div>
        <div className="recent-list">
          {appointments.slice(0, 3).map((patient) => (
            <div className="recent-row" key={patient.name}>
              <div className="avatar patient-avatar">{patient.initials}</div>
              <div className="patient-info">
                <strong>{patient.name}</strong>
                <small>Patient · General profile</small>
              </div>
              <span className="patient-active"><i /> Active</span>
              <span className="registered-date">Registered recently</span>
            </div>
          ))}
        </div>
      </section>

      <footer className="footer">
        <span>© 2026 ClinicDesk AI</span>
        <span>Designed for better healthcare operations <b>✧</b></span>
      </footer>
    </AppShell>
  );
}
