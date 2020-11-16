module.exports = (server, route) => {
  return [
    route(server, 'GET', '/reports/daily-report', 'reports', 'DailyReport'),
    route(server, 'GET', '/reports/daily-report-xls', 'reports', 'DailyReportXls'),
  ]
}
