# ⚡ CacheCraft

> **Learn caching. Build an LRU cache. Understand how real systems stay fast.**

---

## 📚 What You'll Learn

This repository covers:

### 1. What is Caching?

Understand caching from both a **computer organization** and **web/application** perspective.

* What is a cache?
* Why is caching needed?
* Cache vs main memory/storage
* CPU cache: L1, L2, L3
* Web browser caching
* HTTP caching
* Application-level caching
* Database caching
* Real-world examples
* Benefits and limitations of caching

📖 [Read: Caching Fundamentals](notes/01-caching.md)

---

### 2. Redis & Memcached

Introduction to two popular in-memory caching technologies.

* What is Redis?
* What is Memcached?
* How in-memory caching works
* Redis vs Memcached
* Data structures supported by Redis
* Persistence
* Distributed caching
* When to choose Redis
* When to choose Memcached

📖 [Read: Redis & Memcached](notes/02-redis-and-memcached.md)

---

### 3. Cache Eviction Strategies

A cache has limited memory.

So the important question becomes:

> **When the cache is full, which item should be removed?**

This section covers:

* LRU — Least Recently Used
* LFU — Least Frequently Used
* FIFO — First In, First Out
* MRU — Most Recently Used
* Random Replacement
* TTL-based expiration
* Comparison of eviction strategies
* When to use which strategy
* Real-world use cases

📖 [Read: Cache Eviction Strategies](notes/03-cache-eviction-strategies.md)

---

## 🧠 LRU Cache Implementation

One of the most important cache implementations for **DSA + interviews** is the **LRU Cache**.

The target operations are:

```text
get(key)  → O(1)
put(key, value) → O(1)
```

To achieve this, we combine:

```text
HashMap
   +
Circular Doubly Linked List
```

### Why?

The **HashMap** provides:

```text
key → node
```

allowing us to find an item in **O(1)**.

The **Doubly Linked List** maintains the order of usage:

```text
Most Recently Used
        ↓
      [A]
       ↕
      [B]
       ↕
      [C]
        ↓
Least Recently Used
```

When the cache is full, the least recently used node can be removed efficiently.

### Core Design

```text
                ┌──────────────┐
                │   HashMap    │
                │ key → Node   │
                └──────┬───────┘
                       │
                       ▼
              ┌─────────────────┐
              │ Circular DLL    │
              │                 │
              │ A ↔ B ↔ C ↔ ...│
              └─────────────────┘
```

### Complexity

| Operation          | Time |
| ------------------ | ---: |
| `get()`            | O(1) |
| `put()`            | O(1) |
| Remove LRU         | O(1) |
| Move node to front | O(1) |
| Search             | O(1) |

📁 [View LRU Cache Implementation](lru-cache/LRUCache.java)

---

## 🔄 Why Circular Doubly Linked List?

A **Circular Doubly Linked List (CDLL)** is particularly useful because an LRU cache constantly needs to:

1. Move recently accessed nodes to the front.
2. Remove the least recently used node.
3. Insert new nodes.
4. Remove arbitrary nodes.

A DLL supports these operations efficiently because every node has:

```text
prev ← Node → next
```

The circular structure also eliminates special cases involving `null` at the ends.

---

## 📊 Circular DLL vs Array vs Singly Linked List

| Feature                        | Array     | Singly LL    | Circular DLL |
| ------------------------------ | --------- | ------------ | ------------ |
| Random access                  | ✅ O(1)    | ❌ O(n)       | ❌ O(n)       |
| Insert/remove arbitrary node   | ❌ O(n)    | ⚠️ O(1)*     | ✅ O(1)       |
| Delete node when node is known | ❌         | ⚠️ Difficult | ✅ O(1)       |
| Move node to front             | ❌         | ⚠️ Difficult | ✅ O(1)       |
| Bidirectional traversal        | ❌         | ❌            | ✅            |
| Dynamic size                   | ❌/limited | ✅            | ✅            |
| Ideal for LRU                  | ❌         | ❌            | ✅            |

* Assuming the required predecessor node is already known.

The key reason for choosing a **Doubly Linked List** is that an LRU cache needs to remove and reposition nodes frequently.

---

## 🏗️ UML Class Diagram

The LRU cache can be modeled using two main components:

```text
┌──────────────────────────┐
│        LRUCache          │
├──────────────────────────┤
│ - capacity: int          │
│ - map: HashMap           │
│ - head: Node             │
├──────────────────────────┤
│ + get(key): int          │
│ + put(key,value): void   │
│ - addNode(node): void    │
│ - removeNode(node): void │
│ - moveToFront(node)      │
│ - removeLRU(): Node      │
└────────────┬─────────────┘
             │
             │ uses
             ▼
┌──────────────────────────┐
│          Node            │
├──────────────────────────┤
│ - key: int               │
│ - value: int             │
│ - prev: Node             │
│ - next: Node             │
└──────────────────────────┘
```

The actual UML diagram is available in:

📁 [`uml/lru-cache-class-diagram.png`](uml/lru-cache-class-diagram.png)

---

## 🌐 Real-World Applications

Caching appears everywhere in modern computing.

### Computer Organization

```text
CPU
 ↓
L1 Cache
 ↓
L2 Cache
 ↓
L3 Cache
 ↓
RAM
 ↓
Storage
```

The closer the data is to the CPU, the faster it can usually be accessed.

---

### Web Applications

A typical request may look like:

```text
User
 ↓
Browser Cache
 ↓
CDN
 ↓
Application Server
 ↓
Redis / Memcached
 ↓
Database
```

Caching frequently accessed data avoids repeatedly performing expensive operations.

For example:

```text
GET /user/123
```

Instead of querying the database every time:

```text
Request
   ↓
Cache?
 ┌─┴─┐
Hit Miss
 │    │
 ↓    ↓
Data  DB
      ↓
    Cache
```

---
