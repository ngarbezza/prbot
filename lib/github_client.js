'use strict';

const { Octokit } = require('@octokit/core');
const { GITHUB_API_TOKEN } = process.env;
const OCTOKIT = new Octokit({ auth: GITHUB_API_TOKEN });

async function getOpenPRs(repo) {
  const { data } = await OCTOKIT.request('GET /repos/{owner}/{repo}/pulls?state={state}', {
    owner: repo.org,
    repo: repo.name,
    state: 'open',
  });
  return data;
}

async function getReviews(repo, pr) {
  const { data } = await OCTOKIT.request('GET /repos/{owner}/{repo}/pulls/{pull_number}/reviews', {
    owner: repo.org,
    repo: repo.name,
    // eslint-disable-next-line camelcase
    pull_number: pr.number,
  });
  return data;
}

module.exports = {
  getOpenPRs,
  getReviews,
};
