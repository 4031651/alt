(function () {
    var doctypes = {
        'xhtml11':       '<!DOCTYPE html PUBLIC "-//W3C//DTD XHTML 1.1//EN" "http://www.w3.org/TR/xhtml11/DTD/xhtml11.dtd">',
        'xhtml1-strict': '<!DOCTYPE html PUBLIC "-//W3C//DTD XHTML 1.0 Strict//EN" "http://www.w3.org/TR/xhtml1/DTD/xhtml1-strict.dtd">',
        'xhtml1-trans':  '<!DOCTYPE html PUBLIC "-//W3C//DTD XHTML 1.0 Transitional//EN" "http://www.w3.org/TR/xhtml1/DTD/xhtml1-transitional.dtd">',
        'xhtml1-frame':  '<!DOCTYPE html PUBLIC "-//W3C//DTD XHTML 1.0 Frameset//EN" "http://www.w3.org/TR/xhtml1/DTD/xhtml1-frameset.dtd">',
        'html5':         '<!DOCTYPE html>',
        'html4-strict':  '<!DOCTYPE HTML PUBLIC "-//W3C//DTD HTML 4.01//EN" "http://www.w3.org/TR/html4/strict.dtd">',
        'html4-trans':   '<!DOCTYPE HTML PUBLIC "-//W3C//DTD HTML 4.01 Transitional//EN" "http://www.w3.org/TR/html4/loose.dtd">',
        'html4-frame':   '<!DOCTYPE HTML PUBLIC "-//W3C//DTD HTML 4.01 Frameset//EN" "http://www.w3.org/TR/html4/frameset.dtd">'
    };

    var allTags = [//special
        'root', 'block', 'doctype', 'IF', 'EACH', 'LET',
        //common
        'a', 'abbr', 'acronym', 'address', 'applet', 'area', 'article', 'aside', 'audio', 'b', 'base', 'basefont', 'bdi',
        'bdo', 'big', 'blockquote', 'body', 'br', 'button', 'canvas', 'caption', 'center', 'cite', 'code', 'col', 'colgroup', 'command', 'datalist',
        'dd', 'del', 'details', 'dfn', 'dialog', 'dir', 'div', 'dl', 'dt', 'em', 'embed', 'fieldset', 'figcaption', 'figure', 'font', 'footer',
        'form', 'frame', 'frameset', 'h1 to <h6>', 'head', 'header', 'hgroup', 'hr', 'html', 'i', 'iframe', 'img', 'input', 'ins', 'kbd', 'keygen',
        'label', 'legend', 'li', 'link', 'map', 'mark', 'menu', 'meta', 'meter', 'nav', 'noframes', 'noscript', 'object', 'ol', 'optgroup', 'option',
        'output', 'p', 'param', 'pre', 'progress', 'q', 'rp', 'rt', 'ruby', 's', 'samp', 'script', 'section', 'select', 'small', 'source', 'span',
        'strike', 'strong', 'style', 'sub', 'summary', 'sup', 'table', 'tbody', 'td', 'textarea', 'tfoot', 'th', 'thead', 'time', 'title', 'tr',
        'track', 'tt', 'u', 'ul', 'var', 'video', 'wbr'
    ];

    var unpairedTags = ['area', 'base', 'basefont', 'br', 'col', 'colgroup', 'dd', 'dt', 'embed', 'frame', 'hr', 'img', 'input', 'link', 'meta', 'wbr'],
        flowControls = ['IF', 'EACH', 'LET'];
    
    function Tag(s) {
        this.s_ = s;
    }
    Tag.prototype.toString = function () {
        return this.s_;
    };

    function Attr(s) {
        this.s_ = s;
    }
    Attr.prototype.toString = function () {
        return this.s_;
    };

    function trim(s) {
        return s.replace(/^\s+|\s+$/g, '');
    }

    function alt(code) {
        /*jshint -W055*/
        if (!(this instanceof alt)) {
            return new alt(code);
        }
        /*jshint +W055*/
        this.lineSep = '';

        code = code.toString()
            .replace(/^function *[a-z0-9_]* *\( *\) *{/i, 'function () {with(this.scope) {(root,')
            .replace(/} *$/, ')}}');
        code = this.parseCtrls(code)
            .replace(/\( *[a-z_]+[a-z_0-9\.]*/ig, function (elem) {
                if (elem.indexOf('.') > 0) {
                    return elem;
                }
                elem = trim(elem.substring(1));
                if (allTags.indexOf(elem) == -1) {
                    return 'this.attr("' + elem + '"';
                }
                return 'this.tag("' + elem + '"';
            });
        /*jshint -W054*/
        this.parse = new Function('return ' + code)();
        /*jshint +W054*/
    }
    alt.prototype = {
        constructor: alt,
        parseCtrls: function (code) {
            var stack = [], output = '';
            function isEach(pos, str) {
                return str.substring(pos, pos + 4) == 'EACH';
            }
            function isLet(pos, str) {
                return str.substring(pos, pos + 3) == 'LET';
            }

            for (var i = 0; i < code.length; i++) {
                if (isEach(i, code)) {
                    stack.unshift({
                        state: 'startVarList',
                        next: /[a-z_]/,
                        // 1                                           2
                        //⎻↧⎻⎻⎻⎻⎻⎻⎻⎻⎻⎻⎻⎻⎻⎻⎻⎻⎻⎻⎻⎻⎻⎻⎻⎻⎻⎻⎻⎻⎻⎻⎻⎻⎻⎻⎻⎻⎻⎻⎻⎻⎻⎻⎻↴
                        // (EACH, "list", "elem", function () { return (block,
                        bracket: 2
                    });
                    i = i + 3;
                    output += 'EACH';
                } else if (isLet(i, code)) {
                    stack.unshift({
                        state: 'startLetVar',
                        next: /[a-z_]/,
                        // 1                                   2
                        //⎻↧⎻⎻⎻⎻⎻⎻⎻⎻⎻⎻⎻⎻⎻⎻⎻⎻⎻⎻⎻⎻⎻⎻⎻⎻⎻⎻⎻⎻⎻⎻⎻⎻⎻⎻⎻↴
                        // (LET, "a", 20, function () { return (block,
                        bracket: 2
                    });
                    i = i + 2;
                    output += 'LET';
                } else if (stack.length && stack[0].next.test(code[i])) {
                    switch (stack[0].state) {
                        // EACH
                    case 'startVarList':
                        stack[0].state = 'endVarList';
                        stack[0].next = /[ ,]/;
                        output += '"' + code[i];
                        break;
                    case 'endVarList':
                        stack[0].state = 'startVarItem';
                        stack[0].next = /[a-z0-9_]/;
                        output += '"' + code[i];
                        break;
                    case 'startVarItem':
                        stack[0].state = 'endVarItem';
                        stack[0].next = /[ ,]/;
                        output += '"' + code[i];
                        break;
                    // LET
                    case 'startLetVar':
                        stack[0].state = 'endLetVar';
                        stack[0].next = /[ ,]/;
                        output += '"' + code[i];
                        break;
                    // COMMON
                    case 'endVarItem': // EACH
                    case 'endLetVar': // LET
                        stack[0].state = 'startBody';
                        stack[0].next = /\(/;
                        output += '"' + code[i];
                        break;
                    case 'startBody':
                        stack[0].state = 'waitEnd';
                        stack[0].next = /\(|\)/;
                        output += 'function () { return (block, ' + code[i];
                        break;
                    case 'waitEnd':
                        if (code[i] == '(') {
                            stack[0].bracket += 1;
                        } else {
                            stack[0].bracket -= 1;
                        }
                        if (stack[0].bracket === 0) {
                            output += ')}';
                            // code[i] is ")"
                            // process this bracket in parent sctack frame
                            i--;
                            stack.shift();
                        } else {
                            output += code[i];
                        }
                        break;
                    default:
                        break;
                    }
                } else {
                    output += code[i];
                }
            }
            return output;
        },
        ///////////////////////
        //    Special tags   //
        ///////////////////////
        doctype: function (type) {
            type = type in doctypes ? doctypes[type] : type;
            return new Tag(type);
        },
        root: function (elems) {
            this.output = elems.join(this.lineSep);
        },
        block: function (elems) {
            return elems.join(this.lineSep);
        },
        ///////////////////////
        //   Flow controls   //
        ///////////////////////
        IF: function (cond, tArg, fArg) {
            return (cond ? tArg : fArg) + this.lineSep;
        },
        EACH: function (listName, itemName, iterFunc) {
            var i = 0,
                list = this.scope[listName],
                len = list.length,
                output = '';
    
            for (; i < len; i++) {
                this.scope[itemName] = list[i];
                this.scope.$I = i;
                output += iterFunc.call(this);
            }
            delete this.scope.$I;
            delete this.scope[itemName];
            return output;
        },
        LET: function (name, value, func) {
            var oldval = this.scope[name],
                output = '';
    
            this.scope[name] = value;
            output = func.call(this);
    
            if (typeof oldval == 'undefined') {
                delete this.scope[name];
            } else {
                this.scope[name] = oldval;
            }
            return output;
        },
        ///////////////////////
        //  Common use case  //
        ///////////////////////
        tag: function (name) {
            var args = Array.prototype.slice.call(arguments, 1);
            if (name == 'doctype') {
                return this.doctype(args[0]);
            } else if (name == 'root' || name == 'block') {
                return this[name](args);
            } else if (flowControls.indexOf(name) != -1) {
                return this[name].apply(this, args);
            }
    
            var repr = '<' + name + ' ',
                i, attrs = [], text = '';
            for (i = 0; i < args.length; i++) {
                if (args[i] instanceof Attr) {
                    attrs.push(args[i].toString());
                /*} else if (args[i] instanceof Tag) {
                    text += args[i].toString();*/
                } else {
                    text += args[i].toString();
                }
            }
            repr += attrs.join(' ');
            if (text.length) {
                repr = repr + " >" + this.lineSep + text + this.lineSep + "</" + name + '>' + this.lineSep;
            } else if (unpairedTags.indexOf(name) == -1) {
                repr = repr + " ></" + name + '>' + this.lineSep;
            } else {
                repr += " />" + this.lineSep;
            }
            return new Tag(repr);
        },
        attr: function (name, val) {
            name = name == '_style' ? 'style' : name;
            return new Attr(name + '="' + val.replace('"', '\"') + '"');
        },
        render: function (scope) {
            this.scope = scope;
            this.parse();
            return this.output;
        }
    };
    
    this.alt = alt;
}());
