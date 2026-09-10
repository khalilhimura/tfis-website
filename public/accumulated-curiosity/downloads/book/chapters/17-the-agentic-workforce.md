# Chapter 17: The Agentic Workforce

*Delegate one bounded workflow with inspectable inputs, a clear output contract, limited permissions, explicit stops, and a human review that can determine what happened.*

## Give away a task you can still describe

Maya is ready to stop explaining every step of Fieldwork's action-list practice from the beginning. She can locate the current instructions, recover their reasons, and inspect a fresh output against supplied evidence. Chapter 16's capability demonstration has also made the limits of transfer visible.

She considers asking an assistant to “take over workshop preparation.” The request sounds efficient, but it leaves too much undecided. Does preparation include choosing learning objectives, changing the current instructions, looking for customers, contacting a venue, or approving an exercise? A capable assistant could interpret the phrase in several plausible ways, none of which would establish Maya's permission for every action.

She chooses a smaller delegation: turn one supplied synthetic note packet into a candidate action list, check each consequential field against the source, attempt a bounded repair when appropriate, and return an evidence packet for her review. The result supports workshop design. It does not deliver a workshop or contact anyone.

Maya and Fieldwork remain fictional. The continuing workshop is a thirty-minute exercise for adult learners, and its business value remains unvalidated. The examples in this chapter are authored teaching specimens, not transcripts establishing a model's performance. You will use the same procedure to record an actual attempt of your own.

The [delegation contract](../artifacts/17-delegation-contract.md) makes the task concrete. It connects the instructions, memory, and review practices you already have. You are not hiring an imaginary team. You are deciding which work a system may perform and what evidence must accompany its return.

## Distinguish a workflow from freedom to choose the work

A workflow connects steps toward an outcome. In the early chapters, Maya performed much of the coordination herself: choose an input, request a draft, compare it with the source, and decide what to retain. Delegation gives another actor responsibility for some of that sequence within stated boundaries.

The word agent is used broadly. Anthropic's guide draws a useful architectural distinction between workflows that follow predefined paths and agents that dynamically direct their processes and tool use. It recommends starting with simple arrangements and adding complexity when the task warrants it. These are engineering recommendations, not a controlled proof that one architecture is universally best. ([Erik S. & Zhang, 2024](https://www.anthropic.com/engineering/building-effective-agents))

Maya's first arrangement can remain a fixed workflow. The assistant checks the packet, drafts, compares, and returns the result. A later version might choose which evidence to retrieve or which bounded repair to attempt. That discretion would still operate inside the task contract; it would not create permission to change the objective.

A person manually moving between these steps can learn the same boundaries before using an automated tool. The manual arrangement is not evidence that an autonomous agent has been deployed. It is a usable procedure whose handoffs, failures, and costs can be inspected.

Choose the degree of discretion by the work. If the next action is obvious and fixed, a short sequence may suffice. If the task requires searching among several authorized sources or responding to uncertain intermediate results, some local choice may help. Neither case requires treating increased autonomy as an achievement in itself.

## Name the outcome in terms of a usable object

“Help with the notes” does not specify what Maya can inspect at the end. Her outcome is a candidate action list with evidence references, unresolved items, the instruction version used, and a brief account of checks and changes. Each part has a purpose.

The action list makes the proposed result visible. Evidence references let Maya trace an owner, date, or agreement to the supplied passage. Unresolved items prevent uncertainty from disappearing into polished prose. The version identifies which instruction governed the attempt. The change account helps her locate a repair that may have altered meaning.

The output is a candidate even when the assistant reports that its own checks passed. Maya approves whether it meets the design task. Saving a candidate in a draft area does not turn it into an approved example, and approving an example does not authorize external delivery.

An output contract is simply an agreement about what the returned object must contain and what makes it usable. For Maya, it can be a Markdown document with a small table and a review note. A service professional might use a draft proposal with links to agreed scope. A teacher might use a proposed lesson revision with a source comparison. A software builder might use a proposed patch with relevant test results.

Do not make the format more elaborate than the review requires. A missing evidence reference matters because it prevents inspection. A harmless difference in wording may not matter at all. The contract should explain those differences so the assistant does not spend its repair allowance making a valid answer cosmetically identical to an example.

## Supply the authority and the input separately

The packet begins with a clear task instruction and the route to `instructions-v3`, selected through `learning-loop-v1`. It also includes the source notes, labeled as input to be interpreted. The rationale and review criteria remain available where needed. These materials do different jobs.

