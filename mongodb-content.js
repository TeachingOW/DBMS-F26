// Generated from lectures/14_MongoDB.pptx by scripts/generate-mongodb-slides.py.
window.DBMS_ADVANCED_SLIDES = window.DBMS_ADVANCED_SLIDES || {};
window.DBMS_ADVANCED_SLIDES.mongodb = [
  {
    "id": "mongodb-1",
    "section": "Document databases",
    "title": "MongoDB",
    "lead": "Model a shop as documents, then query products and orders in mongosh.",
    "points": [
      "The shop lab uses products with prices, tags, and optional specifications.",
      "Orders embed line items and reference products in a shared catalog.",
      "Follow the lab in order to reproduce the results shown here."
    ],
    "takeaway": "Open MongoDB lab to connect and load the shop data."
  },
  {
    "id": "mongodb-2",
    "section": "Lab setup",
    "title": "The shop practice database",
    "lead": "Connect with mongosh and follow the lab’s insert examples to create the shop dataset.",
    "points": [
      "Run the database selection and inserts in the same mongosh session.",
      "The seed creates Laptop, Phone, Tablet, and Charger.",
      "Choose a fresh database name before repeating the lab."
    ],
    "takeaway": "After the lab inserts, countDocuments({}) returns 4.",
    "code": [
      {
        "label": "Select the practice database",
        "language": "javascript",
        "text": "db = db.getSiblingDB(\"mongodb_shop_lab\");\nprint(db.getName());"
      }
    ]
  },
  {
    "id": "mongodb-3",
    "section": "Document databases",
    "title": "Collections, documents, and BSON",
    "lead": "A collection holds documents. Each document contains fields whose values may be scalars, arrays, or nested documents.",
    "points": [
      "A collection is roughly like a table, and a document is roughly like a row.",
      "BSON stores types such as dates and ObjectIds alongside familiar JSON types.",
      "The _id identifies a document within a regular collection. The lab uses readable strings as IDs."
    ],
    "takeaway": "The Phone document contains a specs object and a tags array.",
    "code": [
      {
        "label": "Phone document",
        "language": "javascript",
        "text": "db.products.findOne({ _id: \"phone\" });"
      }
    ]
  },
  {
    "id": "mongodb-4",
    "section": "Document databases",
    "title": "Flexible schemas and validation",
    "lead": "Phone and Tablet have a specs document. Charger has no specs field.",
    "points": [
      "Store a price as a number so filters and arithmetic treat it as numeric data.",
      "Use schema validation to enforce required fields or types when the application depends on them.",
      "Use $exists when a query needs to distinguish a missing field from a field that is present."
    ],
    "takeaway": "Before the CRUD changes, the query returns Phone and Tablet.",
    "code": [
      {
        "label": "Find products with specifications",
        "language": "javascript",
        "text": "db.products.find(\n  { specs: { $exists: true } },\n  { _id: 0, name: 1 }\n).sort({ name: 1 }).toArray();"
      }
    ]
  },
  {
    "id": "mongodb-5",
    "section": "CRUD",
    "title": "Filters and projections",
    "lead": "The filter in find() plays the role of WHERE. The projection chooses the fields to return.",
    "points": [
      "A price filter with $gt selects values strictly above the threshold.",
      "Set _id to 0 to omit it from an inclusion projection.",
      "sort({ price: -1 }) orders by descending price."
    ],
    "takeaway": "The query returns Laptop at 1200, then Phone at 800.",
    "code": [
      {
        "label": "Products above 700, before the update",
        "language": "javascript",
        "text": "db.products.find(\n  { price: { $gt: 700 } },\n  { _id: 0, name: 1, price: 1 }\n).sort({ price: -1 }).toArray();"
      }
    ]
  },
  {
    "id": "mongodb-6",
    "section": "CRUD",
    "title": "Nested fields and arrays",
    "lead": "Use dot notation for a path inside a document. A scalar equality filter on an array checks for a matching element.",
    "points": [
      "The key \"specs.memory\" follows a path through the specs document.",
      "The tags filter finds products whose array contains the string sale."
    ],
    "takeaway": "Phone has 128GB memory. Laptop and Phone have the sale tag.",
    "code": [
      {
        "label": "A nested field and an array element",
        "language": "javascript",
        "text": "db.products.findOne({ \"specs.memory\": \"128GB\" });\n\ndb.products.find({ tags: \"sale\" }).toArray();"
      }
    ]
  },
  {
    "id": "mongodb-7",
    "section": "CRUD",
    "title": "Insert, update, and delete",
    "lead": "Use insertOne() or insertMany() to create documents. Use a filter to target an update or deletion.",
    "points": [
      "$set assigns a value. A dotted path changes one nested field and preserves its siblings.",
      "$inc adds a numeric amount. updateMany() applies it to every matching document.",
      "Check matchedCount, modifiedCount, and deletedCount in write results."
    ],
    "takeaway": "This step sets the price to 850. The lab then raises it to 900 with $inc and deletes Tablet.",
    "code": [
      {
        "label": "Update the phone",
        "language": "javascript",
        "text": "db.products.updateOne(\n  { _id: \"phone\" },\n  { $set: { price: 850, \"specs.color\": \"blue\" } }\n);"
      }
    ]
  },
  {
    "id": "mongodb-8",
    "section": "Document modeling",
    "title": "Multiple conditions on one array element",
    "lead": "The sample order has two laptops and one phone. The query asks for a single line with at least two phones.",
    "points": [
      "$elemMatch requires the product and quantity conditions to hold for the same line item.",
      "Separate dotted predicates on items can match values from different line items."
    ],
    "takeaway": "The result is an empty array. Substituting laptop finds order-1001.",
    "code": [
      {
        "label": "Check for at least two phones",
        "language": "javascript",
        "text": "db.orders.find({\n  items: {\n    $elemMatch: {\n      productId: \"phone\",\n      quantity: { $gte: 2 }\n    }\n  }\n}).toArray();"
      }
    ]
  },
  {
    "id": "mongodb-9",
    "section": "Aggregation",
    "title": "Filter, group, and summarize",
    "lead": "Each pipeline stage receives the previous stage’s output.",
    "points": [
      "$match filters products by price.",
      "In $group, _id: null combines all matched documents into one group.",
      "$avg reads the price field. $sum adds 1 for each matched document."
    ],
    "takeaway": "After the lab updates, two products match and their average price is 1050.",
    "code": [
      {
        "label": "Count and average after the updates",
        "language": "javascript",
        "text": "db.products.aggregate([\n  { $match: { price: { $gt: 700 } } },\n  { $group: {\n    _id: null,\n    count: { $sum: 1 },\n    avgPrice: { $avg: \"$price\" }\n  } }\n]).toArray();"
      }
    ]
  },
  {
    "id": "mongodb-10",
    "section": "Aggregation",
    "title": "One result per array element",
    "lead": "$unwind emits one document per array element. $group can then count occurrences of each tag.",
    "points": [
      "After $unwind, a product with two tags contributes two documents.",
      "$sort orders by descending count and breaks ties by tag."
    ],
    "takeaway": "After Tablet is deleted, electronics and sale each occur twice. Accessory occurs once.",
    "code": [
      {
        "label": "Count product tags",
        "language": "javascript",
        "text": "db.products.aggregate([\n  { $unwind: \"$tags\" },\n  { $group: { _id: \"$tags\", count: { $sum: 1 } } },\n  { $sort: { count: -1, _id: 1 } }\n]).toArray();"
      }
    ]
  },
  {
    "id": "mongodb-11",
    "section": "Document modeling",
    "title": "Embedded orders and catalog references",
    "lead": "Embed details read with the order. Reference a product when many orders share the same catalog entry.",
    "points": [
      "$lookup matches items.productId to the product collection’s _id.",
      "The result contains an array of matches. A missing product gives an empty array.",
      "Store the purchase price in the order when historical prices matter."
    ],
    "takeaway": "Both line items match their catalog entries. The lab also projects the fields needed for display.",
    "code": [
      {
        "label": "Join order lines to products",
        "language": "javascript",
        "text": "db.orders.aggregate([\n  { $match: { _id: \"order-1001\" } },\n  { $unwind: \"$items\" },\n  { $lookup: {\n    from: \"products\",\n    localField: \"items.productId\",\n    foreignField: \"_id\",\n    as: \"product\"\n  } }\n]).toArray();"
      }
    ]
  },
  {
    "id": "mongodb-12",
    "section": "Query performance",
    "title": "Indexes and execution plans",
    "lead": "An index can help MongoDB find matching documents or return them in the requested order.",
    "points": [
      "The lab creates a price index before running explain().",
      "Look for IXSCAN or COLLSCAN in the winning plan.",
      "Compare totalDocsExamined with nReturned in executionStats."
    ],
    "takeaway": "Use the plan to see how MongoDB found the two matching products.",
    "code": [
      {
        "label": "Explain the price query",
        "language": "javascript",
        "text": "db.products.find({ price: { $gt: 700 } })\n  .sort({ price: 1 })\n  .explain(\"executionStats\");"
      }
    ]
  },
  {
    "id": "mongodb-13",
    "section": "Deployment",
    "title": "Replication, sharding, and atomicity",
    "lead": "Replication maintains copies of data. Sharding distributes data using a shard key.",
    "points": [
      "The primary of a replica set accepts writes, and secondaries replicate its changes.",
      "Shards store different subsets of a sharded collection.",
      "Single document writes are atomic. Replica sets and sharded clusters support transactions across documents."
    ],
    "takeaway": "Embed fields that must change together when they belong to the same document."
  },
  {
    "id": "mongodb-14",
    "section": "Distributed systems",
    "title": "The CAP theorem",
    "lead": "During a network partition, a replicated read/write store cannot guarantee both linearizability and availability for every request.",
    "points": [
      "Consistency (C) means operations appear to happen in a single real-time order. A read started after a write completes sees that write or a later one.",
      "Availability (A) means every request sent to a working replica eventually receives a successful response. A timeout gives up that guarantee.",
      "A partition (P) occurs when groups of replicas can keep running while messages between them are lost."
    ],
    "takeaway": "CAP limits what the store can guarantee during a partition."
  },
  {
    "id": "mongodb-15",
    "section": "Distributed systems",
    "title": "One laptop, three replicas",
    "lead": "A is the primary. A and B can communicate, but C is isolated. All three initially show one laptop in stock.",
    "points": [
      "A records the last sale and confirms it after B acknowledges the write. A and B now show zero in stock.",
      "C still shows one. From C’s local copy, a sale on the other side looks the same as no sale.",
      "C can return its local value or wait for information about the sale. The first option risks a stale answer, and the second can leave the request unanswered."
    ],
    "takeaway": "C cannot guarantee a current stock count and a successful response during the split."
  },
  {
    "id": "mongodb-16",
    "section": "Distributed systems",
    "title": "Different requests, different guarantees",
    "lead": "The shop can keep some features working during the partition while protecting checkout.",
    "points": [],
    "takeaway": "Browsing, checkout, and waitlisting can follow different rules during the same partition.",
    "diagram": [
      {
        "kind": "connector",
        "x": 344.0,
        "y": 308.5000524934383,
        "width": 102.0,
        "height": 0.0,
        "stroke": "#0B5D3B",
        "strokeWidth": 3.0,
        "dashed": false
      },
      {
        "kind": "box",
        "x": 74.0,
        "y": 258.0,
        "width": 270.0,
        "height": 101.0,
        "stroke": "#0B5D3B",
        "strokeWidth": 2.0,
        "dashed": false,
        "fill": "#E7F1E9"
      },
      {
        "kind": "box",
        "x": 446.0,
        "y": 258.0,
        "width": 270.0,
        "height": 101.0,
        "stroke": "#0B5D3B",
        "strokeWidth": 2.0,
        "dashed": false,
        "fill": "#E7F1E9"
      },
      {
        "kind": "box",
        "x": 935.0,
        "y": 258.0,
        "width": 270.0,
        "height": 101.0,
        "stroke": "#8A5017",
        "strokeWidth": 2.0,
        "dashed": false,
        "fill": "#F8EFE1"
      },
      {
        "kind": "connector",
        "x": 827.0,
        "y": 256.0,
        "width": 0.0,
        "height": 121.0,
        "stroke": "#8A5017",
        "strokeWidth": 2.0,
        "dashed": true
      },
      {
        "kind": "label",
        "x": 84.0,
        "y": 275.0,
        "width": 250.0,
        "height": 30.0,
        "text": "A · Primary",
        "align": "middle",
        "size": 24.0,
        "bold": true,
        "color": "#0B5D3B"
      },
      {
        "kind": "label",
        "x": 84.0,
        "y": 311.0,
        "width": 250.0,
        "height": 28.0,
        "text": "0 laptops in stock",
        "align": "middle",
        "size": 22.0,
        "bold": false,
        "color": "#122019"
      },
      {
        "kind": "label",
        "x": 456.0,
        "y": 275.0,
        "width": 250.0,
        "height": 30.0,
        "text": "B · Secondary",
        "align": "middle",
        "size": 24.0,
        "bold": true,
        "color": "#0B5D3B"
      },
      {
        "kind": "label",
        "x": 456.0,
        "y": 311.0,
        "width": 250.0,
        "height": 28.0,
        "text": "0 laptops in stock",
        "align": "middle",
        "size": 22.0,
        "bold": false,
        "color": "#122019"
      },
      {
        "kind": "label",
        "x": 341.0,
        "y": 279.0,
        "width": 108.0,
        "height": 25.0,
        "text": "Connected",
        "align": "middle",
        "size": 16.0,
        "bold": true,
        "color": "#0B5D3B"
      },
      {
        "kind": "label",
        "x": 752.0,
        "y": 224.0,
        "width": 150.0,
        "height": 24.0,
        "text": "Network split",
        "align": "middle",
        "size": 18.0,
        "bold": true,
        "color": "#8A5017"
      },
      {
        "kind": "label",
        "x": 945.0,
        "y": 275.0,
        "width": 250.0,
        "height": 30.0,
        "text": "C · Isolated secondary",
        "align": "middle",
        "size": 22.0,
        "bold": true,
        "color": "#8A5017"
      },
      {
        "kind": "label",
        "x": 945.0,
        "y": 311.0,
        "width": 250.0,
        "height": 28.0,
        "text": "Still shows 1 laptop",
        "align": "middle",
        "size": 22.0,
        "bold": false,
        "color": "#122019"
      },
      {
        "kind": "label",
        "x": 74.0,
        "y": 408.0,
        "width": 345.0,
        "height": 34.0,
        "text": "Browsing",
        "align": "start",
        "size": 25.0,
        "bold": true,
        "color": "#0B5D3B"
      },
      {
        "kind": "label",
        "x": 74.0,
        "y": 448.0,
        "width": 345.0,
        "height": 96.0,
        "text": "C can serve catalog reads if\nthe app routes them there.\nThe stock count may be stale.",
        "align": "start",
        "size": 22.0,
        "bold": false,
        "color": "#122019"
      },
      {
        "kind": "label",
        "x": 460.0,
        "y": 408.0,
        "width": 345.0,
        "height": 34.0,
        "text": "Checkout",
        "align": "start",
        "size": 25.0,
        "bold": true,
        "color": "#0B5D3B"
      },
      {
        "kind": "label",
        "x": 460.0,
        "y": 448.0,
        "width": 345.0,
        "height": 96.0,
        "text": "A and B can confirm the sale.\nC cannot get a majority\nand cannot confirm checkout.",
        "align": "start",
        "size": 22.0,
        "bold": false,
        "color": "#122019"
      },
      {
        "kind": "label",
        "x": 846.0,
        "y": 408.0,
        "width": 345.0,
        "height": 34.0,
        "text": "Waitlist",
        "align": "start",
        "size": 25.0,
        "bold": true,
        "color": "#0B5D3B"
      },
      {
        "kind": "label",
        "x": 846.0,
        "y": 448.0,
        "width": 345.0,
        "height": 96.0,
        "text": "The app can save the request\nlocally as pending and submit\nit after reconnecting.",
        "align": "start",
        "size": 22.0,
        "bold": false,
        "color": "#122019"
      }
    ]
  },
  {
    "id": "mongodb-17",
    "section": "Distributed systems",
    "title": "MongoDB read and write settings",
    "lead": "MongoDB exposes separate settings for read routing, read visibility, and write acknowledgment.",
    "points": [
      "Read preference selects the replica that serves a read. A secondary can return older data.",
      "Read concern controls what data a read can observe. A majority read can return an older committed value. A linearizable read checks a single document on the primary.",
      "Write concern sets the acknowledgment required for a write. The isolated member C cannot satisfy majority write concern on its own."
    ],
    "takeaway": "A supported linearizable read reflects successful majority writes completed before it began."
  },
  {
    "id": "mongodb-18",
    "section": "Distributed systems",
    "title": "PACELC and normal operation",
    "lead": "PACELC asks what the database trades off during a partition and what it trades off when the network is healthy.",
    "points": [
      "If Partition (P), the tradeoff is Availability (A) versus Consistency (C).",
      "Else (E), the tradeoff is Latency (L) versus Consistency (C). A remote acknowledgment can add delay.",
      "In the shop, checkout can pay that latency cost while catalog browsing can accept a replica’s potentially older view."
    ],
    "takeaway": "The relevant tradeoff depends on the request and the state of the network."
  }
];
