# Chapter 19: The Solo Systems Architect

*Design explicit boundaries among roles, inputs, outputs, permissions, and checks, then demonstrate that a small system can detect a broken handoff and recover without losing its authority or evidence.*

## Two completed tasks, one missing result

Maya runs a paper simulation of a more divided Fieldwork workflow. One role prepares an action list. Another checks it against the source. A final review combines their returns. The source remains synthetic, and Maya can perform every role herself before deciding whether separate assistant sessions would help.

Two documents come back. Each looks finished. The first is an action list; the second is a cleaner action list. The checker has rewritten the draft instead of returning a source comparison. The number of completed tasks matches the number she assigned, but an essential result is missing.

The revised list may be correct. Maya cannot establish which draft the checker inspected, which source version it used, or which requirements it considered. The system has confused receiving two files with receiving two different kinds of evidence.

This is a new coordination problem built around a familiar task. The bounded workflow from Chapters 17 and 18 already produces a candidate, source comparison, limited repair, and human review. Dividing that work among roles should preserve those operations.

Maya and Fieldwork remain fictional. No customer has commissioned this work, and these authored specimens are not a measured multi-agent deployment. The [system contracts](../artifacts/19-system-contracts.md) let you rehearse the same boundaries with ordinary documents, then record actual results if you choose to try separate assistants.

## Own the relationships between the parts

A systems architect decides how parts cooperate toward an outcome. In a solo practice, that includes deciding which parts should exist at all. The work is less about inventing a title for every assistant and more about identifying the conditions under which one result can safely become another task's input.

The TFIS homepage presents the Solo Systems Architect as responsible for direction and system design, and describes coordination among harnesses through a canonical vault and scoped write areas. These are the project's stated roles and architecture. They do not establish that any particular reader has implemented them by drawing a diagram. ([The Future Is Solo, n.d.-b](https://thefutureissolo.com/))

For Maya, the practical questions are direct. What exactly does the drafter receive? What must the checker inspect independently? Who resolves a disagreement? Where can each role save its work? Which result may proceed to human review? What happens if a role returns nothing, returns twice, or returns a report about the wrong draft?

Those questions remain relevant whether one person, one model, several models, or a mixture performs the operations. A manual simulation can expose an ambiguous contract before tools make the ambiguity faster and harder to see.

The existing project authority remains intact. `learning-loop-v1` selects `instructions-v3`. The charter governs permission. The knowledge map locates support. The new system contract specifies handoffs; it does not become a competing source of the task's evidence rules.

## Separate roles only when the separation helps

The previous sequential workflow may already be sufficient. Before adding a role, identify the limitation the separation is meant to address. A checker with a distinct source-comparison task might make omissions easier to inspect. Independent preparation of two unrelated sections might reduce waiting.

Anthropic's agent-building guidance describes chaining, routing, parallel work, and other arrangements while recommending that complexity follow demonstrated need. It treats these as adaptable engineering patterns. It does not establish a universal advantage for a large agent team. ([Erik S. & Zhang, 2024](https://www.anthropic.com/engineering/building-effective-agents))

Maya's immediate reason for trying a separate checker is visibility. In the single-role workflow, drafting and checking appear in one return. She wants to see whether requiring a distinct comparison record makes the review more inspectable. That is a hypothesis about her procedure, not a result already established by the example.

She keeps the alternative visible: one assistant can continue to perform the sequential workflow, with Maya reviewing its evidence. If a separate role only produces another polished version of the draft, the division has added coordination without supplying the missing check.

Write the reason for each boundary beside it. Remove a boundary that has no useful purpose. Architecture should earn its maintenance cost through the behavior it enables, rather than through the number of boxes it contains.

## Draw the route that a result must follow

![A versioned task packet feeds drafting and a source-based expectation check. The candidate and the source check are compared with exact version references. Missing, duplicate, stale, or conflicting returns go to diagnosis. A complete evidence packet reaches human review; only a scoped reviewed result proceeds.](../diagrams/system-contracts.svg)

*Figure 19.1. An original book diagram of the handoffs in the manual role simulation. Different roles can be performed by the same person. The drawing does not imply simultaneous execution or deployed agents.*

The source packet and current instruction enter two useful operations. A drafter prepares a candidate. A checker can first identify expected properties from the source, then compare the candidate against them. The evidence packet joins these returns only when their identities and versions match.

