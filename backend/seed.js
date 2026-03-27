// seed.js
// Corporate sample data seeder for Task Management System.
// Run once with:  node seed.js
//
// What it does:
//   1. Creates sample team members if they don't exist
//   2. Replaces old seed tasks with realistic corporate IT tasks
//   3. Seeds a set of realistic corporate bug reports

const db = require('./config/db');

setTimeout(async () => {
  console.log('\n🌱  Starting seed...\n');

  try {
    // ── 1. Seed users ─────────────────────────────────────────────────────────
    const sampleUsers = [
      { username: 'john',   password: 'password123' },
      { username: 'sarah',  password: 'password123' },
      { username: 'mike',   password: 'password123' },
      { username: 'alice',  password: 'password' },
      { username: 'bob',    password: 'password' },
    ];

    for (const u of sampleUsers) {
      await new Promise((resolve, reject) => {
        db.run(
          `INSERT INTO users (username, password)
           SELECT ?, ? WHERE NOT EXISTS (SELECT 1 FROM users WHERE username = ?)`,
          [u.username, u.password, u.username],
          function (err) { if (err) reject(err); else resolve(); }
        );
      });
    }

    const allUsers = await new Promise((resolve, reject) => {
      db.all('SELECT id, username FROM users', (err, rows) => {
        if (err) reject(err); else resolve(rows);
      });
    });

    const userIds = {};
    allUsers.forEach(u => { userIds[u.username] = u.id; });
    console.log('✓  Users:', Object.entries(userIds).map(([n, id]) => `${n}(#${id})`).join(', '));

    // ── 2. Remove old seed tasks ───────────────────────────────────────────────
    await new Promise((resolve, reject) => {
      db.run(
        `UPDATE tasks SET deleted_at = datetime('now') WHERE title LIKE '%[SEED]%' AND deleted_at IS NULL`,
        function (err) { if (err) reject(err); else { console.log(`✓  Removed ${this.changes} old seed tasks`); resolve(); } }
      );
    });

    // Helper: date relative to today
    const relDate = (days) => {
      const d = new Date();
      d.setDate(d.getDate() + days);
      return d.toISOString().substring(0, 10);
    };

    // ── 3. Insert corporate IT tasks ───────────────────────────────────────────
    const tasks = [
      // --- High Priority / Overdue ---
      {
        title:         'P1 Production outage — payment gateway timeout [SEED]',
        description:   'Payment service returning 504 errors intermittently since 08:00. Customers unable to complete checkout. RCA and hotfix required immediately.',
        status:        'In Progress',
        priority:      'High',
        due_date:      relDate(-1),
        assignees:     ['admin', 'john'],
      },
      {
        title:         'CVE-2025-4812 critical patch — apply to all servers [SEED]',
        description:   'CISA advisory issued for OpenSSL vulnerability. All production and staging servers must be patched before end of week. Coordinate with infra team.',
        status:        'In Progress',
        priority:      'High',
        due_date:      relDate(2),
        assignees:     ['mike', 'sarah'],
      },
      {
        title:         'Data breach investigation — audit access logs [SEED]',
        description:   'Unusual API call patterns detected in SIEM dashboard. Review CloudTrail logs, identify source IPs, and escalate if confirmed. Incident ticket #INC-2048.',
        status:        'In Progress',
        priority:      'High',
        due_date:      relDate(0),
        assignees:     ['john'],
      },
      {
        title:         'SOX compliance — quarterly access review [SEED]',
        description:   'Revoke stale user accounts and document access justifications for all privileged users. Audit report due to compliance officer by Friday.',
        status:        'Pending',
        priority:      'High',
        due_date:      relDate(3),
        assignees:     ['admin', 'alice'],
      },

      // --- High Priority / Upcoming ---
      {
        title:         'ERP system migration — UAT sign-off [SEED]',
        description:   'All UAT test cases for the SAP S/4HANA migration must be executed and signed off by business owners. Blocking go-live scheduled for Q2.',
        status:        'In Progress',
        priority:      'High',
        due_date:      relDate(7),
        assignees:     ['sarah', 'bob'],
      },
      {
        title:         'Kubernetes cluster upgrade to v1.31 [SEED]',
        description:   'Upgrade production EKS cluster from 1.29 to 1.31. Drain nodes in rolling fashion, verify all workloads restart cleanly, update helm charts.',
        status:        'Pending',
        priority:      'High',
        due_date:      relDate(10),
        assignees:     ['mike', 'john'],
      },

      // --- Medium Priority / In Progress ---
      {
        title:         'Implement SSO integration — Azure AD [SEED]',
        description:   'Replace local username/password auth with Azure Active Directory SSO using SAML 2.0. Update all internal apps to route through the identity provider.',
        status:        'In Progress',
        priority:      'Medium',
        due_date:      relDate(14),
        assignees:     ['admin', 'sarah'],
      },
      {
        title:         'Build automated backup verification pipeline [SEED]',
        description:   'Current backups are taken nightly but never tested. Create a Jenkins pipeline that restores backup to isolated environment and runs smoke tests weekly.',
        status:        'In Progress',
        priority:      'Medium',
        due_date:      relDate(18),
        assignees:     ['mike'],
      },
      {
        title:         'API rate limiting — throttle unauthenticated endpoints [SEED]',
        description:   'Public-facing APIs have no rate limiting. Implement token-bucket algorithm per IP with Redis. Alert on sustained abuse patterns.',
        status:        'In Progress',
        priority:      'Medium',
        due_date:      relDate(12),
        assignees:     ['john', 'alice'],
      },
      {
        title:         'Migrate legacy reports from Crystal Reports to Power BI [SEED]',
        description:   'Finance team uses 14 Crystal Reports dashboards that run on an EOL server. Convert to Power BI and publish to the corporate workspace.',
        status:        'Pending',
        priority:      'Medium',
        due_date:      relDate(21),
        assignees:     ['sarah', 'bob'],
      },

      // --- Medium Priority / Pending ---
      {
        title:         'Set up centralised log management with ELK stack [SEED]',
        description:   'Application and infrastructure logs are scattered across 6 servers. Deploy Elasticsearch, Logstash, and Kibana on dedicated VM. Ship logs from all services.',
        status:        'Pending',
        priority:      'Medium',
        due_date:      relDate(25),
        assignees:     ['mike', 'john'],
      },
      {
        title:         'Employee onboarding automation — IT provisioning workflow [SEED]',
        description:   'New employee setup takes 2 days manually. Build ServiceNow workflow to auto-provision AD account, email, VPN profile, and laptop MDM enrolment on day 1.',
        status:        'Pending',
        priority:      'Medium',
        due_date:      relDate(30),
        assignees:     ['alice', 'admin'],
      },
      {
        title:         'Conduct disaster recovery drill — RTO validation [SEED]',
        description:   'Test full failover to DR site per BCP requirements. Measure RTO against the 4-hour SLA. Document gaps and update runbook accordingly.',
        status:        'Pending',
        priority:      'Medium',
        due_date:      relDate(35),
        assignees:     ['admin', 'mike'],
      },

      // --- Low Priority ---
      {
        title:         'Refresh IT asset inventory — hardware lifecycle audit [SEED]',
        description:   'Scan all endpoints using SNMP and SCCM. Identify hardware older than 5 years for refresh budget submission. Export report to asset management portal.',
        status:        'Pending',
        priority:      'Low',
        due_date:      relDate(40),
        assignees:     ['bob'],
      },
      {
        title:         'Document internal API standards and versioning policy [SEED]',
        description:   'Establish guidelines for REST API naming conventions, versioning strategy (/v1, /v2), deprecation notice period, and error response format for all teams.',
        status:        'Pending',
        priority:      'Low',
        due_date:      relDate(45),
        assignees:     ['sarah', 'alice'],
      },

      // --- Completed ---
      {
        title:         'Deploy WAF rules for OWASP Top 10 coverage [SEED]',
        description:   'Configured AWS WAF managed rule groups for SQLi, XSS, and bad bots. Verified in staging for 2 weeks with zero false positives before production release.',
        status:        'Completed',
        priority:      'High',
        due_date:      relDate(-14),
        assignees:     ['john', 'mike'],
      },
      {
        title:         'Network segmentation — production/dev VLAN isolation [SEED]',
        description:   'Separated production and development traffic into dedicated VLANs with ACLs enforced at core switch. Eliminated lateral movement risk between environments.',
        status:        'Completed',
        priority:      'High',
        due_date:      relDate(-10),
        assignees:     ['mike'],
      },
      {
        title:         'Automate SSL certificate renewal with Let\'s Encrypt [SEED]',
        description:   'Replaced all manually managed SSL certs with auto-renewing Let\'s Encrypt certificates via certbot and cron. Monitoring alerts if renewal fails 7 days before expiry.',
        status:        'Completed',
        priority:      'Medium',
        due_date:      relDate(-8),
        assignees:     ['alice', 'john'],
      },
      {
        title:         'Implement MFA for all VPN and admin portal access [SEED]',
        description:   'Enforced TOTP-based MFA via Duo Security for all VPN connections and admin dashboards. Enrolled 98% of staff; 2% on approved exceptions pending hardware token delivery.',
        status:        'Completed',
        priority:      'High',
        due_date:      relDate(-5),
        assignees:     ['admin', 'sarah'],
      },
      {
        title:         'Upgrade Node.js runtime to v20 LTS across all services [SEED]',
        description:   'Migrated 8 microservices from Node 16 (EOL) to Node 20 LTS. Updated Dockerfiles, verified all npm dependencies for compatibility, and re-ran full regression suite.',
        status:        'Completed',
        priority:      'Medium',
        due_date:      relDate(-3),
        assignees:     ['bob', 'mike'],
      },
    ];

    let insertedTasks = 0;
    for (const t of tasks) {
      const primaryUser = t.assignees[0];
      const userId = userIds[primaryUser] || userIds['admin'];

      const taskId = await new Promise((resolve, reject) => {
        db.run(
          `INSERT INTO tasks (title, description, status, assigned_user_id, priority, due_date)
           VALUES (?, ?, ?, ?, ?, ?)`,
          [t.title, t.description, t.status, userId, t.priority, t.due_date],
          function (err) { if (err) reject(err); else resolve(this.lastID); }
        );
      });

      // Insert all assignees into task_assignees join table
      for (const uname of t.assignees) {
        const uid = userIds[uname];
        if (uid) {
          await new Promise((resolve, reject) => {
            db.run(
              `INSERT OR IGNORE INTO task_assignees (task_id, user_id) VALUES (?, ?)`,
              [taskId, uid],
              (err) => { if (err) reject(err); else resolve(); }
            );
          });
        }
      }

      insertedTasks++;
    }
    console.log(`✓  Inserted ${insertedTasks} corporate tasks`);

    // ── 4. Seed bug reports ────────────────────────────────────────────────────
    // Clear old seeded bugs first
    await new Promise((resolve, reject) => {
      db.run(
        `DELETE FROM bugs WHERE title LIKE '%[SEED]%'`,
        function (err) { if (err) reject(err); else { console.log(`✓  Removed ${this.changes} old seed bugs`); resolve(); } }
      );
    });

    const bugs = [
      // Open bugs
      {
        title:       'Password reset email not delivered for corporate domain users [SEED]',
        description: 'Users with @microchip.com addresses report the password reset email never arrives. Personal email domains (Gmail, Outlook) work fine. Likely blocked by corporate spam filter or SPF record mismatch.',
        status:      'Open',
        priority:    'High',
        reporter:    'alice',
        assignee:    'john',
      },
      {
        title:       'Dashboard stat cards show stale data after task status update [SEED]',
        description: 'After editing a task\'s status from "In Progress" to "Completed", the dashboard card counts do not update until manual page refresh. Expected: real-time count update.',
        status:      'Open',
        priority:    'Medium',
        reporter:    'bob',
        assignee:    'sarah',
      },
      {
        title:       'Session token not invalidated on logout — users can re-use old JWT [SEED]',
        description: 'After clicking Logout, the JWT token stored in localStorage can still be used to make authenticated API calls until it expires (24h). Token should be server-side invalidated on logout.',
        status:      'Open',
        priority:    'High',
        reporter:    'admin',
        assignee:    'mike',
      },
      {
        title:       'Export to CSV button missing on Reports page [SEED]',
        description: 'Finance team requires a CSV export of the team performance table for monthly reporting. The export button is shown in mockups but has not been implemented.',
        status:      'Open',
        priority:    'Medium',
        reporter:    'sarah',
        assignee:    null,
      },
      {
        title:       'Task due date picker allows past dates on creation form [SEED]',
        description: 'Users can set a due date in the past when creating a new task. No validation error is shown. Should restrict to today or future dates for new tasks.',
        status:      'Open',
        priority:    'Low',
        reporter:    'alice',
        assignee:    'bob',
      },

      // In Progress bugs
      {
        title:       'Pagination breaks when filters are applied — page resets to 1 unexpectedly [SEED]',
        description: 'Navigating to page 3 of task list and then changing the priority filter resets to page 1 correctly, but the URL still shows ?page=3, causing a mismatch in the backend query.',
        status:      'In Progress',
        priority:    'Medium',
        reporter:    'john',
        assignee:    'sarah',
      },
      {
        title:       'Multiple assignee avatars overlap on narrow task cards in mobile view [SEED]',
        description: 'When 3+ users are assigned to a task, the avatar circles overflow outside the card boundary on screens below 480px width. Needs z-index stacking and max-width constraint.',
        status:      'In Progress',
        priority:    'Low',
        reporter:    'bob',
        assignee:    'alice',
      },
      {
        title:       'API returns 500 when assignee_ids contains a non-existent user ID [SEED]',
        description: 'POST /api/tasks with assignee_ids: [99999] returns HTTP 500 with an unhandled SQLite constraint error instead of a proper 400 Bad Request with a clear message.',
        status:      'In Progress',
        priority:    'High',
        reporter:    'mike',
        assignee:    'john',
      },

      // Resolved bugs
      {
        title:       'Search query not URL-encoded — special characters break filter request [SEED]',
        description: 'Searching for tasks containing "&" or "+" caused malformed query strings sent to the backend, resulting in 400 errors. Fixed by encoding the search param before appending to URL.',
        status:      'Resolved',
        priority:    'Medium',
        reporter:    'sarah',
        assignee:    'admin',
      },
      {
        title:       'CORS policy blocked frontend requests in production build [SEED]',
        description: 'After deploying the React build to the server, all API calls returned CORS errors. Root cause: allowed origins were hardcoded to localhost only. Fixed by reading allowed origins from environment variable.',
        status:      'Resolved',
        priority:    'High',
        reporter:    'admin',
        assignee:    'mike',
      },
      {
        title:       'Sidebar collapsed state not persisted across page navigation [SEED]',
        description: 'Collapsing the sidebar and navigating to a different page caused the sidebar to expand again. Fixed by storing the collapsed preference in localStorage and reading it on mount.',
        status:      'Resolved',
        priority:    'Low',
        reporter:    'alice',
        assignee:    'bob',
      },
    ];

    let insertedBugs = 0;
    for (const b of bugs) {
      const reporterId = userIds[b.reporter] || userIds['admin'];
      const assigneeId = b.assignee ? (userIds[b.assignee] || null) : null;

      await new Promise((resolve, reject) => {
        db.run(
          `INSERT INTO bugs (title, description, status, priority, reported_by, assigned_to)
           VALUES (?, ?, ?, ?, ?, ?)`,
          [b.title, b.description, b.status, b.priority, reporterId, assigneeId],
          function (err) { if (err) reject(err); else { insertedBugs++; resolve(); } }
        );
      });
    }
    console.log(`✓  Inserted ${insertedBugs} corporate bug reports`);

    console.log('\n✅  Seed complete!');
    console.log('   Login credentials:');
    console.log('   admin  / password');
    console.log('   alice  / password');
    console.log('   bob    / password');
    console.log('   john   / password123');
    console.log('   sarah  / password123');
    console.log('   mike   / password123\n');

  } catch (err) {
    console.error('❌  Seed failed:', err.message);
  } finally {
    db.close();
  }
}, 500);
