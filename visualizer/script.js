/*

* LRU Cache Visualizer
*
* The cache uses two structures:
*
* 1. Map
* key -> Node
*
* Provides O(1) lookup.
*
* 2. Doubly Linked List
*
* Maintains the order of recently used items.
*
* Head = Most Recently Used
* Tail = Least Recently Used
*
* Together they allow GET and PUT in O(1).
  */

/* ================================
Node
================================ */

class Node {

```
constructor(key, value) {

    this.key = key;
    this.value = value;

    this.prev = null;
    this.next = null;
}
```

}

/* ================================
LRU Cache
================================ */

class LRUCache {

```
constructor(capacity) {

    this.capacity = capacity;

    // HashMap equivalent in JavaScript.
    this.map = new Map();

    // Dummy nodes simplify insertion/removal
    // at the beginning and end of the list.
    this.head = new Node(null, null);
    this.tail = new Node(null, null);

    this.head.next = this.tail;
    this.tail.prev = this.head;
}


/*
 * Add a node immediately after the head.
 *
 * This makes the node the Most Recently Used item.
 */
addToFront(node) {

    node.next = this.head.next;
    node.prev = this.head;

    this.head.next.prev = node;
    this.head.next = node;
}


/*
 * Remove a node from the linked list.
 *
 * Because the node stores both prev and next,
 * removal takes O(1).
 */
removeNode(node) {

    node.prev.next = node.next;
    node.next.prev = node.prev;
}


/*
 * Move an existing node to the front.
 *
 * This means the item was recently accessed.
 */
moveToFront(node) {

    this.removeNode(node);
    this.addToFront(node);
}


/*
 * Get a value from the cache.
 *
 * If the key exists:
 * - Count it as a cache hit.
 * - Move it to the front.
 *
 * If it does not exist:
 * - Count it as a cache miss.
 *
 * Time Complexity: O(1)
 */
get(key) {

    if (!this.map.has(key)) {

        return null;
    }

    const node = this.map.get(key);

    this.moveToFront(node);

    return node.value;
}


/*
 * Insert or update a key-value pair.
 *
 * If the key already exists:
 * - Update its value.
 * - Move it to the front.
 *
 * If the cache is full:
 * - Remove the least recently used node.
 *
 * Time Complexity: O(1)
 */
put(key, value) {

    // Key already exists.
    if (this.map.has(key)) {

        const node = this.map.get(key);

        node.value = value;

        this.moveToFront(node);

        return {
            updated: true,
            evicted: null
        };
    }


    // Create a new node.
    const newNode = new Node(key, value);

    this.map.set(key, newNode);

    this.addToFront(newNode);


    let evicted = null;


    /*
     * Cache exceeded its capacity.
     *
     * tail.prev is the least recently used node.
     */
    if (this.map.size > this.capacity) {

        const lruNode = this.tail.prev;

        this.removeNode(lruNode);

        this.map.delete(lruNode.key);

        evicted = {
            key: lruNode.key,
            value: lruNode.value
        };
    }


    return {
        updated: false,
        evicted: evicted
    };
}


/*
 * Return all cache nodes from MRU → LRU.
 */
getNodes() {

    const nodes = [];

    let current = this.head.next;

    while (current !== this.tail) {

        nodes.push(current);

        current = current.next;
    }

    return nodes;
}


/*
 * Clear the cache.
 */
clear() {

    this.map.clear();

    this.head.next = this.tail;
    this.tail.prev = this.head;
}
```

}

/* ================================
Application State
================================ */

let cache = new LRUCache(3);

let hits = 0;
let misses = 0;
let evictions = 0;

/* ================================
DOM Elements
================================ */

const capacityInput = document.getElementById("capacity");
const keyInput = document.getElementById("key");
const valueInput = document.getElementById("value");

const putButton = document.getElementById("putBtn");
const getButton = document.getElementById("getBtn");
const resetButton = document.getElementById("resetBtn");

const cacheContainer = document.getElementById("cacheContainer");
const cacheSize = document.getElementById("cacheSize");

const status = document.getElementById("status");

