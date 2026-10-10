# Known problems with a Hindsight setup

Open this file when a step of `hindsight-setup.md` does not work as expected, or when Hindsight behaves oddly in a project. Each line names something that went wrong, and what to do.

- **The text for saving had no effect.** The add-on saves under its own instruction for each kind of save, and not under the bank's general text. "Add the text for saving" in `hindsight-template-for-the-project.md` says where the text goes.
- **A wrong memory could not be removed.** The add-on cannot delete a memory. Save a correction with the add-on's tool for saving a document, titled "Correction: <topic>". Deleting is the owner's step, on the bank's page in the dashboard.
- **The summary at the start of a session stopped arriving.** Each run of the add-on's `install` sets the time limit of its hooks back to its own value. Set the time limit of the hook for the first message again.
- **The code survey started at every session start, and the summary came on the second message.** The installed add-on 0.8.0 uses Git documents to detect a new bank. With `gitIngest: "none"`, that can repeat the survey and defer the summary. Check the installed version and behavior. Report the failure and keep setup open; do not enable Git imports or disable an approved survey as a substitute.
- **A knowledge page stayed empty or old.** Inspect its last build and refresh schedule. A busy server can cause a build failure; verify whether the installed server retries it. Tell the owner. After the owner's yes, rebuild each failed page, one at a time.
- **The add-on's tools did not reach a bank that was just set up.** The tools read their settings when a session starts. Start a new session.
