# Chapter 10: The Architecture of Remembering

*Build a small, inspectable memory arrangement that separates immediate context, project records, reviewed reusable knowledge, and recovery copies, then demonstrate that it can support the next task.*

## The right note in the wrong place

Audy has solved an important problem. Starting from `learning-loop-v1`, she can find the instructions that currently govern Himura Inc.'s synthetic action-list exercise. Starting from those instructions, she can follow `action-list-rule-rationale-v1` to the examples that explain them. Her memory charter says who may change these records and what may enter the working set.

Then she prepares another session. She copies a useful paragraph into the conversation, adds the latest practice input, and begins. Halfway through, she notices that the paragraph came from a rejected draft. It says every action must have an owner. The reviewed rule preserves an agreed action whose owner has not yet been assigned, while keeping the missing assignment visible.

The current pointer was correct. Her route around it was not. A searchable collection had made both paragraphs easy to find without making their different roles equally obvious.

For Audy's fictional workshop, the immediate task is to arrange records so they reinforce her existing judgments. The architecture earns its complexity through clearer ordinary use and a usable recovery path.

Keep your inventory and charter beside you. This chapter puts them into operation. You will use the [memory-lanes artifact](../artifacts/10-memory-lanes.md) to assign locations, make one reviewed promotion, retrieve a useful working set, and restore a selected copy without replacing your active work.

## Give each location a job

Think first about the jobs your records perform. Some information matters only while you are doing the current task. Some belongs to the continuing project. Some expresses a reviewed lesson or preference that can be reused within a stated scope. Some is retained so that you can recover or inspect an earlier state.

The book's four practical roles are working context, project workspace, reviewed durable memory, and portable archive. Ordinary folders and text documents can express all four.

The boundaries matter more than the folder names. A proposed correction does not become approved because it moved to a folder called memory. An old instruction does not become current because it appears in a recent search result. A recovery copy does not become a safe working copy until you know which state it preserves and whether that state still applies.

Audy chooses one modest arrangement. A `work` folder holds material assembled for the current session. A `projects/himura-inc` folder holds the continuing brief, instructions, examples, and decisions. A `memory` folder holds reviewed reusable records. An `archive` folder holds selected recovery packages and their restore notes. These names are examples; a document service can express the same roles with clearly labeled areas.

She does not move her entire collection at once. She starts with the records needed for the action-list task. Their existing names stay recognizable. The arrangement must make the next operation safer before it earns the right to absorb more material.

## Follow the review boundary

![Working context holds the immediate task and inputs; project records hold continuing work; human review checks source, relevance, sensitivity, and scope before reusable material enters durable memory; a portable archive retains selected evidence, versions, and restoration notes. Failed review leads to revision or discard.](../diagrams/memory-lanes.svg)

*Figure 10.1. An original book diagram showing four practical memory roles and the review boundary between proposed material and reviewed reusable memory. The arrows describe deliberate actions, not automatic promotion or indefinite retention.*

Read the diagram from the task outward. Working context contains what the current attempt needs. Useful outputs, inputs, and decisions can be retained in the project workspace. A proposed reusable lesson then meets a human review boundary: check its source, relevance, sensitivity, and scope. Passing that review permits a specifically approved record to enter durable memory. Failing it leads to revision or discard.

The archive preserves selected files, provenance, versions, and restore instructions. It can include an approved record's history and the evidence needed to interpret it. It does not make every archived statement current or correct. The drawing is simplified: in practice, a project snapshot may go directly into a recovery package without becoming a reusable lesson first.

The arrangement also supports movement back toward the task. You retrieve selected reviewed material and relevant project evidence into working context. Retrieval does not erase the status of that material. A disputed input remains disputed after it is opened; a past decision remains historical after it is quoted.

Imagine covering the folder names in the diagram. Could you still explain who chooses what enters the next session and who approves an enduring change? If the answer depends entirely on the labels, specify the operations more clearly. Architecture becomes useful when a person can follow its boundaries during an ordinary, slightly hurried day.

## Assemble working context for one purpose

Working context is the material available for the present attempt. In a conversation, it includes the instructions and information actually supplied or retrieved into that session. A document stored somewhere else is not necessarily available to the assistant simply because you can see its name in your collection.

