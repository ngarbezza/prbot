# PR Bot

## Setup

### Requirements

* A valid GitHub API Token with scope `repo`
* A valid Slack webhook URL (for development, you can use any webhook testing utility like [webhook.site]())
  
### Configuration

This app follows the [12factor](https://12factor.net/) convention and uses [dotenv](https://www.npmjs.com/package/dotenv) to load the configuration.

1. `cp .env.sample .env` to start with a template file
2. Set the values for `GITHUB_API_TOKEN` and `SLACK_WEBHOOK_URL`
3. Repos are configured with env variables starting with `REPO_` name, and the content as a serialized JSON for the desired configuration for that repo.

For instance, if we want to see Rails' PRs with label `actionpack` we need to set up a `REPO_RAILS` with the following serialized JSON content:

Example:

```json
{
  "name": "rails",
  "org": "rails",
  "includeLabels": [
    "actionpack"
  ],
  "excludeLabels": []
}
```

You will find this example in the `.env.sample`, so you can use it as a template to change/setup another repos. Repeat this step for every repo you want to setup.

#### Repo configuration parameters

* `name`: The repo name in github, the `name` part in `https://github.com/org/name`
* `org`: The org name in github, the `org` part in `https://github.com/org/name`
* `includeLabels`: filter PRs having ALL the labels specified here
* `excludeLabels`: filter PRs having ANY OF the labels specified here

#### Slack emoji config

Emojis are customized via ENV vars starting with `EMOJI_`. All of them have default values specified in `.env.sample`. You can use one or many emojis for each section.

* `EMOJI_HELLO_MESSAGE`
* `EMOJI_PR_HEADER`
* `EMOJI_REPO_HEADER`
* `EMOJI_APPROVED_REVIEW`
* `EMOJI_CHANGES_REQUESTED_REVIEW`
* `EMOJI_COMMENTED_REVIEW`
* `EMOJI_DISMISSED_REVIEW`
* `EMOJI_PENDING_REVIEW`

#### Other configurations

* `NODE_ENV` contains the execution environment, allowed values `"development"`, `"production"`

## Notes for development

### CodeClimate

CodeClimate is set up in this project to keep track of maintenance metrics like test coverage.

### NPM scripts

This project comes with a group of useful `npm` run scripts:

* `send` used to trigger the bot.
* `test` used to run the tests with [Testy](https://github.com/ngarbezza/testy/).
* `coverage` used to run the tests and generate a coverage report.
* `lint` used to run ESLint and report the offenses.
* `lint-fix` similar to `lint` but including `--fix` to autocorrect the offenses.
* `open-coverage-report` opens the coverage result of the most recent report in a browser.
* `generate-dependencies-graph` generates a diagram of the modules' dependencies using [Madge](https://github.com/pahen/madge). This is useful to constantly measuring the complexity of this project.
