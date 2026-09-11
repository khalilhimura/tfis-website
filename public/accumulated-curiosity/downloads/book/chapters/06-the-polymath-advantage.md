# Chapter 6: The Polymath Advantage

*Adapt one useful idea from another domain, state where the analogy breaks, and test whether the adaptation improves a specific piece of work.*

## A useful idea crosses a boundary

Audy has made her workshop brief more precise. In the fictional Himura Inc. project, the proposed thirty-minute workshop asks adult learners to turn meeting notes into an action list. They must preserve agreements, distinguish suggestions, and leave unstated owners or deadlines unresolved. Her brief now names a task, an individual attempt, and a way to inspect the result.

The difficulty has moved. How should she write the check? Her first instinct is to provide a model answer and mark differences. That would be convenient, but she can already imagine two different sentences accurately describing the same commitment. A learner might also copy the model's structure while quietly inventing a deadline.

She encounters an idea from software testing: specify a condition the output must satisfy, then use an example that could reveal a violation. Audy does not need to become a software engineer to consider the idea. She needs to identify what is useful about it and what changes when the person producing the output is a learner rather than a program.

She opens a document called `connection-map-v1`. On the left she describes the source idea. On the right she describes the workshop problem. Between them she writes the proposed connection: an acceptance condition can make a requirement visible without demanding one exact wording.

Learning across disciplines gives Audy a new way to inspect her work. She can now test whether the borrowed idea makes the check fairer and more useful.

In this chapter, you will do the same with a problem from your own work. Bring the concept-deconstruction record from Chapter 5. You should already be able to explain the target problem well enough to recognize whether the new idea addresses it.

## Build breadth around a question

It is possible to become familiar with many domains while acquiring little ability to work in any of them. A large vocabulary can produce interesting conversations. A business problem usually asks for something more specific: a decision, a design, a repair, or a result that someone else can use.

Knowledge from several domains can supply different descriptions of a problem. The practical advantage comes from selecting a useful connection, learning enough to evaluate it, and applying it under conditions you understand.

Audy's question gives her exploration a boundary. She wants a review method that detects invented commitments while allowing legitimate variation in wording. Software evaluation may offer a useful example of requirements and checks. Editing may offer ways to distinguish a change of meaning from a change of expression. Neither discipline automatically supplies the complete answer.

She begins with the part she can explain. Every asserted owner in an action list should be supported by the notes. That is a concrete relationship between an output and an input. By comparison, “the action list should demonstrate professionalism” contains several judgments she has not yet defined. Borrowing the word *test* would not make those judgments precise.

Use your curiosity to search for a different description of the operation. If your problem concerns a growing review queue, look for ideas about flow and capacity. If it concerns unsupported claims, look for practices that preserve provenance. If it concerns repeated misunderstandings, examine how another field makes assumptions explicit. Let the problem determine what you study next.

This is compatible with deep specialization. An experienced facilitator may notice a flaw in a workshop analogy that a generalist misses. A technical reviewer may see a failure condition that Audy cannot yet recognize. Cross-domain learning becomes stronger when it makes collaboration with specialists more precise, rather than persuading you that their expertise is unnecessary.

Begin with one informed connection and follow it far enough to make an adaptation you can inspect.

## Transfer needs conditions

Learning something in one setting does not settle where else you can use it. Barnett and Ceci's review describes multiple dimensions of transfer and argues against treating all distant transfer as a single effect. It identifies evidence of transfer under some conditions while noting that important combinations remain untested. ([Barnett & Ceci, 2002](https://doi.org/10.1037/0033-2909.128.4.612))

The implication for this chapter is modest: describe what changes between the original setting and the new one. The review does not establish that broad interests produce better entrepreneurs, and it does not validate this book's connection map. Our map is a practical device for making a proposed transfer inspectable.

Audy can separate two claims. One concerns the usefulness of a borrowed evaluation idea for designing her worksheet. The other concerns whether a learner who succeeds on that worksheet will perform well in a real meeting. The first can be examined through a design trial. The second requires evidence about learning and application under different conditions.

Even the word *similar* needs work. Two tasks might use different vocabulary yet depend on the same relationship. Two tasks might share a familiar format while requiring very different judgments. A meeting summary and an action list both condense notes, but only one may require deciding which statements establish commitments.

Before announcing that an idea transfers, state the destination. “This principle works in education” is far too broad. “This requirement-based check can identify an invented owner in our synthetic action-list example” is a claim you can actually test.

The more distant the proposed application, the more useful it becomes to describe intermediate steps. You might first adapt a check within a familiar document task, then test it on a new document type. Each step can reveal a mismatch before you rely on the idea in a setting where a mistake is harder to notice.

