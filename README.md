async-context
============================
A construct for chainable contexts which use async functions compatible with callbacks or promises

Usage
-----

Assuming we have an object with a function that takes an object and returns a transformed version of that object:

```javascript
const myObject = {
    foo: (str)=>{
        return `foo ${str}`;
    }
};
```

Take that object and make a context using it:

```javascript
import { asyncContext } from '@ansi-art/async-context';
const context = asyncContext(myObject);
const value = await context.foo().foo().foo();
// value === "foo foo foo"
```

That's all.

Testing
-------

Run the es module tests to test the root modules
```bash
npm run import-test
```
to run the same test inside the browser:

```bash
npm run browser-test
```
to run the same test headless in chrome:
```bash
npm run headless-browser-test
```

to run the same test inside docker:
```bash
npm run container-test
```

Run the commonjs tests against the `/dist` commonjs source (generated with the `build-commonjs` target).
```bash
npm run require-test
```

Development
-----------
All work is done in the .mjs files and will be transpiled on commit to commonjs and tested.

If the above tests pass, then attempt a commit which will generate .d.ts files alongside the `src` files and commonjs classes in `dist`

