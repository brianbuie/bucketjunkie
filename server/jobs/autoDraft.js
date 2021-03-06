const mongoose = require('mongoose');
const schedule = require('node-schedule');
const suffix = require('ordinal-number-suffix');
const rosterService = require('../services/rosterService');
const moment = require('moment');
const log = require('../services/logService');

const League = mongoose.model('League');
const Draft = mongoose.model('Draft');
const Roster = mongoose.model('Roster');
const Activity = mongoose.model('Activity');

const autoDrafts = {};

const autoDraft = async id => {
  const league = await League.findOne({ _id: id });
  if (!league.uniqueRosters) {
    return league.set({ started: true }).save();
  }
  log.info({ msg: `Autodrafting for ${league.name}`, force: true });
  const drafts = await Draft.find({ league }).populate('players').populate('user');
  const rosters = league.members.map(user => { return { league, user, players: [] } });
  const actions = [];
  let round = 0, pick = 0;
  const simRound = user => {
    pick++;
    if (round > league.rosterSize) return;
    let action = { user, league, category: 'rosters' };
    let rosterIndex = rosters.findIndex(roster => roster.user.equals(user));
    let draft = drafts.find(draft => draft.user.equals(user));
    if (!draft) draft = { players: [] };
    let player = draft.players.find(player => rosterService.playerIsAvailable(rosters, player));
    if (!player) {
      action.message = `forfeited the ${suffix(pick)} pick of round ${round}`;
      return actions.push(action);
    }
    rosters[rosterIndex].players.push(player);
    action.message = `drafted ${player.name} with the ${suffix(pick)} pick of round ${round}`;
    return actions.push(action);
  };
  while (round < league.rosterSize) {
    round++;
    league.members.forEach(user => simRound(user)); pick = 0; round++;
    league.members.reverse().forEach(user => simRound(user)); pick = 0;
    league.members.reverse();
  }
  const update = await Promise.all(rosters.map(roster => (new Roster(roster)).save()));
  for (let action of actions) {
    await (new Activity(action)).save();
  }
  const setStarted = await league.set({ started: true }).save();
  // TODO HANDLE ERRORS HERE
};

const scheduleDrafts = async () => {
  const leagues = await League.find({ started: false });
  leagues.forEach(league => {
    if (autoDrafts[league._id]){
      if (moment(autoDrafts[league._id].start).isSame(league.start)) return;
      log.status(`league start changed for ${league.name}`);
      autoDrafts[league._id].job.cancel();
    }
    if (moment(league.start).isBefore(moment())) {
      return autoDraft(league._id);
    }
    log.status({ msg: `Scheduling autodraft for '${league.name}' ${league.start}`, force: true });
    autoDrafts[league._id] = {
      start: league.start,
      job: schedule.scheduleJob(league.start, function() { autoDraft(league._id); })
    };
  });
}

exports.startup = () => {
  scheduleDrafts();
  setInterval(scheduleDrafts, 5*60*1000);
};