A coordinator is simply whoever tracks that join. Maya can do it with a small table. It need not be another language model. The coordinator checks whether the required artifacts exist and correspond; it does not decide that a source-supported claim is true merely because the fields are filled.

The diagram also shows a route for incomplete or incompatible returns. They go to diagnosis rather than silently continuing as success. An explicit failure route is part of the system, not an embarrassing exception to be omitted from the drawing.

## Make the handoff contract readable

A handoff contract describes what a role receives, what it may do, what it must return, and what causes it to stop or ask for review. Begin with the useful object rather than an elaborate persona.

The drafter receives the authorized synthetic source, current instruction, job identifier, and output requirements. It may create a candidate in the designated draft area. It returns the candidate's identifier and version, the source and instruction versions used, unresolved points, and the actual location if a permitted save occurred.

The checker receives the source and criteria plus the candidate it is meant to inspect. It returns a comparison report identifying that exact candidate version. Each material finding points to the source and the affected output. It may recommend a repair, but a rewritten draft alone does not satisfy its contract.

Maya receives the candidate and report with matching references. She decides whether the result meets the internal practice task, whether a correction is needed, or whether missing evidence prevents a conclusion. The later business runbook will distinguish this decision from any decision to send a deliverable to another person.

Keep the contract small enough to inspect. An identifier matters because it prevents a report from being attached to the wrong output. A source reference matters because it permits checking. A decorative job title contributes little if the returned object's required content remains unclear.

## Identify the job, source, and output separately

For the worked simulation, Maya labels the job `J19-01`. She uses the source packet from Chapter 16, preserving its five labeled lines, and identifies the supplied instruction as `instructions-v3`. The first candidate is `D19-01-v1`; the required comparison report is `C19-01-v1`.

These labels are ordinary references. You can use descriptive filenames or headings instead, provided the relationship is unambiguous. A job identifier groups the work. A source version identifies the evidence supplied. An output version identifies what was actually produced. They answer different questions.

A checker that inspected the first candidate has not automatically inspected a revised candidate. If the drafter changes row two and saves `D19-01-v2`, the earlier report still concerns `D19-01-v1`. A small repair can have consequences elsewhere, including an accidental deletion of a supported row.

Likewise, a source update is different from a draft update. If additional evidence arrives, record its relationship to the existing packet before using it. The current handling of unresolved conflicts does not prove that every apparent amendment should supersede an earlier statement. That extension still requires an authorized interpretation.

The contract should therefore carry the versions used into the return. Do not infer them from the last-modified time of a file or the confidence of a completion message. A recent report about an old candidate is still a report about the old candidate.

## Give the check its own contact with the source

A useful checker needs enough access to challenge the draft. If it receives only the drafter's summary of the evidence, it may merely confirm that summary. Maya supplies the original synthetic lines and the applicable criteria, with the draft separately identified.

She can improve the manual rehearsal by writing expected properties from the source before reading the candidate. This makes the comparison less dependent on the draft's organization. If the draft omits an action entirely, an expectation list derived from the source gives the checker a place to notice the absence.

This is procedural separation, not proof of statistically independent errors. Two sessions using the same model, prompt assumptions, or incomplete packet may agree for the same wrong reason. A second model can also miss a defect.

Anthropic's evaluation guidance distinguishes different kinds of grading and the actual outcome from a system's account of its work. It supports examining what a check establishes, with human judgment where needed. The chapter's role simulation is a small practical application, not a validated evaluator. ([Grace et al., 2026](https://www.anthropic.com/engineering/demystifying-evals-for-ai-agents))

For this task, a mechanical completeness check can detect a missing report. A source comparison can detect an unsupported owner. Maya's review decides whether the evidence packet warrants the requested use. These operations complement one another because they answer different questions.

## Use a known input to expose a new coordination problem

Maya deliberately reuses the synthetic C16 input. The purpose is to test the handoff, not claim a new demonstration of general task capability:

> C1. The coordinator agreed to upload the accessible slides by Tuesday.
>
> C2. The group suggested asking the library about a larger room. Nobody accepted that task and no timing was discussed.
>
> C3. The facilitator agreed to send the revised handout by Thursday.
>
> C4. Another note says the facilitator agreed to send the same revised handout by Friday. The packet establishes no order or supersession.
>
> C5. The group agreed to shorten the opening discussion. No owner or deadline was assigned.

