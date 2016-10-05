let test = require('tape');

let e = require('./event.json');
let h = require('./handler.js');

test('checking get_events',t=>{ 

    t.plan(1);

    h.get_events(e)
        .then(v=>{
            t.ok(v.size > 0);
        })
        .catch(err =>{
            t.end(err);
        });

});

test('checking events', t => {

    t.plan(1);

    h.events(e,null,(err,data)=>{

        if (err != null){
            console.log(err);
        }

        if (data != null) {
            t.ok(data.length > 0);
        }

    });

});

test("checking filtered events", t => {

    t.plan(1);

    h.filteredGroups(null,null,(err,data) => {
        t.ok(true);
    });

});
