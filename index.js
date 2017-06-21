const hook = require('node-hook')

global.requireDefault = (obj) => (obj && obj.__esModule ? obj.default : obj)

const transformations = [
  {
    regexp: /^\s*import\s+\*\s+as\s+(.*)\s+from\s+'(.*)'\s*$/,
    apply: (match) => `const ${match[1]} = require('${match[2]}')`
  },
  {
    regexp: /^\s*import\s+([a-zA-Z0-9-_]*)\s+from\s+'(.*)'\s*$/,
    apply: (match) => `const ${match[1]} = requireDefault(require('${match[2]}'))`
  },
  {
    regexp: /^\s*import\s+([a-zA-Z0-9-_]*),\s+(\{.*})\s+from\s+'(.*)'\s*$/,
    apply: (match) => `const ${match[1]} = requireDefault(require('${match[3]}')); const ${match[2].replace(' as ', ': ')} = require('${match[3]}')`
  },
  {
    regexp: /^\s*import\s+(\{.*}),\s+([a-zA-Z0-9-_]*)\s+from\s+'(.*)'\s*$/,
    apply: (match) => `const ${match[2]} = requireDefault(require('${match[3]}')); const ${match[1].replace(' as ', ': ')} = require('${match[3]}')`
  },
  {
    regexp: /^\s*import\s+(\{.*})\s+from\s+'(.*)'\s*$/,
    apply: (match) => `const ${match[1].replace(' as ', ': ')} = require('${match[2]}')`
  },
  {
    regexp: /^\s*export\s+default\s+(.*)\s*$/,
    apply: (match) => `module.exports.__esModule = true; module.exports.default = ${match[1]}`
  },
  {
    regexp: /^\s*export\s+const\s+([a-zA-Z0-9-_]*)\s+(.*)\s*$/,
    apply: (match) => `module.exports.__esModule = true; const ${match[1]} = module.exports.${match[1]} ${match[2]}`
  },
  {
    regexp: /^\s*export\s+class\s+([a-zA-Z0-9-_]*)\s+(.*)\s*$/,
    apply: (match) => `module.exports.__esModule = true; const ${match[1]} = module.exports.${match[1]} = class ${match[1]} ${match[2]}`
  },
  {
    regexp: /^\s*export\s+(async\s+|)function\s+([a-zA-Z0-9-_]*)\s+(.*)\s*$/,
    apply: (match) => `module.exports.__esModule = true; module.exports.${match[2]} = ${match[2]}; ${match[1]} function ${match[2]} ${match[3]}`
  }
]

function rewriteImport (source) {
  return source.split('\n')
    .map((line) => {
      let outline = line
      transformations.forEach((transformation) => {
        const match = line.match(transformation.regexp)
        if (match) {
          outline = transformation.apply(match)
        }
      })
      return outline
    })
    .join('\n')
}

hook.hook('.js', rewriteImport)
