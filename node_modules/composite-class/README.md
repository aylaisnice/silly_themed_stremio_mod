[![view on npm](https://img.shields.io/npm/v/composite-class.svg)](https://www.npmjs.org/package/composite-class)
[![npm module downloads](https://img.shields.io/npm/dt/composite-class.svg)](https://www.npmjs.org/package/composite-class)
[![Build Status](https://travis-ci.org/75lb/composite-class.svg?branch=master)](https://travis-ci.org/75lb/composite-class)
[![Dependency Status](https://badgen.net/david/dep/75lb/composite-class)](https://david-dm.org/75lb/composite-class)
[![js-standard-style](https://img.shields.io/badge/code%20style-standard-brightgreen.svg)](https://github.com/feross/standard)

# composite-class

An isomorphic, load-anywhere JavaScript class for building [composite structures](https://en.wikipedia.org/wiki/Composite_pattern). Suitable for use as a super class or mixin.

## Synopsis

The `Composite` class implements the [composite design pattern](https://en.wikipedia.org/wiki/Composite_pattern), useful for building and traversing tree structures. For example, build a composite structure representing the French government:

```js
const Composite = require('composite-class')

class Person extends Composite {
  constructor (name, role) {
    super()
    this.name = name
    this.role = role
  }

  toString () {
    return `${this.name} [${this.role}]`
  }
}

const government = new Person('Gouvernement de la République française', 'Government')
const headOfState = new Person('Emmanuel Macron', 'Head of State')
const primeMinister = new Person('Édouard Philippe', 'Prime Minister')
const ministerArmedForces = new Person('Florence Parly', 'Minister of the Armed Forces')
const ministerEconomy = new Person('Bruno Le Maire', 'Minister of Finance and the Economy')

government.add(headOfState)
headOfState.add(primeMinister)
primeMinister.add(ministerArmedForces)
primeMinister.add(ministerEconomy)

console.log(government.tree())
```

Output.

```
- Gouvernement de la République française [Government]
  - Emmanuel Macron [Head of State]
    - Édouard Philippe [Prime Minister]
      - Florence Parly [Minister of the Armed Forces]
      - Bruno Le Maire [Minister of Finance and the Economy]
```

The `Composite` class implements an [iterable](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Iteration_protocols#The_iterator_protocol) interface, therefore can be iterated using standard JavaScript methods.

```js
for (const person of government) {
  console.log('Processing:', person.name)
}
```

Output.

```
Processing: Gouvernement de la République française
Processing: Emmanuel Macron
Processing: Édouard Philippe
Processing: Florence Parly
Processing: Bruno Le Maire
```

<a name="module_composite-class"></a>

## composite-class
An isomorphic, load-anywhere JavaScript class for building [composite structures](https://en.wikipedia.org/wiki/Composite_pattern). Suitable for use as a super class or mixin.

**Example**  
```js
const Composite = require('composite-class')
```

* [composite-class](#module_composite-class)
    * [Composite](#exp_module_composite-class--Composite) ⏏
        * [.children](#module_composite-class--Composite+children) : <code>Array</code>
        * [.parent](#module_composite-class--Composite+parent) : <code>Composite</code>
        * [.add()](#module_composite-class--Composite+add) ⇒ <code>Composite</code>
        * [.append(child)](#module_composite-class--Composite+append) ⇒ <code>Composite</code>
        * [.prepend(child)](#module_composite-class--Composite+prepend) ⇒ <code>Composite</code>
        * [.remove(child)](#module_composite-class--Composite+remove) ⇒ <code>Composite</code>
        * [.level()](#module_composite-class--Composite+level) ⇒ <code>number</code>
        * [.getDescendentCount()](#module_composite-class--Composite+getDescendentCount) ⇒ <code>number</code>
        * [.tree()](#module_composite-class--Composite+tree) ⇒ <code>string</code>
        * [.root()](#module_composite-class--Composite+root) ⇒ <code>Composite</code>
        * [.Symbol.iterator()](#module_composite-class--Composite+Symbol.iterator)
        * [.inspect()](#module_composite-class--Composite+inspect)
        * [.parents()](#module_composite-class--Composite+parents) ⇒ <code>Array.&lt;Composite&gt;</code>

<a name="exp_module_composite-class--Composite"></a>

### Composite ⏏
**Kind**: Exported class  
<a name="module_composite-class--Composite+children"></a>

#### composite.children : <code>Array</code>
Children

**Kind**: instance property of [<code>Composite</code>](#exp_module_composite-class--Composite)  
<a name="module_composite-class--Composite+parent"></a>

#### composite.parent : <code>Composite</code>
Parent

**Kind**: instance property of [<code>Composite</code>](#exp_module_composite-class--Composite)  
<a name="module_composite-class--Composite+add"></a>

#### composite.add() ⇒ <code>Composite</code>
Add a child

**Kind**: instance method of [<code>Composite</code>](#exp_module_composite-class--Composite)  
<a name="module_composite-class--Composite+append"></a>

#### composite.append(child) ⇒ <code>Composite</code>
**Kind**: instance method of [<code>Composite</code>](#exp_module_composite-class--Composite)  

| Param | Type | Description |
| --- | --- | --- |
| child | <code>Composite</code> | the child node to append |

<a name="module_composite-class--Composite+prepend"></a>

#### composite.prepend(child) ⇒ <code>Composite</code>
**Kind**: instance method of [<code>Composite</code>](#exp_module_composite-class--Composite)  

| Param | Type | Description |
| --- | --- | --- |
| child | <code>Composite</code> | the child node to prepend |

<a name="module_composite-class--Composite+remove"></a>

#### composite.remove(child) ⇒ <code>Composite</code>
**Kind**: instance method of [<code>Composite</code>](#exp_module_composite-class--Composite)  

| Param | Type | Description |
| --- | --- | --- |
| child | <code>Composite</code> | the child node to remove |

<a name="module_composite-class--Composite+level"></a>

#### composite.level() ⇒ <code>number</code>
depth level in the tree, 0 being root.

**Kind**: instance method of [<code>Composite</code>](#exp_module_composite-class--Composite)  
<a name="module_composite-class--Composite+getDescendentCount"></a>

#### composite.getDescendentCount() ⇒ <code>number</code>
**Kind**: instance method of [<code>Composite</code>](#exp_module_composite-class--Composite)  
<a name="module_composite-class--Composite+tree"></a>

#### composite.tree() ⇒ <code>string</code>
prints a tree using the .toString() representation of each node in the tree

**Kind**: instance method of [<code>Composite</code>](#exp_module_composite-class--Composite)  
<a name="module_composite-class--Composite+root"></a>

#### composite.root() ⇒ <code>Composite</code>
Returns the root instance of this tree.

**Kind**: instance method of [<code>Composite</code>](#exp_module_composite-class--Composite)  
<a name="module_composite-class--Composite+Symbol.iterator"></a>

#### composite.Symbol.iterator()
default iteration strategy

**Kind**: instance method of [<code>Composite</code>](#exp_module_composite-class--Composite)  
<a name="module_composite-class--Composite+inspect"></a>

#### composite.inspect()
Used by node's `util.inspect`.

**Kind**: instance method of [<code>Composite</code>](#exp_module_composite-class--Composite)  
<a name="module_composite-class--Composite+parents"></a>

#### composite.parents() ⇒ <code>Array.&lt;Composite&gt;</code>
Returns an array of ancestors

**Kind**: instance method of [<code>Composite</code>](#exp_module_composite-class--Composite)  

## Load anywhere

This library is compatible with Node.js, the Web and any style of module loader. It can be loaded anywhere, natively without transpilation.

Node.js:

```js
const Composite = require('composite-class')
```

Within Node.js with ECMAScript Module support enabled:

```js
import Composite from 'composite-class'
```

Within an modern browser ECMAScript Module:

```js
import Composite from './node_modules/composite-class/index.mjs'
```

Old browser (adds `window.Composite`):

```html
<script nomodule src="./node_modules/composite-class/dist/index.js"></script>
```

* * *

&copy; 2016-20 Lloyd Brookes \<75pound@gmail.com\>.

Isomorphic test suite by [test-runner](https://github.com/test-runner-js/test-runner) and [web-runner](https://github.com/test-runner-js/web-runner). Documented by [jsdoc-to-markdown](https://github.com/jsdoc2md/jsdoc-to-markdown).
