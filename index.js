/**
 * treePrinter print a tree
 */
function getTreePrinter(padding) {
	padding = padding || '  ';

	function helper(padded, node) {
		var value = node.value || 'Null';
		var left = node.left;
		var right = node.right;
		console.log(padded + value);
		if (left) helper(padded + padding, left);
		if (right) helper(padded + padding, right);
	}
	return function printTree(node) {
		helper('', node);
	}
}

function printTree(node) {
	var s = [];
	var q = [];
	q.push(node);
	node.level = 0;
	while(q.length !== 0) {
		var tmp = q.shift();
		s.push(tmp);
		if(typeof tmp.left !== 'undefined') {
			q.push(tmp.left);
			tmp.left.level = tmp.level + 1;
		}
		if(typeof tmp.right !== 'undefined') {
			q.push(tmp.right);
			tmp.right.level = tmp.level + 1;
		}
	}
	
	while(s.length !== 0) {
		var tmp = s.pop();
		var len_self = tmp.value.length;
		var len_left = tmp.left ? tmp.left.len : 1;
		var len_right = tmp.right ? tmp.right.len : 0;
		tmp.len = Math.max(len_self, len_left + len_right); 
	}
	
	var level_nodes = [];
	var ret = ''; // line 0
	level_nodes.push(node);
	function undefinedTest(val) { return typeof val !== 'undefined'; }
	while(level_nodes.some(undefinedTest)) {
		var next_level_nodes = [];
		var line1 = '';
		var line2 = '';
		for(var i = 0; i < level_nodes.length; ++i) {
			var n = level_nodes[i];
			if(typeof n === 'undefined') {
				ret += ' ';
				next_level_nodes.push(undefined);
				continue;
			}
			ret += n.value;
			if(n.left) {
				line1 += '|';
				line2 += '|';
			} else {
				line1 += ' ';
				line2 += ' ';
			}
			if(n.right) {
				var len_left = n.left ? n.left.len : 1;
				line1 += '\\';
				for(var j = 0; j < len_left - 1; ++j) { line1 += '_'; line2 += ' '; }
				line2 += '|';
				for(var j = 0; j < n.len - len_left - 1; ++j) { line1 += ' '; line2 += ' '; }
			} else {
				for(var j = 0; j < n.len - 1; ++j) { line1 += ' '; line2 += ' '; }
			}
			for(var j = 0; j < n.len - n.value.length; ++j) ret += ' ';
			if(n.left) next_level_nodes.push(n.left); else next_level_nodes.push(undefined);
			if(n.right) next_level_nodes.push(n.right);
		}
		
		level_nodes = next_level_nodes;
		ret += '\n' + line1 + '\n' + line2 + '\n';
	}
	console.log(ret);
}

/**
 * tokenizer a string into array of tokens
 * token:
 *     name | ( | , | )
 */
function tokenizer(text) {
	if (typeof text !== 'string') return;
	var result = [];
	var prevInWord = false;
	var inWord = false;
	var start = 0;
	for (var i = 0; i < text.length; ++i) {
		var c = text[i];
		var tmp = undefined;
		if (c === '(' || c === ')' || c === ',') { tmp = c; inWord = false; }
		else if (c === ' ' || c === '\n' || c === '\t') { inWord = false; }
		else { inWord = true; }
		if (inWord) {
			if (!prevInWord)
				start = i;
		} else {
			if (prevInWord)
				result.push(text.slice(start, i));
		}

		if (tmp) result.push(tmp);

		prevInWord = inWord;
	}

	if (prevInWord) result.push(text.slice(start, text.length));
	return result;
}

/**
 * parse a tree from text
 * node:
 *  name[([node][,node])]
 */
function makeTree(text) {
	var pars = [];
	var obj = {};
	pars.push(obj);
	var root = obj;
	var tokens = tokenizer(text);
	var prev = '';
	
	var childFlag = 0; // which child are expected 0: no child, 1: left child, 2: right child
	for (var i = 0; i < tokens.length; ++i) {
		var token = tokens[i];
		if(token === '(') {
			childFlag = 1;
			prev = '(';
		} else if(token === ')') {
			if(prev === '#') {
				pars.pop();
				obj = pars[pars.length - 1];
			}
			pars.pop();
			obj = pars[pars.length - 1];
			childFlag = 0;
			prev = ')';
		} else if (token === ',') {
			if(prev === '#') {
				pars.pop();
				obj = pars[pars.length - 1];
			}
			childFlag = 2;
			prev = ',';
		} else {
			if(childFlag === 0)
				obj.value = token;
			else if(childFlag === 1) {
				obj.left = {};
				pars.push(obj.left);
				obj = obj.left;
				obj.value = token;
			} else if(childFlag === 2) {
				obj.right = {};
				pars.push(obj.right);
				obj = obj.right;
				obj.value = token;
			}
			prev = '#';
		}
	}
	return root;
}

printTree(makeTree("NodeA(NodeB(,NodeE(Hello,World)),NodeC(,NodeF))"));