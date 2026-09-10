# Chapter 12: The Personal Knowledge Graph

*Connect the records behind one recurring task so you can trace a decision to its evidence, find what a change affects, and preserve the meaning of those relationships when you move the work.*

## The files are present; the relationship is missing

Maya can now recover the current workshop instructions and the records explaining how they developed. She has a memory inventory, a charter, working areas with different purposes, and a procedure for reviewing material before it becomes lasting memory. The next difficulty appears when she wants to change something.

Chapter 11 added a reviewed procedure for conflicting dates: keep the shared action and owner, preserve both deadline statements, and request clarification. Suppose Maya now considers a different case, in which the notes explicitly document an authorized amendment to an earlier deadline. Which materials would she need to review before extending the procedure? The current instruction is an obvious starting point. The example answer, the review sheet, and a distilled principle may also matter. A relevant sentence in an older conversation might explain why the current rule stops short of resolving contradictions. None of those dependencies disappears merely because each document has a sensible home.

Searching for “deadline” returns several records. Some state a current requirement. Some show an obsolete instruction. Others contain synthetic examples or a question that remains open. Maya needs the relationships between them, not just the matching words inside them.

She begins a small `knowledge-map-v1`. It connects records already in the Fieldwork working set. It does not replace them or become a new source of authority. The current-version pointer in `learning-loop-v1` still identifies the instruction that governs the next attempt. The map helps Maya answer questions about that instruction: what explains it, which examples exercise it, and what would need inspection if it changed.

The exercise remains within the fictional workshop design project. Its value is visible in a modest operation: Maya can find the materials affected by a proposed change without reconstructing their relationships from memory. Bring one active task and its supporting records. A table in an ordinary document is enough to begin.

## A graph is a set of meaningful connections

In a graph, a node represents an item and an edge represents a relationship. In a personal work collection, an item might be a document, a particular claim, a decision, or a test case. An edge might say that one record supports, revises, or tests another. The relationship should tell you more than the fact that both items concern the same broad topic.

