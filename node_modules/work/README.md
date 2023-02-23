[![view on npm](https://badgen.net/npm/v/work)](https://www.npmjs.org/package/work)
[![npm module downloads](https://badgen.net/npm/dt/work)](https://www.npmjs.org/package/work)
[![Gihub repo dependents](https://badgen.net/github/dependents-repo/75lb/work)](https://github.com/75lb/work/network/dependents?dependent_type=REPOSITORY)
[![Gihub package dependents](https://badgen.net/github/dependents-pkg/75lb/work)](https://github.com/75lb/work/network/dependents?dependent_type=PACKAGE)
[![Node.js CI](https://github.com/75lb/work/actions/workflows/node.js.yml/badge.svg)](https://github.com/75lb/work/actions/workflows/node.js.yml)
[![js-standard-style](https://img.shields.io/badge/code%20style-standard-brightgreen.svg)](https://github.com/feross/standard)

# work

Isomorphic, async iterable command queue. WIP.

Benefits to building a command structure.

* Can run the structure again later if it failed (e.g. you're offline).
* Atomic completion, can roll back unless the entire workload succeeded
* Attach a view
* Common, reusable interfaces, standardising the approach to a common task.
* Configurable concurrency
* Async iterable

* * *

&copy; 2013-21 Lloyd Brookes \<75pound@gmail.com\>.

Isomorphic test suite by [test-runner](https://github.com/test-runner-js/test-runner) and [web-runner](https://github.com/test-runner-js/web-runner). Documented by [jsdoc-to-markdown](https://github.com/jsdoc2md/jsdoc-to-markdown).
