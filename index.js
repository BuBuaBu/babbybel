const hook = require('node-hook')

global.requireDefault = (obj) => (obj && obj.__esModule ? obj.default : obj)

const transformations = [
  {
    regexp: /^import \* as (.*) from '(.*)'$/,
    apply: (match) => `const ${match[1]} = require('${match[2]}')`
  },
  {
    regexp: /^import ([a-zA-Z0-9-_]*) from '(.*)'$/,
    apply: (match) => `const ${match[1]} = requireDefault(require('${match[2]}'))`
  },
  {
    regexp: /^import ([a-zA-Z0-9-_]*), (\{.*}) from '(.*)'$/,
    apply: (match) => `const ${match[1]} = requireDefault(require('${match[3]}')); const ${match[2].replace(' as ', ': ')} = require('${match[3]}')`
  },
  {
    regexp: /^import (\{.*}), ([a-zA-Z0-9-_]*) from '(.*)'$/,
    apply: (match) => `const ${match[2]} = requireDefault(require('${match[3]}')); const ${match[1].replace(' as ', ': ')} = require('${match[3]}')`
  },
  {
    regexp: /^import (\{.*}) from '(.*)'$/,
    apply: (match) => `const ${match[1].replace(' as ', ': ')} = require('${match[2]}')`
  },
  {
    regexp: /^export default (.*)$/,
    apply: (match) => `module.exports.__esModule = true; module.exports.default = ${match[1]}`
  },
  {
    regexp: /^export const ([a-zA-Z0-9-_]*) (.*)$/,
    apply: (match) => `module.exports.__esModule = true; const ${match[1]} = module.exports.${match[1]} ${match[2]}`
  },
  {
    regexp: /^export class ([a-zA-Z0-9-_]*) (.*)$/,
    apply: (match) => `module.exports.__esModule = true; const ${match[1]} = module.exports.${match[1]} = class ${match[1]} ${match[2]}`
  },
  {
    regexp: /^export function ([a-zA-Z0-9-_]*) (.*)$/,
    apply: (match) => `module.exports.__esModule = true; module.exports.${match[1]} = ${match[1]}; function ${match[1]} ${match[2]}`
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
