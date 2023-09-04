@ansi-art/async-context
=======================
A construct for chainable contexts which use async functions compatible with callbacks or promises.

Usage
-----

### Making a context

Assuming we have an object with a function that takes an object and returns a transformed version of that object:

```javascript
let str ='';
const myObject = {
    foo: (item, callback)=>{
        str += `foo ${str}`
        callback(null, str);
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

### Using `kitchen-sync`

`kitchen-sync` allows you to support both callbacks and promises with *no* stack fragmentation in the event callbacks are used, allowing for simpler debugging internally to a set of libraries, for example, but allowing external use of more modern idioms.

```javascript
import { kitchenSync } from `@ansi-art/async-context/kitchen-sync`;
(async ()=>{
    const fn = (arg, cb){
        const callback = kitchenSync(cb);
        someFunctionThatTakesCallbacks(callback);
        return callback.return;
    }
    const result = await fn(someArgValue);
})();
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
to run the same test headless in chrome, firefox and safari:
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

