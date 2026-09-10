# Chapter 11: The Knowledge Distillation Pipeline

*Turn a useful conversation into a small reviewed record whose claims, decisions, reasons, limits, and source links survive saving, retrieval, and correction.*

## A clear summary can preserve the wrong thing

Maya asks an assistant to summarize a design session for Fieldwork. The response is organized and readable. It says the workshop should teach learners to assign an owner and deadline to every action, and that this approach has improved the exercise.

Both statements need attention. The current task is to preserve the evidence in supplied meeting notes, including missing owners and uncertain deadlines. Assigning them without support was the defect Maya had been correcting. And “improved the exercise” blurs several possible meanings. A synthetic output met a particular review criterion; no real learner performance has been observed.

The assistant has produced a plausible account of a productive session. It has not yet produced a reliable record for the next one.

In this fictional case, Maya has a place for proposed records, a review boundary, and a designated route to current instructions. She can therefore keep the summary in the project workspace while inspecting it. The architecture from Chapter 10 prevents a draft from acquiring authority simply because its prose looks finished.

Distillation moves a conversation across that boundary: select and reformulate material for a defined future use, preserving the distinctions a later reader needs. The resulting record should let them recover a judgment, examine its support, and correct it.

## Choose the next use before choosing the summary

A conversation can support several different records. You may need a handoff for the next session, a decision history, a reusable principle, or a set of unresolved questions. One general summary often tries to serve all of them and serves none particularly well.

Maya's immediate purpose is to preserve the reasoning behind the action-list rules and prepare a bounded check of conflicting evidence. The relevant material includes prior corrections, the current instruction route, and the uncertainty that remains. Her early brainstorming about possible business names does not belong in this record.

State the intended use before asking an assistant to extract anything. “Prepare a proposed decision record for my review, supporting the next synthetic action-list trial” is more specific than “remember this.” It tells you which omissions would matter and which material can remain in the underlying conversation without entering durable memory.

Different purposes justify different levels of detail. A session handoff needs the next task and immediate constraints. A consequential decision needs alternatives, reasons, and evidence. A reusable principle needs a clear scope and conditions under which it may fail. The same sentence may appear in more than one record, but each should identify its authority and point to the appropriate support.

Use the [distillation-record artifact](../artifacts/11-distillation-record.md) to make these choices explicit. Keep the fields that preserve meaning for the next task, including consequential uncertainty.

## Establish what you actually have

Before extracting conclusions, identify the material available for review. A full conversation, a partial export, a set of notes, and a model-generated recap provide different evidence. A recap may help locate a topic; it is not automatically a faithful substitute for the source passages that support a decision.

Maya identifies the relevant exchange and its synthetic inputs. She gives the input passages stable labels within the project so the later record can point to them. She preserves the words that establish agreements, suggestions, unknowns, and revisions. If the export omits an attachment, she marks the gap instead of pretending the conversation contains it.

A source boundary helps prevent a subtle error: treating the assistant's earlier response as evidence for the claim the assistant now repeats. The original output that invented an owner is evidence of that output's behavior. It is not evidence that the owner was actually assigned in the meeting notes.

The same principle applies to research. An assistant's paragraph about a paper is a claim to check. The inspected paper passage supports the scholarly claim, within the limits of what that passage establishes. Several paraphrases of one study remain accounts of the same study, not several independent observations.

Record which parts of the source were reviewed. If the relevant decision cannot be found, preserve “decision not established from the available material.” That may be an inconvenient handoff, but it is more usable than a confident invented resolution. It tells the next person which human judgment or missing source must be recovered.

## Extract claims before polishing the story

An assistant is often good at making scattered discussion read as a coherent narrative. That strength can conceal changes in status. A tentative suggestion becomes the agreed direction; a partial success becomes a general result; an unanswered question disappears because it interrupts the paragraph.

Begin instead with candidate statements. Keep the distinctions from the memory charter: source records, inferences, decisions, and preferences. Add the source location and scope beside each consequential statement before combining them into prose.

For Maya, “the supplied notes do not name an owner for the shorter introduction” is a claim about a synthetic source. “Making missing assignments visible may help a reviewer notice unfinished coordination” is an inference. “For this practice, preserve the unassigned action and mark ownership as not established” is a design decision. “Put unresolved items near the beginning of routine progress notes” is a scoped presentation preference if Maya actually approved it.