For Audy's next attempt, the purpose is to convert a fresh synthetic note into an action list while preserving what is and is not established. Her working packet includes the task, the current instructions located through `learning-loop-v1`, the fresh input, and the review criteria. She includes the relevant rationale if the task involves explaining the rule or examining a borderline case. She does not need every earlier brainstorming exchange.

A packet should be small enough to inspect and complete enough for its purpose. Those requirements can pull in different directions. Removing a redundant greeting may help. Removing the sentence that says a proposed reminder was deferred changes the evidence. Brevity is a means of managing attention, not a license to alter the task.

Research provides a reason to test context use rather than assuming that availability is sufficient. Liu and colleagues found position-related performance differences in multi-document question answering and key-value retrieval: relevant material in the middle of long inputs was often used less successfully. Those findings concern the models and tasks studied, not a universal limit for every later system. ([Liu et al., 2024](https://doi.org/10.1162/tacl_a_00638))

The practical test is local. Supply the packet, then check whether the next attempt identifies the applicable rule and uses it correctly. If it fails, inspect the supplied material before adding more. The missing piece may be one source sentence, an authority label, or a clear distinction between input and instruction.

## Keep the project workspace complete enough to explain itself

The project workspace holds the continuing work that does not fit into every session. Audy puts `workshop-brief-v1`, `learning-loop-v1`, the claims ledger, the charter, the rationale record, and selected synthetic inputs and outputs here. A project index describes their roles. It points to the existing current-instruction route instead of introducing a second version selector.

Evidence and drafts can coexist in this workspace if their status is visible. Audy labels the rejected owner rule where a reader encounters it, not only in a separate index. A detached excerpt should still say that the candidate was rejected and where to find the current rule. This makes accidental reuse easier to notice.

Use links that survive the moves you expect to make. A reference such as “see yesterday's chat” depends on a shared memory of yesterday. A link to a named synthetic input, with a short description of the relevant passage, is more portable. Within a file bundle, relative links can preserve relationships when the whole folder moves. External sources still need their direct URLs and enough reference information to identify them.

An index is a route into work, not another place to copy every conclusion. If Audy pastes the current instruction into three overview files, every correction now has three potential destinations. She instead describes the purpose and links to the designated record. The supporting rationale may restate the issue for explanation, but its heading makes clear that it does not issue instructions.

A useful workspace lets another session answer three questions: what applies now, what supports it, and what remains unsettled? If a reader can answer only the first, preserve more rationale. If they can answer only the second, make authority clearer.

## Promote a lesson without promoting its exaggeration

Reviewed durable memory holds material intended for reuse beyond the immediate attempt. Durable means deliberately retained and maintained. It does not mean immutable, universally applicable, or stored forever.

Audy proposes a short reusable note: “When turning supplied notes into commitments, preserve the distinction between what was agreed, what was suggested, and what remains unknown.” Its scope is the design and review of Himura Inc.'s action-list practice. It points to the project rationale and examples. It does not claim that the rule has been tested with real learners or that every kind of meeting can be interpreted without clarification.

She calls the record `commitment-evidence-principle-v1`. It explains a reviewed design principle. It also states that task instructions must still be retrieved through `learning-loop-v1`. This prevents the broader note from quietly becoming a substitute instruction sheet.

Promotion involves reading the proposed wording against its support. Does “preserve unknowns” accidentally prohibit offering clearly labeled suggestions? Does the statement imply that the source itself is accurate? Does the example contain information the charter excludes? Does the next reader know what would trigger review?

Audy rejects an earlier proposed version that says, “Never infer anything from meeting notes.” That wording would rule out ordinary interpretation while failing to explain the real problem: presenting an unsupported commitment as established. She narrows the statement and records the reason for the revision.

The retained note is useful because it is bounded. Its evidence is modest, and its authority is explicit. Saving a sweeping rule would have produced a stronger-sounding memory and a weaker guide to action.

## Separate storage from the act of remembering

It is tempting to picture an assistant's memory as a room that becomes more knowledgeable whenever another file enters it. Actual use requires a route from storage to the current task. Someone or something must locate the relevant record, select the appropriate passage, and supply it in a form the next attempt can use.

The MemGPT research system explored managing different memory tiers to extend the usable context of language models with limited context windows. Its evaluations concerned document analysis and conversations across sessions. This is an example of an implemented technical approach to moving information between stores and active context. It does not establish that creating a folder gives any assistant the same capabilities. ([Packer et al., 2023](https://doi.org/10.48550/arXiv.2310.08560))

For a reader who does not code, the first retrieval mechanism can be you. Open the project index, follow the current pointer, choose the relevant evidence, and attach or paste the authorized packet. Write down what you supplied. That modest record makes it possible to distinguish a retrieval failure from a failure to apply retrieved information.

Later, a search feature or an agent may perform part of the selection. The acceptance criteria remain observable. It should identify the correct record, retain its status and scope, and avoid silently substituting a nearby draft. A confident answer with no traceable selection is difficult to evaluate.

The memory practice developed here, informed by SovMem's emphasis on inspectable records, begins with clear records and routes between them. The files help preserve the material from which useful work can be reconstructed. They do not automatically preserve understanding, judgment, or every feature of the environment that previously used them.

## Make retrieval a task with an answer you can inspect

Audy writes a retrieval request before opening the collection: “Find the current instruction for an agreed action with no named owner, and the evidence explaining why the missing owner must stay visible.” This asks for both authority and rationale. It gives her a way to notice a response that retrieves only one.

The successful route begins at the project index, reaches `learning-loop-v1`, and follows its current-instruction pointer. The rationale link then reaches the owner comparison and the rejected candidate. Audy records those locations in the working packet. She can now inspect the answer against specific records instead of judging its plausibility.

She also asks a question the collection cannot answer: “Which named person should take the unassigned action?” A successful retrieval should expose the gap. It should not treat the absence of an answer as an invitation to search until a plausible name appears.

Test a misleading route deliberately. Search for a phrase present in the rejected owner rule. Does the result identify its rejected status and direct the reader toward the current rule? If not, repair the status label or index. Search ranking is not the authority policy.

These retrieval checks prepare for bounded delegation by showing where a reviewer can inspect the evidence. Later, a delegated workflow will need to demonstrate that it follows the same routes.

## Update the record and the routes that depend on it

A memory architecture must accommodate changes without making every earlier record disappear. Audy already corrected the instruction to preserve uncertainty about deadlines as well as owners. If she discovers another consequential error, the next step is a proposed revision with its evidence, not an unannounced overwrite.

In this exercise, she keeps the existing current instruction active while reviewing a candidate. After approval, she saves the new version, checks its wording, and changes the single current pointer in `learning-loop-v1`. She marks the previous version as superseded and links the material reason for the change. The project index continues to point to `learning-loop-v1`, so it does not need an independent version choice.

The rationale record receives an explanatory update when the reasoning changes. The reusable principle receives one only if the change affects its scope or content. Updating everything on every edit would create unnecessary maintenance and obscure which judgment actually changed.

Before beginning another task, Audy reopens the current pointer from a fresh view and follows it. If the write failed or the link still points to the old version, she repairs that state. The architecture has not completed the update merely because the new paragraph appeared in a conversation.

In the manual arrangement, complete one approved change before beginning a dependent task. The next reader should be able to identify the applicable version and recover why it replaced the previous one.

## Give proposed writes their own destination

At this point Audy works with one assistant at a time and approves consequential changes herself. Even so, distinguishing a proposed write from an approved one is useful. She gives candidate notes a visible proposed status in the project workspace. An assistant may prepare them there without receiving permission to replace the current instructions or reviewed memory.

The physical arrangement should reinforce that boundary. When a tool supports separate access rights, use them to express the actual working agreement. When it does not, recognize that a label is a convention requiring supervision. A folder name alone does not prevent an application with broad file access from changing its contents.

Consider two proposed revisions prepared from the same instruction version. One adds handling for contradictory deadlines; another clarifies how suggestions should be labeled. If Audy approves the first and then accepts the second as a complete replacement without comparing versions, she could lose the first change. This is a hypothetical failure to anticipate, not another event already demonstrated in Himura Inc.

The simple manual repair is to identify which version each proposal started from and review it against the version that is current now. Incorporate only the intended change, then repeat the relevant checks. Do not assume that the most recently saved file contains every previously approved judgment.

This boundary becomes more important if several assistants later contribute to the same project. Give them bounded proposal areas and a clear review route before permitting shared authoritative writes. Increasing the number of writers creates coordination work; it does not remove the need to decide who can make a change apply.

## Archive a state you can describe

An archive serves recovery and historical inspection. It should say what it contains and which point in the work it represents. “Backup final” is a poor description when several folders have that name.

Audy creates a selected recovery package after checking the current pointer and rationale. The package contains the files needed to reopen this part of Himura Inc.: the brief, the pointer and instructions it names, the supporting rationale and synthetic examples, the claims ledger, and the charter. A restore note identifies the approved state and any dependencies outside the package.

She records that the package is a workshop-design snapshot. It contains no evidence of customer demand and no operational customer records. A later reader should not have to reconstruct those limits from the absence of sales documents.

The archive also distinguishes preserved history from applicable guidance. The old rejected owner rule can be included because it explains a correction. Its status travels with it. An archived copy of a once-current instruction says when it applied and that the live project's pointer must be consulted before ordinary use.

A copy in another folder on the same device is useful for a restore rehearsal. It does not protect against every loss affecting that device. Select actual backup arrangements according to the value of the work and your charter, then test what they restore. This chapter's exercise demonstrates recovery of a defined working set, not a complete disaster-recovery system.

## Rehearse restoration without overwriting the present

Restoration is the act of making a saved state usable again. Start in a separate folder so that mistakes in the rehearsal cannot replace the active project. Give the restored copy an obvious rehearsal label.

Audy opens the restore note from that copy. She follows the included index and current pointer without relying on the original project's open windows. She retrieves the applicable instructions and rationale. She then opens the relevant synthetic input and explains why an unassigned action must remain visible without receiving an invented owner.

Her first rehearsal reveals a broken evidence link. The rationale file is present, but one link reaches outside the copied package to a file in the original workspace. The restore looks complete until the original location is unavailable. Audy adds the authorized synthetic dependency to the package, repairs the relative link, and repeats the rehearsal from a new copy.

The second rehearsal distinguishes file recovery from behavioral recovery. The records open and their relationships make sense. A fresh attempt still has to use them correctly. Audy tests an input containing “soon” and checks whether the output preserves that uncertainty instead of manufacturing a date.

If the package restores an older approved state, she does not silently make it current. She compares it with any later valid decisions and identifies what may be missing. Recovery can return readable work while leaving a gap in history. The restore note should make that gap visible before anyone relies on the recovered instructions.

## Use a file check for the question it can answer

The optional [memory-manifest check](../artifacts/10-check-memory-manifest.md) supplies a Python program and synthetic files for comparing a recovery package with its file list. The main exercise remains usable without it.

A manifest is a list describing the files expected in a package. The example records relative paths, file sizes, and SHA-256 fingerprints. A fingerprint is a value calculated from file contents; comparing it with a previously recorded value can reveal a byte-level difference. The supplied checker reads the listed files and reports matches, missing files, or differences. It does not change them or contact a service.

The no-code equivalent is to open the package against a written file list, compare the expected contents, and follow the links. For a small bundle, that is often the more informative first check. A program saves comparison effort, but it cannot tell you which records ought to have been included.

A matching fingerprint does not prove a statement true, a decision approved, or a package complete. If both a file and its manifest are altered together, this simple comparison may still pass. It is a consistency check against the supplied manifest, not proof of authorship or protection against a hostile editor.

Use it alongside the restore questions: can the current rule be located, can its evidence be inspected, and can the task be resumed? A package can pass the file check while preserving an obsolete instruction perfectly. That is why restoration includes interpretation as well as copying.

## Maintain the routes people actually use

An architecture can become elaborate while its most common retrieval remains awkward. Follow the ordinary route through your own collection. If you repeatedly bypass the index because it is too broad or out of date, repair the route instead of treating every bypass as a failure of discipline.

Audy puts the action-list task near the beginning of the Himura Inc. index because it is the active design exercise. The entry names the purpose, identifies `learning-loop-v1` as the route to current instructions, and links the rationale separately. It does not turn the index into a second handbook. A short description makes the links understandable without duplicating their contents.

She also looks for signs of unnecessary maintenance. A general note that merely copies the project rationale adds another place that could become stale. If it has no distinct reuse purpose, it can remain a project record. A proposed principle earns durable status when its future role is clear, even if that role is limited to a narrow family of tasks.

Review the arrangement when an actual event exposes a problem: an instruction changes, a link breaks, a restored package lacks a dependency, or a record's scope no longer matches the task. Event-based review gives maintenance a reason. You can add periodic checks for records whose staleness would matter, but a rigid schedule for every harmless historical file may create work without improving use.

The archive needs the same restraint. Retaining more versions may improve recovery, but it also increases what you must interpret and, where appropriate, remove. Follow the charter's retention choices. Do not let the diagram's final box become an excuse to keep material whose purpose or authorization you can no longer explain.

## Let a reported build clarify the direction of travel

The TFIS experiment deck includes an entry describing a website build drawing on Audy's Vault, with a progression from session material to memory and then to the vault. It names a deployment tool and lists a web application as the next step. The presentation records that development account; it does not independently verify a particular deployment or the reliability of every memory transfer. ([The Future Is Solo, 2026, slide 25](https://docs.google.com/presentation/d/1dvbBGs22QvtGogevZ6f5mf8YQE7WDAPBwYlclhTyctI/edit#slide=id.g3e84e1096e6_0_0))

The account puts a useful question in concrete terms: what survives a working session well enough to support another piece of work? In Audy's case, the answer is neither the whole conversation nor only its final confident sentence. She needs the applicable instruction, its approved status, the rationale, selected evidence, and the limits of what the project has established.

Your architecture should make those transfers deliberate. A service proposal may depend on a confirmed scope decision. A lesson plan may depend on a reason an exercise changed. A software task may depend on a requirement and a known failing example. The storage medium can differ while the need to preserve authority and evidence remains recognizable.

## Field assignment: restore one usable working set

Complete the [memory-lanes artifact](../artifacts/10-memory-lanes.md) for the project you inventoried. Assign the four roles to actual locations. Keep your existing current-version route if it already works. Identify one candidate for reviewed reusable memory and inspect its wording, support, scope, and retention conditions before promotion.

Retrieve the materials for one bounded task. Record what you supplied, then inspect whether the task used the applicable record. Include a query that should return an unresolved answer and one that might surface an obsolete draft. Repair misleading authority labels before expanding the collection.

Create a selected recovery package and restore it into a separate location. Open the current pointer, follow the evidence, and perform a fresh practice attempt. Record file availability, link resolution, version clarity, and task behavior separately. If one fails, keep the other results and repair the specific failure.

Without an assistant, explain why a reviewed principle does not replace a task instruction, why an archive may contain a rejected rule, and why a matching file fingerprint does not establish truth. If these distinctions are difficult to explain, use your own package as the example until the roles become clear.

Audy keeps `memory-lanes-v1`, the reviewed `commitment-evidence-principle-v1`, and her restore rehearsal. The next design attempt has a clearer route to its evidence. [Chapter 11](11-the-knowledge-distillation-pipeline.md) examines how to produce these small records without compressing away their meaning or limits.

## References

Liu, N. F., Lin, K., Hewitt, J., Paranjape, A., Bevilacqua, M., Petroni, F., & Liang, P. (2024). Lost in the middle: How language models use long contexts. *Transactions of the Association for Computational Linguistics, 12*, 157–173. https://doi.org/10.1162/tacl_a_00638

Packer, C., Wooders, S., Lin, K., Fang, V., Patil, S. G., Stoica, I., & Gonzalez, J. E. (2023). *MemGPT: Towards LLMs as operating systems* [Preprint]. arXiv. https://doi.org/10.48550/arXiv.2310.08560

The Future Is Solo. (2026). *The Future Is Solo 20260910* [Google Slides presentation]. https://docs.google.com/presentation/d/1dvbBGs22QvtGogevZ6f5mf8YQE7WDAPBwYlclhTyctI/edit

<!-- sources: liu2024, packer2023, tfis-experiments-20260910 -->