const hitsElement = document.getElementById("hits");
const missesElement = document.getElementById("misses");
const evictionsElement = document.getElementById("evictions");
const hitRateElement = document.getElementById("hitRate");

const history = document.getElementById("history");

/* ================================
Render Cache
================================ */

function renderCache() {

```
const nodes = cache.getNodes();

cacheContainer.innerHTML = "";


if (nodes.length === 0) {

    cacheContainer.innerHTML =
        '<p class="empty">Cache is empty</p>';

} else {

    nodes.forEach((node, index) => {

        const nodeElement = document.createElement("div");

        nodeElement.className = "node";

        nodeElement.innerHTML = `
            <strong>${node.key}</strong>
            <span>${node.value}</span>
        `;

        cacheContainer.appendChild(nodeElement);


        // Add arrows between nodes.
        if (index < nodes.length - 1) {

            const arrow = document.createElement("div");

            arrow.className = "arrow";

            arrow.textContent = "↔";

            cacheContainer.appendChild(arrow);
        }
    });
}


cacheSize.textContent =
    `${nodes.length} / ${cache.capacity}`;
```

}

/* ================================
Update Statistics
================================ */

function updateStats() {

```
hitsElement.textContent = hits;

missesElement.textContent = misses;

evictionsElement.textContent = evictions;


const total = hits + misses;

const rate =
    total === 0
        ? 0
        : ((hits / total) * 100).toFixed(1);

hitRateElement.textContent = `${rate}%`;
```

}

/* ================================
Add Operation to History
================================ */

function addHistory(message) {

```
if (
    history.children.length === 1 &&
    history.children[0].textContent === "No operations yet."
) {

    history.innerHTML = "";
}


const item = document.createElement("li");

item.textContent = message;

history.prepend(item);
```

}

/* ================================
PUT
================================ */

putButton.addEventListener("click", () => {

```
const key = keyInput.value.trim();

const value = valueInput.value.trim();


if (key === "" || value === "") {

    status.textContent =
        "Please enter both a key and a value.";

    return;
}


const numericKey = Number(key);

const result = cache.put(numericKey, value);


if (result.updated) {

    status.textContent =
        `PUT(${key}, ${value}) → Updated existing key and moved it to MRU.`;

    addHistory(
        `PUT(${key}, ${value}) → UPDATED`
    );

} else {

    if (result.evicted) {

        evictions++;

        status.textContent =
            `PUT(${key}, ${value}) → Added to MRU. Evicted ${result.evicted.key}:${result.evicted.value}.`;

        addHistory(
            `PUT(${key}, ${value}) → EVICTED ${result.evicted.key}:${result.evicted.value}`
        );

    } else {

        status.textContent =
            `PUT(${key}, ${value}) → Added to MRU.`;

        addHistory(
            `PUT(${key}, ${value}) → ADDED`
        );
    }
}


renderCache();

updateStats();
```

});

/* ================================
GET
================================ */

getButton.addEventListener("click", () => {

```
const key = keyInput.value.trim();


if (key === "") {

    status.textContent =
        "Please enter a key.";

    return;
}


const numericKey = Number(key);

const value = cache.get(numericKey);


if (value === null) {

    misses++;

    status.textContent =
        `GET(${key}) → CACHE MISS`;

    addHistory(
        `GET(${key}) → MISS`
    );

} else {

    hits++;

    status.textContent =
        `GET(${key}) → CACHE HIT. Value = ${value}. Moved to MRU.`;

    addHistory(
        `GET(${key}) → HIT (${value})`
    );
}


renderCache();

updateStats();
```

});

/* ================================
RESET
================================ */

resetButton.addEventListener("click", () => {

```
const capacity =
    parseInt(capacityInput.value);


if (capacity < 1 || isNaN(capacity)) {

    status.textContent =
        "Capacity must be at least 1.";

    return;
}


cache = new LRUCache(capacity);

hits = 0;
misses = 0;
evictions = 0;


history.innerHTML =
    "<li>No operations yet.</li>";


status.textContent =
    "Cache has been reset.";


renderCache();

updateStats();
```

});

/* ================================
Initial Render
================================ */

renderCache();

updateStats();
