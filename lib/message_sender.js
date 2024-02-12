'use strict';

import { IncomingWebhook } from '@slack/webhook';
import { Environment } from './environment.js';
import { PrFilter } from './pr_filter.js';
import { RepoConfigurationParser } from './repo_configuration_parser.js';
import { getOpenPRs, getReviews } from './github_client.js';

const { SLACK_WEBHOOK_URL } = process.env;
const SLACK_WEBHOOK = new IncomingWebhook(SLACK_WEBHOOK_URL);

const environment = Environment.named(process.env.NODE_ENV);
const reposToRead = RepoConfigurationParser.parseFrom(process.env);

console.log(reposToRead);

function stateToEmoji(githubReviewState) {
  const reviewMapping = {
    APPROVED: process.env.EMOJI_APPROVED_REVIEW,
    CHANGES_REQUESTED: process.env.EMOJI_CHANGES_REQUESTED_REVIEW,
    COMMENTED: process.env.EMOJI_COMMENTED_REVIEW,
    DISMISSED: process.env.EMOJI_DISMISSED_REVIEW,
    PENDING: process.env.EMOJI_PENDING_REVIEW,
  };
  return reviewMapping[githubReviewState] || githubReviewState;
}

async function readPRsFrom(repo) {
  const openPRs = await getOpenPRs(repo);
  const prsToNotify = openPRs.filter(pr => PrFilter.valueFor(repo, pr));

  // don't show Repo tab if there are no open PRs
  if (prsToNotify.length === 0) {
    console.log(`No open PRs on ${repo.name}. Enjoy!`);
    return;
  }

  const repoHeader = `${process.env.EMOJI_REPO_HEADER} ${prsToNotify.length} open PR(s) on *${repo.org}/${repo.name}*:\n`;
  const prNotifications = await Promise.all(prsToNotify.map(async pr => buildReviewsSummaryForPR(repo, pr)));
  return `${repoHeader}${prNotifications.join('\n\n')}`;
}

async function buildReviewsSummaryForPR(repo, pr) {
  const reviews = await getReviews(repo, pr);
  const reviewsSummary = reviews.length > 0 ? `(${reviews.length} comment(s): ${reviews.map(review => stateToEmoji(review.state)).join('')})` : '(no comments yet)';
  return `${process.env.EMOJI_PR_HEADER} <${pr.html_url}|${pr.title}> ${reviewsSummary}`;
}

async function sendPRsToSlack(repos) {
  const dayOfWeek = new Date().toLocaleString('en-US', { weekday: 'long' });
  if (environment.isProduction() && (dayOfWeek === 'Saturday' || dayOfWeek === 'Sunday')) {
    console.log(`It's ${dayOfWeek}, get some rest and leave the PRs for the next Monday ;-)`);
    return;
  }
  const introductionMessage = `${process.env.EMOJI_HELLO_MESSAGE} Happy ${dayOfWeek} team! Here are all the open PRs we have today:\n\n`;
  const notificationMessages = await Promise.all(repos.map(repo => readPRsFrom(repo)));
  const slackMessage = `${introductionMessage}${notificationMessages.join('\n\n')}`;

  console.log('Sending the following message to Slack:');
  console.log(slackMessage);

  return SLACK_WEBHOOK.send({ text: slackMessage });
}

export function run() {
  sendPRsToSlack(reposToRead)
    .then(() => console.log('Finished reporting PRs'))
    .catch(error => console.error(`Unknown error communicating with Slack: ${error}`));
}
