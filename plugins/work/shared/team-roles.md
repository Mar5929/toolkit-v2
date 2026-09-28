# Team roles and team size

What each helper role does and returns, and how to size a design or build
team for one work item.

The main agent sizes the team fresh for each item. The owner decides and
steers; he cannot judge which internal helpers a small item needs, so he is
not asked about the small team:

- The small team for the item's kind (the first row of each example table
  below): the main agent picks it and states it in one line ("Design team: one
  requirements analyst, one architect, one critic, and a researcher when a
  question is open."). No question.
- A larger team: the main agent proposes it, and the owner agrees or changes
  it before any agent starts, unless the item already records his
  team-arrangement answer from `work-delegate`. That answer saves a repeated
  question; it does not approve a product decision, a design, or a result.

## The roles

| Role | Agent | What it does | What it returns |
| --- | --- | --- | --- |
| Requirements analyst | `requirements-analyst` | Reads the requirements as one whole, inside the larger system, and walks the flow start to finish as the person who uses the result | Ready or not ready, then missing pieces, places not explicit end to end, wording a builder could misread, build details inside requirements, and drift from the Agreed goal, each with a fix |
| Researcher | `researcher` | Answers one bounded question from project evidence, official documentation, and community sources | An answer, then findings labeled official documentation, project evidence, or community claim, each with source and date |
| Design architect | `design-architect` | Writes or fixes one design option | The draft, and after each fix round a list of what changed by requirement |
| Design critic | `design-critic` | Checks one draft against every requirement and the writing rules | One verdict per requirement (satisfied, partly, not), then findings with fixes |
| Builder | `builder` | Builds one planned task in its own worktree and runs its checks | What changed, the tests run and their result, the commit on its branch, and anything it could not do |
| Acceptance checker | `acceptance-checker` | Checks a finished result against each acceptance check and the design's Acceptance checks, or a build plan before the build; never the agent that built it | One verdict per requirement (met, partly met, not met) with evidence, defects seen in the diff, and checks that could not run; for a plan, each finding by task id |

In Codex, each agent's full text is in the skill folder as
`references/agent-<name>.md`.

Narrower briefs for the same roles:

| Brief | When to add it | Given to |
| --- | --- | --- |
| Existing-build survey | The project is not new and nobody in this session has read what exists for this area | A researcher: map what the current build does for these requirements, with file paths, and where it falls short of the goal |
| Domain specialist | The platform has its own method, for example `sf-architect-solutioning` in a Salesforce project | The main agent opens that skill and passes its findings to the architect |
| Experience walk | The requirements describe a flow with several steps or screens | The requirements analyst before design, and the critic after: walk the flow start to finish as that person and report where it breaks |

## How to size a team

Weigh, in the context of what is being built:

- how many requirements there are, and how many are unclear;
- how many systems, platforms, or teams the result touches;
- whether a build already exists, and how much of it the result changes;
- how many design options the owner wants;
- how much is unknown about the platform, the version, or the data.

Then pick a team, say why each role and count is there, and say how many
agent runs the first pass takes. Cut what the item does not need. A small
design still gets one requirements analyst and one critic: those two make the
design loop stop for the right reason. A design with no critic is allowed
only in a session with no agent tool, or when the owner said no to helpers.
Then the reply and the design's Notes say that no critique ran.

Owner-led delivery is not a no to helpers. "Owner-led", "no agent team", or
"keep it owner-led" answers the delivery offer: the owner steers each step
instead of a team running the whole goal. The design critic and the
acceptance checker still run. Only his words about the check itself ("no
helper agents at all", "skip the independent check") remove them.

## Example teams for a design

Starting points, not rules.

| Item | Requirements analyst | Researchers | Architects | Critics |
| --- | --- | --- | --- | --- |
| Small: up to 5 clear requirements, one platform, one option, nothing built yet | 1 | 1 | 1 | 1 |
| Medium: 6 to 15 requirements, or two platforms, or two options, or an existing build | 1 | 2 to 3, one per open question, plus the existing-build survey | 1 per option | 1 |
| Large: more than 15 requirements, three or more platforms, three options, or a rewrite decision | 1, with the experience walk | 3 to 5, one per open question | 1 per option | 1 per option |

## Example teams for a build

| Item | Builders | Acceptance checkers |
| --- | --- | --- |
| One task, or tasks that must happen in order | 0 (the main agent builds) or 1 | 1 |
| Several independent tasks | 1 per independent task, each with its own files (in Codex, each in a worktree the main agent makes first: `helpers.md`, section 2) | 1 |

## What the owner sees

The small team: one line naming it. A larger team: a short list of role,
count, and one line on what each reads and returns, and the question whether
to run it. The owner can cut, add, or change any role. Record the team, for a
design or a build, in the item's Notes > Decisions and context.
