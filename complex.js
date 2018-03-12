#!/usr/bin/env nodejs

const mustache = require('mustache')

const template = `
  <h1>Report</h1>
  <table>
    <tr>
      <th>Question></th>{{#alts}}
      <th>{{.}}</th>{{/alts}}
    </tr>
    {{#answers}}
     <tr>
       <td>{{id}}</td>{{#alts}}
       <td{{{klass}}}>{{val}}%</td>{{/alts}}
     </tr>
    {{/answers}}
  </table>  
`;

function klass(ctx) {
  let classes = []
  if (ctx.correct) classes.push('correct');
  if (ctx.distract) classes.push('distract');
  return classes.length === 0 ? '' : ` class="${classes.join(' ')}"`;
}

const view = {
  alts: [ 'a', 'b', 'c' ],
  klass: function() { return klass(this); },
  answers: [
    { id: 1,
      alts: [
	{ val: 10 },
	{ val: 20 },
	{ val: 70, correct: true }
      ]
    },
    { id: 2,
      alts: [
	{ val: 10 },
	{ val: 40, correct: true },
	{ val: 50, distract: true }
      ]
    }
  ]
};

console.log(mustache.render(template, view));