These statements can be related without being interchangeable. The source supports the presence of a gap. Maya's decision specifies how the exercise handles it. The inference proposes why that choice may be useful. A future test could question the inference without changing what the original notes said.

An extraction prompt should therefore ask for candidates, not declare that everything extracted is approved memory. It can request the exact supporting location, uncertainty, and any contradictory passage. Where no support is available, the assistant should label the item unsupported or unresolved. Maya then reviews the record as a proposal rather than treating the assistant's organization as a verdict.

## Keep a useful unit of meaning

A small record is easier to inspect when its statements can be checked separately. But dividing every thought into fragments can destroy the relationships that explain it. “Missing owner” is too small to guide action. A long paragraph combining owner rules, deadlines, market demand, and learner outcomes is too large to verify as one claim.

Choose units that preserve a complete decision-relevant meaning. “In the supplied practice notes, the shorter introduction is agreed, but no owner is named” contains the action, its status, and its limit. A link can supply the exact source passage. The related instruction about keeping the item visible can sit beside it as a separate decision.

Maya gives consequential entries stable identifiers within `distillation-record-v1` so the rationale can link to a particular entry. In a short note, clear section headings may be enough.

Choose the smallest unit that remains useful and understandable. When it changes, a reader should be able to locate the change without assuming every neighboring statement changed too.

This makes correction more precise. If a deadline claim proves unsupported, the source record can be corrected while leaving an unrelated formatting preference intact. A record whose statements are all fused into a single confident summary is harder to repair without rewriting the entire account.

## Preserve the reason that constrains future use

A decision without a reason may be easy to follow until the situation changes. Then the next reader must guess whether to keep it, bend it, or abandon it. A short rationale gives the decision a shape: what problem it addresses, what alternatives were considered, and which trade-off the decision accepts.

Maya's owner rule has a consequential reason. Removing every unassigned item would hide an agreement that still needs coordination. Inventing an owner would misrepresent the input. Her selected response keeps the agreed item visible and marks the assignment as unresolved. The rationale preserves both failures so that a later simplification does not restore one of them.

She does not need a complete history of every phrase considered. She needs the rejected alternatives that explain the current boundary. “Require an owner before retaining any action” and “fill in a plausible owner” are materially different from the approved behavior. A change from one synonym to another is usually less important to retain.

A rationale also needs its limits. This rule concerns representing supplied commitments in a synthetic exercise. It does not tell a facilitator how to negotiate an assignment with real participants, and it does not authorize an assistant to contact anyone. Those are separate tasks requiring their own context and decisions.

When distilling a discussion, ask what a competent future reader might otherwise infer incorrectly. Preserve the reason that blocks that mistake. This is often a better guide to what belongs in durable memory than asking which sentences sound most insightful.

## Work through a conflict without inventing its resolution

Maya now creates a new synthetic practice case. It extends the existing workshop design inquiry; it is not a report of a real meeting. One supplied passage says, “The group agreed that the facilitator will circulate the revised action list on Thursday.” A second passage says, “The group agreed that the facilitator will circulate the revised action list on Friday.”

The packet supplies no reliable order of revision and no statement that either passage replaces the other. Both name the same action and owner. They conflict about the deadline. A later paragraph in a document is not, by itself, evidence of a later authorized decision.

The assistant's first candidate record selects Friday and says the schedule was clarified. Maya can see exactly what went wrong: the output supplied a relationship between the passages that the input did not establish. It treated one statement as superseding the other without support.

She separates the extraction into two source claims and one unresolved conflict. Each source claim points to its own passage. The conflict entry says that the applicable deadline cannot be determined from the supplied material. Her design decision is to preserve both statements and require clarification before presenting a single confirmed deadline.

The repaired record does not need to be indecisive about everything. The action and named owner are consistent across the supplied passages. Maya can retain those points while marking the deadline unresolved. Preserving uncertainty precisely means locating it, not spreading a vague doubt across the whole task.

She then reviews a second candidate output. It keeps the shared action and owner, displays both deadline statements, and asks which applies. The record describes that bounded synthetic result. It makes no claim that all conflicts can be detected or that real-world clarification has occurred.

## Distinguish a correction from a change in the world