## Map the relationship you intend to borrow

An analogy compares a source situation with a target situation. The useful part is often a relationship: an output depends on an input, a queue grows when arrivals exceed departures, or a correction must reach the next attempt. Matching labels without matching the relationship gives you little to work with.

For Audy, the source situation is an evaluation with a defined input, an expected property, and a check. The target is the learner's action list. The meeting notes supply the input. The expected property is that commitments and their details remain faithful to the notes. The check compares each asserted action with its support.

Her first mapped requirement reads: “If the list names an owner, the notes must support that assignment.” She can test this with the fictional note about circulating minutes by Friday. She can also test it with a suggestion that nobody agreed to own. The requirement gives the reviewer a question to ask of either output.

She maps another property: missing information should remain visible. In software, a process may distinguish a valid value from an absent value. In the workshop, an agreed action can lack an assigned owner. The absence should prompt a question rather than be filled with the most plausible person.

The wording of the mapping is deliberately ordinary. Audy does not need to reproduce a testing framework or learn a programming language. She is borrowing the idea of inspecting a meaningful condition. A text document with the input, an example output, and a review reason can carry that operation.

Anthropic's practitioner guidance on agent evaluation distinguishes code, model, and human grading, including limitations of checks that are brittle to valid variations. That guidance helps identify the design choice Audy faces. It is engineering advice for AI systems, not evidence that the same check teaches adult learners. ([Grace et al., 2026](https://www.anthropic.com/engineering/demystifying-evals-for-ai-agents))

Your connection map should contain enough detail for a reader to challenge the mapping. Name the original operation, its counterpart in your problem, and the decision the relationship could improve. If the best explanation is “they are both systems,” the connection is still too vague to guide work.

## Write the mismatch before the success story

Audy's first mismatch concerns acceptable variation. Two learners can produce different accurate action lists. An exact comparison with her model answer could reject a legitimate paraphrase. She therefore needs requirements that preserve meaning while allowing more than one expression.

The second mismatch concerns purpose. A software check may be used to accept or reject an output. Audy also wants the learner to understand a distinction and improve an attempt. A verdict without an explanation might help her record performance while giving the learner little to use. She retains Chapter 5’s requirement for a short reason tied to the notes when adapting the software check.

The third mismatch concerns missing ground truth. Her synthetic notes were written to make a distinction visible. Real meeting notes may be incomplete, contradictory, or dependent on shared context absent from the document. A classification rule that seems obvious in the example may require clarification in practice. She cannot eliminate that problem by insisting that the reference answer must be correct.

Audy writes the mismatches beside the connection. She keeps the requirement-based comparison, allows multiple faithful answers, and leaves workplace competence for a separate investigation.

Look for a mismatch in authority as well. A technique may assume that the person applying it controls the environment. In your setting, the relevant decision may belong to a client, a regulator, a partner, or a participant. An elegant automation analogy will fail if it treats that person's agreement as just another field to infer.

Also consider timescale. A method that detects an immediate defect may say little about a delayed outcome. Audy can inspect whether an action list invents a deadline today. She cannot infer from that inspection whether the learner will preserve uncertainty in a difficult conversation next month.

You are allowed to keep a partial analogy. In fact, a precise statement of the part you reject makes the retained part easier to use. “Borrow the property check; keep human interpretation and explanation” is a more actionable design decision than a sweeping claim that workshops should work like software.

## Build a trial that can reject the analogy

Audy returns to the same three lines of synthetic notes used earlier. The facilitator agreed to circulate notes by Friday. The group suggested asking the venue about access arrangements, with nobody assigned. The group agreed to try a shorter introduction next session, without naming an owner.

She writes a deliberately flawed action list. It says the facilitator will circulate notes by Friday, the coordinator will contact the venue, and the facilitator will prepare the shorter introduction by Thursday. The mixture of supported details and plausible inventions gives the check something meaningful to distinguish.

Her original review method asks whether the answer matches the model list. Her adapted method asks whether each action is agreed, whether each named owner and deadline is supported, and whether missing details are flagged. She applies both methods to the same candidate output, recording the reasons rather than just the verdict.

The adapted check exposes the invented coordinator and Thursday deadline. It also separates the unassigned agreed introduction change from the unagreed suggestion about the venue. Audy can now describe what the review actually catches. She has not observed a learner; she has inspected a designed example.

Next she tests the check against a valid paraphrase. One output says, “Owner: facilitator; send the notes by Friday.” Another says, “The facilitator will circulate the notes no later than Friday.” A check that rejects the second simply because the wording differs would fail the intended purpose.