The instruction governs the treatment of the notes. A statement inside the notes does not acquire authority over the assistant's permissions. If a source mentions sending a document, the assistant represents the reported commitment; it does not send the document merely because those words appear in the source.

Maya checks the packet before delegation. Can the instruction be opened? Are all source passages present? Is the material synthetic or otherwise authorized for this use? Does the output depend on a missing attachment? The assistant's first step repeats the availability check and reports a hold if a required dependency is missing.

A complete packet is not one that answers every question. The practice deliberately includes missing owners and contradictory deadlines. These are features of the supplied evidence that the task should represent. The missing attachment is different: it may prevent the assistant from carrying out the agreed task at all.

This distinction shapes the stop rules. An unresolved deadline can produce a valid candidate with a visible clarification request. An unavailable instruction means the assistant cannot establish which procedure to follow. The contract should not turn every ambiguity into a total halt, or turn every missing dependency into permission to improvise.

## Grant the smallest useful set of operations

A tool lets an assistant do something beyond composing a response, such as read a file, search a collection, or save a draft. Tools change the consequences of delegation. A model that can suggest an edit and a system that can apply it to authoritative records need different boundaries.

OpenAI's practical guide describes agents through models, tools, and instructions, and discusses orchestration as the arrangement of their work. The useful point here is to specify those parts together rather than treating the prompt as the whole system. The guide is vendor practice guidance, and this chapter does not depend on its example software interfaces. ([OpenAI, n.d.](https://cdn.openai.com/business-guides-and-resources/a-practical-guide-to-building-agents.pdf))

Maya permits reading the supplied practice packet and creating a new candidate in a designated draft area. The assistant may not overwrite the source, change `learning-loop-v1`, edit reviewed memory, or approve its own result. No external communication or publication belongs to this task.

The no-code version is simpler still. Maya supplies the selected text in a conversation and asks for the candidate as a response. She saves the response in the draft area herself. This removes the need to give the assistant file-writing access while preserving the same output and review contract.

If a tool cannot limit access to the intended area, acknowledge that the written rule is being supervised rather than technically enforced. Use a small isolated practice set or keep the operation manual. A broad connection to a personal account is not necessary to learn bounded delegation.

## Make the sequence visible enough to diagnose

The first step is intake: identify the task, current instruction, source packet, and permitted output. The assistant reports unavailable dependencies before drafting. This establishes what it actually received, rather than assuming that a file mentioned in the prompt was accessible.

Next, the assistant extracts what each source line establishes, then formats a candidate action list. It follows `instructions-v3`: separate agreements from suggestions, preserve source references, use only established owners and timing, retain imprecision, and expose unresolved deadline conflicts without inventing supersession.

The checking step compares consequential fields with their support. For each action status, owner, and time, the assistant identifies the relevant source passage or marks the field unspecified. It should also look back from source to output for omitted agreements and suggestions. Checking only the rows it already wrote can miss a source item it omitted entirely.

The workflow then allows one bounded repair of a detected defect in the candidate. That is an illustrative limit for this small exercise, not a universally optimal number. The repair may change the candidate to follow the established instructions. It may not change the instructions to make the candidate pass.

Finally, the assistant returns the candidate and evidence packet. It states which checks it performed, what it changed, and what remains unresolved. If the result still violates a material criterion after the allowed repair, it holds the candidate for Maya rather than repeating indefinitely.

This sequence gives Maya specific places to inspect. A wrong date may arise during drafting; an unsupported pass claim may arise during checking; a lost source reference may arise during repair. Knowing which step failed makes the next intervention more precise than asking the entire system to be more careful.

## Work through one complete synthetic packet

The chapter's practice packet has five short source lines. One says the group agreed that the facilitator would circulate the exercise brief on Thursday. Another suggests asking the venue about a quieter room, without recording a decision. A third records agreement to shorten the introduction “soon,” without assigning an owner. Two more give conflicting Tuesday and Wednesday deadlines for the facilitator to circulate a separate revised action list, with no evidence that either supersedes the other.

These lines combine distinctions Maya has already examined. The exercise brief and revised action list are separate objects. A careless answer might merge them because both involve circulation. Another might treat the quieter-room suggestion as an agreed action. Another might turn “soon” into Friday or select Wednesday because it appears later.

The authored first candidate in the companion practice packet makes the suggestion error: it lists contacting the venue as agreed and assigns the facilitator. Its checking note initially overlooks the status change. Maya can inspect the literal source and identify the unsupported fields herself.