The expected properties are familiar. Keep the slides commitment and “by Tuesday” deadline. Preserve the library inquiry as an unassigned suggestion. Retain the facilitator's handout action with the conflicting “by Thursday” and “by Friday” deadlines. Keep the shorter opening as an agreement with unresolved assignment and timing.

The first candidate again makes the library inquiry an agreement and assigns it to the coordinator. This authored defect makes the check's job visible.

The checker should report that C2 supports neither agreement nor ownership, identify the candidate's affected row, and request repair. Returning a corrected row may be helpful additional material. It cannot replace the comparison record that explains the finding and identifies the inspected version.

## Diagnose the duplicate return and the missing report

In the opening failure, both roles return action lists. One is labeled `D19-01-v1`; the other is an alternate draft. The coordinator counts two completed returns and marks the job ready. But the contract requires one candidate and one source comparison, not two arbitrary files.

Maya inspects the expected-artifact table. The candidate slot is occupied twice, while the comparison slot is empty. This is a duplicate deliverable category and a missing required artifact. A correct diagnosis does not depend on whether the alternate draft happens to be more accurate.

She keeps both drafts in the practice history long enough to explain what happened. She does not merge them and label the merge “checked.” She returns the checker task with the clarified requirement: identify the candidate inspected, compare every material item with C1–C5, and return findings and unresolved issues.

The repaired comparison identifies the library defect, confirms the supported slides row, preserves the handout conflict, and checks that the shorter opening has not disappeared. The drafter can then produce a revised candidate with the comparison as feedback, within the bounded repair allowance.

Maya updates the handoff contract so that completeness is checked by artifact role and target, rather than by a count of messages. This change concerns coordination. It does not alter `instructions-v3`, whose evidence rules already handled the source correctly.

## Make the repaired return inspectable

The repaired candidate contains the following content:

| Status | Item | Owner | Timing | Source |
| --- | --- | --- | --- | --- |
| Agreed | Upload accessible slides | Coordinator | By Tuesday | C1 |
| Suggestion | Ask library about a larger room | Unspecified | Unspecified | C2 |
| Agreed; timing unresolved | Send revised handout | Facilitator | By Thursday / by Friday; applicable deadline unresolved; clarification required | C3–C4 |
| Agreed | Shorten opening discussion | Unspecified | Unspecified | C5 |

The accompanying comparison names `D19-01-v2`, the C16 source, and `instructions-v3`. It identifies what changed from the previous candidate and checks the revised result against every required property. Maya can inspect the source lines without reconstructing the roles' conversation.

The revised list is a candidate until its scoped review occurs. Maya may accept this internal representation while leaving the real handout deadline unresolved. Acceptance of faithful uncertainty is different from choosing the date.

The artifact contains literal failed and repaired receipts as well as this content. If you perform the exercise, keep your actual returns. Do not replace a failed handoff with the authored sample and report that your arrangement passed.

## A valid report can become stale

Maya introduces a second deliberate handoff defect. She attaches the report about `D19-01-v1` to `D19-01-v2`. Both files are present, and the report contains detailed findings. Its target version does not match the candidate being advanced.

The coordinator should hold the join and name the mismatch. It should not assume the old check carries forward because the change was described as small. Nor should it ask the checker to rewrite the entire project. The next task is a bounded comparison of the revised candidate, including earlier properties the edit might have disturbed.

After that comparison, a new or updated report identifies the exact revised candidate. The old report remains part of the earlier attempt's history. The job record says which pair reached review.

This discipline matters when work overlaps. A fast drafter can produce another revision while a checker is still inspecting the first. You may choose to finish one cycle before beginning another, or explicitly track both. Either is clearer than letting whichever message arrives last define the current evidence packet.

For a beginner, sequential role simulation is often enough. Parallel execution can wait until the coordination costs and expected gains justify it.

## Resolve disagreement through the relevant authority

Two roles can disagree about more than version labels. A checker may insist that the library inquiry should be omitted because it is only a suggestion. The draft may retain it with a suggestion label. The current instruction allows suggestions to remain distinguishable from agreements; it does not require erasing them.

Maya compares the disagreement with the governing instruction and source. She does not take a vote or favor the role with the more authoritative title. If the instruction answers the question, apply it. If the source lacks the needed information, preserve the gap. If the task's purpose genuinely requires a new policy choice, bring that choice to the responsible person.