Not every new statement supersedes an old one in the same way. Sometimes a saved record misrepresented its source. Sometimes the source itself was corrected. Sometimes an authorized person made a new decision. Sometimes two accounts still disagree. A memory that treats all four as “updated information” loses the reason for the change.

In Maya's synthetic conflict, the first candidate record was wrong to claim that Friday had been confirmed. Correcting that record does not change the fictional meeting. It changes the accuracy of the account. The underlying passages still disagree.

If a later authorized clarification were actually supplied, it could establish the applicable deadline. That would be a new piece of evidence or decision, with its own source and scope. Maya should not invent that future event merely to complete the example. Her current record stops at the unresolved conflict and the approved procedure for handling it.

Use plain change notes. “Corrected unsupported claim that Friday superseded Thursday; no superseding instruction exists in the supplied packet” explains more than “updated deadline.” It tells the next reader why the previous sentence should no longer be used.

This distinction matters outside the workshop. Correcting a transcription error is different from receiving a new project requirement. A revised research interpretation is different from a retracted source. A changed preference is different from discovering that the preference was never approved. The useful memory preserves enough of the change's origin to guide later reliance.

## Leave some material outside the lasting record

A useful distillation excludes as well as retains. The source may include an abandoned suggestion, a personal aside, or an operational detail that helped the conversation but has no purpose in the next task. Keeping it simply because it is available expands the material someone must review and manage.

Maya does not preserve speculative descriptions of her future customers as if they were evidence. If a sentence helps explain why she chose a hypothesis to investigate, she can retain it with that status. If it adds no useful distinction beyond the claims ledger, a link is enough. She also leaves temporary formatting experiments outside the durable record unless one became a scoped preference she explicitly chose to keep.

Exclusion should not remove the evidence of a consequential error merely because it looks untidy. The rejected Friday claim matters because it shows the unsupported supersession assumption. A repeated sentence offering encouragement may not. The judgment concerns future use and accountability, not whether the passage makes the project look successful.

When relevant material cannot be retained, record the limitation at the appropriate level. An unavailable attachment means the claim depending on it remains unverified from this record. Do not replace the missing source with a reconstructed quotation. A memory can honestly preserve a dependency it cannot currently satisfy.

The charter continues to govern these choices. Distillation does not create new permission to retain or share material. A smaller record may still contain an inappropriate detail, while a longer authorized source may be necessary for a legitimate review. Selection must consider purpose and permission as well as length.

## Let human review decide what becomes authoritative

Extraction can be delegated before authority is delegated. An assistant may assemble candidate claims, locate conflicting passages, and propose wording. Maya remains responsible for approving the consequential meaning of the record in this exercise.

The TFIS experiment deck's Daily Court v2 entry describes a division of labor in which agents gather evidence, humans judge its meaning, and scripts apply resulting changes deterministically. It also lists further work connecting the procedure to a shared vault. This is a reported operating idea and development account, not independent proof of compounding gains or completed integration. ([The Future Is Solo, 2026, slide 33](https://docs.google.com/presentation/d/1dvbBGs22QvtGogevZ6f5mf8YQE7WDAPBwYlclhTyctI/edit#slide=id.g3f2637d0be9_0_0))

Applied here, the division gives each step a concrete output. The assistant produces a proposed record with links. Maya checks the consequential claims and decides which wording may be retained. A simple tool may later copy an approved record or check that required fields exist. None of those operations should silently stand in for the others.

Review must be possible at the scale you choose. A hundred polished claims with vague links can be harder to verify than the conversation they replaced. Begin with the few statements that will affect the next task. Expand the batch only when you can inspect it without losing the distinctions that matter.

Maya approves the repaired account of the synthetic conflict and its handling rule. She does not approve a confirmed Thursday or Friday deadline, a claim about customer need, or a promise of universal conflict detection. The approval has an object and a scope. Recording those makes it easier to prevent later summaries from expanding it.

## Compress only after the distinctions survive

Once the candidate statements have been checked, the record can become shorter and more readable. Combine repeated wording, remove conversation logistics, and keep the explanation close to its evidence. Compression should reduce unnecessary repetition while preserving what another task needs.

