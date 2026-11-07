const {test}=require('node:test'),assert=require('node:assert/strict'),vm=require('node:vm'),fs=require('node:fs');const c=vm.createContext({});vm.runInContext(fs.readFileSync('topics.js','utf8'),c);
test('discovery has 24 unique non-drinking prompts',()=>{const a=c.selectTopicsByDifficulty('discovery','r','u');assert.equal(a.length,24);assert.equal(new Set(a.map(x=>x.id)).size,24);assert.ok(a.every(x=>x.id>=201))});
test('same seed stays stable',()=>assert.deepEqual(c.selectTopicsByDifficulty('discovery','r','u'),c.selectTopicsByDifficulty('discovery','r','u')));
test('legacy modes retain 24 topics',()=>{for(const m of ['easy','medium','hard'])assert.equal(c.selectTopicsByDifficulty(m,'r','u').length,24)});
test('both selectors expose discovery',()=>assert.equal((fs.readFileSync('game.html','utf8').match(/value="discovery"/g)||[]).length,2));