An escalation should say what conflicts, why the existing authority does not resolve it, and which action depends on the answer. “Need human review” is less useful than “The requested output now asks us to choose one deadline, but the supplied source and current instruction permit only an unresolved account.”

Work that does not depend on the conflict may continue within the contract. The supported slides row does not need to disappear while a deadline remains unresolved. Consequence-based boundaries allow useful progress without manufacturing the missing decision.

A role's confident recommendation remains a recommendation. Its ability to produce persuasive reasoning does not grant it authority to change the charter or current instruction.

## Plan for repeated returns and unfinished work

A task may return twice because an operator retries after an uncertain save or because a message is delivered again. The coordinator should recognize the same job, artifact role, and version rather than treating every arrival as new work to merge.

For the manual rehearsal, record the expected artifact identity in a table. When a duplicate arrives, compare it with the existing return. If it is identical, retain one active reference and note the duplicate if it matters. If the content differs under the same identity, hold the ambiguity and require a clear versioned return.

This avoids a common trap: responding to an uncertain completion by starting the whole workflow again without inspecting what already exists. First check the actual saved location. A missing return and a missing notification are different problems.

A role that cannot finish should return its state, the reason, any usable partial artifact, and the next dependency. The coordinator should not convert silence into success. Nor should it keep retrying indefinitely merely to avoid a visible hold.

Preserve the bounded repair rule from the delegation contract. If the allowed repair still leaves a material defect, escalate with evidence. Renaming the job does not create permission to exceed its limits automatically.

## Distinguish separate responsibilities from simultaneous work

Giving two operations different roles does not mean they should run at the same time. The checker cannot compare a candidate that does not exist yet. It can, however, identify source-based expected properties while drafting takes place, provided both operations use the same source and instruction versions.

That distinction reveals which part of the work is actually independent. Maya can draw one line for preparing expectations and another for producing the candidate. The comparison occurs where they meet. If she instead launches two complete action-list tasks and calls the second one checking, she has changed the output count without establishing a separate comparison.

Concurrency also creates a coordination obligation. Suppose Maya receives a corrected source packet while one role is still working from the earlier copy. Quietly replacing the shared file can leave the two returns based on different inputs. The contract should preserve the original packet for that attempt and identify the new version as a separate reviewed input change.

The person coordinating the work can then decide whether to stop and restart the affected operation or finish the earlier attempt as historical evidence. The decision depends on what changed and which output is needed. What should not happen is silently combining a draft from one source version with a check from another.

For a short task, avoiding overlap may be the simplest reliable choice. A small waiting period can cost less than reconciling ambiguous returns. For a larger task with independent parts, measured time savings may justify explicit concurrent work. The manual simulation helps you identify that possibility without pretending to have measured it already.

Record the actual route used in a trial. “Separate drafter and checker roles, performed sequentially by one person” is an accurate description. It should not become “autonomous multi-agent system” when summarized in a capability portfolio. The quality of the architecture begins with knowing what has actually been arranged and tested.

## Give each role a useful permission boundary

Low-impact drafting should proceed under the permissions already granted by the task. Maya does not need to approve every heading, candidate sentence, or source comparison individually. Those operations are the delegated work.

The boundary changes when an action would alter authority, expose information, or affect another person. The drafter may save a new candidate in a designated area when that operation is permitted. It may not overwrite the source, change the current selector, promote its own judgment into reviewed memory, or send a customer message under the same permission.

A checker may inspect the supplied source and return findings. If it proposes a correction to a reviewed rule, that proposal remains separate. The coordinator may assemble the evidence packet and track its completeness. It may not mark substantive human acceptance merely because every expected file arrived.

These boundaries should correspond to actual tool capabilities where possible. If a tool has broader access than the task requires, an isolated synthetic packet and manual copying can provide a simpler practice environment. Written restrictions alone should not be described as technical enforcement.

The architecture is useful when responsibilities are clear enough for routine work to proceed and consequential changes to reach the right decision-maker. Requiring permission for everything would hide that distinction almost as thoroughly as granting permission for everything.

## Keep memory writes from becoming a competition

Several roles may discover a useful correction. That does not mean each should write a new permanent rule. Competing summaries can turn a single observation into multiple apparently independent lessons and make later retrieval harder.