Anthropic's context-engineering guidance describes conversation compaction and structured notes as ways to continue work beyond a single context window. It also warns that overly aggressive compaction can remove details whose importance becomes apparent later. This is laboratory engineering guidance about managing model context, not a guarantee that a summary retains every consequential distinction. ([Rajasekaran et al., 2025](https://www.anthropic.com/engineering/effective-context-engineering-for-ai-agents))

Maya tests a short version of the conflict record: “Preserve unresolved deadline conflicts; request clarification.” It captures the main instruction but omits why the two source statements remain unresolved. For a task instruction, that may be enough when the source packet is attached. For a durable rationale, it is incomplete.

Her retained explanation adds that the supplied passages establish no ordering or supersession. It links to both and identifies the unsupported assumption in the rejected candidate. The record is still brief, but it now supports a future reader who needs to understand the decision.

Measure compression against the intended use. Can a reader recover the governing choice, the support, the uncertainty, and the next action? If those disappear, the shorter record has failed even if every sentence is grammatical. Keep a route to the source so that later work can recover detail the present distillation did not need.

## Save the approved record in the lane it earned

The approved distillation belongs first in the Fieldwork project workspace because it concerns this specific synthetic case. It does not automatically become a broad reusable principle. Maya can later propose an update to `commitment-evidence-principle-v1` if the new case reveals a material omission, but that proposal receives its own scope review.

The current task instructions also remain separate. Maya prepares a proposed revision adding the conflict-handling behavior, checks it against the repaired example, and approves that revision for this practice. She saves it as `instructions-v3` and updates the existing pointer in `learning-loop-v1`. The distillation record links to that decision; it does not compete with the pointer. The chapter artifact supplies the literal instruction and pointer for inspection.

The previous instruction version becomes superseded, with a note that the new version adds handling for unresolved contradictory deadlines. The earlier rules about owners, suggestions, and imprecise timing remain in force. A useful update should not accidentally erase solved cases while addressing the new one.

The rationale record receives a link to the new distillation because it now explains another important boundary. The reviewed general principle can remain unchanged if it already captures preserving unsupported commitments and unknowns. Maintenance should follow actual dependencies instead of rewriting every document to signal activity.

Write the destination and authorized change before performing the save. This gives the later verification something specific to inspect. “Remember the lesson” has no definite stored outcome. “Save this approved project record, preserve the source links, and update this existing pointer to the approved instruction version” does.

## Verify the write from the stored state

An assistant's statement that it saved a correction is evidence that it made that statement. It is not sufficient evidence that the intended record exists in the intended location with the approved wording.

The Functional Life explicitly emphasizes verifying durable writes rather than relying on an agent's self-report. This book applies that principle to ordinary document work: reopen the saved record, inspect the actual content, and follow the route the next task will use. ([The Future Is Solo, n.d.-a](https://life.thefutureissolo.com/))

Maya closes the editing view and opens `distillation-record-v1` from the project index. She checks the two source claims, the unresolved conflict, the approved handling decision, and the linked evidence. She then follows `learning-loop-v1` to confirm that it identifies the approved new instruction version. The old candidate's Friday claim remains marked as rejected where it is retained for explanation.