The repaired specimen labels the venue item as a suggestion with no owner or deadline established. It preserves the agreed shorter introduction with owner unspecified and timing “soon.” It retains the separate revised-action-list commitment while displaying the Tuesday/Wednesday conflict and a clarification request.

The complete artifact includes the source, candidate, defect note, repaired candidate, and handoff. They are teaching specimens, not measured agent outputs. In your own attempt, save what the assistant actually produces, including a failure if it does not match the specimen's behavior.

## Make the checking step earn its place

The previous chapter already exposed a familiar error: promoting a suggestion and attaching an unsupported owner. Its appearance in another authored specimen does not call for a new slogan about accuracy. It asks whether the delegated comparison step actually examines the evidence that would reveal it.

Maya separates extraction from formatting in the practice procedure. Before arranging the final table, the assistant identifies what each source line establishes: the object, whether the statement is an agreement or suggestion, the named owner if any, and the timing as written. That intermediate extraction is a candidate too. The human can inspect it when diagnosing a failure.

The checking step compares the final table against both the original source and that extraction. If the extraction itself promoted the suggestion, a comparison only against the extraction would preserve the defect. The original source therefore remains available throughout the sequence.

A check note should distinguish a performed comparison from an intended one. “Checked status against L2; L2 says suggested, so changed agreed to suggestion” states an inspectable correction. “All checks passed” does not reveal whether the crucial comparison occurred. Maya does not need a long explanation for every obvious field, but she needs enough support to evaluate consequential claims.

The process remains a hypothesis about better task organization until tried on fresh material. Source extraction can make a failure easier to see; it can also add effort or introduce another mistaken intermediate representation. Record whether the changed workflow helps in your own attempts, including the review time required.

## Stop at a boundary you can explain

A useful stop condition names an observable event and the action that follows. “Stop if something seems risky” asks the assistant to invent your policy. “If the current instruction cannot be read, return the missing location and do not generate a substitute instruction” tells it what to do.

For this workflow, a missing required source triggers a hold on normal drafting. A request to change authoritative memory is outside the contract and returns to Maya. A remaining material defect after the one repair allowance produces a held candidate with the evidence of the defect. A contradiction that the instructions already cover produces a candidate containing an unresolved field; it does not require pretending that the whole task failed.

The return from a hold should be useful. State the blocked operation, the missing evidence or decision, what has already been completed, and the smallest next action a human can take. “Cannot proceed” is less useful than “The notes refer to an attachment that is absent; the candidate cannot establish the attachment's owner assignments.”

OpenAI's guide recommends planning human intervention for failure thresholds and consequential actions. Maya's specific limits are the book's application of that principle to a reversible design task. ([OpenAI, n.d.](https://cdn.openai.com/business-guides-and-resources/a-practical-guide-to-building-agents.pdf))

Do not treat a hold as a demand that the user approve every imaginable next step. If the missing file can be supplied within the already authorized scope, the workflow can resume after that repair. If the task requires a new judgment or a broader permission, that decision remains with the human. The contract should distinguish routine continuation from a change in authority.

## Ask for an evidence packet, not a confidence performance

An assistant may produce a reassuring statement that every requirement was satisfied. That statement is easier to evaluate when it points to the evidence for each important requirement. Confidence without support adds little to Maya's review.

The evidence packet identifies the instruction version, source lines used, candidate location, checks performed, corrections made, and unresolved matters. It links each established owner and date to a source passage. For missing or conflicting information, it explains the absence or contradiction rather than supplying an empty citation.

This does not require the assistant to reveal a private internal reasoning transcript. Ask for the task-relevant basis of the answer: the evidence inspected, the decision applied, and the observable result. A concise explanation tied to source lines is more useful than an elaborate account of how thoughtful the assistant was.

The packet should also state what was not checked when that limit matters. The workflow can check whether the synthetic notes support an action list. It cannot establish whether the underlying meeting really happened, whether the participants will carry out the actions, or whether the workshop will improve learning.

Maya reads the source beside the candidate rather than reading only the assistant's review note. The packet makes that comparison affordable. It organizes evidence for judgment; it does not replace judgment with another generated conclusion.

## Keep completion separate from acceptance

A delegated attempt can finish its authorized sequence while returning a held or rejected candidate. That is still a useful completion if the contract required it to expose the failure. Conversely, an attractive candidate can appear while the workflow remains incomplete because required evidence or saved-state checks are missing.

