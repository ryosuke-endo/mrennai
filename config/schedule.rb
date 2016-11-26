# Use this file to easily define all of your cron jobs.
#
# It's helpful, but not entirely necessary to understand cron before proceeding.
# http://en.wikipedia.org/wiki/Cron

set :output, 'var/log/cron/cron_log.log'

set :environment, :production

every 1.day, at: '0:05 am' do
  runner 'Mennai::Ranking.update'
  runner 'Mennai::Ranking.import_read'
end
#
# every 4.days do
#   runner "AnotherModel.prune_old_records"
# end

# Learn more: http://github.com/javan/whenever