Then she supplies an ambiguous case. The notes say, “We could ask the venue; let's return to that.” She does not invent a definitive interpretation and use it as an answer key. She expects the review to identify an unresolved proposal and explain what information is missing. This tests whether the adaptation tolerates uncertainty rather than forcing every input into a confident category.

The analogy has a clear failure condition. If the check rewards exact wording over supported meaning, or hides ambiguity behind a pass mark, Audy must revise it. If it identifies the meaningful defects and permits justified variation, she can retain it for further design work.

Your own trial should include a plausible failure, a legitimate variation, and a boundary case when those are relevant to the task. These are book-designed testing suggestions, not a universal minimum sample. Choose cases because they can distinguish a useful adaptation from a misleading one.

## Inspect the check as carefully as the output

A failed result does not always mean the person or assistant performing the task failed. The check may be wrong. Audy discovers this when she tries to simplify her review sheet to “every action must have an owner.” That sounds reasonable for a usable action list, but it creates pressure to invent missing ownership.

She separates two conditions. An action list should show whether ownership is established. An unresolved assignment should be flagged before the action is treated as ready for execution. The first condition can be satisfied by an honest “owner not specified.” The second points to a follow-up question. Neither requires fabrication.

This revision improves the relationship between the output and its intended use. It also shows why borrowing a rule is insufficient. Audy had to understand the meeting-note task well enough to see that a superficially stricter rule could produce a less trustworthy result.

She keeps the rejected rule in `connection-map-v1` with the reason for changing it. The record now contains something reusable: completeness of presentation must not be confused with completeness of evidence. Future briefs may need a similar distinction between a missing field that blocks action and a field that the assistant is authorized to infer.

The next input will challenge the revised rule. These designed examples explain why it exists; they supply no measured error rate across real meeting notes.

The observable improvement is therefore specific. The revised worksheet can represent an agreed action with unresolved ownership without silently converting it into a ready assignment. That is a useful change in the design. A later learner trial would ask whether people understand and apply it; a later business trial would ask whether the help is valuable enough to buy.

## A source of ideas can be surprisingly distant

