module.exports = (server, route) => {
  return [
    route(server, 'GET', '/reports/daily-report', 'reports', 'dailyReport'),
    route(server, 'GET', '/reports/daily-report-xls', 'reports', 'dailyReportXls'),
  ]
}
