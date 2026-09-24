# SSA-CMM Assessment Bank

## Documentation

See **[ASSESSMENT-SPEC.md](ASSESSMENT-SPEC.md)** for the complete v0.2 product spec, including:
- UX flow (staircase + optional deep-confirm probes)
- Data shapes (AssessmentState, ProbeClaims)
- Jev battery details
- Open-probe rubric ([probe_rubric.json](probe_rubric.json))

## Overview

The SSA-CMM Field Manual Nº 01 assessment requires a **500-item bank** with the following structure:

- **5 Pillars**: Agency, Clarity, Competence, Accountability, Security
- **6 Levels**: L0, L1, L2, L3, L4, L5 (corresponding to SSA-CMM maturity levels)
- **20 Variants** per pillar-level combination (5 pillars × 6 levels × 20 variants = 600 items)

The actual production bank should be reduced to **500 high-quality items** (approximately 16-17 variants per pillar-level combination).

## Bank Structure

The assessment expects a `bank.json` file in this directory with the following schema:

```json
{
  "version": "1.0",
  "note": "SSA-CMM Field Manual Nº 01 item bank",
  "items": [
    {
      "id": "agency-l0-01",
      "pillar": "Agency",
      "level": "L0",
      "band": 0,
      "technical": "Technical phrasing of the question...",
      "plain": "Plain language phrasing of the question...",
      "context": "Optional context or scenario",
      "scoring": {
        "L0": 1,
        "L1": 2,
        "L2": 3,
        "L3": 4,
        "L4": 5,
        "L5": 6
      }
    }
  ]
}
```

## Field Descriptions

### Required Fields

- **id** (string): Unique identifier for the item (e.g., `"agency-l3-05"`)
- **pillar** (string): One of `["Agency", "Clarity", "Competence", "Accountability", "Security"]`
- **level** (string): One of `["L0", "L1", "L2", "L3", "L4", "L5"]`
- **band** (integer): Numeric level 0-5 corresponding to L0-L5
- **technical** (string): Technical phrasing of the item (for expert users)
- **plain** (string): Plain language phrasing of the item (default mode)
- **scoring** (object): Scoring table mapping response level to score

### Optional Fields

- **context** (string): Additional scenario or context for the item

## Scoring Table

Each item must include a `scoring` object that maps all six levels (L0-L5) to numeric scores. This enables:

1. **Polytomous scoring**: Different responses have different score values
2. **Staircase adaptation**: The engine uses scores to update level estimates
3. **Partial credit**: Responses can have intermediate scores

Example scoring for an L2-difficulty item:
```json
{
  "L0": 1,
  "L1": 2,
  "L2": 3,   // Target level
  "L3": 4,
  "L4": 5,
  "L5": 6
}
```

## Pillar Definitions

### 1. Agency
The capacity to initiate, direct, and terminate work within defined boundaries. Measures:
- Decision authority at each level
- Ability to delegate effectively
- Scope of autonomous operation

### 2. Clarity
The ability to articulate requirements, boundaries, and success criteria. Measures:
- Precision of instructions
- Quality of documentation
- Explainability of processes

### 3. Competence
Technical and domain capability to execute and supervise work. Measures:
- Task execution quality
- Error detection and correction
- Domain knowledge depth

### 4. Accountability
The practice of recording decisions, tracking outcomes, and maintaining audit trails. Measures:
- Decision documentation
- Result verification
- Traceability maintenance

### 5. Security
The implementation of appropriate boundaries, permissions, and safeguards. Measures:
- Permission management
- Data protection
- Risk mitigation practices

## Level Descriptions

- **L0 (Task Operator)**: Direct manual execution, task-by-task
- **L1 (AI-Assisted Operator)**: Uses AI assistance with human oversight per task
- **L2 (Workflow Orchestrator)**: Designs and manages multi-step workflows
- **L3 (Agent Supervisor)**: Supervises autonomous agents with escalation rules
- **L4 (Multi-Agent Architect)**: Coordinates multiple specialized agents
- **L5 (Sovereign Architect)**: Full autonomous cognitive infrastructure with self-improvement

## Current Status

The repository contains a **stub bank** (60 items) for demonstration purposes. This stub:
- Covers all 5 pillars × 6 levels = 30 pillar-level combinations
- Includes 2 variants per combination for basic testing
- Uses placeholder text instead of validated assessment items
- **Is NOT suitable for production use**

## Production Requirements

To deploy a production-ready assessment:

1. **Obtain the validated 500-item bank** from the original SSA-CMM assessment project
2. **Replace the stub** `createStubBank()` function in `app.js` with proper bank loading
3. **Validate the bank** schema matches the structure above
4. **Test adaptivity** across all pillar-level combinations
5. **Verify Jev integration** works with real assessment results

## Item Development Guidelines

If developing new items:

1. **Pillar Alignment**: Each item should clearly measure one pillar
2. **Level Discrimination**: Items should differentiate between adjacent levels
3. **Plain Language**: Ensure both technical and plain versions convey the same concept
4. **Realistic Scenarios**: Base items on actual SSA-CMM practice evidence
5. **Scoring Validity**: Scoring tables should reflect item difficulty and discrimination

## References

- [The Future Is Solo](https://thefutureissolo.com) - SSA-CMM framework
- [Accumulated Curiosity, Chapter 23](https://thefutureissolo.com/accumulated-curiosity/chapters/the-ssa-cmm-ladder/) - SSA-CMM detailed treatment
- Original assessment app: `~/Projects/ssa-cmm` (local development machine)

---

**Last Updated**: 2026-09-24  
**Status**: Awaiting production bank  
**Maintainer**: TFIS Assessment Team
