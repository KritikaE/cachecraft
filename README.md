# CacheCraft

A simple exploration of **caching concepts and LRU Cache implementation**.

This repository covers the fundamentals of caching, popular caching systems like Redis and Memcached, cache eviction strategies, and the implementation of an LRU Cache using a Circular Doubly Linked List and HashMap.

---

## Topics Covered

### 1. Caching

Understanding what caching is and why it is used.

* What is caching?
* Why do we need caching?
* Cache in Computer Organization
* CPU caches: L1, L2, and L3
* Web page and browser caching
* Application-level caching
* Cache hits and cache misses
* Advantages and limitations of caching

---

### 2. Redis and Memcached

An introduction to two widely used in-memory data stores.

* What is Redis?
* What is Memcached?
* How in-memory caching works
* Redis vs Memcached
* Advantages and limitations
* When to use Redis
* When to use Memcached

---

### 3. Cache Eviction Strategies

Caches have limited storage. When the cache becomes full, some existing data needs to be removed.

This section explores:

* LRU — Least Recently Used
* LFU — Least Frequently Used
* FIFO — First In, First Out
* MRU — Most Recently Used
* Random Replacement
* TTL-based expiration

It also discusses **why eviction is necessary and when different strategies are useful**.

---

### 4. LRU Cache Implementation

An LRU Cache is implemented using:

```text
HashMap + Circular Doubly Linked List
```

The HashMap provides fast lookup:

```text
key → Node
```

The Circular Doubly Linked List maintains the order of usage:

```text
Most Recently Used
        ↓
      [A] ↔ [B] ↔ [C]
                    ↑
              Least Recently Used
```

This combination allows both `get()` and `put()` to operate in **O(1)** time.

---

## LRU Cache Design

### Main Components

**HashMap**

Stores the mapping between a key and its corresponding node.

```text
HashMap<Key, Node>
```

**Circular Doubly Linked List**

Maintains the order of recently used elements.

```text
        ┌─────────────────────┐
        ↓                     │
      [A] ↔ [B] ↔ [C] ↔ [D] ─┘
       ↑
      Head
```

The most recently used element is maintained near the head, while the least recently used element is at the opposite end.

---

## UML Class Diagram

The LRU Cache consists mainly of two classes:

```text
┌─────────────────────────────┐
│          LRUCache           │
├─────────────────────────────┤
│ - capacity : int            │
│ - map : HashMap             │
│ - head : Node               │
├─────────────────────────────┤
│ + get(key) : int            │
│ + put(key, value) : void    │
│ - addNode(node) : void      │
│ - removeNode(node) : void   │
│ - moveToFront(node) : void  │
│ - removeLRU() : Node        │
└──────────────┬──────────────┘
               │
               │ uses
               ▼
┌─────────────────────────────┐
│            Node             │
├─────────────────────────────┤
│ - key : int                 │
│ - value : int               │
│ - prev : Node               │
│ - next : Node               │
└─────────────────────────────┘
```

---

## Why a Circular Doubly Linked List?

An LRU Cache frequently needs to:

1. Add a new node.
2. Remove an existing node.
3. Move a recently accessed node to the front.
4. Remove the least recently used node.

A doubly linked list makes these operations efficient because each node contains both:

```text
prev ← Node → next
```

The circular structure also connects the two ends of the list, reducing special-case handling for insertion and deletion.

---

## Why Not an Array?

Arrays provide efficient random access:

```text
array[index] → O(1)
```

However, moving or removing elements from the middle requires shifting other elements.

For an LRU Cache, nodes are constantly being moved and removed, making an array inefficient for this purpose.

---

## Why Not a Singly Linked List?

A singly linked list only stores:

```text
Node → next
```

If we want to remove a node, we generally need access to its previous node.

A doubly linked list directly provides:

```text
prev ← Node → next
```

So a known node can be removed in **O(1)** time.

This is exactly what an LRU Cache needs.

---

## Complexity

| Operation   | Time Complexity |
| ----------- | --------------- |
| `get()`     | O(1)            |
| `put()`     | O(1)            |
| Insert Node | O(1)            |
| Remove Node | O(1)            |
| Move Node   | O(1)            |
| Find Key    | O(1)            |

Space complexity:

```text
O(capacity)
```

---

## Repository Structure

```text
cachecraft/
│
├── README.md
│
├── notes/
│   ├── caching.md
│   ├── redis-memcached.md
│   └── eviction-strategies.md
│
├── lru-cache/
│   └── LRUCache.java
│
└── uml/
    └── lru-cache-class-diagram.png
```

---

