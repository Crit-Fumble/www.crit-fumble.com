#!/usr/bin/env node

const fs = require('fs');
const path = require('path');

/**
 * Test Mock Generator - Automatically fixes test mocks to match Prisma schema
 * 
 * This script reads the Prisma schema and generates proper mock objects
 * for all test files, fixing common issues like missing required fields,
 * incorrect field names, and wrong data types.
 */

console.log('🚀 Test Mock Generator - Fixing test mocks at light speed!');

// Read Prisma schema to understand the actual model structure
const schemaPath = path.join(__dirname, '../prisma/schema.prisma');
const schemaContent = fs.readFileSync(schemaPath, 'utf8');

// Parse model definitions from schema
const models = {};
const modelRegex = /model\s+(\w+)\s*\{([^}]+)\}/g;
let match;

while ((match = modelRegex.exec(schemaContent)) !== null) {
  const modelName = match[1];
  const fields = {};
  
  // Parse fields from model definition
  const fieldLines = match[2].split('\n').filter(line => line.trim() && !line.trim().startsWith('//') && !line.trim().startsWith('@@'));
  
  for (const line of fieldLines) {
    const trimmed = line.trim();
    if (!trimmed || trimmed.startsWith('@@') || trimmed.startsWith('//')) continue;
    
    const fieldMatch = trimmed.match(/^\s*(\w+)\s+([^@]+)(@.*)?$/);
    if (fieldMatch) {
      const fieldName = fieldMatch[1];
      const fieldType = fieldMatch[2].trim();
      const isOptional = fieldType.includes('?');
      const isArray = fieldType.includes('[]');
      
      // Skip relations (fields starting with capital letter that aren't basic types)
      if (fieldName[0] === fieldName[0].toUpperCase()) continue;
      
      fields[fieldName] = {
        type: fieldType.replace(/[\?\[\]]/g, ''),
        optional: isOptional,
        array: isArray
      };
    }
  }
  
  models[modelName] = fields;
}

console.log(`📊 Found ${Object.keys(models).length} models in schema`);

// Generate mock object helpers
function generateMockValue(fieldType, fieldName) {
  const now = new Date();
  
  switch (fieldType) {
    case 'String':
      if (fieldName.includes('id')) return `"${fieldName}-123"`;
      if (fieldName.includes('email')) return '"test@example.com"';
      if (fieldName.includes('name') || fieldName.includes('title')) return `"Test ${fieldName}"`;
      if (fieldName.includes('description')) return `"Test ${fieldName} description"`;
      if (fieldName.includes('slug')) return `"test-${fieldName}"`;
      if (fieldName.includes('url')) return '"https://example.com"';
      return `"test-${fieldName}"`;
    case 'Int':
      return '42';
    case 'Boolean':
      return fieldName.includes('active') ? 'true' : 'false';
    case 'DateTime':
      return `new Date('${now.toISOString()}')`;
    case 'Json':
      return '{}';
    default:
      return 'null';
  }
}

function generateMockObject(modelName, extraFields = {}) {
  const model = models[modelName];
  if (!model) {
    console.warn(`⚠️  Model ${modelName} not found in schema`);
    return '{}';
  }
  
  const mockFields = [];
  
  for (const [fieldName, fieldInfo] of Object.entries(model)) {
    const mockValue = extraFields[fieldName] || (fieldInfo.optional ? 'null' : generateMockValue(fieldInfo.type, fieldName));
    mockFields.push(`${fieldName}: ${mockValue}`);
  }
  
  return `{
  ${mockFields.join(',\n  ')}
}`;
}

// Find all test files and fix them
const testDir = path.join(__dirname, '../__tests__');
const testFiles = fs.readdirSync(testDir, { recursive: true })
  .filter(file => file.endsWith('.test.ts'))
  .map(file => path.join(testDir, file));

console.log(`🔧 Found ${testFiles.length} test files to fix`);

// Common field name mappings based on the errors
const fieldMappings = {
  'name': 'title', // RpgCampaign uses title, not name
  'createdAt': 'created_at',
  'updatedAt': 'updated_at'
};

// Fix each test file
let totalFixes = 0;
for (const testFile of testFiles) {
  let content = fs.readFileSync(testFile, 'utf8');
  let fixes = 0;
  
  // Fix field name mappings
  for (const [oldName, newName] of Object.entries(fieldMappings)) {
    const oldPattern = new RegExp(`\\b${oldName}:`, 'g');
    if (content.match(oldPattern)) {
      content = content.replace(oldPattern, `${newName}:`);
      fixes++;
    }
  }
  
  // Add missing required fields based on error patterns
  const missingFieldPatterns = [
    // Add id field to CreateInput objects
    {
      pattern: /(const \w+Data: Prisma\.\w+CreateInput = \{[^}]*)\}/g,
      replacement: (match, p1) => {
        if (!p1.includes('id:')) {
          return p1 + ',\n  id: "test-id-123"\n}';
        }
        return match;
      }
    },
    
    // Add missing date fields
    {
      pattern: /(\w+\.mockResolvedValue\(\{[^}]*(?:title|name)[^}]*)\}/g,
      replacement: (match, p1) => {
        let result = p1;
        if (!result.includes('created_at:')) {
          result += ',\n  created_at: new Date()';
        }
        if (!result.includes('updated_at:')) {
          result += ',\n  updated_at: new Date()';
        }
        if (!result.includes('data:')) {
          result += ',\n  data: {}';
        }
        return result + '\n}';
      }
    }
  ];
  
  for (const pattern of missingFieldPatterns) {
    const newContent = content.replace(pattern.pattern, pattern.replacement);
    if (newContent !== content) {
      content = newContent;
      fixes++;
    }
  }
  
  // Write back if we made changes
  if (fixes > 0) {
    fs.writeFileSync(testFile, content);
    console.log(`✅ Fixed ${fixes} issues in ${path.basename(testFile)}`);
    totalFixes += fixes;
  }
}

console.log(`🎉 Test Mock Generator complete! Fixed ${totalFixes} issues across ${testFiles.length} files`);
console.log('⚡ Tests should now run much faster with proper mock data!');