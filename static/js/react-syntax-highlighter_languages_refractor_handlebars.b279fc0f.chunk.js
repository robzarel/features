"use strict";(self.webpackChunkfeatures=self.webpackChunkfeatures||[]).push([[3846,3047],{4490:function(e,n,a){var t=a(595);function r(e){e.register(t),function(e){e.languages.handlebars={comment:/\{\{![\s\S]*?\}\}/,delimiter:{pattern:/^\{\{\{?|\}\}\}?$/i,alias:"punctuation"},string:/(["'])(?:\\.|(?!\1)[^\\\r\n])*\1/,number:/\b0x[\dA-Fa-f]+\b|(?:\b\d+\.?\d*|\B\.\d+)(?:[Ee][+-]?\d+)?/,boolean:/\b(?:true|false)\b/,block:{pattern:/^(\s*~?\s*)[#\/]\S+?(?=\s*~?\s*$|\s)/i,lookbehind:!0,alias:"keyword"},brackets:{pattern:/\[[^\]]+\]/,inside:{punctuation:/\[|\]/,variable:/[\s\S]+/}},punctuation:/[!"#%&'()*+,.\/;<=>@\[\\\]^`{|}~]/,variable:/[^!"#%&'()*+,.\/;<=>@\[\\\]^`{|}~\s]+/},e.hooks.add("before-tokenize",(function(n){e.languages["markup-templating"].buildPlaceholders(n,"handlebars",/\{\{\{[\s\S]+?\}\}\}|\{\{[\s\S]+?\}\}/g)})),e.hooks.add("after-tokenize",(function(n){e.languages["markup-templating"].tokenizePlaceholders(n,"handlebars")}))}(e)}e.exports=r,r.displayName="handlebars",r.aliases=[]},595:function(e){function n(e){!function(e){function n(e,n){return"___"+e.toUpperCase()+n+"___"}Object.defineProperties(e.languages["markup-templating"]={},{buildPlaceholders:{value:function(a,t,r,o){if(a.language===t){var s=a.tokenStack=[];a.code=a.code.replace(r,(function(e){if("function"===typeof o&&!o(e))return e;for(var r,i=s.length;-1!==a.code.indexOf(r=n(t,i));)++i;return s[i]=e,r})),a.grammar=e.languages.markup}}},tokenizePlaceholders:{value:function(a,t){if(a.language===t&&a.tokenStack){a.grammar=e.languages[t];var r=0,o=Object.keys(a.tokenStack);!function s(i){for(var u=0;u<i.length&&!(r>=o.length);u++){var l=i[u];if("string"===typeof l||l.content&&"string"===typeof l.content){var c=o[r],p=a.tokenStack[c],g="string"===typeof l?l:l.content,f=n(t,c),d=g.indexOf(f);if(d>-1){++r;var k=g.substring(0,d),b=new e.Token(t,e.tokenize(p,a.grammar),"language-"+t,p),h=g.substring(d+f.length),m=[];k&&m.push.apply(m,s([k])),m.push(b),h&&m.push.apply(m,s([h])),"string"===typeof l?i.splice.apply(i,[u,1].concat(m)):l.content=m}}else l.content&&s(l.content)}return i}(a.tokens)}}}})}(e)}e.exports=n,n.displayName="markupTemplating",n.aliases=[]}}]);
//# sourceMappingURL=react-syntax-highlighter_languages_refractor_handlebars.b279fc0f.chunk.js.map