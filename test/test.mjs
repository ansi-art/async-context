/* global describe:false */
import { chai } from '@environment-safe/chai';
import { it } from '@open-automaton/moka';
import { Context } from '../src/index.mjs';
import { kitchenSync } from '../src/kitchen-sync.mjs';
const should = chai.should();

// a simple object with a single function that works as a callback or promise
const makeSimpleObject = ()=>{
    let callCount = 0;
    let simpleObject = {
        fn : (item, cb)=>{
            const callback = kitchenSync(cb);
            callCount++;
            setTimeout(()=>{
                callback(null, callCount);
            });
            return callback.return;
        }
    };
    return simpleObject;
};

// a simple object with a single function that works as a callback or promise
const makeStringObject = ()=>{
    let str = '';
    let simpleObject = {
        fn : (item, cb)=>{
            const callback = kitchenSync(cb);
            str += (item.text && str)?' '+item.text:item.text;
            setTimeout(()=>{
                callback(null, str);
            });
            return callback.return;
        }
    };
    return simpleObject;
};



describe('async-context', ()=>{
    describe('works using a counter', ()=>{
        it('counter works as a promise', (done)=>{
            let chain = Context.wrap(makeSimpleObject());
            chain.fn({}).fn({}).fn({}).promise.then((result)=>{
                should.exist(result);
                result.should.equal(3);
                done();
            }).catch((ex)=>{
                should.not.exist(ex);
            });
        });

        it('counter works as a callback', (done)=>{
            let chain = Context.wrap(makeSimpleObject());
            chain.fn({}).fn({}).fn({}, (err, result)=>{
                should.not.exist(err);
                should.exist(result);
                result.should.equal(3);
                done();
            });
        });
    });
    
    describe('works using strings', ()=>{
        it('strings work as a promise', async ()=>{
            let chain = Context.wrap(makeStringObject());
            const result = await chain.fn({text: 'foo'}).fn({text: 'foo'}).fn({text: 'foo'}).complete;
            result.should.equal('foo foo foo');
        });
    
        it('strings work as a callback', (done)=>{
            let chain = Context.wrap(makeStringObject());
            chain.fn({text: 'foo'}).fn({text: 'foo'}).fn({text: 'foo'}, (err, result)=>{
                should.not.exist(err);
                should.exist(result);
                result.should.equal('foo foo foo');
                done();
            });
        });
    });
});

