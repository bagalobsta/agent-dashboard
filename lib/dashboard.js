const fs = require('fs-extra');
const path = require('path');

class AgentDashboard {
  constructor(agentName = 'agent') {
    this.agentName = agentName;
    this.dataDir = path.join(process.env.HOME || '/tmp', '.agent-dashboard');
    this.projectsFile = path.join(this.dataDir, 'projects.json');
    this.engagementFile = path.join(this.dataDir, 'engagement.json');
    this.metricsFile = path.join(this.dataDir, 'metrics.json');
    this.initDirs();
  }

  initDirs() {
    fs.ensureDirSync(this.dataDir);
  }

  // Add/track a project
  addProject(name, type, url, status = 'active') {
    const projects = this.readFile(this.projectsFile, []);
    const project = {
      id: name.toLowerCase().replace(/\s+/g, '-'),
      name,
      type, // 'npm', 'github', 'gumroad', 'skill'
      url,
      status,
      created: new Date().toISOString(),
      engagement: { stars: 0, downloads: 0, sales: 0 }
    };
    projects.push(project);
    fs.writeJsonSync(this.projectsFile, projects, { spaces: 2 });
    return project;
  }

  // Update engagement metrics
  updateEngagement(projectId, metrics) {
    const projects = this.readFile(this.projectsFile, []);
    const project = projects.find(p => p.id === projectId);
    if (project) {
      project.engagement = { ...project.engagement, ...metrics };
    }
    fs.writeJsonSync(this.projectsFile, projects, { spaces: 2 });
  }

  // Log a metric event
  logMetric(event, data) {
    const engagement = this.readFile(this.engagementFile, []);
    engagement.push({
      timestamp: new Date().toISOString(),
      event,
      data
    });
    fs.writeJsonSync(this.engagementFile, engagement, { spaces: 2 });
  }

  // Get all projects
  getProjects() {
    return this.readFile(this.projectsFile, []);
  }

  // Calculate total engagement
  getTotalEngagement() {
    const projects = this.getProjects();
    return {
      totalStars: projects.reduce((sum, p) => sum + (p.engagement.stars || 0), 0),
      totalDownloads: projects.reduce((sum, p) => sum + (p.engagement.downloads || 0), 0),
      totalSales: projects.reduce((sum, p) => sum + (p.engagement.sales || 0), 0),
      revenue: projects.reduce((sum, p) => sum + (p.engagement.revenue || 0), 0)
    };
  }

  // Get performance summary
  getSummary() {
    const projects = this.getProjects();
    const engagement = this.getTotalEngagement();
    
    return {
      agent: this.agentName,
      projectCount: projects.length,
      paidProducts: projects.filter(p => p.type === 'gumroad').length,
      freeTools: projects.filter(p => p.type === 'npm').length,
      engagement,
      topProject: projects.sort((a, b) => 
        (b.engagement.downloads || b.engagement.stars || 0) - 
        (a.engagement.downloads || a.engagement.stars || 0)
      )[0]
    };
  }

  readFile(filepath, defaultVal) {
    if (fs.existsSync(filepath)) {
      return fs.readJsonSync(filepath);
    }
    return defaultVal;
  }
}

module.exports = { AgentDashboard };
