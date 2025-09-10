# PR Bot - GitHub Copilot Instructions

**ALWAYS follow these instructions first and fallback to additional search and context gathering only if the information here is incomplete or found to be in error.**

PR Bot is a Node.js application that fetches open pull requests from GitHub repositories and sends formatted notifications to Slack channels. It filters PRs based on configurable label criteria and provides review status summaries.

## Prerequisites and Environment Setup

- **Node.js Version**: Requires Node.js 20.11.0+ (specified in .tool-versions)
- **Project Type**: ES module-based Node.js project (`"type": "module"` in package.json)
- **Main Dependencies**: @octokit/core (GitHub API), @slack/webhook (Slack integration), dotenv (environment configuration)

## Working Effectively

### Initial Setup (REQUIRED EVERY TIME)
1. **Install dependencies**: `npm install` -- completes in 18 seconds, timeout 60 seconds
2. **Copy environment template**: `cp .env.sample .env`
3. **Configure environment variables** in `.env`:
   - `GITHUB_API_TOKEN`: Valid GitHub API token with `repo` scope
   - `SLACK_WEBHOOK_URL`: Valid Slack webhook URL
   - `REPO_*` variables: JSON-formatted repository configurations (see Configuration section)

### Build and Test Commands
- **Run tests**: `npm test` -- completes in <1 second, timeout 30 seconds
- **Run with coverage**: `npm run coverage` -- completes in <1 second, timeout 30 seconds  
- **Lint code**: `npm run lint` -- completes in <1 second, timeout 30 seconds
- **Auto-fix linting**: `npm run lint-fix` -- completes in <1 second, timeout 30 seconds
- **Execute bot**: `npm run send` -- completes in <1 second, timeout 30 seconds

### Timing Expectations
- All commands are fast (<1-18 seconds)
- No long-running builds or operations
- **NEVER CANCEL** any operation - they complete quickly

## Configuration

### Repository Configuration
Configure repositories using environment variables starting with `REPO_`:

```bash
REPO_RAILS={"name":"rails","org":"rails","includeLabels":["actionpack"],"excludeLabels":[]}
```

**Configuration Parameters**:
- `name`: Repository name (the `name` in `https://github.com/org/name`)
- `org`: Organization name (the `org` in `https://github.com/org/name`) 
- `includeLabels`: Array of labels - PR must have ALL these labels
- `excludeLabels`: Array of labels - PR must have NONE of these labels

### Emoji Configuration
Customize Slack emojis with `EMOJI_*` environment variables:
- `EMOJI_HELLO_MESSAGE`, `EMOJI_PR_HEADER`, `EMOJI_REPO_HEADER`
- `EMOJI_APPROVED_REVIEW`, `EMOJI_CHANGES_REQUESTED_REVIEW`, `EMOJI_COMMENTED_REVIEW`
- `EMOJI_DISMISSED_REVIEW`, `EMOJI_PENDING_REVIEW`

## Validation and Testing

### ALWAYS Run Before Committing
```bash
npm install
npm run lint
npm test
npm run coverage
```

### Manual Testing Scenarios
1. **Configuration Parsing**: Verify .env file syntax is correct
2. **Application Startup**: Run `npm run send` - should parse config without syntax errors
3. **Expected Errors**: Without valid credentials, expect GitHub API or Slack webhook errors (this is normal)

### Complete Validation Flow
```bash
# Install and verify setup
npm install
cp .env.sample .env

# Test core functionality 
npm test
npm run lint
npm run coverage

# Test application execution (expect credential errors)
npm run send
```

## Codebase Navigation

### Key Files and Directories
- **`index.js`**: Main entry point, loads environment and calls MessageSender.run()
- **`lib/`**: Core application logic
  - `message_sender.js`: Main bot logic, orchestrates PR fetching and Slack messaging
  - `github_client.js`: GitHub API integration using Octokit
  - `pr_filter.js`: PR filtering logic based on label rules
  - `repo_configuration_parser.js`: Parses REPO_* environment variables
  - `environment.js`: Environment detection (development/production)
- **`test/`**: Test files using Testy framework
  - `*_test.js`: Unit tests for corresponding lib files
- **`.github/workflows/ci.yml`**: CI pipeline (install, lint, test, coverage)

### Common Development Tasks
- **Add new repository**: Add `REPO_NEWNAME={"name":"repo","org":"org","includeLabels":[],"excludeLabels":[]}` to .env
- **Modify filtering logic**: Edit `lib/pr_filter.js`
- **Change Slack message format**: Edit `lib/message_sender.js`
- **Add new tests**: Create `*_test.js` files in `test/` directory

## Troubleshooting

### Common Issues
- **"require is not defined"**: Project uses ES modules, use `import` instead of `require`
- **JSON parse errors**: Check REPO_* variables use valid JSON (no escaped quotes in .env)
- **Slack webhook errors**: Expected when using placeholder URLs
- **GitHub API errors**: Expected when using invalid tokens

### CI/Build Failures
- **Linting failures**: Run `npm run lint-fix` to auto-correct
- **Test failures**: Check test output, all tests should pass
- **Missing dependencies**: Run `npm install`

## Additional Commands
- **Generate dependency graph**: `npm run generate-dependencies-graph` (requires Graphviz)
- **Code complexity analysis**: `npm run churn-vs-complexity` (may have dependency issues)
- **Open coverage report**: `npm run open-coverage-report` (requires browser)

## Production Deployment
- Set `NODE_ENV=production` in environment
- Bot skips weekends in production mode
- Configure valid GitHub API token and Slack webhook URL
- Can be run as cron job or scheduled task

## File Structure Reference
```
.
├── index.js                    # Main entry point
├── lib/                        # Core application code
│   ├── message_sender.js       # Main bot orchestration
│   ├── github_client.js        # GitHub API client
│   ├── pr_filter.js           # PR filtering logic
│   ├── repo_configuration_parser.js # Config parsing
│   └── environment.js          # Environment detection
├── test/                       # Test files
├── .env.sample                # Environment template
├── package.json               # Dependencies and scripts
├── .github/workflows/ci.yml   # CI configuration
└── README.md                  # Project documentation
```