/**
 * This is the main entrypoint to your Probot app
 * @param {import('probot').Probot} app
 */

const piston = require("./temp");

const client = piston();

function AddComment(context, comment) {
  const issueComment = context.issue({
    body: comment,
  });
  return context.octokit.issues.createComment(issueComment);
}

module.exports = (app) => {
  // Your code here
  app.log.info("Yay, the app was loaded!");

  // Respond to issue creation or edit events with a comment
  app.on(
    ["issues.opened", "issues.edited"], async (context) => {
      // app.log.info('Issue Event listened', context);
      AddComment(context, "Thanks for working on this this issue!");
    });

  // Respond to pull request creation with '/execute' events with a comment of output in their code
  app.on(
    ["pull_request.opened", "pull_request.edited"],
    async (context) => {
      try {
        const commentBody = context.payload.pull_request.body;
        app.log.info(commentBody);
        app.log.info(commentBody !== null);
        if (commentBody && commentBody.includes("/execute")) {

          const codeSnippetRegex = /```([\s\S]+?)```/;
          const codeMatches = commentBody.match(codeSnippetRegex);
          app.log.info(codeMatches);

          if (codeMatches && codeMatches.length >= 2) {
            const codeToExecute = codeMatches[1];
            // app.log.info('Code to Execute:', codeToExecute);

            // Make a request to the code execution API
            client.execute("python", codeToExecute)
              .then(async (executionResult) => {
                // Sending it back as a comment on the pull request
                app.log.info(executionResult);
                AddComment(context, "Execution Result:\n```\n" + executionResult.run.output + "\n```");
                await context.octokit.pulls.createReview({
                  ...context.pullRequest(),
                  event: 'APPROVE'
                })
              })
              .catch((error) => {
                // Handle API request errors
                app.log.info("Error executing code:", error);
                AddComment(context, "Error executing code: " + error.message);
              });
          } else {
            // Handle case where code snippet is not found in the comment
            AddComment(context, "No code snippet found in comment!");
          }
        }
      } catch (error) {
        app.log.info("Error executing code:", error);
        // AddComment(context, "Error executing code: " + error.message);
      }
    });

  // For more information on building apps:
  // https://probot.github.io/docs/

  // To get your app running against GitHub, see:
  // https://probot.github.io/docs/development/
};
