#!/usr/bin/env node

const { program } = require('commander');
const chalk = require('chalk');
const { AgentDashboard } = require('../lib/dashboard.js');

const dashboard = new AgentDashboard('Bagalobsta');

program
  .name('agent-dashboard')
  .version('1.0.0')
  .description('Track your agent performance, projects, and revenue');

program
  .command('add <name> <type> <url>')
  .option('-s, --status <status>', 'Project status (active/archived)', 'active')
  .description('Add a new project (type: npm|github|gumroad)')
  .action((name, type, url, options) => {
    const project = dashboard.addProject(name, type, url, options.status);
    console.log(chalk.green(`✅ Project added: ${name}`));
  });

program
  .command('update <projectId> <metric> <value>')
  .description('Update engagement metric (stars|downloads|sales|revenue)')
  .action((projectId, metric, value) => {
    const updates = {};
    updates[metric] = parseInt(value) || value;
    dashboard.updateEngagement(projectId, updates);
    console.log(chalk.green(`✅ Updated ${projectId}: ${metric} = ${value}`));
  });

program
  .command('projects')
  .description('List all projects')
  .action(() => {
    const projects = dashboard.getProjects();
    console.log(chalk.cyan('\n📊 Projects\n'));
    
    projects.forEach(p => {
      const engagement = p.engagement || {};
      console.log(`${chalk.yellow(p.name)} [${p.type}]`);
      console.log(`  Status: ${p.status}`);
      if (engagement.stars) console.log(`  ⭐ Stars: ${engagement.stars}`);
      if (engagement.downloads) console.log(`  📥 Downloads: ${engagement.downloads}`);
      if (engagement.sales) console.log(`  💰 Sales: ${engagement.sales}`);
      if (engagement.revenue) console.log(`  💵 Revenue: €${engagement.revenue}`);
      console.log();
    });
  });

program
  .command('summary')
  .description('Show performance summary')
  .action(() => {
    const summary = dashboard.getSummary();
    console.log(chalk.cyan(`\n📈 ${summary.agent} Dashboard\n`));
    
    console.log(`Projects: ${summary.projectCount} (${summary.paidProducts} paid, ${summary.freeTools} free)`);
    console.log(`⭐ Stars: ${summary.engagement.totalStars}`);
    console.log(`📥 Downloads: ${summary.engagement.totalDownloads}`);
    console.log(`💰 Sales: ${summary.engagement.totalSales}`);
    console.log(`💵 Revenue: €${summary.engagement.revenue || 0}`);
    
    if (summary.topProject) {
      console.log(`\n🔥 Top Project: ${summary.topProject.name}`);
    }
    console.log();
  });

program
  .command('goal <target> [timeframe]')
  .description('Track progress toward goal (e.g., 800 "Mac mini in 3 weeks")')
  .action((target, timeframe = 'pending') => {
    const engagement = dashboard.getTotalEngagement();
    const progress = (engagement.revenue / parseFloat(target)) * 100;
    
    console.log(chalk.cyan(`\n🎯 Goal Tracker\n`));
    console.log(`Target: €${target}`);
    console.log(`Current: €${engagement.revenue}`);
    console.log(`Progress: ${progress.toFixed(1)}%`);
    console.log(`Remaining: €${(parseFloat(target) - engagement.revenue).toFixed(2)}`);
    console.log(`Timeframe: ${timeframe}\n`);
  });

program
  .command('log <event> [data]')
  .description('Log a metric event')
  .action((event, data) => {
    dashboard.logMetric(event, data || '');
    console.log(chalk.green(`✅ Logged: ${event}`));
  });

program.parse(process.argv);
