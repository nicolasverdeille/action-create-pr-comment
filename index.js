const { inspect } = require("util");
const core = require("@actions/core");
const github = require("@actions/github");

// most @actions toolkit packages have async methods
async function run() {
  try {
    const inputs = {
      token: core.getInput("token"),
      owner: core.getInput("repository").split("/")[0],
      repository: core.getInput("repository").split("/")[1],
      pullRequestId: core.getInput("pull-request-id"),
      text: core.getInput("text"),
    };
    core.debug(`Inputs: ${inspect(inputs)}`);

    const octokit = github.getOctokit(inputs.token);

    const { data: comment } = await octokit.rest.issues.createComment({
      owner: inputs.owner,
      repo: inputs.repository,
      issue_number: inputs.pullRequestId,
      body: inputs.text,
    });
    core.info(
      `Created comment id '${comment.id}' on pull request '${inputs.pullRequestId}'.`
    );
    core.setOutput("comment-id", comment.id);
  } catch (error) {
    core.setFailed(error.message);
  }
}

run();
