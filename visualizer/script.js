/*
 * LRU Cache Visualizer
 *
 * Data structures:
 * 1. Map      -> O(1) key lookup
 * 2. Doubly Linked List -> maintains MRU to LRU order
 *
 * MRU = Most Recently Used
 * LRU = Least Recently Used
 */


/* =========================================
   Node
========================================= */

class Node {
    constructor(key, value) {
        this.key = key;
        this.value = value;

        this.prev = null;
        this.next = null;
    }
}


/* =========================================
   LRU Cache
========================================= */

class LRUCache {

    constructor(capacity) {

        this.capacity = capacity;
        this.map = new Map();

        // Dummy head and tail nodes.
        // head.next = Most Recently Used
        // tail.prev = Least Recently Used
        this.head = new Node(null, null);
        this.tail = new Node(null, null);

        this.head.next = this.tail;
        this.tail.prev = this.head;
    }


    // Adds a node immediately after the head.
    addToFront(node) {

        node.next = this.head.next;
        node.prev = this.head;

        this.head.next.prev = node;
        this.head.next = node;
    }


    // Removes a known node in O(1).
    removeNode(node) {

        node.prev.next = node.next;
        node.next.prev = node.prev;
    }


    // Moves an existing node to the MRU position.
    moveToFront(node) {

        this.removeNode(node);
        this.addToFront(node);
    }


    // Returns the value associated with a key.
    // Returns null if the key does not exist.
    get(key) {

        if (!this.map.has(key)) {
            return null;
        }

        const node = this.map.get(key);

        // Accessing an item makes it MRU.
        this.moveToFront(node);

        return node.value;
    }


    // Inserts or updates a key-value pair.
    put(key, value) {

        // If key already exists, update it
        // and move it to MRU.
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

        // New items are immediately MRU.
        this.addToFront(newNode);


        let evicted = null;


        // If capacity is exceeded,
        // remove the LRU node.
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


    // Returns nodes from MRU -> LRU.
    getNodes() {

        const nodes = [];

        let current = this.head.next;

        while (current !== this.tail) {

            nodes.push(current);

            current = current.next;
        }

        return nodes;
    }


    // Clears the entire cache.
    clear() {

        this.map.clear();

        this.head.next = this.tail;
        this.tail.prev = this.head;
    }
}


/* =========================================
   Application State
========================================= */

let cache = new LRUCache(3);

let hits = 0;
let misses = 0;
let evictions = 0;


/* =========================================
   DOM Elements
========================================= */

const capacityInput = document.getElementById("capacity");
const keyInput = document.getElementById("key");
const valueInput = document.getElementById("value");

const putButton = document.getElementById("putBtn");
const getButton = document.getElementById("getBtn");
const resetButton = document.getElementById("resetBtn");

const cacheContainer = document.getElementById("cacheContainer");
const cacheSize = document.getElementById("cacheSize");

const statusElement = document.getElementById("status");

const hitsElement = document.getElementById("hits");
const missesElement = document.getElementById("misses");
const evictionsElement = document.getElementById("evictions");
const hitRateElement = document.getElementById("hitRate");

const historyList = document.getElementById("history");


/* =========================================
   Render Cache
========================================= */

function renderCache() {

    const nodes = cache.getNodes();

    cacheContainer.innerHTML = "";


    if (nodes.length === 0) {

        cacheContainer.innerHTML =
            '<p class="empty">Cache is empty</p>';

    } else {

        nodes.forEach((node, index) => {

            const nodeElement =
                document.createElement("div");

            nodeElement.className = "node";

            nodeElement.innerHTML = `
                <strong>${node.key}</strong>
                <span>${node.value}</span>
            `;

            cacheContainer.appendChild(nodeElement);


            if (index < nodes.length - 1) {

                const arrow =
                    document.createElement("div");

                arrow.className = "arrow";
                arrow.textContent = "↔";

                cacheContainer.appendChild(arrow);
            }
        });
    }


    cacheSize.textContent =
        `${nodes.length} / ${cache.capacity}`;
}


/* =========================================
   Statistics
========================================= */

function updateStats() {

    hitsElement.textContent = hits;
    missesElement.textContent = misses;
    evictionsElement.textContent = evictions;

    const total = hits + misses;

    const rate =
        total === 0
            ? 0
            : ((hits / total) * 100).toFixed(1);

    hitRateElement.textContent = `${rate}%`;
}


/* =========================================
   Operation History
========================================= */

function addHistory(message) {

    if (
        historyList.children.length === 1 &&
        historyList.children[0].textContent ===
            "No operations yet."
    ) {
        historyList.innerHTML = "";
    }


    const item = document.createElement("li");

    item.textContent = message;

    historyList.prepend(item);
}


/* =========================================
   PUT
========================================= */

putButton.addEventListener("click", function () {

    const keyText = keyInput.value.trim();
    const value = valueInput.value.trim();


    if (keyText === "" || value === "") {

        statusElement.textContent =
            "Please enter both a key and a value.";

        return;
    }


    const key = Number(keyText);


    if (Number.isNaN(key)) {

        statusElement.textContent =
            "Key must be a number.";

        return;
    }


    const result = cache.put(key, value);


    if (result.updated) {

        statusElement.textContent =
            `PUT(${key}, ${value}) → Updated and moved to MRU.`;

        addHistory(
            `PUT(${key}, ${value}) → UPDATED`
        );

    } else if (result.evicted) {

        evictions++;

        statusElement.textContent =
            `PUT(${key}, ${value}) → Evicted ${result.evicted.key}:${result.evicted.value}.`;

        addHistory(
            `PUT(${key}, ${value}) → EVICTED ${result.evicted.key}:${result.evicted.value}`
        );

    } else {

        statusElement.textContent =
            `PUT(${key}, ${value}) → Added to MRU.`;

        addHistory(
            `PUT(${key}, ${value}) → ADDED`
        );
    }


    renderCache();
    updateStats();
});


/* =========================================
   GET
========================================= */

getButton.addEventListener("click", function () {

    const keyText = keyInput.value.trim();


    if (keyText === "") {

        statusElement.textContent =
            "Please enter a key.";

        return;
    }


    const key = Number(keyText);


    if (Number.isNaN(key)) {

        statusElement.textContent =
            "Key must be a number.";

        return;
    }


    const value = cache.get(key);


    if (value === null) {

        misses++;

        statusElement.textContent =
            `GET(${key}) → CACHE MISS`;

        addHistory(
            `GET(${key}) → MISS`
        );

    } else {

        hits++;

        statusElement.textContent =
            `GET(${key}) → CACHE HIT. Value = ${value}.`;

        addHistory(
            `GET(${key}) → HIT (${value})`
        );
    }


    renderCache();
    updateStats();
});


/* =========================================
   RESET
========================================= */

resetButton.addEventListener("click", function () {

    const capacity =
        parseInt(capacityInput.value);


    if (
        Number.isNaN(capacity) ||
        capacity < 1
    ) {

        statusElement.textContent =
            "Capacity must be at least 1.";

        return;
    }


    cache = new LRUCache(capacity);

    hits = 0;
    misses = 0;
    evictions = 0;


    historyList.innerHTML =
        "<li>No operations yet.</li>";


    statusElement.textContent =
        "Cache has been reset.";


    renderCache();
    updateStats();
});


/* =========================================
   Initial Setup
========================================= */

renderCache();
updateStats();