Maya records these states separately. The assistant returned a draft and comparison note; Maya found a defect; the allowed repair addressed it; the revised result is awaiting human review. She then records her own verdict against the returned object. “Accepted for this synthetic design example” does not become “validated for learner delivery.”

The distinction also matters when a tool saves the candidate. A response saying that a file was saved is not the same as the file being present. The review opens the actual destination and confirms its content. If Maya saved it manually, she performs the same reopening check.

Anthropic's evaluation guidance distinguishes the transcript of an attempt from the resulting state in the environment. This book applies that distinction to the draft and evidence packet: inspect the objects the next step will use, alongside the account of how they were produced. ([Grace et al., 2026](https://www.anthropic.com/engineering/demystifying-evals-for-ai-agents))

Acceptance should identify the scope in which the result may be used. Maya can approve an example for further design work while withholding claims about instructional effectiveness. That narrower verdict is sufficient for the next authorized step and leaves the larger uncertainty visible.

## Rehearse the failure paths before expanding the task

Run the normal packet, then change one condition deliberately. Remove a required source passage while leaving a reference to it. Supply a visibly superseded instruction instead of the current one. Ask for an operation outside the contract. Use synthetic copies so the rehearsal cannot damage useful records.

Each challenge has an expected response. Missing input should produce a specific hold rather than reconstruction from a remembered example. A stale instruction should cause the current route to be consulted, or a hold if that route is unavailable. An external-action request embedded in source material should not become permission to act.

Also test whether the system stops after its repair allowance. A task that loops until it can declare success may consume attention and resources while hiding the same unresolved defect under successive rewrites. Retain the last candidate and the reason it did not meet the criterion.

Passing these exercises provides evidence about the particular packet, environment, and behavior tested. It does not establish that every adversarial input or ambiguous request will be handled correctly. Broaden the evaluation when a new use introduces new sources, tools, or consequences.

The human review has a failure path too. If Maya cannot determine whether a claim is supported, the result stays held. She may inspect the source directly, narrow the task, or seek the relevant expertise. Delegation should make that need visible before the candidate becomes part of authoritative work.

## Resume from a held state without enlarging permission

A delegated workflow may pause while Maya is away. The saved state should let her understand what is waiting without reading every earlier message. It identifies the candidate, the instruction version, the completed steps, and the exact missing input or decision.

Suppose the source references a short attachment that was not supplied. The workflow holds drafting and names the dependency. Maya later provides the authorized synthetic attachment. Resuming can repeat the intake check and continue within the existing task contract.

Now suppose the missing information is which conflicting deadline actually applies. Supplying another copy of the same source does not resolve that decision. The workflow can produce the already permitted unresolved candidate, but it cannot infer that Maya's silence selected one date. Elapsed time is not evidence or approval.

If Maya changes the task on return, record the change before continuing. A request to prepare a shorter candidate may stay within the same scope. A request to send it to an external audience changes the operation and requires the relevant destination, content, and authorization to be concrete. The old draft permission cannot silently expand to cover it.

The resume procedure also checks whether `instructions-v3` is still current. A held task should not restart under an obsolete version merely because that was the version available when it paused. Identify the difference and decide whether the candidate needs to be regenerated or rechecked. A recoverable handoff preserves continuity while leaving current human direction in control.

## Decide whether delegation saves useful effort

Count the work that remains with you. Preparing the packet, resolving questions, inspecting the result, and repairing failures all consume time. A quick candidate is not automatically a cheaper completed task.

For a short five-line practice note, Maya may spend longer establishing the contract than drafting manually. The setup can still be a useful learning exercise. Reuse becomes worth testing when the same bounded pattern recurs often enough for the setup and maintenance to be justified.

Record the actual time and attention required during your own attempts. Keep setup separate from recurring operation. Record human review and correction effort, not only the assistant's response time. If the workflow creates more unreviewed candidates than you can inspect, reduce the intake rather than assuming the backlog is productive output.

A task may remain partly manual because human judgment is inexpensive or difficult to specify. Maya might let the assistant prepare the source-linked table while she handles ambiguity directly. That division can be a sound operating choice even if a more autonomous version is technically possible.

Later business chapters will connect capacity to demand and unit economics. Here, the question is narrower: does this delegation preserve acceptable behavior while reducing or usefully reallocating effort for a repeated task? Keep the answer tied to observations instead of counting named agents as capacity.

## Change the assistant without changing the agreement by accident

A portable contract helps when you use another assistant or working environment. The new receiver needs the same objective, source boundary, applicable instructions, output requirements, and stop conditions. It does not need to reproduce the old interface to perform the bounded task.