A scholarly survey by Hogan and colleagues describes knowledge graphs through entities and their relations, while acknowledging that definitions vary. It also explains that graph data can be represented in several ways and stored using ordinary relational tables. Those technical foundations allow a useful starting choice here: you can practice explicit relationships before adopting a specialized graph database. ([Hogan et al., 2021](https://doi.org/10.1145/3447772))

Begin by naming a few items, stating how they relate, and answering a question through those connections. An ordinary relationship table supports this first practice.

Compare two links. “The workshop brief is related to the review sheet” says little about how to proceed. “The review sheet checks the example action lists used in the workshop brief” identifies an operation. If the review sheet changes, you have a reason to inspect those examples. If an example fails, you know which criteria produced that judgment.

Useful links have direction. The notes supply evidence for the action list; the action list does not establish what the original notes said. A later decision can supersede an earlier decision without deleting the earlier record. Reversing either relationship would change its meaning.

You can read a connection as a short sentence. Put the starting item first, then a verb, then the destination. “Run-02 tests instruction v2.” If you cannot explain what that sentence means in the actual work, the line may be decoration rather than a useful connection.

## Begin with a question you cannot answer easily

Maya writes, “If I add handling for an explicitly authorized deadline amendment, what must I inspect before accepting the change?” This is different from asking for every document about time. It concerns the consequences of a particular revision.

Her current instruction is now v3, following Chapter 11’s approved conflict-handling revision. It links to that distillation record, the review sheet, and the earlier two-pass practice packet. The packet includes a failed output with an invented Wednesday date and a changed input whose timing is only “soon.” Those examples constrain any new rule: recognizing an authorized amendment should not reintroduce date invention or treat an unresolved contradiction as a settled change.

The map should therefore preserve a route from the instruction to those examples. It should also connect the proposed amendment-handling extension to its status as unresolved. Otherwise a future reader might assume that an open design question has already become a supported capability.

Choose your own question before selecting a mapping tool. Perhaps you need to know which client deliverables depend on a revised source. Perhaps you need to identify the exercises affected by a learning outcome. Perhaps an old decision keeps returning because nobody can find why it was rejected.

A good first question identifies a decision about a small set of items. “Show me my whole knowledge network” names no such decision. Expand the map when another working question needs additional relationships.

Write down how you currently answer the question. Note the documents you open, the search terms you try, and any relationship you supply from memory. That last category is particularly useful. It identifies connections that exist in your understanding but are not yet available to another reader.

## Give each item a stable identity

A title helps a person recognize a record. An identifier helps preserve that record's identity when its title changes. Maya can call the project “Action-list workshop” today and refine its public name later without changing which project the history describes.

Her first item table contains an identifier, a readable name, a kind of item, its current status, and a location. The identifier can be as simple as `instruction-v2` or `run-02`. It does not need to be globally unique across the internet. It needs to be unambiguous within the working set.

The difference between a record and its version matters. A current-instruction pointer is intended to resolve to whichever version has been approved. A historical test must identify the particular version it used. If Maya points both to a generic “latest instruction,” she will lose the ability to explain an earlier failure after the instruction changes.

She therefore distinguishes the current pointer from the versioned instruction. The pointer can change through an approved update. The relationship “run-01 used instruction v1” remains attached to that historical version. This preserves the observation without forcing a new task to use old material.

Do not make every sentence a separate node. A small project often works well with document-level items and links to specific headings. Create a finer-grained item when you need to distinguish its status, evidence, or consequences from the rest of the document. A disputed claim inside an otherwise useful source may deserve its own record; a routine explanatory sentence probably does not.

Maya begins with the current procedure, earlier versions, and relevant examples. The [knowledge-map artifact](../artifacts/12-knowledge-map.md) supplies her item and relationship tables. Let your own question determine how many items you need.

## Use verbs that change what you do next

The relationship table has three essential columns: from, relationship, and to. A note beside the row explains the relevant scope or source location. The table becomes useful when its verbs imply a concrete reading operation.

“Uses” tells Maya which instruction was supplied to an attempt. “Tests” tells her which requirement an example examines. “Explains” points from a rationale to the decision it interprets. “Supersedes” preserves the difference between a replacement and an additional alternative. These verbs do different work.

Be especially careful with “supports.” A synthetic example may support a judgment that a particular output violates a stated requirement. It cannot, by itself, support a claim about customer demand or general learning gains. The type of relationship must preserve the limits of the underlying material.

Maya uses “illustrates” for a constructed teaching specimen where “demonstrates reliability” would overstate the evidence. Her table can still show which behavior the specimen is intended to make inspectable. A clear label gives the next reader both the route and the appropriate interpretation.

You do not need an elaborate dictionary of relation types. Start with ordinary verbs you can apply consistently. If two people interpret a verb differently, add a one-sentence explanation beside the map. If you find yourself inventing many nearly identical verbs, simplify before expanding the vocabulary.

A useful relation also has a stopping point. “Depends on” can become so broad that everything depends on everything else. Specify the relevant operation: the review needs the exact source notes to judge whether a date was invented. That dependency is narrower and more actionable than saying the entire business depends on knowledge.

## Walk a path before drawing a picture

Maya tries the question from the beginning of the chapter. She starts at the project, follows its current pointer to instruction v3, and follows the instruction’s links to the distillation decision and retained review criteria. The sheet leads her to the two supplied test cases. She opens the cases and inspects what they establish.

Run-01 contains an unsupported Wednesday date. Its history shows an incomplete instruction migration: the owner correction was retained while an obsolete deadline suggestion remained. Run-02 preserves “soon” without turning it into a date. These cases protect two distinctions that the proposed amendment-handling extension must preserve. Chapter 11’s conflict case adds a third: without evidence of supersession, keep the conflicting dates unresolved.

The route does not establish how the proposed amendment case will behave. It identifies the current constraints and the materials that need review. Maya writes a new proposed case rather than silently changing the old ones. An honest answer to her original question is now possible: review the governing instruction, the review sheet, the relevant examples, and the rationale; then test the extension separately.

This is a graph query performed by a person. A query is simply a question you ask of the represented information. Software can automate parts of the traversal when the collection grows, but the useful behavior is already present in the manual route.

Try a second question in the opposite direction: “What is this example for?” Start with run-02 and follow its link to the instruction and project. You should be able to explain why retaining imprecise timing matters to the workshop design. If the example sits alone, its purpose may be clear to you today and obscure to another reader next month.

Record the route you followed and the answer it allowed. If a missing edge forces you to rely on recollection, add the relationship only after checking the underlying records. The failed walk is useful evidence about the map, not a reason to manufacture a plausible connection.

## Repair a broken relationship without rewriting history

Consider an intentionally broken version of Maya's map. The run-01 row points to instruction v2 as the version used. Every location opens successfully. A link checker might report no problem. The map still tells a false story.

The packet shows that the flawed output belongs with the intermediate v1, which retained the conflicting deadline instruction. If a reviewer follows the incorrect relationship, they may conclude that v2 produced the same failure under the same conditions. They could reject the wrong revision or spend time repairing a rule that was never supplied to that attempt.

Maya repairs the historical relationship to point to v1. She keeps the current pointer aimed at v3, which already includes the separately reviewed Chapter 11 addition. She then repeats both walks: a new drafting task reaches the current instruction; a review of run-01 reaches its actual specimen version. The two questions now resolve differently for a good reason.

This repair illustrates why file integrity and meaning need separate inspection. A valid filename cannot establish that the relationship is accurate. The right record may be present but assigned the wrong role. Your review needs a question about what the connection claims, not only whether the link opens.

Do not rewrite an old attempt to make it look as if it used the latest rule. Add a correction to an inaccurate historical description, with a reason, while preserving the original evidence. In a real project, the input and supplied instruction should settle the matter when available. If they are missing, record that the version is uncertain.

The graph helps expose that uncertainty because the absent relationship has a visible consequence. You cannot confidently attribute the output to a particular instruction. That may require a new controlled comparison; it does not justify filling the empty cell with the version you wish had been used.

## Keep contradiction visible

A graph can represent disagreement without resolving it. Two source records may make incompatible claims. A later note may question a previous inference. A project can contain both an approved decision and an open challenge to that decision, provided their roles are clear.

The approved Chapter 11 procedure remains relevant when a proposed amendment is itself ambiguous. Suppose one synthetic note says the worksheet is due Friday and a second says the same commitment moved to Monday. Without further context, Maya cannot know whether the second statement records an approved change or a conflicting recollection. Adding both dates as if they were compatible facts would conceal the problem. Selecting the newer file would also impose a rule the evidence has not established.

Following the already-approved procedure, she would keep the statements linked to their respective sources and mark the conflict as unresolved. The current instruction requires clarification before producing a single scheduled date. An approved resolution, if obtained, would become a separate decision with its own support and scope.

This approach does not require you to turn uncertainty into a precise probability. A plain status such as “disputed,” “proposed,” or “awaiting confirmation” may be more useful than an unexplained confidence score. The reader needs to know what action is justified now and what information is missing.

Absence also needs careful interpretation. A missing “has owner” relationship may mean no owner was assigned, the source did not mention one, or the information has not yet been entered. Those are different conditions. In Maya's exercise, the notes explicitly identify some missing assignments. Preserve that wording rather than asking an empty graph cell to carry all three meanings.

Choose an explicit note when absence matters to a decision. This keeps the map readable without pretending every unknown is a known negative. The graph represents what has been recorded under stated rules; it is not a complete account of everything that exists.

## Let AI propose connections you can inspect

An assistant can help identify candidate relationships in a supplied working set. Give it a small set of authorized records and a specific question. Ask for the starting item, the proposed relationship, the destination, and the passage supporting the proposal. Require it to identify gaps rather than invent a route.

The [map artifact](../artifacts/12-knowledge-map.md) includes a reusable prompt. Its most useful feature is the separation between a proposed edge and an accepted edge. A fluent sentence about two documents is still a claim about their relationship.

For example, an assistant might propose that Maya's action-list criteria are “validated by” her synthetic workshop. She should reject that relation. The examples let her inspect whether a proposed output follows the criteria. They do not supply learner outcomes that validate the design. A narrower relation such as “used to review” may accurately describe the work.

Another proposal might link a rejected completeness rule to the current instruction with the verb “requires.” The words in both records overlap, but the status is reversed. Maya checks the surrounding text and changes the relation to preserve the rejected history. Similarity helped locate the records; it did not settle their relationship.

Review the proposed connections in batches small enough to inspect. Open the source locations for consequential edges. A suggested link that affects current instructions, permissions, or a customer claim deserves more attention than a navigational link between two harmless examples. This is a judgment about the consequence of an error, not a need to approve every click.

When no useful connection emerges, keep the item separate or remove it from the task's map. A visual gap can accurately reflect the evidence.

## A useful picture should preserve the question

A visual map can make a short route easier to see. It can also hide meaning behind a dense network of dots. The same collection may need different views for different questions: one view for current instructions, another for evidence history, and another for dependencies affected by a change.

Maya's first view would show the current pointer, instruction v3, the distillation decision, and the relevant review cases. The historical view would add instructions v1 and v2 and the migration diagnosis. Neither needs to display every curiosity note or every source in the project.

Keep labels readable and relationships named. A line whose meaning depends entirely on its color is difficult to use when printed, viewed at a small size, or read by someone who cannot distinguish the colors. Supply the same relationships in text or a table, as the chapter artifact does.

Layout does not establish importance. A record in the middle of a force-directed visualization may be highly connected because it is generic, duplicated, or frequently referenced. Its position does not prove that it is true, useful, or causally central to the work. Open the record and inspect the relevant relation before drawing that conclusion.

You may find that the table remains the best view. It is easy to edit, compare, and move. Use a picture when it reduces the effort needed to follow a particular path. The choice is about the reader's question, not about making the collection appear sophisticated.

## Maintain the smallest map that earns its upkeep

Every explicit relationship becomes something you may need to maintain. If the map duplicates a long explanation from another file, both copies can drift. Prefer a short relation and a precise link to the maintained source when that is sufficient.

Maya reviews the map when an instruction changes, a test is added, or a record is moved. These events give her a reason to inspect particular edges. She does not reread every historical document whenever she opens the project.

During the review, she asks whether the affected locations still open, whether the relationships remain accurate, and whether a current pointer still identifies the approved version. She also asks whether any new record depends on material outside the portable working set. A useful relationship to an inaccessible source should be labeled as such.

If maintaining the map repeatedly takes longer than answering the question directly, simplify it. Remove redundant intermediate nodes. Keep relationships at the document level unless a finer distinction affects a decision. Retain useful source links inside the documents themselves so the graph does not become the only way to understand the work.

A small comparison can inform the choice. Attempt the same kind of retrieval or change review with and without the map, using comparable records and the same acceptance standard. Record the time and errors you observe, including map maintenance. Do not count time saved by skipping the underlying evidence inspection as an improvement in that inspection.

If the comparison favors a simple index, use it. Keep the relationships explicit in whichever representation makes the work easier to follow.

## Use the pattern in services, education, and software

In a service business, connect the client's stated request to the agreed deliverable, the input supporting it, and the review that accepted it. A proposed extra service should remain separate from an authorized change. A relationship table can show which deliverables require review when an assumption changes, without exposing unrelated client material to the same assistant.

In education, connect a proposed outcome to the activity that gives learners an attempt, the criteria used to inspect that attempt, and the feedback that guides revision. Keep a designed opportunity to learn separate from evidence of learning. If you later collect appropriate learner work, give it its own source and permission context.

In software, connect a requirement to the implementation area, the test that exercises it, and a recorded limitation. A passing test covers its actual conditions; it does not certify every behavior suggested by a requirement's broad title. The map can help identify what to rerun when a dependency changes, but someone must still judge whether the selected tests are adequate.

In each example, ask what the record depends on and what depends on it. The answer identifies the sources and relationships to inspect before testing a proposed change.

## Field assignment: answer through the links

Open the [knowledge-map artifact](../artifacts/12-knowledge-map.md). Select one recurring task and one question about its evidence or dependencies. Use existing records from the memory inventory. Add only the items necessary to make the first route inspectable.

Create the item table, then write the relationships as ordinary sentences before entering them as rows. Distinguish the current pointer from the historical versions used in earlier attempts. Mark proposals and unresolved questions so they cannot be mistaken for accepted decisions.

Follow the route from the task to its current instruction and from the instruction to the relevant evidence. Try a reverse question that begins with an example or source and asks why it matters. Record any point where you must rely on an unstated memory to continue.

Repair one missing or incorrect relationship. Reopen the underlying records to justify the repair. Then ask someone else, or a fresh assistant session supplied only with the selected working set, to answer the original question. Compare the route and answer with the sources yourself.

Your completion evidence is a small usable map, an actual question it helped answer, and a checked repair. A dense picture or a high edge count is unnecessary. Keep one unanswered question visible if the evidence does not settle it.

Maya leaves with a route through the materials that govern and explain her workshop examples. The map helps her find the relevant judgments. The next problem is whether those judgments can guide repeated work without becoming detached from their reasons. [Chapter 13](13-the-memory-flywheel.md) develops that practice through a durable verdict record and a later attempt that must use it.

## References

Hogan, A., Blomqvist, E., Cochez, M., d’Amato, C., de Melo, G., Gutierrez, C., Kirrane, S., Labra Gayo, J. E., Navigli, R., Neumaier, S., Ngonga Ngomo, A.-C., Polleres, A., Rashid, S. M., Rula, A., Schmelzeisen, L., Sequeda, J., Staab, S., & Zimmermann, A. (2021). Knowledge graphs. *ACM Computing Surveys, 54*(4), Article 71. [https://doi.org/10.1145/3447772](https://doi.org/10.1145/3447772)

<!-- sources: hogan2021 -->