Maya lets roles propose memory candidates with their source and scope. The existing review and distillation procedure determines whether a candidate belongs in project history or reviewed reusable memory. The designated current-instruction route remains singular.

If the handoff failure changes the operating manual, she records that specific coordination decision. It need not modify the commitment-evidence principle, because the meaning of an agreed action has not changed. Maintenance follows the actual dependency affected by the observation.

A shared store therefore needs more than common access. It needs agreed roles for proposals, current decisions, historical evidence, and writes. Otherwise a shared folder can become a place where the most recent confident output overrides a better-supported record.

You can establish these rules before adopting a multi-harness system. The ordinary document simulation makes the authority problem visible without requiring a database or a new provider.

## Rehearse the roles manually and record the cost

Use the artifact to perform the drafter, checker, and coordinator roles in sequence. Write the source-based expected properties before inspecting the failed candidate. Complete the comparison, assemble the packet, and perform the human review. Then introduce the duplicate-category and stale-report defects and verify that your receipt table catches them.

If another person is available and authorized to see the material, they can perform one role. If you use separate assistants, record the actual packets supplied and the resulting artifacts. Neither option is required for the core exercise.

Measure the effort that the division adds. Preparation, transfers, checking, waiting, and repair all belong in the comparison with the simpler workflow. A faster draft may be offset by a longer coordination step. You do not need sophisticated accounting to notice that you spent most of the session reconciling versions.

Keep the architecture only if it provides a useful benefit under the conditions you observe. A source comparison that becomes more inspectable may justify some extra work. A second draft labeled “verification” does not demonstrate that benefit.

The manual rehearsal establishes whether the contract is understandable and the authored failure cases are detectable. It does not establish the reliability or speed of a deployed multi-agent system. Further delegation needs actual repeated evidence in its intended environment.

## Apply the boundary to another kind of work

A service workflow might separate proposal drafting from checking the confirmed scope. The checker needs the actual scope record, not only the drafter's account of it. A revised proposal requires a comparison tied to that revision, and external sending remains separately authorized.

An educator might separate exercise creation from examining whether the answer guide follows the source and learning objective. A second exercise is not an answer-guide check. The returned report should identify the particular exercise version and any unsupported assumption about learner performance.

A software workflow might separate implementation from review of requirements and observed checks. A review of an earlier revision cannot establish the behavior of a later change. Some checks can run automatically, while consequential acceptance remains tied to the task and its risks.

The same role labels need not fit all three. What transfers is the design question: what information must cross this boundary, what can the recipient establish from it, and what authority does the recipient actually have?

## Field assignment: make a broken handoff visible

Complete the [system contracts](../artifacts/19-system-contracts.md) for the bounded workflow you already understand. Explain why each role exists. Define its input, allowed operations, returned artifact, version references, stop conditions, and responsible reviewer.

Run the manual simulation with the supplied packet or your own authorized example. Produce the candidate and source comparison as distinct artifacts. Introduce a duplicate deliverable category, omit a required return, and attach a report to the wrong candidate version. Record the specific defect, repair, and repeated check.

Your practice passes when the coordinator can tell whether the evidence packet is complete and compatible, the reviewer can trace material findings to source, and permission boundaries remain intact. The source rules should survive the new arrangement without being copied into competing authoritative records.

Without AI, explain why two completed tasks may still leave one required result missing, why two agreeing models do not prove independent validation, and why a report must identify the output it inspected. Maya finishes with `system-contracts-v1`, a clearer handoff procedure, and a reasoned choice about whether separate roles are worth using. [Chapter 20](20-the-architecture-of-a-solo-enterprise.md) places that workflow among the other operations a prospective business would need.

## References

Erik S., & Zhang, B. (2024, December 19). *Building effective agents*. Anthropic. https://www.anthropic.com/engineering/building-effective-agents

Grace, M., Hadfield, J., Olivares, R., & De Jonghe, J. (2026, January 9). *Demystifying evals for AI agents*. Anthropic. https://www.anthropic.com/engineering/demystifying-evals-for-ai-agents

The Future Is Solo. (n.d.-b). *The future is solo*. Retrieved September 10, 2026, from https://thefutureissolo.com/

<!-- sources: anthropic2024, grace2026, TFIS-HOME -->