Test the replacement with the supplied packet and a changed case. Inspect the returned evidence, permitted operations, and stop behavior separately. One system may produce an accurate table but omit the instruction version. Another may preserve the version while selecting an unsupported date. A general impression that both seem competent conceals those differences.

Tool availability can change the procedure. If the new environment cannot write a draft file, return the candidate as text and let Maya save it. If the environment cannot access the authorized source at all, hold the task rather than using a remembered specimen as a substitute.

Keep the task's meaning stable during this comparison. Changing the source, the instruction, the tool permissions, and the model at once makes it difficult to determine why behavior changed. When a practical constraint forces several changes, record them and narrow the conclusion accordingly.

Portability does not mean identical responses. It means that the task's requirements and evidence can be carried into a different environment and their satisfaction inspected there. The memory work made that test possible; the delegation contract specifies what the receiving system is being asked to do with the recovered material.

## Add another role only when the handoff has a purpose

The chapter title invites a workforce metaphor, but separate roles do not require separate agents. One assistant can draft and then perform a structured check. A human can perform both. A second assistant may offer a useful additional review when the task justifies its cost and the evidence remains inspectable.

Calling one prompt “writer” and another “critic” does not guarantee independent judgment. If both are given the same unsupported assumption, their agreement can preserve it. The second role needs a distinct job, such as checking each claim against the source without seeing the first assistant's confidence statement.

The TFIS experiment deck describes a small Scratchpad experiment using a document template and two manually run harness sessions, followed by a multipane interface experiment. A much larger scale appears as a future question. The reported sequence is useful as an example of exposing coordination before assuming it will scale; it is not evidence that ten thousand agents were operated successfully. ([The Future Is Solo, 2026, slides 12–13](https://docs.google.com/presentation/d/1dvbBGs22QvtGogevZ6f5mf8YQE7WDAPBwYlclhTyctI/edit#slide=id.g3e6bf19dcd5_0_0))

For Maya, the immediate handoff is between a bounded drafting workflow and human review. That is enough to reveal many of the responsibilities a larger arrangement would need. Add a second automated role when you can identify a recurring failure or bottleneck it is intended to address, and test whether it helps.

## Field assignment: delegate one inspectable return

Complete the [delegation contract](../artifacts/17-delegation-contract.md) for one recurring task you can already review. Name the input, current instructions, output, permitted operations, stops, repair allowance, and human acceptance point. Use the [synthetic practice packet](../artifacts/17-delegated-workflow-practice.md) if you need a safe starting case.

Run the workflow manually or with an available assistant. In the manual version, you move between the specified steps and preserve each output. In the assistant version, supply the bounded packet and retain the actual response. Do not replace an unsuccessful attempt with the authored specimen when recording your result.

Inspect the returned evidence and save a verdict. Reopen any saved draft and confirm that its content matches the reviewed object. Rehearse a missing dependency, an unresolved case, and a requested operation outside the contract. Record the actual response and repair the contract or workflow when the boundary is unclear.

Without an assistant, explain which decisions you delegated, which remained yours, and what would cause the workflow to stop. Show how the evidence packet lets you detect an invented owner, a promoted suggestion, or a fabricated resolution. If you cannot perform that inspection, narrow the task before widening its permissions.

Maya finishes with `delegation-contract-v1` and an inspectable rehearsal return. `instructions-v3` remains current. The next challenge is the quality and capacity of the human review on which this arrangement depends. [Chapter 18](18-the-human-in-the-loop-principle.md) makes that responsibility specific enough to exercise.

## References

Erik S., & Zhang, B. (2024, December 19). *Building effective agents*. Anthropic. https://www.anthropic.com/engineering/building-effective-agents

Grace, M., Hadfield, J., Olivares, R., & De Jonghe, J. (2026, January 9). *Demystifying evals for AI agents*. Anthropic. https://www.anthropic.com/engineering/demystifying-evals-for-ai-agents

OpenAI. (n.d.). *A practical guide to building agents*. https://cdn.openai.com/business-guides-and-resources/a-practical-guide-to-building-agents.pdf

The Future Is Solo. (2026). *The Future Is Solo 20260910* [Google Slides presentation]. https://docs.google.com/presentation/d/1dvbBGs22QvtGogevZ6f5mf8YQE7WDAPBwYlclhTyctI/edit

<!-- sources: anthropic2024, grace2026, openai_agents_guide, tfis-experiments-20260910 -->
