class t{constructor(t,e){this.namespace=t,this.storage=e}setState(t){t?(this.storage.setItem(this.namespace+":state","string"==typeof t?t:JSON.stringify(t)),this.storage.setItem(this.namespace+":lastUpdated",(new Date).getTime().toString())):this.removeState()}getState(){return JSON.parse(this.storage.getItem(this.namespace+":state"))}lastUpdated(){return parseInt(this.storage.getItem(this.namespace+":lastUpdated"),10)}removeState(){this.storage.removeItem(this.namespace+":state"),this.storage.removeItem(this.namespace+":lastUpdated")}}class e{constructor(t){const e=this;e.getters={},e.actions={},e.mutations={},e.state={},e.getterCache={},e.status="resting",e.transaction=!1,e.transactionCache={},e.callbacks=[],t.getters&&(e.getters=new Proxy(t.getters||{},{get(t,s){if(!e.getterCache[s]){const a=t[s](e.state);e.getterCache[s]=a}return e.getterCache[s]}})),t.actions&&(e.actions=t.actions),t.mutations&&(e.mutations=t.mutations);let s=t.initialState||{};if(e.copyOfInitialState=e._copyValue(s),e.ttl=-1,e.lastUpdatedState={},t.ttl&&(e.ttl=t.ttl,Object.keys(e.copyOfInitialState).forEach(t=>e.lastUpdatedState[t]=(new Date).getTime())),t.persist){e.persist="string"==typeof t.persist?createPersist(t.persist):t.persist;const a=e.persist.getState(),i=e.persist.lastUpdated();a&&i&&(-1===e.ttl||e._lastUpdatedTimeDiff(i)<e.ttl)&&(s=a)}this._processState(s)}_processState(t){const e=this;e.state=new Proxy(t,{set:(t,s,a)=>(e.transaction&&!e.transactionCache[s]&&(e.transactionCache[s]=e._copyValue(t[s])),t[s]=a,e.lastUpdatedState[s]=(new Date).getTime(),e.getterCache={},"clear"!==e.status&&(e._processCallbacks(e.state),e.status="resting"),!0),get:(t,s)=>e.ttl>-1&&e._lastUpdatedTimeDiff(e.lastUpdatedState[s])>e.ttl?(e.persist&&e.persist.removeState(),e.copyOfInitialState[s]):t[s]})}_lastUpdatedTimeDiff(t){return Math.round(((new Date).getTime()-t)/1e3)}dispatch(t,e){return"function"!=typeof this.actions[t]?(console.error(`Dude, the store action "${t}" doesn't exist.`),!1):(this.status="action",this.actions[t](this,e))}commit(t,e){if("function"!=typeof this.mutations[t])return console.error(`Dude, the store mutation "${t}" doesn't exist`),!1;this.status="mutation";const s=this.mutations[t](this.state,e);return this.state=s,this.persist&&this.persist.setState(s),!0}_processCallbacks(t){return!(!this.callbacks.length||this.transaction)&&(this.callbacks.forEach(e=>e(t)),!0)}subscribe(t){if("function"!=typeof t)return console.error("Dude, you can only subscribe to store changes with a valid function"),!1;return this.callbacks.push(t),()=>{this.callbacks=this.callbacks.filter(e=>e!==t)}}_copyValue(t){return JSON.parse(JSON.stringify(t))}begin(){this.transactionCache={},this.transaction=!0}end(){this.transaction=!1,this._processCallbacks(this.state)}rollback(){Object.keys(this.transactionCache).forEach(t=>this.state[t]=this.transactionCache[t]),this.end()}clear(t=!0){this.getterCache={},this.transactionCache={},this.lastUpdatedState={},this.persist&&this.persist.removeState(),this.status="clear";const e=this._copyValue(this.copyOfInitialState);for(const t in e)this.state[t]=e[t];this.status="resting",t&&this._processCallbacks(this.state)}}function createStore(t,s){const a=new e(s);return"undefined"!=typeof window&&(window.__ficusjs__=window.__ficusjs__||{},window.__ficusjs__.store=window.__ficusjs__.store||{},window.__ficusjs__.store[t]=a),a}function createPersist(e,s="session"){return new t(e,"local"===s?window.localStorage:window.sessionStorage)}function getStore(t){if("undefined"!=typeof window&&window.__ficusjs__&&window.__ficusjs__.store&&window.__ficusjs__.store[t])return window.__ficusjs__.store[t]}export{createPersist,createStore,getStore};