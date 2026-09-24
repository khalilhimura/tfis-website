/**
 * WebMCP Bridge for SovMemGrok
 * Exposes SovMem records and operations via MCP tools
 */

(function() {
  'use strict';

  // Wait for WebMCP library and app to load
  if (typeof WebMCP === 'undefined') {
    console.error('WebMCP library not loaded');
    return;
  }

  // Initialize WebMCP
  const webmcp = new WebMCP({
    name: 'SovMemGrok',
    description: 'Sovereign Memory Filter for Solo Systems Architects - browser-local knowledge management with claims, decisions, and corrections',
    version: '1.0.0'
  });

  function getRecords() {
    window.sovmem.refresh();
    return window.sovmem.records();
  }

  function toolResult(text, isError = false) {
    return { isError, content: [{ type: 'text', text }] };
  }

  // This vendored client takes positional registration arguments.
  function registerTool({ name, description, inputSchema, handler }) {
    webmcp.registerTool(name, description, inputSchema, handler);
  }
  function registerResource({ name, description, uri, mimeType, fetch }) {
    webmcp.registerResource(name, description, { uri, mimeType }, fetch);
  }

  // Helper: Format record for display
  function formatRecord(record) {
    return `ID: ${record.id}
Type: ${record.type}
Title: ${record.title}
Review: ${record.review_status}
Created: ${record.created_at}
Updated: ${record.updated_at}

Body:
${record.body}

Provenance: ${record.provenance}
Stop Rule: ${record.stop_rule}

${record.revisions && record.revisions.length > 0 ? `Revisions: ${record.revisions.length}` : 'No revisions'}`;
  }

  // Register Resource: Current records
  registerResource({
    uri: 'sovmem://records',
    name: 'SovMem Records',
    description: 'Current browser-local records (claims, decisions, corrections)',
    mimeType: 'application/json',
    fetch: async () => {
      const records = getRecords();
      return {
        contents: [{
          uri: 'sovmem://records',
          mimeType: 'application/json',
          text: JSON.stringify(records, null, 2)
        }]
      };
    }
  });

  // Tool: List records
  registerTool({
    name: 'sovmem_list',
    description: 'List SovMem records with optional filters (type: claim|decision|correction, review: unreviewed|reviewed|needs-revision, search: text)',
    inputSchema: {
      type: 'object',
      properties: {
        type: {
          type: 'string',
          enum: ['claim', 'decision', 'correction'],
          description: 'Filter by record type'
        },
        review: {
          type: 'string',
          enum: ['unreviewed', 'reviewed', 'needs-revision'],
          description: 'Filter by review status'
        },
        search: {
          type: 'string',
          description: 'Search in title, body, provenance, or stop rule'
        }
      }
    },
    handler: async (args) => {
      let records = getRecords();
      
      // Apply filters
      if (args.type) {
        records = records.filter(r => r.type === args.type);
      }
      if (args.review) {
        records = records.filter(r => r.review_status === args.review);
      }
      if (args.search) {
        const query = args.search.toLowerCase();
        records = records.filter(r => 
          r.title.toLowerCase().includes(query) ||
          r.body.toLowerCase().includes(query) ||
          r.provenance.toLowerCase().includes(query) ||
          r.stop_rule.toLowerCase().includes(query)
        );
      }

      const summary = `Found ${records.length} record(s)${args.type ? ` of type ${args.type}` : ''}${args.review ? ` with review status ${args.review}` : ''}${args.search ? ` matching "${args.search}"` : ''}`;
      
      const list = records.map(r => 
        `- [${r.type}] ${r.title} (${r.review_status}) - ID: ${r.id}`
      ).join('\n');

      return {
        content: [{
          type: 'text',
          text: `${summary}\n\n${list || 'No records found.'}`
        }]
      };
    }
  });

  // Tool: Get record by ID
  registerTool({
    name: 'sovmem_get',
    description: 'Get a specific SovMem record by ID',
    inputSchema: {
      type: 'object',
      properties: {
        id: {
          type: 'string',
          description: 'Record ID'
        }
      },
      required: ['id']
    },
    handler: async (args) => {
      const records = getRecords();
      const record = records.find(r => r.id === args.id);
      
      if (!record) {
        return {
          content: [{
            type: 'text',
            text: `Record not found: ${args.id}`
          }]
        };
      }

      return {
        content: [{
          type: 'text',
          text: formatRecord(record)
        }]
      };
    }
  });

  // Tool: Capture new record
  registerTool({
    name: 'sovmem_capture',
    description: 'Capture a new SovMem record (claim, decision, or correction)',
    inputSchema: {
      type: 'object',
      properties: {
        type: {
          type: 'string',
          enum: ['claim', 'decision', 'correction'],
          description: 'Record type'
        },
        title: {
          type: 'string',
          description: 'Record title'
        },
        body: {
          type: 'string',
          description: 'Record body text'
        },
        provenance: {
          type: 'string',
          description: 'Source or context (e.g., "Tuesday standup", "API review")'
        },
        stop_rule: {
          type: 'string',
          description: 'When to stop, revisit, or escalate this record'
        },
        review_status: {
          type: 'string',
          enum: ['unreviewed', 'reviewed', 'needs-revision'],
          description: 'Review status (default: unreviewed)'
        }
      },
      required: ['type', 'title', 'body', 'provenance', 'stop_rule']
    },
    handler: async (args) => {
      try {
        const { record, concerns } = await window.sovmem.capture(args);
        return toolResult(`Captured ${record.type}: "${record.title}" (ID: ${record.id})\nReview: ${record.review_status}${concerns.length ? '\n' + concerns.join('\n') : ''}`);
      } catch (error) { return toolResult(error.message, true); }
    }
  });

  // Tool: Revise record
  registerTool({
    name: 'sovmem_revise',
    description: 'Revise an existing SovMem record',
    inputSchema: {
      type: 'object',
      properties: {
        id: {
          type: 'string',
          description: 'Record ID to revise'
        },
        title: {
          type: 'string',
          description: 'Updated title'
        },
        body: {
          type: 'string',
          description: 'Updated body'
        },
        provenance: {
          type: 'string',
          description: 'Updated provenance'
        },
        stop_rule: {
          type: 'string',
          description: 'Updated stop rule'
        },
        review_status: {
          type: 'string',
          enum: ['unreviewed', 'reviewed', 'needs-revision'],
          description: 'Updated review status'
        },
        revision_reason: {
          type: 'string',
          description: 'Reason for revision'
        }
      },
      required: ['id']
    },
    handler: async (args) => {
      try {
        const { record, concerns } = await window.sovmem.revise(args);
        return toolResult(`Revised "${record.title}" (ID: ${record.id})\nReview: ${record.review_status}${concerns.length ? '\n' + concerns.join('\n') : ''}`);
      } catch (error) { return toolResult(error.message, true); }
    }
  });

  // Tool: Delete record
  registerTool({
    name: 'sovmem_delete',
    description: 'Delete a SovMem record (requires confirm: true)',
    inputSchema: {
      type: 'object',
      properties: {
        id: {
          type: 'string',
          description: 'Record ID to delete'
        },
        confirm: {
          type: 'boolean',
          description: 'Must be true to confirm deletion'
        }
      },
      required: ['id', 'confirm']
    },
    handler: async (args) => {
      try {
        const record = window.sovmem.remove(args);
        return toolResult(`Deleted "${record.title}" (ID: ${record.id})`);
      } catch (error) { return toolResult(error.message, true); }
    }
  });

  // Tool: Export OKF summary
  registerTool({
    name: 'sovmem_export_okf_summary',
    description: 'Get a text summary of the OKF bundle that would be exported (counts and index)',
    inputSchema: {
      type: 'object',
      properties: {}
    },
    handler: async () => {
      const records = getRecords();
      const claims = records.filter(r => r.type === 'claim');
      const decisions = records.filter(r => r.type === 'decision');
      const corrections = records.filter(r => r.type === 'correction');

      const summary = `SovMemGrok OKF Bundle Summary
================================

Total records: ${records.length}
- Claims: ${claims.length}
- Decisions: ${decisions.length}
- Corrections: ${corrections.length}

Would export as: sovmem-grok-okf-YYYY-MM-DD.zip
OKF version: 0.2
Bundle structure:
  index.md (with okf_version: "0.2")
  claims/*.md (${claims.length} files)
  decisions/*.md (${decisions.length} files)
  corrections/*.md (${corrections.length} files)
  ${records.some(r => r.revisions && r.revisions.length > 0) ? 'log.md (chronological updates)' : ''}

Index Preview:
==============

## Claims
${claims.map(r => `* ${r.title} - ${r.review_status}`).join('\n') || '(none)'}

## Decisions
${decisions.map(r => `* ${r.title} - ${r.review_status}`).join('\n') || '(none)'}

## Corrections
${corrections.map(r => `* ${r.title} - ${r.review_status}`).join('\n') || '(none)'}`;

      return {
        content: [{
          type: 'text',
          text: summary
        }]
      };
    }
  });


})();
