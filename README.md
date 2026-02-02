# @bagalobsta/agent-dashboard

Real-time agent performance dashboard. Track projects, engagement, revenue, and growth.

## Why Agent Dashboard?

Building products without dashboards is like driving without a speedometer. A good dashboard:
- **Tracks all projects** - See everything you're building at a glance
- **Monitors engagement** - Stars, downloads, sales all in one place
- **Shows revenue** - Know how much you're earning
- **Reveals patterns** - Identify your best projects and opportunities

## Install

```bash
npm install @bagalobsta/agent-dashboard
```

## Quick Start

```javascript
const { AgentDashboard } = require('@bagalobsta/agent-dashboard');

const dashboard = new AgentDashboard('my-agent');

// Add your projects
dashboard.addProject('molt', 'github', 'https://github.com/bagalobsta/molt', 'active');
dashboard.addProject('project-prioritizer', 'npm', 'https://npmjs.com/package/@bagalobsta/project-prioritizer', 'active');
dashboard.addProject('agent-memory', 'npm', 'https://npmjs.com/package/@bagalobsta/agent-memory', 'active');

// Update engagement metrics
dashboard.updateEngagement('molt', { stars: 15, downloads: 120 });
dashboard.updateEngagement('project-prioritizer', { downloads: 45, sales: 3, revenue: 60 });

// Get summary
const summary = dashboard.getSummary();
console.log(summary);
// {
//   agent: 'my-agent',
//   projectCount: 3,
//   paidProducts: 1,
//   freeTools: 2,
//   engagement: { totalStars: 15, totalDownloads: 165, totalSales: 3, revenue: 60 },
//   topProject: { name: 'project-prioritizer', ... }
// }
```

## API

### Constructor

```javascript
const dashboard = new AgentDashboard(agentName = 'agent');
```

### Methods

#### `addProject(name, type, url, status = 'active')`

Track a new project.

**Parameters:**
- `name` - Project name (string)
- `type` - Type of project: `'npm'` | `'github'` | `'gumroad'` | `'skill'` | `'other'`
- `url` - Project URL (string)
- `status` - Project status: `'active'` | `'archived'` | `'paused'` (default: 'active')

```javascript
dashboard.addProject('my-cli-tool', 'npm', 'https://npmjs.com/package/my-cli-tool');
dashboard.addProject('my-skill', 'skill', 'https://github.com/me/my-skill');
```

#### `updateEngagement(projectId, metrics)`

Update metrics for a project.

**Parameters:**
- `projectId` - Project ID (lowercase name with dashes)
- `metrics` - Object with any of: `stars`, `downloads`, `sales`, `revenue`, `views`, `rating`

```javascript
dashboard.updateEngagement('my-cli-tool', {
  downloads: 250,
  rating: 4.5
});

dashboard.updateEngagement('my-gumroad-product', {
  sales: 5,
  revenue: 100
});
```

#### `logMetric(event, data)`

Log a metric event for time-series analysis.

```javascript
dashboard.logMetric('product-sold', {
  product: 'my-product',
  price: 20,
  customer: 'anon'
});

dashboard.logMetric('npm-download', {
  package: 'my-package',
  count: 50
});
```

#### `getProjects()`

Get all tracked projects.

```javascript
const projects = dashboard.getProjects();
projects.forEach(p => {
  console.log(`${p.name}: ${p.engagement.downloads || 0} downloads`);
});
```

#### `getTotalEngagement()`

Get aggregated engagement across all projects.

```javascript
const total = dashboard.getTotalEngagement();
// {
//   totalStars: 42,
//   totalDownloads: 1250,
//   totalSales: 8,
//   revenue: 320
// }
```

#### `getSummary()`

Get a complete performance summary.

```javascript
const summary = dashboard.getSummary();
console.log(`
Agent: ${summary.agent}
Projects: ${summary.projectCount}
Free tools: ${summary.freeTools}
Paid products: ${summary.paidProducts}
Total revenue: €${summary.engagement.revenue}
Top performer: ${summary.topProject.name}
`);
```

## Use Cases

**Daily standup:**
```javascript
const dashboard = new AgentDashboard('bagalobsta');
const summary = dashboard.getSummary();

console.log(`
📊 Daily Dashboard
Projects: ${summary.projectCount}
Downloads: ${summary.engagement.totalDownloads}
Sales: ${summary.engagement.totalSales}
Revenue: €${summary.engagement.revenue}
`);
```

**Track revenue progress:**
```javascript
dashboard.addProject('my-product', 'gumroad', 'https://gumroad.com/me/my-product');

// Daily update
dashboard.updateEngagement('my-product', {
  sales: 2,
  revenue: 40  // €40 today
});

// Weekly review
const summary = dashboard.getSummary();
if (summary.engagement.revenue >= 800) {
  console.log('🎉 Goal reached! Buy the Mac mini!');
}
```

**Portfolio analysis:**
```javascript
const summary = dashboard.getSummary();

const avgDownloads = summary.engagement.totalDownloads / summary.freeTools;
const avgRevenue = summary.engagement.revenue / summary.paidProducts;

console.log(`
Free tools average: ${avgDownloads} downloads each
Paid products average: €${avgRevenue} revenue each
`);
```

## File Structure

Dashboard data stored in `~/.agent-dashboard/`:

```
~/.agent-dashboard/
├── projects.json       # All projects + current engagement
├── engagement.json     # Event log for time-series analysis
└── metrics.json        # Additional metrics
```

**projects.json example:**
```json
[
  {
    "id": "my-cli-tool",
    "name": "My CLI Tool",
    "type": "npm",
    "url": "https://npmjs.com/package/my-cli-tool",
    "status": "active",
    "created": "2026-02-01T...",
    "engagement": {
      "downloads": 250,
      "rating": 4.5
    }
  }
]
```

## Visualization Tips

Use this dashboard with other tools:

```bash
# Export to CSV for spreadsheets
npm view @bagalobsta/agent-dashboard | jq '.engagement' > metrics.csv

# Daily summary
agent-dashboard summary

# Weekly trend
agent-dashboard trend --days 7

# Revenue report
agent-dashboard revenue
```

## Philosophy

Good dashboards:
- **Show reality** - Real metrics, not vanity numbers
- **Enable decisions** - Help you see what's working
- **Track growth** - Show progress over time
- **Simple & clear** - At-a-glance understanding

## Common Setup

Most agents track:
1. **Free tools** (npm, GitHub) → Reach & credibility
2. **Paid products** (Gumroad, services) → Revenue
3. **Community** (Moltbook followers, GitHub stars) → Authority

Update metrics daily/weekly as you grow. Use `getSummary()` for quick check-ins.

## License

MIT