An ant-colony example provides the starting idea for the TFIS experiment “Build W18 Stigmergy”: could traces left in a shared environment influence subsequent agent actions? The deck proposes exploring that relationship in the evaluation of collaboration. ([The Future Is Solo, 2026, slide 15](https://docs.google.com/presentation/d/1dvbBGs22QvtGogevZ6f5mf8YQE7WDAPBwYlclhTyctI/edit#slide=id.g3e6bf493125_0_114))

Evaluation remains a next step in the account, so the analogy has not established improved reliability. It has supplied a testable question about a working arrangement.

Audy can ask a related question without importing a theory of insect behavior: what trace should one pass through the brief leave for the next? An unresolved ownership note could prevent a later draft from treating a proposal as settled. A correction record could explain why a field remains blank. The useful relationship is an observable document change influencing later work.

She must still decide who may write the record, how its source is preserved, and how a later reader distinguishes a correction from an unsupported claim. The analogy points toward a design question; her working context supplies the constraints. That is the kind of cross-domain movement the book aims to make repeatable.

## Borrow a capacity model without turning people into machines

Chapter 5 considered a hypothetical process that generates six candidate briefs daily while Audy can review two. The arithmetic exposes a growing queue. It does not tell her to behave like a faster component or reduce every part of judgment to an average duration.

The model can still help her select a useful change. If she generates only the two candidates she is ready to review, she avoids adding four unreviewed items under those assumptions. If a better evidence layout reduces avoidable searching during review, she can test that improvement. Neither decision requires increasing generation.

Now identify the mismatch. Briefs vary in difficulty. Audy's available attention changes. Some revisions are quick; others reveal a fundamental problem. A daily average can conceal a particularly difficult brief. She should therefore use the simple model to ask about flow, while keeping the actual review conditions visible.

The transfer is valuable if it changes a decision she can examine. For example, she might stop requesting five variations when she only needs to investigate one uncertain requirement. She could record whether the narrower request leaves her with a clearer review and fewer unfinished alternatives.

Keep this second connection where it informs production, and the acceptance-condition map where it informs review. As the workflow develops, experience will show where the two need to connect.

## Use AI to generate contrasts, then choose

An assistant can help you notice possible connections. Give it the target problem and ask for a few candidate source ideas, each with a proposed relationship and an important mismatch. Ask which part would require expertise you do not currently have. The output should help you choose an investigation, rather than create an obligation to study every field mentioned.

Audy might receive suggestions about software testing, editorial review, quality control, or decision analysis. She chooses one because it addresses the specific defect in her brief. A less relevant but fascinating connection goes into her curiosity map for possible later use. Selecting it now would displace the work needed to inspect the current adaptation.

Ask the assistant to provide a counterexample to the chosen analogy. For a rule that requires every field to be complete, the missing-owner case is a useful challenge. Then inspect the counterexample yourself. The assistant can misunderstand the source idea, invent a limitation, or produce a case that does not actually challenge the relationship.

If the source field is unfamiliar, request an explanation using a modest example and verify the load-bearing claims in an appropriate source. You need not study the whole discipline. You do need enough knowledge to avoid borrowing a technical term whose meaning changes every time you use it.

Keep the final choice in your own words. “I used the assistant's third suggestion” will mean little later. “I compared stated requirements because exact wording rejected valid action lists” describes both the source of the idea and the reason it belongs in your project.

## Test your understanding in a changed case

Close the connection map and explain the borrowed relationship without using its technical label. Audy can say: compare the claim an output makes with the evidence in its input, and preserve the uncertainty when that evidence is missing. Then she names a condition where this will not be enough: the input itself could be wrong or incomplete.

Next change a relevant feature of the example. Move from an owner missing in the notes to a deadline stated only as “soon.” Does the rule encourage a precise date the notes never supplied? Audy should be able to identify the same class of problem without copying the earlier answer.

This check is evidence about her application to the changed case. It does not establish that she will recognize every distant version of the problem. Record what changed between examples and what remained constant. That is a more useful transfer claim than saying the concept has become universal.

If the new case defeats your explanation, return to the map. The source idea may have been misunderstood, the target situation may differ more than expected, or your previous success may have depended on a superficial cue. Each possibility suggests a different repair. A failed transfer attempt is informative when you can locate the mismatch.

## Adapt the connection to another kind of work

A service professional might borrow the idea of a dependency check when assembling a proposal. Which promises depend on client inputs that have not yet been supplied? The connection is useful if the proposal distinguishes an available service from one blocked by missing information. It becomes misleading if the checklist hides a conversation needed to understand the client's situation.

An educator might connect editorial revision with feedback on a learner's explanation. The transferable operation is identifying a change that improves meaning. The mismatch is that an editor may directly repair a sentence while the learner needs an opportunity to make and understand the repair. Design the next attempt accordingly.

A software builder might borrow a facilitator's practice of restating an agreement before proceeding. In a product, this could become a review screen that makes a consequential action understandable. The analogy does not prove that the screen is usable or that its defaults are appropriate. Test the actual wording and behavior with the people who will encounter it.

In each domain, learning enough about the target lets you inspect the adaptation and recognize what the source idea cannot supply.

## Field assignment: make one connection earn its place

Open the [connection map](../artifacts/06-connection-map.md). Choose a specific difficulty in your current project and one idea from another domain that might help. Describe the source situation, the target, the relationship you propose to carry over, and at least one mismatch that could invalidate the application.

Write the decision you will change if the adaptation proves useful. Then construct a small comparison that can reveal a defect in the adaptation itself. Keep the input, the original approach, the changed approach, and the review reason. Do not count a more impressive description as improved performance.

The artifact is ready when another reader can explain the connection, locate its boundary, and trace the decision to a concrete test. A well-supported rejection is an equally useful result.

Repair a vague map by naming the actual relationship. Repair an overextended analogy by removing the parts that do not fit. Repair an inconclusive test by changing an input or criterion that can distinguish the alternatives. Seek specialist review where you cannot judge the borrowed concept well enough to rely on it.

Audy keeps a revised review sheet that permits faithful paraphrases, exposes invented details, and preserves missing ownership. She also keeps the rejected completeness rule and the reason it failed. These records give her something to reuse. [Chapter 7](07-the-accumulated-curiosity-loop.md) connects the earlier inquiries into a working procedure so that each new attempt can benefit from the ones before it.

## References

Barnett, S. M., & Ceci, S. J. (2002). When and where do we apply what we learn? A taxonomy for far transfer. *Psychological Bulletin, 128*(4), 612–637. https://doi.org/10.1037/0033-2909.128.4.612

Grace, M., Hadfield, J., Olivares, R., & De Jonghe, J. (2026, January 9). *Demystifying evals for AI agents*. Anthropic. https://www.anthropic.com/engineering/demystifying-evals-for-ai-agents

The Future Is Solo. (2026). *The Future Is Solo 20260910* [Google Slides presentation]. https://docs.google.com/presentation/d/1dvbBGs22QvtGogevZ6f5mf8YQE7WDAPBwYlclhTyctI/edit

<!-- sources: barnett2002, grace2026, tfis-experiments-20260910 -->
