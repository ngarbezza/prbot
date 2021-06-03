require('dotenv').config();

const { Octokit } = require('@octokit/core');
const { IncomingWebhook } = require('@slack/webhook');

const GITHUB_API_TOKEN = process.env.GITHUB_API_TOKEN;
const SLACK_WEBHOOK_URL = process.env.SLACK_WEBHOOK_URL;

const OCTOKIT = new Octokit({ auth: GITHUB_API_TOKEN });
const SLACK_WEBHOOK = new IncomingWebhook(SLACK_WEBHOOK_URL);

const reposToRead = [];

for (const envVar in process.env) {
    if (envVar.startsWith('REPO_'))
        reposToRead.push(JSON.parse(process.env[envVar]))
}

console.log(reposToRead);

function stateToEmoji(githubReviewState) {
    const reviewMapping = {
        'APPROVED': process.env.EMOJI_APPROVED_REVIEW,
        'CHANGES_REQUESTED': process.env.EMOJI_CHANGES_REQUESTED_REVIEW,
        'COMMENTED': process.env.EMOJI_COMMENTED_REVIEW,
        'DISMISSED': provess.env.EMOJI_DISMISSED_REVIEW,
    };
    return reviewMapping[githubReviewState] || githubReviewState;
}

async function readPRsFrom(repo) {
    const { data: openPRs } = await OCTOKIT.request('GET /repos/{owner}/{repo}/pulls?state={state}', {
        owner: repo.org,
        repo: repo.name,
        state: 'open',
    });

    const prsToNotify = openPRs.filter(pr => {
        const prLabelNames = pr.labels.map(label => label.name);
        const hasAllIncludedLabels = repo.includeLabels.every(label => prLabelNames.includes(label));
        const hasSomeExcludedLabels = repo.excludeLabels.some(label => prLabelNames.includes(label));
        return hasAllIncludedLabels && !hasSomeExcludedLabels;
    });

    const repoHeader = `${process.env.EMOJI_REPO_HEADER} ${prsToNotify.length} open PR(s) on *${repo.org}/${repo.name}*:\n`;

    const prNotifications = await Promise.all(prsToNotify.map(async function(pr) {
        const { data: reviews } = await OCTOKIT.request('GET /repos/{owner}/{repo}/pulls/{pull_number}/reviews', {
            owner: repo.org,
            repo: repo.name,
            pull_number: pr.number,
        });

        const reviewsSummary = reviews.length > 0 ? `(${reviews.length} comment(s): ${reviews.map(review => stateToEmoji(review.state)).join('')})` : '(no comments yet)';
        return `${process.env.EMOJI_PR_HEADER} <${pr.html_url}|${pr.title}> ${reviewsSummary}`;
    }));

    return `${repoHeader}${prNotifications.join('\n\n')}`;
}

async function sendPRsToSlack(reposToRead) {
    const dayOfWeek = new Date().toLocaleString('en-US', { weekday: 'long' });
    if (dayOfWeek == "Saturday" || dayOfWeek == "Sunday")
        return;
    const introductionMessage = `${process.env.EMOJI_HELLO_MESSAGE} Happy ${dayOfWeek} team! Here are all the open PRs we have today:\n\n`;
    const notificationMessages = await Promise.all(reposToRead.map(repo => readPRsFrom(repo)));
    const slackMessage = `${introductionMessage}${notificationMessages.join('\n\n')}`;

    console.log('Sending the following message to Slack:');
    console.log(slackMessage);

    return await SLACK_WEBHOOK.send({ text: slackMessage });
}

sendPRsToSlack(reposToRead);