This distinction between a transcript and the resulting state also appears in Anthropic's guidance on agent evaluation. A system's account of what it did and the actual state left in the environment are different objects to inspect. ([Grace et al., 2026](https://www.anthropic.com/engineering/demystifying-evals-for-ai-agents))

The optional manifest checker from Chapter 10 can detect missing or changed listed files relative to a supplied manifest. It cannot determine whether Maya approved the meaning or whether the source supports the claim. Reopening and reading remain necessary for those checks. If the save is correct but the current pointer is stale, repair the pointer; if the source link is broken, repair the dependency before calling the record usable.

## Challenge the distillation with a fresh reading

The last check asks whether the saved record can support future work without the original conversational momentum. Open it in a fresh session, or set it aside and return without the earlier windows in view. Ask for the applicable decision, the reason, and the unresolved issue.

Maya first performs the check herself. She can explain that the two deadlines conflict because no superseding relation was supplied. She can identify the approved response: retain the shared action and owner, show the conflict, and request clarification. She can also say what has not happened: nobody has established the correct deadline.

She then uses a changed synthetic input. This time the conflicting statements name Tuesday and Wednesday. The names of the days differ; the missing relationship between the statements remains. A correct application should preserve the conflict rather than repeat Thursday and Friday from the saved example.

She also repeats an earlier missing-owner case. A new instruction that handles contradictory deadlines but invents an owner has not preserved the earlier correction. This is a small regression check: inspect whether a previously accepted behavior still holds after a change. It does not require claiming statistical reliability from two practice cases.

Record retrieval and application separately. The assistant may quote the correct rule and still choose a date. Or it may fail because the new session was supplied the superseded instruction. Those failures require different repairs. A useful distillation procedure leaves enough evidence to locate the problem rather than encouraging another round of general advice.

## Keep the procedure affordable to maintain

Reviewing every sentence from every conversation would overwhelm most solo workers. Distillation should follow the importance and reuse of the material. A decision that will guide several future tasks deserves more care than a disposable wording suggestion.

Maya selects the conflict case because it changes the instructions. She does not create a durable record for every harmless variation in the assistant's phrasing. She retains selected failed outputs that explain consequential corrections, while leaving repetitive attempts outside the lasting working set according to her charter.

You can ask an assistant to propose candidates at the end of a bounded task: decisions that changed, assumptions still unresolved, corrections likely to recur, and evidence needed for the next attempt. Review the selection as well as the wording. An important omission can matter as much as an inaccurate included statement.

When the review queue grows, reduce the number of items being promoted or narrow the purpose. More extraction is not necessarily more accumulated understanding. The earlier capacity lesson still applies: generating candidate records faster than you can review them creates a backlog of unearned authority.

For service work, prioritize changes to agreed scope and the reasons behind delivery decisions. For education, preserve the distinction between observed learner work and a proposed teaching explanation. For software, retain the reported behavior, suspected cause, approved change, and observed test result as distinct statements. These applications differ in detail but share the need for a reader to recover what the record actually establishes.

## Field assignment: produce one record worth retrieving

Choose a completed discussion that contains a consequential correction or decision. Use synthetic material if you do not have permission to retain the real source. Complete the [distillation record](../artifacts/11-distillation-record.md), identifying the intended future use and the exact material available for review.

Extract a small set of candidate claims and decisions. Check the source links, preserve disagreements, and retain the reason that constrains each important decision. Mark unsupported statements for revision or exclusion. Approve only the wording and scope you can defend, then save it in the appropriate lane.

Reopen the stored record from the route a future task will use. Verify its content and links, and inspect any current-version pointer you changed. Use a fresh input to test whether the retained lesson guides the intended behavior. Include an earlier case when the new instruction could disturb a previous correction.

Without an assistant, explain the difference between correcting a record and receiving a new decision. Explain why repeated summaries of one source are not independent evidence. Show where your record preserves an unresolved question rather than resolving it by style.

Your practice passes when a future reader can identify the claims, their support, the approved decisions, their reasons and limits, and the uncertainty that remains. Repair a missing dependency, an overbroad statement, or an incorrect pointer before promoting more material. A failed fresh attempt should return to the relevant evidence and review step.

Maya keeps `distillation-record-v1`, reviewed `instructions-v3` reached through the existing pointer, and the rationale connecting this conflict case to earlier corrections. [Chapter 12](12-the-personal-knowledge-graph.md) makes those relationships easier to navigate while preserving what each connection actually establishes.

## References

Grace, M., Hadfield, J., Olivares, R., & De Jonghe, J. (2026, January 9). *Demystifying evals for AI agents*. Anthropic. https://www.anthropic.com/engineering/demystifying-evals-for-ai-agents

Rajasekaran, P., Dixon, E., Ryan, C., & Hadfield, J. (2025, September 29). *Effective context engineering for AI agents*. Anthropic. https://www.anthropic.com/engineering/effective-context-engineering-for-ai-agents

The Future Is Solo. (n.d.-a). *The functional life* (Field Manual No. 01). Retrieved September 10, 2026, from https://life.thefutureissolo.com/

The Future Is Solo. (2026). *The Future Is Solo 20260910* [Google Slides presentation]. https://docs.google.com/presentation/d/1dvbBGs22QvtGogevZ6f5mf8YQE7WDAPBwYlclhTyctI/edit

<!-- sources: grace2026, rajasekaran2025, TFIS-LIFE, tfis-experiments-20260910 -->
