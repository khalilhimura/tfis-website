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

  // Helper: Get records from localStorage
  function getRecords() {
    try {
      const stored = localStorage.getItem('sovmem-grok-records');
      if (!stored) return [];
      const data = JSON.parse(stored);
      return Array.isArray(data.records) ? data.records : [];
    } catch (e) {
      console.error('Failed to load records:', e);
      return [];
    }
  }

  // Helper: Save records to localStorage
  function saveRecords(records) {
    try {
      const data = {
        version: 1,
        records: records,
        savedAt: new Date().toISOString()
      };
      localStorage.setItem('sovmem-grok-records', JSON.stringify(data));
      return true;
    } catch (e) {
      console.error('Failed to save records:', e);
      return false;
    }
  }

  // Helper: Generate ID
  function generateId() {
    return `${Date.now()}-${Math.random().toString(36).substr(2, 9)}`;
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
  webmcp.registerResource({
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
  webmcp.registerTool({
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
  webmcp.registerTool({
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
  webmcp.registerTool({
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
      const now = new Date().toISOString();
      const record = {
        id: generateId(),
        type: args.type,
        title: args.title,
        body: args.body,
        provenance: args.provenance,
        stop_rule: args.stop_rule,
        review_status: args.review_status || 'unreviewed',
        created_at: now,
        updated_at: now,
        revisions: []
      };

      const records = getRecords();
      records.unshift(record);
      
      if (saveRecords(records)) {
        // Trigger UI refresh if available
        if (window.sovmem && window.sovmem.refresh) {
          window.sovmem.refresh();
        }
        
        return {
          content: [{
            type: 'text',
            text: `Successfully captured ${args.type}: "${args.title}" (ID: ${record.id})`
          }]
        };
      } else {
        return {
          content: [{
            type: 'text',
            text: 'Failed to save record to storage'
          }]
        };
      }
    }
  });

  // Tool: Revise record
  webmcp.registerTool({
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

      // Track changes
      const changes = [];
      const fields = ['title', 'body', 'provenance', 'stop_rule', 'review_status'];
      fields.forEach(field => {
        if (args[field] !== undefined && args[field] !== record[field]) {
          record[field] = args[field];
          changes.push(field);
        }
      });

      if (changes.length > 0) {
        record.updated_at = new Date().toISOString();
        record.revisions.push({
          timestamp: record.updated_at,
          reason: args.revision_reason || 'Updated via MCP',
          fields: changes
        });

        if (saveRecords(records)) {
          // Trigger UI refresh if available
          if (window.sovmem && window.sovmem.refresh) {
            window.sovmem.refresh();
          }
          
          return {
            content: [{
              type: 'text',
              text: `Successfully revised "${record.title}" (ID: ${args.id})\nChanged fields: ${changes.join(', ')}`
            }]
          };
        } else {
          return {
            content: [{
              type: 'text',
              text: 'Failed to save changes to storage'
            }]
          };
        }
      } else {
        return {
          content: [{
            type: 'text',
            text: 'No changes made (no fields were different)'
          }]
        };
      }
    }
  });

  // Tool: Delete record
  webmcp.registerTool({
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
      if (!args.confirm) {
        return {
          content: [{
            type: 'text',
            text: 'Deletion cancelled. Set confirm: true to proceed.'
          }]
        };
      }

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

      const title = record.title;
      const filtered = records.filter(r => r.id !== args.id);
      
      if (saveRecords(filtered)) {
        // Trigger UI refresh if available
        if (window.sovmem && window.sovmem.refresh) {
          window.sovmem.refresh();
        }
        
        return {
          content: [{
            type: 'text',
            text: `Successfully deleted "${title}" (ID: ${args.id})`
          }]
        };
      } else {
        return {
          content: [{
            type: 'text',
            text: 'Failed to delete record from storage'
          }]
        };
      }
    }
  });

  // Tool: Export OKF summary
  webmcp.registerTool({
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

  console.log('WebMCP bridge initialized with 7 tools');
  console.log('Tools:', webmcp.listTools().map(t => t.name).join(', '));
})();
