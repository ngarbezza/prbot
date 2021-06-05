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