window.DBMS_ORIGINAL_SLIDES = { sql: {
  "source": "Lecture_2_3_SQLv4_with_labs.pptx",
  "count": 126,
  "slides": {
    "1": {
      "number": 1,
      "title": "Introduction to SQL",
      "elements": []
    },
    "2": {
      "number": 2,
      "title": "SQL is declarative: say what, not how",
      "elements": [
        {
          "kind": "text",
          "name": "Content Placeholder 2",
          "placeholder": "body",
          "position": {
            "x": 838199,
            "y": 1825625,
            "w": 7239000,
            "h": 3660775
          },
          "paragraphs": [
            {
              "text": "Application code asks for the result.",
              "level": 0,
              "bullet": true
            },
            {
              "text": "The DBMS chooses an execution strategy.",
              "level": 0,
              "bullet": true
            },
            {
              "text": "The same query can benefit from new indexes or a new plan without being rewritten.",
              "level": 0,
              "bullet": true
            }
          ]
        },
        {
          "kind": "text",
          "name": "TextBox 6",
          "placeholder": "",
          "position": {
            "x": 8395447,
            "y": 2457637,
            "w": 3572966,
            "h": 830997
          },
          "paragraphs": [
            {
              "text": "SQL separates",
              "level": 0,
              "bullet": false
            },
            {
              "text": "meaning from execution",
              "level": 0,
              "bullet": false
            }
          ]
        },
        {
          "kind": "text",
          "name": "TextBox 5",
          "placeholder": "",
          "position": {
            "x": 1766047,
            "y": 5699909,
            "w": 8659906,
            "h": 954107
          },
          "paragraphs": [
            {
              "text": "Mental model: describe the answer; let the optimizer plan the work.",
              "level": 0,
              "bullet": false
            }
          ]
        }
      ]
    },
    "3": {
      "number": 3,
      "title": "SQL Part I",
      "elements": []
    },
    "4": {
      "number": 4,
      "title": "1. SQL Introduction & Definitions",
      "elements": []
    },
    "5": {
      "number": 5,
      "title": "Basic SQL",
      "elements": []
    },
    "6": {
      "number": 6,
      "title": "SQL Introduction",
      "elements": [
        {
          "kind": "text",
          "name": "Content Placeholder 2",
          "placeholder": "body",
          "position": {
            "x": 838199,
            "y": 1825625,
            "w": 10295965,
            "h": 3660775
          },
          "paragraphs": [
            {
              "text": "SQL is a standard language for querying and manipulating data",
              "level": 0,
              "bullet": true
            },
            {
              "text": "SQL is a very high-level programming language",
              "level": 0,
              "bullet": true
            },
            {
              "text": "This works because it is optimized well!",
              "level": 1,
              "bullet": true
            },
            {
              "text": "Many standards out there:",
              "level": 0,
              "bullet": true
            },
            {
              "text": "ANSI SQL,  SQL92 (a.k.a. SQL2),  SQL99 (a.k.a. SQL3), ….",
              "level": 1,
              "bullet": true
            },
            {
              "text": "Vendors support various subsets",
              "level": 1,
              "bullet": true
            }
          ]
        },
        {
          "kind": "text",
          "name": "TextBox 6",
          "placeholder": "",
          "position": {
            "x": 8395447,
            "y": 2457637,
            "w": 3572966,
            "h": 830997
          },
          "paragraphs": [
            {
              "text": "SQL stands for",
              "level": 0,
              "bullet": false
            },
            {
              "text": "Structured Query Language",
              "level": 0,
              "bullet": false
            }
          ]
        },
        {
          "kind": "text",
          "name": "TextBox 5",
          "placeholder": "",
          "position": {
            "x": 1766047,
            "y": 5699909,
            "w": 8659906,
            "h": 954107
          },
          "paragraphs": [
            {
              "text": "NB: Probably the world’s most successful parallel programming language (multicore?)",
              "level": 0,
              "bullet": false
            }
          ]
        }
      ]
    },
    "7": {
      "number": 7,
      "title": "From SEQUEL to SQL:2023",
      "elements": [
        {
          "kind": "text",
          "name": "Content Placeholder 2",
          "placeholder": "body",
          "position": {
            "x": 838199,
            "y": 1825625,
            "w": 7239000,
            "h": 3660775
          },
          "paragraphs": [
            {
              "text": "1972: IBM's System R team develops SEQUEL.",
              "level": 0,
              "bullet": true
            },
            {
              "text": "1986-1987: ANSI and ISO standardize SQL.",
              "level": 0,
              "bullet": true
            },
            {
              "text": "1999-2023: standards add objects, XML, windows, temporal data, JSON, and property graphs.",
              "level": 0,
              "bullet": true
            }
          ]
        },
        {
          "kind": "text",
          "name": "TextBox 6",
          "placeholder": "",
          "position": {
            "x": 8395447,
            "y": 2457637,
            "w": 3572966,
            "h": 830997
          },
          "paragraphs": [
            {
              "text": "SQL is a family",
              "level": 0,
              "bullet": false
            },
            {
              "text": "of dialects",
              "level": 0,
              "bullet": false
            }
          ]
        },
        {
          "kind": "text",
          "name": "TextBox 5",
          "placeholder": "",
          "position": {
            "x": 1766047,
            "y": 5699909,
            "w": 8659906,
            "h": 954107
          },
          "paragraphs": [
            {
              "text": "The syntax grows; the relational core remains.",
              "level": 0,
              "bullet": false
            }
          ]
        }
      ]
    },
    "8": {
      "number": 8,
      "title": "SQL is a…",
      "elements": [
        {
          "kind": "code",
          "name": "Rectangle 3",
          "placeholder": "body",
          "position": {
            "x": 0,
            "y": 0,
            "w": 0,
            "h": 0
          },
          "paragraphs": [
            {
              "text": "Data Definition Language (DDL)",
              "level": 0,
              "bullet": true
            },
            {
              "text": "Define relational schemata",
              "level": 1,
              "bullet": true
            },
            {
              "text": "Create/alter/delete tables and their attributes",
              "level": 1,
              "bullet": true
            },
            {
              "text": "Data Manipulation Language (DML)",
              "level": 0,
              "bullet": true
            },
            {
              "text": "Insert/delete/modify tuples in tables",
              "level": 1,
              "bullet": true
            },
            {
              "text": "Query one or more tables – discussed next!",
              "level": 1,
              "bullet": true
            }
          ]
        }
      ]
    },
    "9": {
      "number": 9,
      "title": "Tables in SQL",
      "elements": [
        {
          "kind": "text",
          "name": "TextBox 2",
          "placeholder": "",
          "position": {
            "x": 8229600,
            "y": 1690688,
            "w": 3124200,
            "h": 1569660
          },
          "paragraphs": [
            {
              "text": "A relation or table is a multiset of tuples having the attributes specified by the schema",
              "level": 0,
              "bullet": false
            }
          ]
        },
        {
          "kind": "text",
          "name": "Text Box 56",
          "placeholder": "",
          "position": {
            "x": 2909046,
            "y": 2108779,
            "w": 1184427,
            "h": 461665
          },
          "paragraphs": [
            {
              "text": "Product",
              "level": 0,
              "bullet": false
            }
          ]
        },
        {
          "kind": "table",
          "name": "Group 55",
          "position": {
            "x": 2980764,
            "y": 2606348,
            "w": 4672854,
            "h": 2436298
          },
          "rows": [
            [
              "PName",
              "Price",
              "Manufacturer"
            ],
            [
              "Gizmo",
              "$19.99",
              "GizmoWorks"
            ],
            [
              "Powergizmo",
              "$29.99",
              "GizmoWorks"
            ],
            [
              "SingleTouch",
              "$149.99",
              "Canon"
            ],
            [
              "MultiTouch",
              "$203.99",
              "Hitachi"
            ]
          ]
        },
        {
          "kind": "text",
          "name": "TextBox 3",
          "placeholder": "",
          "position": {
            "x": 8229600,
            "y": 3797140,
            "w": 3545030,
            "h": 962193
          },
          "paragraphs": [
            {
              "text": "Let’s break this definition down",
              "level": 0,
              "bullet": false
            }
          ]
        }
      ]
    },
    "10": {
      "number": 10,
      "title": "Tables in SQL",
      "elements": [
        {
          "kind": "text",
          "name": "TextBox 2",
          "placeholder": "",
          "position": {
            "x": 8420100,
            "y": 1554781,
            "w": 3124200,
            "h": 1569660
          },
          "paragraphs": [
            {
              "text": "A multiset is an unordered list (or: a set with multiple duplicate instances allowed)",
              "level": 0,
              "bullet": false
            }
          ]
        },
        {
          "kind": "text",
          "name": "Text Box 56",
          "placeholder": "",
          "position": {
            "x": 2909046,
            "y": 2108779,
            "w": 1184427,
            "h": 461665
          },
          "paragraphs": [
            {
              "text": "Product",
              "level": 0,
              "bullet": false
            }
          ]
        },
        {
          "kind": "table",
          "name": "Group 55",
          "position": {
            "x": 2980764,
            "y": 2606348,
            "w": 4672854,
            "h": 2436298
          },
          "rows": [
            [
              "PName",
              "Price",
              "Manufacturer"
            ],
            [
              "Gizmo",
              "$19.99",
              "GizmoWorks"
            ],
            [
              "Powergizmo",
              "$29.99",
              "GizmoWorks"
            ],
            [
              "SingleTouch",
              "$149.99",
              "Canon"
            ],
            [
              "MultiTouch",
              "$203.99",
              "Hitachi"
            ]
          ]
        },
        {
          "kind": "text",
          "name": "TextBox 1",
          "placeholder": "",
          "position": {
            "x": 8913317,
            "y": 3494668,
            "w": 2137765,
            "h": 923330
          },
          "paragraphs": [
            {
              "text": "List:            [1, 1, 2, 3]",
              "level": 0,
              "bullet": false
            },
            {
              "text": "Set:            {1, 2, 3}",
              "level": 0,
              "bullet": false
            },
            {
              "text": "Multiset:   {1, 1, 2, 3}",
              "level": 0,
              "bullet": false
            }
          ]
        },
        {
          "kind": "text",
          "name": "TextBox 4",
          "placeholder": "",
          "position": {
            "x": 8592844,
            "y": 4922597,
            "w": 2778709,
            "h": 369332
          },
          "paragraphs": [
            {
              "text": "i.e. no next(), etc. methods!",
              "level": 0,
              "bullet": false
            }
          ]
        }
      ]
    },
    "11": {
      "number": 11,
      "title": "Tables in SQL",
      "elements": [
        {
          "kind": "text",
          "name": "Text Box 56",
          "placeholder": "",
          "position": {
            "x": 2909046,
            "y": 2108779,
            "w": 1184427,
            "h": 461665
          },
          "paragraphs": [
            {
              "text": "Product",
              "level": 0,
              "bullet": false
            }
          ]
        },
        {
          "kind": "text",
          "name": "TextBox 2",
          "placeholder": "",
          "position": {
            "x": 8073874,
            "y": 2108779,
            "w": 3279926,
            "h": 1569660
          },
          "paragraphs": [
            {
              "text": "An attribute (or column) is a typed data entry present in each tuple in the relation",
              "level": 0,
              "bullet": false
            }
          ]
        },
        {
          "kind": "table",
          "name": "Group 55",
          "position": {
            "x": 2980764,
            "y": 2606348,
            "w": 4672854,
            "h": 2436298
          },
          "rows": [
            [
              "PName",
              "Price",
              "Manufacturer"
            ],
            [
              "Gizmo",
              "$19.99",
              "GizmoWorks"
            ],
            [
              "Powergizmo",
              "$29.99",
              "GizmoWorks"
            ],
            [
              "SingleTouch",
              "$149.99",
              "Canon"
            ],
            [
              "MultiTouch",
              "$203.99",
              "Hitachi"
            ]
          ]
        },
        {
          "kind": "text",
          "name": "TextBox 13",
          "placeholder": "",
          "position": {
            "x": 8073874,
            "y": 4673314,
            "w": 3279926,
            "h": 923330
          },
          "paragraphs": [
            {
              "text": "NB: Attributes must have an atomic type in standard SQL, i.e. not a list, set, etc.",
              "level": 0,
              "bullet": false
            }
          ]
        }
      ]
    },
    "12": {
      "number": 12,
      "title": "Tables in SQL",
      "elements": [
        {
          "kind": "text",
          "name": "Text Box 56",
          "placeholder": "",
          "position": {
            "x": 2909046,
            "y": 2108779,
            "w": 1184427,
            "h": 461665
          },
          "paragraphs": [
            {
              "text": "Product",
              "level": 0,
              "bullet": false
            }
          ]
        },
        {
          "kind": "table",
          "name": "Group 55",
          "position": {
            "x": 2980764,
            "y": 2606348,
            "w": 4672854,
            "h": 2436298
          },
          "rows": [
            [
              "PName",
              "Price",
              "Manufacturer"
            ],
            [
              "Gizmo",
              "$19.99",
              "GizmoWorks"
            ],
            [
              "Powergizmo",
              "$29.99",
              "GizmoWorks"
            ],
            [
              "SingleTouch",
              "$149.99",
              "Canon"
            ],
            [
              "MultiTouch",
              "$203.99",
              "Hitachi"
            ]
          ]
        },
        {
          "kind": "text",
          "name": "TextBox 2",
          "placeholder": "",
          "position": {
            "x": 8135470,
            "y": 4464424,
            "w": 3124200,
            "h": 1569660
          },
          "paragraphs": [
            {
              "text": "A tuple or row is a single entry in the table having the attributes specified by the schema",
              "level": 0,
              "bullet": false
            }
          ]
        },
        {
          "kind": "text",
          "name": "TextBox 3",
          "placeholder": "",
          "position": {
            "x": 3501259,
            "y": 5664752,
            "w": 3796424,
            "h": 369332
          },
          "paragraphs": [
            {
              "text": "Also referred to sometimes as a record",
              "level": 0,
              "bullet": false
            }
          ]
        }
      ]
    },
    "13": {
      "number": 13,
      "title": "Tables in SQL",
      "elements": [
        {
          "kind": "text",
          "name": "Text Box 56",
          "placeholder": "",
          "position": {
            "x": 2652466,
            "y": 1852219,
            "w": 1184427,
            "h": 461665
          },
          "paragraphs": [
            {
              "text": "Product",
              "level": 0,
              "bullet": false
            }
          ]
        },
        {
          "kind": "table",
          "name": "Group 55",
          "position": {
            "x": 2724184,
            "y": 2349788,
            "w": 4672854,
            "h": 2436298
          },
          "rows": [
            [
              "PName",
              "Price",
              "Manufacturer"
            ],
            [
              "Gizmo",
              "$19.99",
              "GizmoWorks"
            ],
            [
              "Powergizmo",
              "$29.99",
              "GizmoWorks"
            ],
            [
              "SingleTouch",
              "$149.99",
              "Canon"
            ],
            [
              "MultiTouch",
              "$203.99",
              "Hitachi"
            ]
          ]
        },
        {
          "kind": "text",
          "name": "TextBox 6",
          "placeholder": "",
          "position": {
            "x": 8354020,
            "y": 3106272,
            "w": 2380860,
            "h": 923330
          },
          "paragraphs": [
            {
              "text": "The number of tuples is the cardinality of the relation",
              "level": 0,
              "bullet": false
            }
          ]
        },
        {
          "kind": "text",
          "name": "TextBox 15",
          "placeholder": "",
          "position": {
            "x": 3870181,
            "y": 5541585,
            "w": 2380860,
            "h": 923330
          },
          "paragraphs": [
            {
              "text": "The number of attributes is the arity of the relation",
              "level": 0,
              "bullet": false
            }
          ]
        }
      ]
    },
    "14": {
      "number": 14,
      "title": "SQL tables are bags by default",
      "elements": [
        {
          "kind": "code",
          "name": "Content Placeholder 2",
          "placeholder": "body",
          "position": {
            "x": 838199,
            "y": 1825625,
            "w": 7239000,
            "h": 3660775
          },
          "paragraphs": [
            {
              "text": "Rows may repeat unless a key or operator prevents it.",
              "level": 0,
              "bullet": true
            },
            {
              "text": "SELECT preserves duplicates; SELECT DISTINCT removes them.",
              "level": 0,
              "bullet": true
            },
            {
              "text": "UNION removes duplicates; UNION ALL preserves them.",
              "level": 0,
              "bullet": true
            },
            {
              "text": "Always ask whether multiplicity is part of the answer.",
              "level": 0,
              "bullet": true
            }
          ]
        },
        {
          "kind": "text",
          "name": "TextBox 6",
          "placeholder": "",
          "position": {
            "x": 8395447,
            "y": 2457637,
            "w": 3572966,
            "h": 830997
          },
          "paragraphs": [
            {
              "text": "Bag = multiset",
              "level": 0,
              "bullet": false
            },
            {
              "text": "Set = no duplicates",
              "level": 0,
              "bullet": false
            }
          ]
        },
        {
          "kind": "text",
          "name": "TextBox 5",
          "placeholder": "",
          "position": {
            "x": 1766047,
            "y": 5699909,
            "w": 8659906,
            "h": 954107
          },
          "paragraphs": [
            {
              "text": "Duplicate behavior is semantics, not cosmetic formatting.",
              "level": 0,
              "bullet": false
            }
          ]
        }
      ]
    },
    "15": {
      "number": 15,
      "title": "Data Types in SQL",
      "elements": [
        {
          "kind": "text",
          "name": "Rectangle 3",
          "placeholder": "body",
          "position": {
            "x": 0,
            "y": 0,
            "w": 0,
            "h": 0
          },
          "paragraphs": [
            {
              "text": "Atomic types:",
              "level": 0,
              "bullet": true
            },
            {
              "text": "Characters: CHAR(20), VARCHAR(50)",
              "level": 1,
              "bullet": true
            },
            {
              "text": "Numbers: INT, BIGINT, SMALLINT, FLOAT",
              "level": 1,
              "bullet": true
            },
            {
              "text": "Others: MONEY, DATETIME, …",
              "level": 1,
              "bullet": true
            },
            {
              "text": "Every attribute must have an atomic type",
              "level": 0,
              "bullet": true
            },
            {
              "text": "Hence tables are flat",
              "level": 1,
              "bullet": true
            }
          ]
        }
      ]
    },
    "16": {
      "number": 16,
      "title": "Table Schemas",
      "elements": [
        {
          "kind": "text",
          "name": "Rectangle 3",
          "placeholder": "body",
          "position": {
            "x": 838200,
            "y": 1930373,
            "w": 10515600,
            "h": 4114800
          },
          "paragraphs": [
            {
              "text": "The schema of a table is the table name, its attributes, and their types:",
              "level": 0,
              "bullet": true
            },
            {
              "text": "A key is an attribute whose values are unique; we underline a key",
              "level": 0,
              "bullet": true
            }
          ]
        },
        {
          "kind": "text",
          "name": "Rectangle 35",
          "placeholder": "",
          "position": {
            "x": 1207618,
            "y": 3119696,
            "w": 9279991,
            "h": 757130
          },
          "paragraphs": [
            {
              "text": "Products(Pname: string, Price: decimal, Category: string, Manufacturer: string)",
              "level": 0,
              "bullet": false
            }
          ]
        },
        {
          "kind": "text",
          "name": "Rectangle 35",
          "placeholder": "",
          "position": {
            "x": 1207618,
            "y": 5181762,
            "w": 9279991,
            "h": 757130
          },
          "paragraphs": [
            {
              "text": "Products(Pname: string, Price: decimal, Category: string, Manufacturer: string)",
              "level": 0,
              "bullet": false
            }
          ]
        }
      ]
    },
    "17": {
      "number": 17,
      "title": "Key constraints",
      "elements": [
        {
          "kind": "text",
          "name": "TextBox 5",
          "placeholder": "",
          "position": {
            "x": 1117880,
            "y": 1672031,
            "w": 7924800,
            "h": 954107
          },
          "paragraphs": [
            {
              "text": "A key is a minimal subset of attributes that acts as a unique identifier for tuples in a relation",
              "level": 0,
              "bullet": false
            }
          ]
        },
        {
          "kind": "text",
          "name": "Content Placeholder 2",
          "placeholder": "body",
          "position": {
            "x": 838200,
            "y": 1946649,
            "w": 10515600,
            "h": 4911351
          },
          "paragraphs": [
            {
              "text": "A key is an implicit constraint on which tuples can be in the relation",
              "level": 0,
              "bullet": true
            },
            {
              "text": "i.e. if two tuples agree on the values of the key, then they must be the same tuple!",
              "level": 1,
              "bullet": true
            }
          ]
        },
        {
          "kind": "text",
          "name": "Rectangle 35",
          "placeholder": "",
          "position": {
            "x": 4699280,
            "y": 4905927,
            "w": 7084826,
            "h": 400110
          },
          "paragraphs": [
            {
              "text": "Students(sid:string, name:string, gpa: float)",
              "level": 0,
              "bullet": false
            }
          ]
        },
        {
          "kind": "text",
          "name": "TextBox 4",
          "placeholder": "",
          "position": {
            "x": 6808694,
            "y": 5373505,
            "w": 4975412,
            "h": 1200329
          },
          "paragraphs": [
            {
              "text": "1. Which would you select as a key?",
              "level": 0,
              "bullet": false
            },
            {
              "text": "2. Is a key always guaranteed to exist?",
              "level": 0,
              "bullet": false
            },
            {
              "text": "3. Can we have more than one key?",
              "level": 0,
              "bullet": false
            }
          ]
        }
      ]
    },
    "18": {
      "number": 18,
      "title": "NULL and NOT NULL",
      "elements": [
        {
          "kind": "text",
          "name": "Content Placeholder 2",
          "placeholder": "body",
          "position": {
            "x": 0,
            "y": 0,
            "w": 0,
            "h": 0
          },
          "paragraphs": [
            {
              "text": "To say “don’t know the value” we use NULL",
              "level": 0,
              "bullet": true
            },
            {
              "text": "NULL has (sometimes painful) semantics, more detail later",
              "level": 1,
              "bullet": true
            }
          ]
        },
        {
          "kind": "text",
          "name": "Rectangle 35",
          "placeholder": "",
          "position": {
            "x": 1905000,
            "y": 3053649,
            "w": 7084826,
            "h": 400110
          },
          "paragraphs": [
            {
              "text": "Students(sid:string, name:string, gpa: float)",
              "level": 0,
              "bullet": false
            }
          ]
        },
        {
          "kind": "table",
          "name": "Table 5",
          "position": {
            "x": 1905000,
            "y": 3820412,
            "w": 2895600,
            "h": 1371600
          },
          "rows": [
            [
              "sid",
              "name",
              "gpa"
            ],
            [
              "123",
              "Bob",
              "3.9"
            ],
            [
              "143",
              "Jim",
              "NULL"
            ]
          ]
        },
        {
          "kind": "text",
          "name": "TextBox 6",
          "placeholder": "",
          "position": {
            "x": 5109882,
            "y": 4736847,
            "w": 4881283,
            "h": 461665
          },
          "paragraphs": [
            {
              "text": "Say, Jim just enrolled in his first class.",
              "level": 0,
              "bullet": false
            }
          ]
        },
        {
          "kind": "text",
          "name": "TextBox 7",
          "placeholder": "",
          "position": {
            "x": 1557068,
            "y": 5943600,
            "w": 9924547,
            "h": 461665
          },
          "paragraphs": [
            {
              "text": "In SQL, we may constrain a column to be NOT NULL, e.g., “name” in this table",
              "level": 0,
              "bullet": false
            }
          ]
        }
      ]
    },
    "19": {
      "number": 19,
      "title": "General Constraints",
      "elements": [
        {
          "kind": "text",
          "name": "Content Placeholder 2",
          "placeholder": "body",
          "position": {
            "x": 0,
            "y": 0,
            "w": 0,
            "h": 0
          },
          "paragraphs": [
            {
              "text": "We can actually specify arbitrary assertions",
              "level": 0,
              "bullet": true
            },
            {
              "text": "E.g. “There cannot be 25 people in the DB class”",
              "level": 1,
              "bullet": true
            },
            {
              "text": "In practice, we don’t specify many such constraints. Why?",
              "level": 0,
              "bullet": true
            },
            {
              "text": "Performance!",
              "level": 1,
              "bullet": true
            }
          ]
        },
        {
          "kind": "text",
          "name": "TextBox 3",
          "placeholder": "",
          "position": {
            "x": 1434353,
            "y": 5357793,
            "w": 9323294,
            "h": 954107
          },
          "paragraphs": [
            {
              "text": "Whenever we do something ugly (or avoid doing something convenient) it’s for the sake of performance",
              "level": 0,
              "bullet": false
            }
          ]
        }
      ]
    },
    "20": {
      "number": 20,
      "title": "Summary of Schema Information",
      "elements": [
        {
          "kind": "text",
          "name": "Content Placeholder 2",
          "placeholder": "body",
          "position": {
            "x": 0,
            "y": 0,
            "w": 0,
            "h": 0
          },
          "paragraphs": [
            {
              "text": "Schema and Constraints are how databases understand the semantics (meaning) of data",
              "level": 0,
              "bullet": true
            },
            {
              "text": "They are also useful for optimization",
              "level": 0,
              "bullet": true
            },
            {
              "text": "SQL supports general constraints:",
              "level": 0,
              "bullet": true
            },
            {
              "text": "Keys and foreign keys are most important",
              "level": 1,
              "bullet": true
            },
            {
              "text": "We’ll give you a chance to write the others",
              "level": 1,
              "bullet": true
            }
          ]
        }
      ]
    },
    "21": {
      "number": 21,
      "title": "2. Single-table queries",
      "elements": []
    },
    "22": {
      "number": 22,
      "title": "What you will learn about in this section",
      "elements": [
        {
          "kind": "text",
          "name": "Content Placeholder 2",
          "placeholder": "body",
          "position": {
            "x": 838200,
            "y": 1825624,
            "w": 10515600,
            "h": 4175783
          },
          "paragraphs": [
            {
              "text": "The SFW query",
              "level": 0,
              "bullet": true
            },
            {
              "text": "Other useful operators: LIKE, DISTINCT, ORDER BY",
              "level": 0,
              "bullet": true
            }
          ]
        }
      ]
    },
    "23": {
      "number": 23,
      "title": "SQL Query",
      "elements": [
        {
          "kind": "text",
          "name": "Text Box 3",
          "placeholder": "",
          "position": {
            "x": 896218,
            "y": 1572308,
            "w": 9184245,
            "h": 1785104
          },
          "paragraphs": [
            {
              "text": "Basic form (there are many many more bells and whistles)",
              "level": 0,
              "bullet": true
            }
          ]
        },
        {
          "kind": "code",
          "name": "Rectangle 35",
          "placeholder": "",
          "position": {
            "x": 2149926,
            "y": 2957303,
            "w": 6676828,
            "h": 1384995
          },
          "paragraphs": [
            {
              "text": "SELECT <attributes>\nFROM   <one or more relations>\nWHERE  <conditions>",
              "level": 0,
              "bullet": false
            }
          ]
        },
        {
          "kind": "text",
          "name": "TextBox 6",
          "placeholder": "",
          "position": {
            "x": 5737063,
            "y": 4928421,
            "w": 4343400,
            "h": 523220
          },
          "paragraphs": [
            {
              "text": "Call this a SFW query.",
              "level": 0,
              "bullet": false
            }
          ]
        }
      ]
    },
    "24": {
      "number": 24,
      "title": "Simple SQL Query: Selection",
      "elements": [
        {
          "kind": "table",
          "name": "Group 3",
          "position": {
            "x": 4433598,
            "y": 1685315,
            "w": 6234404,
            "h": 1828800
          },
          "rows": [
            [
              "PName",
              "Price",
              "Category",
              "Manufacturer"
            ],
            [
              "Gizmo",
              "$19.99",
              "Gadgets",
              "GizmoWorks"
            ],
            [
              "Powergizmo",
              "$29.99",
              "Gadgets",
              "GizmoWorks"
            ],
            [
              "SingleTouch",
              "$149.99",
              "Photography",
              "Canon"
            ],
            [
              "MultiTouch",
              "$203.99",
              "Household",
              "Hitachi"
            ]
          ]
        },
        {
          "kind": "text",
          "name": "TextBox 17",
          "placeholder": "",
          "position": {
            "x": 340152,
            "y": 2130897,
            "w": 3407648,
            "h": 1200329
          },
          "paragraphs": [
            {
              "text": "Selection is the operation of filtering a relation’s tuples on some condition",
              "level": 0,
              "bullet": false
            }
          ]
        },
        {
          "kind": "code",
          "name": "Rectangle 35",
          "placeholder": "",
          "position": {
            "x": 1891398,
            "y": 3954324,
            "w": 4339650,
            "h": 1015663
          },
          "paragraphs": [
            {
              "text": "SELECT *\nFROM   Product\nWHERE  Category = ‘Gadgets’",
              "level": 0,
              "bullet": false
            }
          ]
        },
        {
          "kind": "table",
          "name": "Group 70",
          "position": {
            "x": 4433600,
            "y": 5410198,
            "w": 6234403,
            "h": 1097280
          },
          "rows": [
            [
              "PName",
              "Price",
              "Category",
              "Manufacturer"
            ],
            [
              "Gizmo",
              "$19.99",
              "Gadgets",
              "GizmoWorks"
            ],
            [
              "Powergizmo",
              "$29.99",
              "Gadgets",
              "GizmoWorks"
            ]
          ]
        }
      ]
    },
    "25": {
      "number": 25,
      "title": "Simple SQL Query: Projection",
      "elements": [
        {
          "kind": "table",
          "name": "Group 3",
          "position": {
            "x": 4433598,
            "y": 1685315,
            "w": 6234404,
            "h": 1828800
          },
          "rows": [
            [
              "PName",
              "Price",
              "Category",
              "Manufacturer"
            ],
            [
              "Gizmo",
              "$19.99",
              "Gadgets",
              "GizmoWorks"
            ],
            [
              "Powergizmo",
              "$29.99",
              "Gadgets",
              "GizmoWorks"
            ],
            [
              "SingleTouch",
              "$149.99",
              "Photography",
              "Canon"
            ],
            [
              "MultiTouch",
              "$203.99",
              "Household",
              "Hitachi"
            ]
          ]
        },
        {
          "kind": "text",
          "name": "TextBox 17",
          "placeholder": "",
          "position": {
            "x": 340152,
            "y": 1853010,
            "w": 3407648,
            "h": 1938992
          },
          "paragraphs": [
            {
              "text": "Projection is the operation of producing an output table with tuples that have a subset of their prior attributes",
              "level": 0,
              "bullet": false
            }
          ]
        },
        {
          "kind": "code",
          "name": "Rectangle 35",
          "placeholder": "",
          "position": {
            "x": 1350316,
            "y": 3954324,
            "w": 3909532,
            "h": 1015663
          },
          "paragraphs": [
            {
              "text": "SELECT Pname, Price, Manufacturer\nFROM   Product\nWHERE  Category = 'Gadgets'",
              "level": 0,
              "bullet": false
            }
          ]
        },
        {
          "kind": "table",
          "name": "Group 70",
          "position": {
            "x": 5212704,
            "y": 5410198,
            "w": 4676191,
            "h": 1097280
          },
          "rows": [
            [
              "PName",
              "Price",
              "Manufacturer"
            ],
            [
              "Gizmo",
              "$19.99",
              "GizmoWorks"
            ],
            [
              "Powergizmo",
              "$29.99",
              "GizmoWorks"
            ]
          ]
        }
      ]
    },
    "26": {
      "number": 26,
      "title": "Notation",
      "elements": [
        {
          "kind": "text",
          "name": "Rectangle 35",
          "placeholder": "",
          "position": {
            "x": 3556783,
            "y": 2314478,
            "w": 6963802,
            "h": 369332
          },
          "paragraphs": [
            {
              "text": "Product(PName, Price, Category, Manfacturer)",
              "level": 0,
              "bullet": false
            }
          ]
        },
        {
          "kind": "text",
          "name": "TextBox 1",
          "placeholder": "",
          "position": {
            "x": 1204717,
            "y": 2323710,
            "w": 1861407,
            "h": 461665
          },
          "paragraphs": [
            {
              "text": "Input schema",
              "level": 0,
              "bullet": false
            }
          ]
        },
        {
          "kind": "code",
          "name": "Rectangle 35",
          "placeholder": "",
          "position": {
            "x": 838200,
            "y": 3355808,
            "w": 5262979,
            "h": 1015663
          },
          "paragraphs": [
            {
              "text": "SELECT Pname, Price, Manufacturer\nFROM   Product\nWHERE  Category = ‘Gadgets’",
              "level": 0,
              "bullet": false
            }
          ]
        },
        {
          "kind": "text",
          "name": "Rectangle 35",
          "placeholder": "",
          "position": {
            "x": 4286529,
            "y": 4748645,
            "w": 5504309,
            "h": 369332
          },
          "paragraphs": [
            {
              "text": "Answer(PName, Price, Manfacturer)",
              "level": 0,
              "bullet": false
            }
          ]
        },
        {
          "kind": "text",
          "name": "TextBox 18",
          "placeholder": "",
          "position": {
            "x": 1204717,
            "y": 4790762,
            "w": 2089033,
            "h": 461665
          },
          "paragraphs": [
            {
              "text": "Output schema",
              "level": 0,
              "bullet": false
            }
          ]
        }
      ]
    },
    "27": {
      "number": 27,
      "title": "A Few Details",
      "elements": [
        {
          "kind": "code",
          "name": "Rectangle 3",
          "placeholder": "body",
          "position": {
            "x": 0,
            "y": 0,
            "w": 0,
            "h": 0
          },
          "paragraphs": [
            {
              "text": "SQL commands are case insensitive:",
              "level": 0,
              "bullet": true
            },
            {
              "text": "Same: SELECT,  Select,  select",
              "level": 1,
              "bullet": true
            },
            {
              "text": "Same: Product,   product",
              "level": 1,
              "bullet": true
            },
            {
              "text": "Values are not:",
              "level": 0,
              "bullet": true
            },
            {
              "text": "Different: ‘Seattle’,  ‘seattle’",
              "level": 1,
              "bullet": true
            },
            {
              "text": "MySQL uses case insensitive value.",
              "level": 1,
              "bullet": true
            },
            {
              "text": "Use single quotes for constants:",
              "level": 0,
              "bullet": true
            },
            {
              "text": "'abc'  - yes",
              "level": 1,
              "bullet": true
            },
            {
              "text": "\"abc\" - no",
              "level": 1,
              "bullet": true
            }
          ]
        }
      ]
    },
    "28": {
      "number": 28,
      "title": "Relational algebra is the mental model",
      "elements": [
        {
          "kind": "code",
          "name": "Content Placeholder 2",
          "placeholder": "body",
          "position": {
            "x": 838199,
            "y": 1825625,
            "w": 7239000,
            "h": 3660775
          },
          "paragraphs": [
            {
              "text": "Selection filters rows -> WHERE.",
              "level": 0,
              "bullet": true
            },
            {
              "text": "Projection chooses columns -> SELECT list.",
              "level": 0,
              "bullet": true
            },
            {
              "text": "Product combines possibilities; a condition turns it into a join.",
              "level": 0,
              "bullet": true
            },
            {
              "text": "Each operator returns a relation, so operators can be chained.",
              "level": 0,
              "bullet": true
            }
          ]
        },
        {
          "kind": "text",
          "name": "TextBox 6",
          "placeholder": "",
          "position": {
            "x": 8395447,
            "y": 2457637,
            "w": 3572966,
            "h": 830997
          },
          "paragraphs": [
            {
              "text": "sigma = rows",
              "level": 0,
              "bullet": false
            },
            {
              "text": "pi = columns",
              "level": 0,
              "bullet": false
            }
          ]
        },
        {
          "kind": "text",
          "name": "TextBox 5",
          "placeholder": "",
          "position": {
            "x": 1766047,
            "y": 5699909,
            "w": 8659906,
            "h": 954107
          },
          "paragraphs": [
            {
              "text": "Translate the question into operations before writing syntax.",
              "level": 0,
              "bullet": false
            }
          ]
        }
      ]
    },
    "29": {
      "number": 29,
      "title": "LIKE: Simple String Pattern Matching",
      "elements": [
        {
          "kind": "code",
          "name": "Rectangle 4",
          "placeholder": "",
          "position": {
            "x": 3470989,
            "y": 2103438,
            "w": 5250022,
            "h": 1089529
          },
          "paragraphs": [
            {
              "text": "SELECT *\nFROM   Products\nWHERE  PName LIKE ‘%gizmo%’",
              "level": 0,
              "bullet": false
            }
          ]
        },
        {
          "kind": "text",
          "name": "Rectangle 3",
          "placeholder": "body",
          "position": {
            "x": 2936810,
            "y": 3711071,
            "w": 6318380,
            "h": 2286000
          },
          "paragraphs": [
            {
              "text": "s LIKE p:  pattern matching on strings",
              "level": 0,
              "bullet": true
            },
            {
              "text": "p may contain two special symbols:",
              "level": 0,
              "bullet": true
            },
            {
              "text": "%  = any sequence of characters",
              "level": 1,
              "bullet": true
            },
            {
              "text": "_   = any single character",
              "level": 1,
              "bullet": true
            }
          ]
        }
      ]
    },
    "30": {
      "number": 30,
      "title": "DISTINCT: Eliminating Duplicates",
      "elements": [
        {
          "kind": "table",
          "name": "Group 54",
          "position": {
            "x": 7772400,
            "y": 1905000,
            "w": 1981200,
            "h": 1828800
          },
          "rows": [
            [
              "Category"
            ],
            [
              "Gadgets"
            ],
            [
              "Photography"
            ],
            [
              "Household"
            ]
          ]
        },
        {
          "kind": "code",
          "name": "Rectangle 3",
          "placeholder": "",
          "position": {
            "x": 1438472,
            "y": 2133601,
            "w": 4631797,
            "h": 830997
          },
          "paragraphs": [
            {
              "text": "SELECT DISTINCT Category",
              "level": 0,
              "bullet": false
            },
            {
              "text": "FROM   Product",
              "level": 0,
              "bullet": false
            }
          ]
        },
        {
          "kind": "text",
          "name": "Text Box 4",
          "placeholder": "",
          "position": {
            "x": 3133834,
            "y": 3600071,
            "w": 990325,
            "h": 461665
          },
          "paragraphs": [
            {
              "text": "Versus",
              "level": 0,
              "bullet": false
            }
          ]
        },
        {
          "kind": "table",
          "name": "Group 39",
          "position": {
            "x": 7772400,
            "y": 4163808,
            "w": 1981200,
            "h": 2286000
          },
          "rows": [
            [
              "Category"
            ],
            [
              "Gadgets"
            ],
            [
              "Gadgets"
            ],
            [
              "Photography"
            ],
            [
              "Household"
            ]
          ]
        },
        {
          "kind": "code",
          "name": "Rectangle 5",
          "placeholder": "",
          "position": {
            "x": 2374214,
            "y": 4697209,
            "w": 2964123,
            "h": 830997
          },
          "paragraphs": [
            {
              "text": "SELECT Category",
              "level": 0,
              "bullet": false
            },
            {
              "text": "FROM   Product",
              "level": 0,
              "bullet": false
            }
          ]
        }
      ]
    },
    "31": {
      "number": 31,
      "title": "ORDER BY: Sorting the Results",
      "elements": [
        {
          "kind": "code",
          "name": "Rectangle 3",
          "placeholder": "",
          "position": {
            "x": 2283840,
            "y": 2249201,
            "w": 7622600,
            "h": 1569660
          },
          "paragraphs": [
            {
              "text": "SELECT   PName, Price, Manufacturer",
              "level": 0,
              "bullet": false
            },
            {
              "text": "FROM     Product",
              "level": 0,
              "bullet": false
            },
            {
              "text": "WHERE    Category=‘gizmo’ AND Price > 50",
              "level": 0,
              "bullet": false
            },
            {
              "text": "ORDER BY Price, PName",
              "level": 0,
              "bullet": false
            }
          ]
        },
        {
          "kind": "text",
          "name": "TextBox 9",
          "placeholder": "",
          "position": {
            "x": 2746581,
            "y": 4458133,
            "w": 2690342,
            "h": 1323439
          },
          "paragraphs": [
            {
              "text": "Ties are broken by the second attribute on the ORDER BY list, etc.",
              "level": 0,
              "bullet": false
            }
          ]
        },
        {
          "kind": "text",
          "name": "TextBox 10",
          "placeholder": "",
          "position": {
            "x": 6580795,
            "y": 4458133,
            "w": 2690342,
            "h": 1323439
          },
          "paragraphs": [
            {
              "text": "Ordering is ascending, unless you specify the DESC keyword.",
              "level": 0,
              "bullet": false
            }
          ]
        }
      ]
    },
    "32": {
      "number": 32,
      "title": "3. Multi-table queries",
      "elements": []
    },
    "33": {
      "number": 33,
      "title": "What you will learn about in this section",
      "elements": [
        {
          "kind": "text",
          "name": "Content Placeholder 2",
          "placeholder": "body",
          "position": {
            "x": 838200,
            "y": 1825624,
            "w": 10515600,
            "h": 4175783
          },
          "paragraphs": [
            {
              "text": "Foreign key constraints",
              "level": 0,
              "bullet": true
            },
            {
              "text": "Joins: basics",
              "level": 0,
              "bullet": true
            },
            {
              "text": "Joins: SQL semantics",
              "level": 0,
              "bullet": true
            }
          ]
        }
      ]
    },
    "34": {
      "number": 34,
      "title": "Foreign Key constraints",
      "elements": [
        {
          "kind": "text",
          "name": "Content Placeholder 2",
          "placeholder": "body",
          "position": {
            "x": 838200,
            "y": 1604865,
            "w": 8427098,
            "h": 4399001
          },
          "paragraphs": [
            {
              "text": "Suppose we have the following schema:",
              "level": 0,
              "bullet": true
            },
            {
              "text": "And we want to impose the following constraint:",
              "level": 0,
              "bullet": true
            },
            {
              "text": "‘Only bona fide students may enroll in courses’ i.e. a student must appear in the Students table to enroll in a class",
              "level": 1,
              "bullet": true
            }
          ]
        },
        {
          "kind": "text",
          "name": "Rectangle 35",
          "placeholder": "",
          "position": {
            "x": 2055830,
            "y": 2083217,
            "w": 8865488,
            "h": 1015663
          },
          "paragraphs": [
            {
              "text": "Students(sid: string, name: string, gpa: float)",
              "level": 0,
              "bullet": false
            },
            {
              "text": "Enrolled(student_id: string, cid: string, grade: string)",
              "level": 0,
              "bullet": false
            }
          ]
        },
        {
          "kind": "text",
          "name": "TextBox 7",
          "placeholder": "",
          "position": {
            "x": 9265298,
            "y": 4260685,
            "w": 2530898,
            "h": 646331
          },
          "paragraphs": [
            {
              "text": "student_id alone is not a key- what is?",
              "level": 0,
              "bullet": false
            }
          ]
        },
        {
          "kind": "text",
          "name": "TextBox 2",
          "placeholder": "",
          "position": {
            "x": 2667001,
            "y": 4395990,
            "w": 1029000,
            "h": 369332
          },
          "paragraphs": [
            {
              "text": "Students",
              "level": 0,
              "bullet": false
            }
          ]
        },
        {
          "kind": "text",
          "name": "TextBox 12",
          "placeholder": "",
          "position": {
            "x": 6001678,
            "y": 4395990,
            "w": 973793,
            "h": 369332
          },
          "paragraphs": [
            {
              "text": "Enrolled",
              "level": 0,
              "bullet": false
            }
          ]
        },
        {
          "kind": "table",
          "name": "Table 8",
          "position": {
            "x": 2743201,
            "y": 4765322,
            "w": 2029408,
            "h": 1097280
          },
          "rows": [
            [
              "sid",
              "name",
              "gpa"
            ],
            [
              "101",
              "Bob",
              "3.2"
            ],
            [
              "123",
              "Mary",
              "3.8"
            ]
          ]
        },
        {
          "kind": "table",
          "name": "Table 9",
          "position": {
            "x": 6088767,
            "y": 4765323,
            "w": 3000148,
            "h": 1111527
          },
          "rows": [
            [
              "student_id",
              "cid",
              "grade"
            ],
            [
              "123",
              "564",
              "A"
            ],
            [
              "123",
              "537",
              "A+"
            ]
          ]
        },
        {
          "kind": "text",
          "name": "TextBox 13",
          "placeholder": "",
          "position": {
            "x": 1372920,
            "y": 6149632,
            "w": 9431694,
            "h": 523220
          },
          "paragraphs": [
            {
              "text": "We say that student_id is a foreign key that refers to Students",
              "level": 0,
              "bullet": false
            }
          ]
        }
      ]
    },
    "35": {
      "number": 35,
      "title": "Declaring Foreign Keys",
      "elements": [
        {
          "kind": "code",
          "name": "Rectangle 3",
          "placeholder": "",
          "position": {
            "x": 1451138,
            "y": 2077617,
            "w": 10219464,
            "h": 3600986
          },
          "paragraphs": [
            {
              "text": "Students(sid: string, name: string, gpa: float)",
              "level": 0,
              "bullet": false
            },
            {
              "text": "Enrolled(student_id: string, cid: string, grade: string)",
              "level": 0,
              "bullet": false
            },
            {
              "text": "CREATE TABLE Enrolled(",
              "level": 0,
              "bullet": false
            },
            {
              "text": "student_id CHAR(20),",
              "level": 0,
              "bullet": false
            },
            {
              "text": "cid\t\t CHAR(20),",
              "level": 0,
              "bullet": false
            },
            {
              "text": "grade\t CHAR(10),",
              "level": 0,
              "bullet": false
            },
            {
              "text": "PRIMARY KEY (student_id, cid),",
              "level": 0,
              "bullet": false
            },
            {
              "text": "FOREIGN KEY (student_id) REFERENCES Students(sid)",
              "level": 0,
              "bullet": false
            },
            {
              "text": ")",
              "level": 0,
              "bullet": false
            }
          ]
        }
      ]
    },
    "36": {
      "number": 36,
      "title": "Foreign Keys and update operations",
      "elements": [
        {
          "kind": "text",
          "name": "Rectangle 35",
          "placeholder": "",
          "position": {
            "x": 1853756,
            "y": 1690688,
            "w": 8865488,
            "h": 1015663
          },
          "paragraphs": [
            {
              "text": "Students(sid: string, name: string, gpa: float)",
              "level": 0,
              "bullet": false
            },
            {
              "text": "Enrolled(student_id: string, cid: string, grade: string)",
              "level": 0,
              "bullet": false
            }
          ]
        },
        {
          "kind": "code",
          "name": "Content Placeholder 2",
          "placeholder": "body",
          "position": {
            "x": 838200,
            "y": 3116425,
            "w": 10515600,
            "h": 4572098
          },
          "paragraphs": [
            {
              "text": "What if we insert a tuple into Enrolled, but no corresponding student?",
              "level": 0,
              "bullet": true
            },
            {
              "text": "INSERT is rejected (foreign keys are constraints)!",
              "level": 1,
              "bullet": true
            },
            {
              "text": "What if we delete a student?",
              "level": 0,
              "bullet": true
            },
            {
              "text": "Disallow the delete",
              "level": 1,
              "bullet": true
            },
            {
              "text": "Remove all of the courses for that student",
              "level": 1,
              "bullet": true
            },
            {
              "text": "SQL allows a third via NULL (not yet covered)",
              "level": 1,
              "bullet": true
            }
          ]
        },
        {
          "kind": "text",
          "name": "TextBox 7",
          "placeholder": "",
          "position": {
            "x": 5602714,
            "y": 4813041,
            "w": 3630094,
            "h": 400110
          },
          "paragraphs": [
            {
              "text": "DBA chooses (syntax in the book)",
              "level": 0,
              "bullet": false
            }
          ]
        }
      ]
    },
    "37": {
      "number": 37,
      "title": "Keys and Foreign Keys",
      "elements": [
        {
          "kind": "text",
          "name": "Text Box 62",
          "placeholder": "",
          "position": {
            "x": 1905001,
            "y": 1594052,
            "w": 1368425,
            "h": 457200
          },
          "paragraphs": [
            {
              "text": "Company",
              "level": 0,
              "bullet": false
            }
          ]
        },
        {
          "kind": "text",
          "name": "TextBox 1",
          "placeholder": "",
          "position": {
            "x": 7128588,
            "y": 1975628,
            "w": 2438400,
            "h": 1477328
          },
          "paragraphs": [
            {
              "text": "What is a foreign key vs. a key here?",
              "level": 0,
              "bullet": false
            }
          ]
        },
        {
          "kind": "table",
          "name": "Group 106",
          "position": {
            "x": 1828800,
            "y": 2124277,
            "w": 3909527,
            "h": 1463040
          },
          "rows": [
            [
              "CName",
              "StockPrice",
              "Country"
            ],
            [
              "GizmoWorks",
              "25",
              "USA"
            ],
            [
              "Canon",
              "65",
              "Japan"
            ],
            [
              "Hitachi",
              "15",
              "Japan"
            ]
          ]
        },
        {
          "kind": "text",
          "name": "Text Box 36",
          "placeholder": "",
          "position": {
            "x": 1828800,
            "y": 3962401,
            "w": 1164952,
            "h": 461665
          },
          "paragraphs": [
            {
              "text": "Product",
              "level": 0,
              "bullet": false
            }
          ]
        },
        {
          "kind": "table",
          "name": "Group 102",
          "position": {
            "x": 1828800,
            "y": 4495800,
            "w": 6400799,
            "h": 1860550
          },
          "rows": [
            [
              "PName",
              "Price",
              "Category",
              "Manufacturer"
            ],
            [
              "Gizmo",
              "$19.99",
              "Gadgets",
              "GizmoWorks"
            ],
            [
              "Powergizmo",
              "$29.99",
              "Gadgets",
              "GizmoWorks"
            ],
            [
              "SingleTouch",
              "$149.99",
              "Photography",
              "Canon"
            ],
            [
              "MultiTouch",
              "$203.99",
              "Household",
              "Hitachi"
            ]
          ]
        }
      ]
    },
    "38": {
      "number": 38,
      "title": "Joins",
      "elements": [
        {
          "kind": "text",
          "name": "Rectangle 35",
          "placeholder": "",
          "position": {
            "x": 1699797,
            "y": 1678109,
            "w": 7355558,
            "h": 1015663
          },
          "paragraphs": [
            {
              "text": "Product(PName, Price, Category, Manufacturer)",
              "level": 0,
              "bullet": false
            },
            {
              "text": "Company(CName, StockPrice, Country)",
              "level": 0,
              "bullet": false
            }
          ]
        },
        {
          "kind": "text",
          "name": "TextBox 1",
          "placeholder": "",
          "position": {
            "x": 9429036,
            "y": 2372589,
            "w": 2617038,
            "h": 1477328
          },
          "paragraphs": [
            {
              "text": "Note: we will often omit attribute types in schema definitions for brevity, but assume attributes are always atomic types",
              "level": 0,
              "bullet": false
            }
          ]
        },
        {
          "kind": "text",
          "name": "Rectangle 4",
          "placeholder": "",
          "position": {
            "x": 1781888,
            "y": 2861524,
            "w": 7191375,
            "h": 896060
          },
          "paragraphs": [
            {
              "text": "Ex: Find all products under $200 manufactured in Japan;\nreturn their names and prices.",
              "level": 0,
              "bullet": false
            }
          ]
        },
        {
          "kind": "code",
          "name": "Rectangle 5",
          "placeholder": "",
          "position": {
            "x": 3130806,
            "y": 4006756,
            "w": 4493538,
            "h": 1631216
          },
          "paragraphs": [
            {
              "text": "SELECT PName, Price\nFROM   Product, Company\nWHERE  Manufacturer = CName",
              "level": 0,
              "bullet": false
            },
            {
              "text": "AND Country=‘Japan’\n       AND Price <= 200",
              "level": 0,
              "bullet": false
            }
          ]
        }
      ]
    },
    "39": {
      "number": 39,
      "title": "Joins",
      "elements": [
        {
          "kind": "text",
          "name": "Rectangle 35",
          "placeholder": "",
          "position": {
            "x": 2418221,
            "y": 1678109,
            "w": 7355558,
            "h": 1015663
          },
          "paragraphs": [
            {
              "text": "Product(PName, Price, Category, Manufacturer)",
              "level": 0,
              "bullet": false
            },
            {
              "text": "Company(CName, StockPrice, Country)",
              "level": 0,
              "bullet": false
            }
          ]
        },
        {
          "kind": "text",
          "name": "Rectangle 4",
          "placeholder": "",
          "position": {
            "x": 2500312,
            "y": 2861524,
            "w": 7191375,
            "h": 896060
          },
          "paragraphs": [
            {
              "text": "Ex: Find all products under $200 manufactured in Japan;\nreturn their names and prices.",
              "level": 0,
              "bullet": false
            }
          ]
        },
        {
          "kind": "code",
          "name": "Rectangle 5",
          "placeholder": "",
          "position": {
            "x": 1914832,
            "y": 4006756,
            "w": 4493538,
            "h": 1631216
          },
          "paragraphs": [
            {
              "text": "SELECT PName, Price\nFROM   Product, Company\nWHERE  Manufacturer = CName",
              "level": 0,
              "bullet": false
            },
            {
              "text": "AND Country=‘Japan’\n       AND Price <= 200",
              "level": 0,
              "bullet": false
            }
          ]
        },
        {
          "kind": "code",
          "name": "TextBox 14",
          "placeholder": "",
          "position": {
            "x": 6813254,
            "y": 4037534,
            "w": 3796947,
            "h": 1569660
          },
          "paragraphs": [
            {
              "text": "A join between tables returns all unique combinations of their tuples which meet some specified join condition",
              "level": 0,
              "bullet": false
            }
          ]
        }
      ]
    },
    "40": {
      "number": 40,
      "title": "Joins",
      "elements": [
        {
          "kind": "text",
          "name": "Rectangle 35",
          "placeholder": "",
          "position": {
            "x": 2418221,
            "y": 1678109,
            "w": 7355558,
            "h": 1015663
          },
          "paragraphs": [
            {
              "text": "Product(PName, Price, Category, Manufacturer)",
              "level": 0,
              "bullet": false
            },
            {
              "text": "Company(CName, StockPrice, Country)",
              "level": 0,
              "bullet": false
            }
          ]
        },
        {
          "kind": "text",
          "name": "Rectangle 4",
          "placeholder": "",
          "position": {
            "x": 578245,
            "y": 3003672,
            "w": 7191375,
            "h": 488166
          },
          "paragraphs": [
            {
              "text": "Several equivalent ways to write a basic join in SQL:",
              "level": 0,
              "bullet": false
            }
          ]
        },
        {
          "kind": "code",
          "name": "Rectangle 5",
          "placeholder": "",
          "position": {
            "x": 4952999,
            "y": 3822144,
            "w": 6794241,
            "h": 1477328
          },
          "paragraphs": [
            {
              "text": "SELECT PName, Price\nFROM   Product",
              "level": 0,
              "bullet": false
            },
            {
              "text": "JOIN   Company ON Manufacturer = Cname",
              "level": 0,
              "bullet": false
            },
            {
              "text": "AND Country=‘Japan’\nWHERE  Price <= 200",
              "level": 0,
              "bullet": false
            }
          ]
        },
        {
          "kind": "code",
          "name": "Rectangle 5",
          "placeholder": "",
          "position": {
            "x": 671551,
            "y": 3826323,
            "w": 3937771,
            "h": 1477328
          },
          "paragraphs": [
            {
              "text": "SELECT PName, Price\nFROM   Product, Company\nWHERE  Manufacturer = CName",
              "level": 0,
              "bullet": false
            },
            {
              "text": "AND Country=‘Japan’\n       AND Price <= 200",
              "level": 0,
              "bullet": false
            }
          ]
        },
        {
          "kind": "text",
          "name": "TextBox 1",
          "placeholder": "",
          "position": {
            "x": 7249886,
            "y": 5784980,
            "w": 2221121,
            "h": 369332
          },
          "paragraphs": [
            {
              "text": "A few more later on…",
              "level": 0,
              "bullet": false
            }
          ]
        }
      ]
    },
    "41": {
      "number": 41,
      "title": "Joins",
      "elements": [
        {
          "kind": "text",
          "name": "Text Box 36",
          "placeholder": "",
          "position": {
            "x": 1524000,
            "y": 1244478,
            "w": 1164952,
            "h": 461665
          },
          "paragraphs": [
            {
              "text": "Product",
              "level": 0,
              "bullet": false
            }
          ]
        },
        {
          "kind": "text",
          "name": "Text Box 37",
          "placeholder": "",
          "position": {
            "x": 9347067,
            "y": 1489841,
            "w": 1364476,
            "h": 461665
          },
          "paragraphs": [
            {
              "text": "Company",
              "level": 0,
              "bullet": false
            }
          ]
        },
        {
          "kind": "table",
          "name": "Group 70",
          "position": {
            "x": 1524000,
            "y": 1708151,
            "w": 5029200,
            "h": 2456793
          },
          "rows": [
            [
              "PName",
              "Price",
              "Category",
              "Manuf"
            ],
            [
              "Gizmo",
              "$19",
              "Gadgets",
              "GWorks"
            ],
            [
              "Powergizmo",
              "$29",
              "Gadgets",
              "GWorks"
            ],
            [
              "SingleTouch",
              "$149",
              "Photography",
              "Canon"
            ],
            [
              "MultiTouch",
              "$203",
              "Household",
              "Hitachi"
            ]
          ]
        },
        {
          "kind": "table",
          "name": "Group 71",
          "position": {
            "x": 6858000,
            "y": 1936751,
            "w": 3810000,
            "h": 1845129
          },
          "rows": [
            [
              "Cname",
              "Stock",
              "Country"
            ],
            [
              "GWorks",
              "25",
              "USA"
            ],
            [
              "Canon",
              "65",
              "Japan"
            ],
            [
              "Hitachi",
              "15",
              "Japan"
            ]
          ]
        },
        {
          "kind": "code",
          "name": "Rectangle 5",
          "placeholder": "",
          "position": {
            "x": 1524000,
            "y": 4725134,
            "w": 4493538,
            "h": 1631216
          },
          "paragraphs": [
            {
              "text": "SELECT PName, Price\nFROM   Product, Company\nWHERE  Manufacturer = CName",
              "level": 0,
              "bullet": false
            },
            {
              "text": "AND Country=‘Japan’\n       AND Price <= 200",
              "level": 0,
              "bullet": false
            }
          ]
        },
        {
          "kind": "table",
          "name": "Group 113",
          "position": {
            "x": 6858000,
            "y": 5441950,
            "w": 3810000,
            "h": 914400
          },
          "rows": [
            [
              "PName",
              "Price"
            ],
            [
              "SingleTouch",
              "$149.99"
            ]
          ]
        }
      ]
    },
    "42": {
      "number": 42,
      "title": "Tuple Variable Ambiguity in Multi-Table",
      "elements": [
        {
          "kind": "text",
          "name": "Rectangle 35",
          "placeholder": "",
          "position": {
            "x": 2590799,
            "y": 1900375,
            "w": 5288865,
            "h": 1015663
          },
          "paragraphs": [
            {
              "text": "Person(name, address, worksfor)\nCompany(name, address)",
              "level": 0,
              "bullet": false
            }
          ]
        },
        {
          "kind": "text",
          "name": "TextBox 3",
          "placeholder": "",
          "position": {
            "x": 8470641,
            "y": 3682737,
            "w": 3167779,
            "h": 1569660
          },
          "paragraphs": [
            {
              "text": "Which “address” does this refer to?",
              "level": 0,
              "bullet": false
            },
            {
              "text": "Which “name”s??",
              "level": 0,
              "bullet": false
            }
          ]
        },
        {
          "kind": "code",
          "name": "Rectangle 4",
          "placeholder": "",
          "position": {
            "x": 2680685,
            "y": 3959736,
            "w": 5109091,
            "h": 1015663
          },
          "paragraphs": [
            {
              "text": "SELECT DISTINCT name, address\nFROM      \t    Person, Company\nWHERE           worksfor = name",
              "level": 0,
              "bullet": false
            }
          ]
        }
      ]
    },
    "43": {
      "number": 43,
      "title": "Tuple Variable Ambiguity in Multi-Table",
      "elements": [
        {
          "kind": "text",
          "name": "Rectangle 35",
          "placeholder": "",
          "position": {
            "x": 2590799,
            "y": 1900375,
            "w": 5288865,
            "h": 1015663
          },
          "paragraphs": [
            {
              "text": "Person(name, address, worksfor)\nCompany(name, address)",
              "level": 0,
              "bullet": false
            }
          ]
        },
        {
          "kind": "code",
          "name": "Rectangle 4",
          "placeholder": "",
          "position": {
            "x": 2590799,
            "y": 3275513,
            "w": 7417415,
            "h": 1015663
          },
          "paragraphs": [
            {
              "text": "SELECT DISTINCT Person.name, Person.address\nFROM      \t    Person, Company\nWHERE           Person.worksfor = Company.name",
              "level": 0,
              "bullet": false
            }
          ]
        },
        {
          "kind": "text",
          "name": "TextBox 2",
          "placeholder": "",
          "position": {
            "x": 373225,
            "y": 3853543,
            "w": 1772816,
            "h": 1200329
          },
          "paragraphs": [
            {
              "text": "Both equivalent ways to resolve variable ambiguity",
              "level": 0,
              "bullet": false
            }
          ]
        },
        {
          "kind": "code",
          "name": "Rectangle 4",
          "placeholder": "",
          "position": {
            "x": 2590799,
            "y": 4650651,
            "w": 5570756,
            "h": 1015663
          },
          "paragraphs": [
            {
              "text": "SELECT DISTINCT p.name, p.address\nFROM      \t    Person p, Company c\nWHERE           p.worksfor = c.name",
              "level": 0,
              "bullet": false
            }
          ]
        }
      ]
    },
    "44": {
      "number": 44,
      "title": "Meaning (Semantics) of SQL Queries",
      "elements": [
        {
          "kind": "code",
          "name": "Rectangle 3",
          "placeholder": "body",
          "position": {
            "x": 0,
            "y": 1946275,
            "w": 5878513,
            "h": 923925
          },
          "paragraphs": [
            {
              "text": "SELECT x1.a1, x1.a2, …, xn.ak",
              "level": 0,
              "bullet": true
            },
            {
              "text": "FROM   R1 AS x1, R2 AS x2, …, Rn AS xn",
              "level": 0,
              "bullet": true
            },
            {
              "text": "WHERE  Conditions(x1,…, xn)",
              "level": 0,
              "bullet": true
            }
          ]
        },
        {
          "kind": "text",
          "name": "TextBox 6",
          "placeholder": "",
          "position": {
            "x": 7572569,
            "y": 2057219,
            "w": 3241610,
            "h": 707886
          },
          "paragraphs": [
            {
              "text": "Almost never the fastest way to compute it!",
              "level": 0,
              "bullet": false
            }
          ]
        },
        {
          "kind": "text",
          "name": "Rectangle 4",
          "placeholder": "",
          "position": {
            "x": 838200,
            "y": 3178864,
            "w": 8153400,
            "h": 2751522
          },
          "paragraphs": [
            {
              "text": "Answer = {}",
              "level": 0,
              "bullet": false
            },
            {
              "text": "for x1 in R1 do",
              "level": 0,
              "bullet": false
            },
            {
              "text": "for x2 in R2 do",
              "level": 0,
              "bullet": false
            },
            {
              "text": "…..",
              "level": 0,
              "bullet": false
            },
            {
              "text": "for xn in Rn do",
              "level": 0,
              "bullet": false
            },
            {
              "text": "if Conditions(x1,…, xn)",
              "level": 0,
              "bullet": false
            },
            {
              "text": "then Answer = Answer  {(x1.a1, x1.a2, …, xn.ak)}",
              "level": 0,
              "bullet": false
            },
            {
              "text": "return Answer",
              "level": 0,
              "bullet": false
            }
          ]
        },
        {
          "kind": "text",
          "name": "TextBox 7",
          "placeholder": "",
          "position": {
            "x": 5784979,
            "y": 6125517,
            "w": 3872205,
            "h": 461665
          },
          "paragraphs": [
            {
              "text": "Note: this is a multiset union",
              "level": 0,
              "bullet": false
            }
          ]
        }
      ]
    },
    "45": {
      "number": 45,
      "title": "An example of SQL semantics",
      "elements": [
        {
          "kind": "text",
          "name": "TextBox 24",
          "placeholder": "",
          "position": {
            "x": 6770103,
            "y": 1381851,
            "w": 1562099,
            "h": 461665
          },
          "paragraphs": [
            {
              "text": "Output",
              "level": 0,
              "bullet": false
            }
          ]
        },
        {
          "kind": "code",
          "name": "Text Box 3",
          "placeholder": "",
          "position": {
            "x": 3648901,
            "y": 1443866,
            "w": 2895600,
            "h": 1015663
          },
          "paragraphs": [
            {
              "text": "SELECT R.A",
              "level": 0,
              "bullet": false
            },
            {
              "text": "FROM   R, S",
              "level": 0,
              "bullet": false
            },
            {
              "text": "WHERE  R.A = S.B",
              "level": 0,
              "bullet": false
            }
          ]
        },
        {
          "kind": "table",
          "name": "Table 16",
          "position": {
            "x": 8559973,
            "y": 1460152,
            "w": 533400,
            "h": 1554480
          },
          "rows": [
            [
              "A"
            ],
            [
              "3"
            ],
            [
              "3"
            ]
          ]
        },
        {
          "kind": "table",
          "name": "Table 4",
          "position": {
            "x": 974813,
            "y": 2590773,
            "w": 609600,
            "h": 1554480
          },
          "rows": [
            [
              "A"
            ],
            [
              "1"
            ],
            [
              "3"
            ]
          ]
        },
        {
          "kind": "table",
          "name": "Table 8",
          "position": {
            "x": 4283532,
            "y": 2972853,
            "w": 1447800,
            "h": 3627120
          },
          "rows": [
            [
              "A",
              "B",
              "C"
            ],
            [
              "1",
              "2",
              "3"
            ],
            [
              "1",
              "3",
              "4"
            ],
            [
              "1",
              "3",
              "5"
            ],
            [
              "3",
              "2",
              "3"
            ],
            [
              "3",
              "3",
              "4"
            ],
            [
              "3",
              "3",
              "5"
            ]
          ]
        },
        {
          "kind": "text",
          "name": "TextBox 11",
          "placeholder": "",
          "position": {
            "x": 2658489,
            "y": 3368013,
            "w": 1219200,
            "h": 830997
          },
          "paragraphs": [
            {
              "text": "Cross Product",
              "level": 0,
              "bullet": false
            }
          ]
        },
        {
          "kind": "text",
          "name": "TextBox 20",
          "placeholder": "",
          "position": {
            "x": 9093374,
            "y": 3416864,
            "w": 1562099,
            "h": 830997
          },
          "paragraphs": [
            {
              "text": "Apply Projection",
              "level": 0,
              "bullet": false
            }
          ]
        },
        {
          "kind": "text",
          "name": "TextBox 23",
          "placeholder": "",
          "position": {
            "x": 6081068,
            "y": 3900801,
            "w": 1761399,
            "h": 1200329
          },
          "paragraphs": [
            {
              "text": "Apply Selections / Conditions",
              "level": 0,
              "bullet": false
            }
          ]
        },
        {
          "kind": "table",
          "name": "Table 5",
          "position": {
            "x": 974813,
            "y": 4511013,
            "w": 990600,
            "h": 2072640
          },
          "rows": [
            [
              "B",
              "C"
            ],
            [
              "2",
              "3"
            ],
            [
              "3",
              "4"
            ],
            [
              "3",
              "5"
            ]
          ]
        },
        {
          "kind": "table",
          "name": "Table 13",
          "position": {
            "x": 8033661,
            "y": 4801870,
            "w": 1447800,
            "h": 1554480
          },
          "rows": [
            [
              "A",
              "B",
              "C"
            ],
            [
              "3",
              "3",
              "4"
            ],
            [
              "3",
              "3",
              "5"
            ]
          ]
        }
      ]
    },
    "46": {
      "number": 46,
      "title": "Note the semantics of a join",
      "elements": [
        {
          "kind": "code",
          "name": "Text Box 3",
          "placeholder": "",
          "position": {
            "x": 8808730,
            "y": 675025,
            "w": 2895600,
            "h": 1015663
          },
          "paragraphs": [
            {
              "text": "SELECT R.A",
              "level": 0,
              "bullet": false
            },
            {
              "text": "FROM   R, S",
              "level": 0,
              "bullet": false
            },
            {
              "text": "WHERE  R.A = S.B",
              "level": 0,
              "bullet": false
            }
          ]
        },
        {
          "kind": "text",
          "name": "TextBox 10",
          "placeholder": "",
          "position": {
            "x": 6875105,
            "y": 1888246,
            "w": 4478695,
            "h": 1477328
          },
          "paragraphs": [
            {
              "text": "Recall: Cross product (A X B) is the set of all unique tuples in A,B",
              "level": 0,
              "bullet": false
            },
            {
              "text": "Ex: {a,b,c} X {1,2}",
              "level": 0,
              "bullet": false
            },
            {
              "text": "= {(a,1), (a,2), (b,1), (b,2), (c,1), (c,2)}",
              "level": 0,
              "bullet": false
            }
          ]
        },
        {
          "kind": "text",
          "name": "TextBox 13",
          "placeholder": "",
          "position": {
            "x": 923731,
            "y": 1991625,
            "w": 6979298,
            "h": 3600986
          },
          "paragraphs": [
            {
              "text": "Take cross product:",
              "level": 0,
              "bullet": true
            },
            {
              "text": "𝑋=𝑅×𝑆",
              "level": 1,
              "bullet": false
            },
            {
              "text": "Apply selections / conditions:",
              "level": 0,
              "bullet": true
            },
            {
              "text": "𝑌=𝑟,𝑠∈𝑋  𝑟.𝐴==𝑟.𝐵}",
              "level": 1,
              "bullet": false
            },
            {
              "text": "Apply projections to get final output:",
              "level": 0,
              "bullet": true
            },
            {
              "text": "𝑍=(𝑦.𝐴,) 𝑓𝑜𝑟 𝑦∈𝑌",
              "level": 1,
              "bullet": false
            }
          ]
        },
        {
          "kind": "text",
          "name": "TextBox 25",
          "placeholder": "",
          "position": {
            "x": 6875105,
            "y": 3693743,
            "w": 1507818,
            "h": 461665
          },
          "paragraphs": [
            {
              "text": "= Filtering!",
              "level": 0,
              "bullet": false
            }
          ]
        },
        {
          "kind": "text",
          "name": "TextBox 26",
          "placeholder": "",
          "position": {
            "x": 6875105,
            "y": 4793117,
            "w": 3541892,
            "h": 400110
          },
          "paragraphs": [
            {
              "text": "= Returning only some attributes",
              "level": 0,
              "bullet": false
            }
          ]
        },
        {
          "kind": "text",
          "name": "TextBox 27",
          "placeholder": "",
          "position": {
            "x": 2921575,
            "y": 6013589,
            "w": 6348850,
            "h": 707886
          },
          "paragraphs": [
            {
              "text": "Remembering this order is critical to understanding the output of certain queries (see later on…)",
              "level": 0,
              "bullet": false
            }
          ]
        }
      ]
    },
    "47": {
      "number": 47,
      "title": "Note: we say “semantics” not “execution order”",
      "elements": [
        {
          "kind": "text",
          "name": "Content Placeholder 2",
          "placeholder": "body",
          "position": {
            "x": 0,
            "y": 0,
            "w": 0,
            "h": 0
          },
          "paragraphs": [
            {
              "text": "The preceding slides show what a join means",
              "level": 0,
              "bullet": true
            },
            {
              "text": "Not actually how the DBMS executes it under the covers",
              "level": 0,
              "bullet": true
            }
          ]
        }
      ]
    },
    "48": {
      "number": 48,
      "title": "Semantics describes the answer - not the plan",
      "elements": [
        {
          "kind": "code",
          "name": "Content Placeholder 2",
          "placeholder": "body",
          "position": {
            "x": 838199,
            "y": 1825625,
            "w": 7239000,
            "h": 3660775
          },
          "paragraphs": [
            {
              "text": "Logical reading: FROM combinations, WHERE filters, SELECT projects.",
              "level": 0,
              "bullet": true
            },
            {
              "text": "Physical execution: the optimizer may reorder joins, push filters, or use indexes.",
              "level": 0,
              "bullet": true
            },
            {
              "text": "Correct rewrites preserve the same result, including duplicate and NULL behavior.",
              "level": 0,
              "bullet": true
            }
          ]
        },
        {
          "kind": "text",
          "name": "TextBox 6",
          "placeholder": "",
          "position": {
            "x": 8395447,
            "y": 2457637,
            "w": 3572966,
            "h": 830997
          },
          "paragraphs": [
            {
              "text": "Meaning first",
              "level": 0,
              "bullet": false
            },
            {
              "text": "performance second",
              "level": 0,
              "bullet": false
            }
          ]
        },
        {
          "kind": "text",
          "name": "TextBox 5",
          "placeholder": "",
          "position": {
            "x": 1766047,
            "y": 5699909,
            "w": 8659906,
            "h": 954107
          },
          "paragraphs": [
            {
              "text": "Use the logical order to reason; use EXPLAIN to study execution.",
              "level": 0,
              "bullet": false
            }
          ]
        }
      ]
    },
    "49": {
      "number": 49,
      "title": "A Subtlety about Joins",
      "elements": [
        {
          "kind": "text",
          "name": "Rectangle 35",
          "placeholder": "",
          "position": {
            "x": 2418221,
            "y": 1782787,
            "w": 7355558,
            "h": 1015663
          },
          "paragraphs": [
            {
              "text": "Product(PName, Price, Category, Manufacturer)",
              "level": 0,
              "bullet": false
            },
            {
              "text": "Company(CName, StockPrice, Country)",
              "level": 0,
              "bullet": false
            }
          ]
        },
        {
          "kind": "text",
          "name": "Rectangle 4",
          "placeholder": "",
          "position": {
            "x": 2704714,
            "y": 3218829,
            "w": 6573819,
            "h": 967581
          },
          "paragraphs": [
            {
              "text": "Find all countries that manufacture some product in the ‘Gadgets’ category.",
              "level": 0,
              "bullet": false
            }
          ]
        },
        {
          "kind": "code",
          "name": "Rectangle 5",
          "placeholder": "",
          "position": {
            "x": 2233404,
            "y": 4523209,
            "w": 7725192,
            "h": 1015663
          },
          "paragraphs": [
            {
              "text": "SELECT Country\nFROM   Product, Company\nWHERE  Manufacturer=CName AND Category=‘Gadgets’",
              "level": 0,
              "bullet": false
            }
          ]
        }
      ]
    },
    "50": {
      "number": 50,
      "title": "A subtlety about Joins",
      "elements": [
        {
          "kind": "text",
          "name": "Text Box 36",
          "placeholder": "",
          "position": {
            "x": 1819835,
            "y": 1424627,
            "w": 1164952,
            "h": 461665
          },
          "paragraphs": [
            {
              "text": "Product",
              "level": 0,
              "bullet": false
            }
          ]
        },
        {
          "kind": "text",
          "name": "Text Box 37",
          "placeholder": "",
          "position": {
            "x": 7112774,
            "y": 1450219,
            "w": 1364476,
            "h": 461665
          },
          "paragraphs": [
            {
              "text": "Company",
              "level": 0,
              "bullet": false
            }
          ]
        },
        {
          "kind": "table",
          "name": "Group 70",
          "position": {
            "x": 1819835,
            "y": 1911884,
            "w": 4285129,
            "h": 2055375
          },
          "rows": [
            [
              "PName",
              "Price",
              "Category",
              "Manuf"
            ],
            [
              "Gizmo",
              "$19",
              "Gadgets",
              "GWorks"
            ],
            [
              "Powergizmo",
              "$29",
              "Gadgets",
              "GWorks"
            ],
            [
              "SingleTouch",
              "$149",
              "Photography",
              "Canon"
            ],
            [
              "MultiTouch",
              "$203",
              "Household",
              "Hitachi"
            ]
          ]
        },
        {
          "kind": "table",
          "name": "Group 71",
          "position": {
            "x": 7124700,
            "y": 1933400,
            "w": 2705100,
            "h": 1364178
          },
          "rows": [
            [
              "Cname",
              "Stock",
              "Country"
            ],
            [
              "GWorks",
              "25",
              "USA"
            ],
            [
              "Canon",
              "65",
              "Japan"
            ],
            [
              "Hitachi",
              "15",
              "Japan"
            ]
          ]
        },
        {
          "kind": "code",
          "name": "Rectangle 103",
          "placeholder": "",
          "position": {
            "x": 1869518,
            "y": 4421326,
            "w": 4185761,
            "h": 1323439
          },
          "paragraphs": [
            {
              "text": "SELECT Country\nFROM   Product, Company\nWHERE  Manufacturer=Cname",
              "level": 0,
              "bullet": false
            },
            {
              "text": "AND Category=‘Gadgets’",
              "level": 0,
              "bullet": false
            }
          ]
        },
        {
          "kind": "table",
          "name": "Group 113",
          "position": {
            "x": 7391400,
            "y": 4421326,
            "w": 2171700,
            "h": 1371600
          },
          "rows": [
            [
              "Country"
            ],
            [
              "?"
            ],
            [
              "?"
            ]
          ]
        },
        {
          "kind": "text",
          "name": "TextBox 21",
          "placeholder": "",
          "position": {
            "x": 1905000,
            "y": 5943600,
            "w": 4114800,
            "h": 729430
          },
          "paragraphs": [
            {
              "text": "What is the problem ?",
              "level": 0,
              "bullet": false
            },
            {
              "text": "What’s the solution ?",
              "level": 0,
              "bullet": false
            }
          ]
        }
      ]
    },
    "51": {
      "number": 51,
      "title": "Lecture 3: SQL Part II",
      "elements": []
    },
    "52": {
      "number": 52,
      "title": "1. Set Operators & Nested Queries",
      "elements": []
    },
    "53": {
      "number": 53,
      "title": "What you will learn about in this section",
      "elements": [
        {
          "kind": "text",
          "name": "Content Placeholder 2",
          "placeholder": "body",
          "position": {
            "x": 838200,
            "y": 1825624,
            "w": 10515600,
            "h": 4175783
          },
          "paragraphs": [
            {
              "text": "Multiset operators in SQL",
              "level": 0,
              "bullet": true
            },
            {
              "text": "Nested queries",
              "level": 0,
              "bullet": true
            }
          ]
        }
      ]
    },
    "54": {
      "number": 54,
      "title": "Multiset Operations",
      "elements": []
    },
    "55": {
      "number": 55,
      "title": "Recall Multisets",
      "elements": [
        {
          "kind": "text",
          "name": "TextBox 14",
          "placeholder": "",
          "position": {
            "x": 7767504,
            "y": 676049,
            "w": 3557265,
            "h": 1200329
          },
          "paragraphs": [
            {
              "text": "𝝀𝑿= “Count of tuple in X”",
              "level": 0,
              "bullet": false
            },
            {
              "text": "(Items not listed have implicit count 0)",
              "level": 0,
              "bullet": false
            }
          ]
        },
        {
          "kind": "text",
          "name": "TextBox 12",
          "placeholder": "",
          "position": {
            "x": 2131285,
            "y": 1566384,
            "w": 1227195,
            "h": 400110
          },
          "paragraphs": [
            {
              "text": "Multiset X",
              "level": 0,
              "bullet": false
            }
          ]
        },
        {
          "kind": "table",
          "name": "Table 5",
          "position": {
            "x": 2222041,
            "y": 1966494,
            "w": 1045684,
            "h": 4539762
          },
          "rows": [
            [
              "Tuple"
            ],
            [
              "(1, a)"
            ],
            [
              "(1, a)"
            ],
            [
              "(1, b)"
            ],
            [
              "(2, c)"
            ],
            [
              "(2, c)"
            ],
            [
              "(2, c)"
            ],
            [
              "(1, d)"
            ],
            [
              "(1, d)"
            ]
          ]
        },
        {
          "kind": "text",
          "name": "TextBox 3",
          "placeholder": "",
          "position": {
            "x": 7767504,
            "y": 2103978,
            "w": 1227195,
            "h": 400110
          },
          "paragraphs": [
            {
              "text": "Multiset X",
              "level": 0,
              "bullet": false
            }
          ]
        },
        {
          "kind": "table",
          "name": "Table 6",
          "position": {
            "x": 7767504,
            "y": 2579731,
            "w": 2522250,
            "h": 1935400
          },
          "rows": [
            [
              "Tuple",
              "𝝀(𝑿)"
            ],
            [
              "(1, a)",
              "2"
            ],
            [
              "(1, b)",
              "1"
            ],
            [
              "(2, c)",
              "3"
            ],
            [
              "(1, d)",
              "2"
            ]
          ]
        },
        {
          "kind": "text",
          "name": "TextBox 11",
          "placeholder": "",
          "position": {
            "x": 4371860,
            "y": 4040427,
            "w": 2291509,
            "h": 1200329
          },
          "paragraphs": [
            {
              "text": "Equivalent Representations of a Multiset",
              "level": 0,
              "bullet": false
            }
          ]
        },
        {
          "kind": "text",
          "name": "TextBox 13",
          "placeholder": "",
          "position": {
            "x": 7988412,
            "y": 5404174,
            "w": 2301342,
            "h": 830997
          },
          "paragraphs": [
            {
              "text": "Note: In a set all counts are {0,1}.",
              "level": 0,
              "bullet": false
            }
          ]
        }
      ]
    },
    "56": {
      "number": 56,
      "title": "Generalizing Set Operations to Multiset Operations",
      "elements": [
        {
          "kind": "text",
          "name": "TextBox 3",
          "placeholder": "",
          "position": {
            "x": 760777,
            "y": 2017933,
            "w": 1227195,
            "h": 400110
          },
          "paragraphs": [
            {
              "text": "Multiset X",
              "level": 0,
              "bullet": false
            }
          ]
        },
        {
          "kind": "text",
          "name": "TextBox 14",
          "placeholder": "",
          "position": {
            "x": 4718740,
            "y": 2017933,
            "w": 1219180,
            "h": 400110
          },
          "paragraphs": [
            {
              "text": "Multiset Y",
              "level": 0,
              "bullet": false
            }
          ]
        },
        {
          "kind": "text",
          "name": "TextBox 16",
          "placeholder": "",
          "position": {
            "x": 8754127,
            "y": 2017933,
            "w": 1217577,
            "h": 400110
          },
          "paragraphs": [
            {
              "text": "Multiset Z",
              "level": 0,
              "bullet": false
            }
          ]
        },
        {
          "kind": "table",
          "name": "Table 6",
          "position": {
            "x": 838200,
            "y": 2504088,
            "w": 2522250,
            "h": 1935400
          },
          "rows": [
            [
              "Tuple",
              "𝝀(𝑿)"
            ],
            [
              "(1, a)",
              "2"
            ],
            [
              "(1, b)",
              "0"
            ],
            [
              "(2, c)",
              "3"
            ],
            [
              "(1, d)",
              "0"
            ]
          ]
        },
        {
          "kind": "table",
          "name": "Table 13",
          "position": {
            "x": 4796163,
            "y": 2504088,
            "w": 2522250,
            "h": 1935400
          },
          "rows": [
            [
              "Tuple",
              "𝝀(𝒀)"
            ],
            [
              "(1, a)",
              "5"
            ],
            [
              "(1, b)",
              "1"
            ],
            [
              "(2, c)",
              "2"
            ],
            [
              "(1, d)",
              "2"
            ]
          ]
        },
        {
          "kind": "table",
          "name": "Table 15",
          "position": {
            "x": 8831550,
            "y": 2504088,
            "w": 2522250,
            "h": 1935400
          },
          "rows": [
            [
              "Tuple",
              "𝝀(𝒁)"
            ],
            [
              "(1, a)",
              "2"
            ],
            [
              "(1, b)",
              "0"
            ],
            [
              "(2, c)",
              "2"
            ],
            [
              "(1, d)",
              "0"
            ]
          ]
        },
        {
          "kind": "text",
          "name": "TextBox 4",
          "placeholder": "",
          "position": {
            "x": 3802830,
            "y": 3056289,
            "w": 628377,
            "h": 830997
          },
          "paragraphs": [
            {
              "text": "∩",
              "level": 0,
              "bullet": false
            }
          ]
        },
        {
          "kind": "text",
          "name": "TextBox 17",
          "placeholder": "",
          "position": {
            "x": 7760793,
            "y": 3056289,
            "w": 674865,
            "h": 830997
          },
          "paragraphs": [
            {
              "text": "=",
              "level": 0,
              "bullet": false
            }
          ]
        },
        {
          "kind": "text",
          "name": "TextBox 19",
          "placeholder": "",
          "position": {
            "x": 8821033,
            "y": 4982420,
            "w": 2301342,
            "h": 830997
          },
          "paragraphs": [
            {
              "text": "For sets, this is intersection",
              "level": 0,
              "bullet": false
            }
          ]
        },
        {
          "kind": "text",
          "name": "Rectangle 18",
          "placeholder": "",
          "position": {
            "x": 4061981,
            "y": 5252887,
            "w": 4068037,
            "h": 523220
          },
          "paragraphs": [
            {
              "text": "𝝀𝒁=𝒎𝒊𝒏(𝝀𝑿,𝝀𝒀)",
              "level": 0,
              "bullet": false
            }
          ]
        }
      ]
    },
    "57": {
      "number": 57,
      "title": "Generalizing Set Operations to Multiset Operations",
      "elements": [
        {
          "kind": "text",
          "name": "TextBox 3",
          "placeholder": "",
          "position": {
            "x": 760777,
            "y": 2017933,
            "w": 1227195,
            "h": 400110
          },
          "paragraphs": [
            {
              "text": "Multiset X",
              "level": 0,
              "bullet": false
            }
          ]
        },
        {
          "kind": "text",
          "name": "TextBox 14",
          "placeholder": "",
          "position": {
            "x": 4718740,
            "y": 2017933,
            "w": 1219180,
            "h": 400110
          },
          "paragraphs": [
            {
              "text": "Multiset Y",
              "level": 0,
              "bullet": false
            }
          ]
        },
        {
          "kind": "text",
          "name": "TextBox 16",
          "placeholder": "",
          "position": {
            "x": 8754127,
            "y": 2017933,
            "w": 1217577,
            "h": 400110
          },
          "paragraphs": [
            {
              "text": "Multiset Z",
              "level": 0,
              "bullet": false
            }
          ]
        },
        {
          "kind": "table",
          "name": "Table 6",
          "position": {
            "x": 838200,
            "y": 2504088,
            "w": 2522250,
            "h": 1935400
          },
          "rows": [
            [
              "Tuple",
              "𝝀(𝑿)"
            ],
            [
              "(1, a)",
              "2"
            ],
            [
              "(1, b)",
              "0"
            ],
            [
              "(2, c)",
              "3"
            ],
            [
              "(1, d)",
              "0"
            ]
          ]
        },
        {
          "kind": "table",
          "name": "Table 13",
          "position": {
            "x": 4796163,
            "y": 2504088,
            "w": 2522250,
            "h": 1935400
          },
          "rows": [
            [
              "Tuple",
              "𝝀(𝒀)"
            ],
            [
              "(1, a)",
              "5"
            ],
            [
              "(1, b)",
              "1"
            ],
            [
              "(2, c)",
              "2"
            ],
            [
              "(1, d)",
              "2"
            ]
          ]
        },
        {
          "kind": "table",
          "name": "Table 15",
          "position": {
            "x": 8831550,
            "y": 2504088,
            "w": 2522250,
            "h": 1935400
          },
          "rows": [
            [
              "Tuple",
              "𝝀(𝒁)"
            ],
            [
              "(1, a)",
              "7"
            ],
            [
              "(1, b)",
              "1"
            ],
            [
              "(2, c)",
              "5"
            ],
            [
              "(1, d)",
              "2"
            ]
          ]
        },
        {
          "kind": "text",
          "name": "TextBox 4",
          "placeholder": "",
          "position": {
            "x": 3777553,
            "y": 2810068,
            "w": 628377,
            "h": 830997
          },
          "paragraphs": [
            {
              "text": "∪",
              "level": 0,
              "bullet": false
            }
          ]
        },
        {
          "kind": "text",
          "name": "TextBox 17",
          "placeholder": "",
          "position": {
            "x": 7760793,
            "y": 3056289,
            "w": 674865,
            "h": 830997
          },
          "paragraphs": [
            {
              "text": "=",
              "level": 0,
              "bullet": false
            }
          ]
        },
        {
          "kind": "text",
          "name": "TextBox 19",
          "placeholder": "",
          "position": {
            "x": 8821033,
            "y": 4982420,
            "w": 2301342,
            "h": 830997
          },
          "paragraphs": [
            {
              "text": "For sets,",
              "level": 0,
              "bullet": false
            },
            {
              "text": "this is union",
              "level": 0,
              "bullet": false
            }
          ]
        },
        {
          "kind": "text",
          "name": "Rectangle 18",
          "placeholder": "",
          "position": {
            "x": 4374407,
            "y": 5297258,
            "w": 3443186,
            "h": 523220
          },
          "paragraphs": [
            {
              "text": "𝝀𝒁=𝝀𝑿+ 𝝀𝒀",
              "level": 0,
              "bullet": false
            }
          ]
        }
      ]
    },
    "58": {
      "number": 58,
      "title": "Multiset Operations in SQL",
      "elements": []
    },
    "59": {
      "number": 59,
      "title": "Explicit Set Operators: INTERSECT",
      "elements": [
        {
          "kind": "code",
          "name": "Text Box 3",
          "placeholder": "",
          "position": {
            "x": 1308704,
            "y": 2283268,
            "w": 2940085,
            "h": 2677656
          },
          "paragraphs": [
            {
              "text": "SELECT R.A",
              "level": 0,
              "bullet": false
            },
            {
              "text": "FROM   R, S",
              "level": 0,
              "bullet": false
            },
            {
              "text": "WHERE  R.A=S.A",
              "level": 0,
              "bullet": false
            },
            {
              "text": "INTERSECT",
              "level": 0,
              "bullet": false
            },
            {
              "text": "SELECT R.A",
              "level": 0,
              "bullet": false
            },
            {
              "text": "FROM   R, T",
              "level": 0,
              "bullet": false
            },
            {
              "text": "WHERE  R.A=T.A",
              "level": 0,
              "bullet": false
            }
          ]
        },
        {
          "kind": "text",
          "name": "TextBox 20",
          "placeholder": "",
          "position": {
            "x": 5338549,
            "y": 3257677,
            "w": 3647793,
            "h": 276999
          },
          "paragraphs": [
            {
              "text": "𝑟.𝐴  𝑟.𝐴=𝑠.𝐴∩𝑟.𝐴 𝑟.𝐴=𝑡.𝐴}",
              "level": 0,
              "bullet": false
            }
          ]
        },
        {
          "kind": "text",
          "name": "Oval 18",
          "placeholder": "",
          "position": {
            "x": 5588059,
            "y": 3955228,
            "w": 1381688,
            "h": 1381688
          },
          "paragraphs": [
            {
              "text": "Q1",
              "level": 0,
              "bullet": false
            }
          ]
        },
        {
          "kind": "text",
          "name": "Oval 19",
          "placeholder": "",
          "position": {
            "x": 6511985,
            "y": 3955228,
            "w": 1381688,
            "h": 1381688
          },
          "paragraphs": [
            {
              "text": "Q2",
              "level": 0,
              "bullet": false
            }
          ]
        },
        {
          "kind": "text",
          "name": "TextBox 3",
          "placeholder": "",
          "position": {
            "x": 4124325,
            "y": 6067425,
            "w": 2845844,
            "h": 369332
          },
          "paragraphs": [
            {
              "text": "https://tinyurl.com/sqlsetop",
              "level": 0,
              "bullet": false
            }
          ]
        }
      ]
    },
    "60": {
      "number": 60,
      "title": "UNION",
      "elements": [
        {
          "kind": "text",
          "name": "TextBox 22",
          "placeholder": "",
          "position": {
            "x": 5347821,
            "y": 1384379,
            "w": 3646704,
            "h": 276999
          },
          "paragraphs": [
            {
              "text": "𝑟.𝐴  𝑟.𝐴=𝑠.𝐴∪𝑟.𝐴 𝑟.𝐴=𝑡.𝐴}",
              "level": 0,
              "bullet": false
            }
          ]
        },
        {
          "kind": "text",
          "name": "Oval 20",
          "placeholder": "",
          "position": {
            "x": 5597331,
            "y": 1823656,
            "w": 1381688,
            "h": 1381688
          },
          "paragraphs": [
            {
              "text": "Q1",
              "level": 0,
              "bullet": false
            }
          ]
        },
        {
          "kind": "text",
          "name": "Oval 21",
          "placeholder": "",
          "position": {
            "x": 6521257,
            "y": 1823656,
            "w": 1381688,
            "h": 1381688
          },
          "paragraphs": [
            {
              "text": "Q2",
              "level": 0,
              "bullet": false
            }
          ]
        },
        {
          "kind": "text",
          "name": "TextBox 27",
          "placeholder": "",
          "position": {
            "x": 8548147,
            "y": 1940360,
            "w": 2667000,
            "h": 954107
          },
          "paragraphs": [
            {
              "text": "Why aren’t there duplicates?",
              "level": 0,
              "bullet": false
            }
          ]
        },
        {
          "kind": "code",
          "name": "Text Box 3",
          "placeholder": "",
          "position": {
            "x": 1243025,
            "y": 2280300,
            "w": 2940085,
            "h": 2677656
          },
          "paragraphs": [
            {
              "text": "SELECT  R.A",
              "level": 0,
              "bullet": false
            },
            {
              "text": "FROM   R, S",
              "level": 0,
              "bullet": false
            },
            {
              "text": "WHERE  R.A=S.A",
              "level": 0,
              "bullet": false
            },
            {
              "text": "UNION",
              "level": 0,
              "bullet": false
            },
            {
              "text": "SELECT R.A",
              "level": 0,
              "bullet": false
            },
            {
              "text": "FROM   R, T",
              "level": 0,
              "bullet": false
            },
            {
              "text": "WHERE  R.A=T.A",
              "level": 0,
              "bullet": false
            }
          ]
        },
        {
          "kind": "text",
          "name": "TextBox 28",
          "placeholder": "",
          "position": {
            "x": 8548147,
            "y": 3083360,
            "w": 3399014,
            "h": 2677656
          },
          "paragraphs": [
            {
              "text": "By default:",
              "level": 0,
              "bullet": false
            },
            {
              "text": "SQL uses set semantics!",
              "level": 0,
              "bullet": false
            },
            {
              "text": "What if we want duplicates?",
              "level": 0,
              "bullet": false
            }
          ]
        },
        {
          "kind": "text",
          "name": "TextBox 5",
          "placeholder": "",
          "position": {
            "x": 4286250,
            "y": 6165962,
            "w": 6096000,
            "h": 369332
          },
          "paragraphs": [
            {
              "text": "http://sqlfiddle.com/#!17/96ef0/9",
              "level": 0,
              "bullet": false
            }
          ]
        }
      ]
    },
    "61": {
      "number": 61,
      "title": "UNION ALL",
      "elements": [
        {
          "kind": "code",
          "name": "Text Box 3",
          "placeholder": "",
          "position": {
            "x": 1247799,
            "y": 2280300,
            "w": 2940085,
            "h": 2677656
          },
          "paragraphs": [
            {
              "text": "SELECT  R.A",
              "level": 0,
              "bullet": false
            },
            {
              "text": "FROM   R, S",
              "level": 0,
              "bullet": false
            },
            {
              "text": "WHERE  R.A=S.A",
              "level": 0,
              "bullet": false
            },
            {
              "text": "UNION ALL",
              "level": 0,
              "bullet": false
            },
            {
              "text": "SELECT R.A",
              "level": 0,
              "bullet": false
            },
            {
              "text": "FROM   R, T",
              "level": 0,
              "bullet": false
            },
            {
              "text": "WHERE  R.A=T.A",
              "level": 0,
              "bullet": false
            }
          ]
        },
        {
          "kind": "text",
          "name": "TextBox 22",
          "placeholder": "",
          "position": {
            "x": 5277644,
            "y": 3512983,
            "w": 3646704,
            "h": 276999
          },
          "paragraphs": [
            {
              "text": "𝑟.𝐴  𝑟.𝐴=𝑠.𝐴∪𝑟.𝐴 𝑟.𝐴=𝑡.𝐴}",
              "level": 0,
              "bullet": false
            }
          ]
        },
        {
          "kind": "text",
          "name": "Oval 20",
          "placeholder": "",
          "position": {
            "x": 5527154,
            "y": 3952260,
            "w": 1381688,
            "h": 1381688
          },
          "paragraphs": [
            {
              "text": "Q1",
              "level": 0,
              "bullet": false
            }
          ]
        },
        {
          "kind": "text",
          "name": "Oval 21",
          "placeholder": "",
          "position": {
            "x": 6451080,
            "y": 3952260,
            "w": 1381688,
            "h": 1381688
          },
          "paragraphs": [
            {
              "text": "Q2",
              "level": 0,
              "bullet": false
            }
          ]
        },
        {
          "kind": "text",
          "name": "TextBox 15",
          "placeholder": "",
          "position": {
            "x": 8610600,
            "y": 4257056,
            "w": 2301342,
            "h": 1384995
          },
          "paragraphs": [
            {
              "text": "ALL indicates Multiset operations",
              "level": 0,
              "bullet": false
            }
          ]
        },
        {
          "kind": "text",
          "name": "TextBox 5",
          "placeholder": "",
          "position": {
            "x": 3790950,
            "y": 6171684,
            "w": 6096000,
            "h": 369332
          },
          "paragraphs": [
            {
              "text": "https://tinyurl.com/sqlsetop",
              "level": 0,
              "bullet": false
            }
          ]
        }
      ]
    },
    "62": {
      "number": 62,
      "title": "EXCEPT",
      "elements": [
        {
          "kind": "code",
          "name": "Text Box 3",
          "placeholder": "",
          "position": {
            "x": 1259420,
            "y": 2280300,
            "w": 2940085,
            "h": 2677656
          },
          "paragraphs": [
            {
              "text": "SELECT R.A",
              "level": 0,
              "bullet": false
            },
            {
              "text": "FROM   R, S",
              "level": 0,
              "bullet": false
            },
            {
              "text": "WHERE  R.A=S.A",
              "level": 0,
              "bullet": false
            },
            {
              "text": "EXCEPT",
              "level": 0,
              "bullet": false
            },
            {
              "text": "SELECT R.A",
              "level": 0,
              "bullet": false
            },
            {
              "text": "FROM   R, T",
              "level": 0,
              "bullet": false
            },
            {
              "text": "WHERE  R.A=T.A",
              "level": 0,
              "bullet": false
            }
          ]
        },
        {
          "kind": "text",
          "name": "TextBox 20",
          "placeholder": "",
          "position": {
            "x": 5417705,
            "y": 3480628,
            "w": 3450625,
            "h": 276999
          },
          "paragraphs": [
            {
              "text": "𝑟.𝐴  𝑟.𝐴=𝑠.𝐴\\{𝑟.𝐴|𝑟.𝐴=𝑡.𝐴}",
              "level": 0,
              "bullet": false
            }
          ]
        },
        {
          "kind": "text",
          "name": "Oval 18",
          "placeholder": "",
          "position": {
            "x": 5538775,
            "y": 3952260,
            "w": 1381688,
            "h": 1381688
          },
          "paragraphs": [
            {
              "text": "Q1",
              "level": 0,
              "bullet": false
            }
          ]
        },
        {
          "kind": "text",
          "name": "Oval 19",
          "placeholder": "",
          "position": {
            "x": 6462701,
            "y": 3952260,
            "w": 1381688,
            "h": 1381688
          },
          "paragraphs": [
            {
              "text": "Q2",
              "level": 0,
              "bullet": false
            }
          ]
        },
        {
          "kind": "text",
          "name": "TextBox 15",
          "placeholder": "",
          "position": {
            "x": 8531975,
            "y": 4356636,
            "w": 2821825,
            "h": 954107
          },
          "paragraphs": [
            {
              "text": "What is the multiset version?",
              "level": 0,
              "bullet": false
            }
          ]
        },
        {
          "kind": "text",
          "name": "TextBox 5",
          "placeholder": "",
          "position": {
            "x": 3872463,
            "y": 6123543,
            "w": 6096000,
            "h": 369332
          },
          "paragraphs": [
            {
              "text": "https://tinyurl.com/sqlsetop",
              "level": 0,
              "bullet": false
            }
          ]
        }
      ]
    },
    "63": {
      "number": 63,
      "title": "INTERSECT: Still some subtle problems…",
      "elements": [
        {
          "kind": "text",
          "name": "Rectangle 8",
          "placeholder": "",
          "position": {
            "x": 1676400,
            "y": 1336745,
            "w": 5416868,
            "h": 707886
          },
          "paragraphs": [
            {
              "text": "Company(name, hq_city)",
              "level": 0,
              "bullet": false
            },
            {
              "text": "Product(pname, maker, factory_loc)",
              "level": 0,
              "bullet": false
            }
          ]
        },
        {
          "kind": "code",
          "name": "TextBox 9",
          "placeholder": "",
          "position": {
            "x": 1676400,
            "y": 2157511,
            "w": 5416868,
            "h": 2862322
          },
          "paragraphs": [
            {
              "text": "SELECT hq_city",
              "level": 0,
              "bullet": false
            },
            {
              "text": "FROM   Company, Product",
              "level": 0,
              "bullet": false
            },
            {
              "text": "WHERE  maker = name",
              "level": 0,
              "bullet": false
            },
            {
              "text": "AND factory_loc = ‘US’",
              "level": 0,
              "bullet": false
            },
            {
              "text": "INTERSECT",
              "level": 0,
              "bullet": false
            },
            {
              "text": "SELECT hq_city",
              "level": 0,
              "bullet": false
            },
            {
              "text": "FROM   Company, Product",
              "level": 0,
              "bullet": false
            },
            {
              "text": "WHERE  maker = name",
              "level": 0,
              "bullet": false
            },
            {
              "text": "AND factory_loc = ‘China’",
              "level": 0,
              "bullet": false
            }
          ]
        },
        {
          "kind": "text",
          "name": "TextBox 4",
          "placeholder": "",
          "position": {
            "x": 7785100,
            "y": 2592358,
            "w": 3009900,
            "h": 1815882
          },
          "paragraphs": [
            {
              "text": "“Headquarters of companies which make gizmos in US AND China”",
              "level": 0,
              "bullet": false
            }
          ]
        },
        {
          "kind": "text",
          "name": "TextBox 10",
          "placeholder": "",
          "position": {
            "x": 2171700,
            "y": 5229538,
            "w": 7848600,
            "h": 830997
          },
          "paragraphs": [
            {
              "text": "What if two companies have HQ in US: BUT one has factory in China (but not US) and vice versa?  What goes wrong?",
              "level": 0,
              "bullet": false
            }
          ]
        },
        {
          "kind": "text",
          "name": "TextBox 3",
          "placeholder": "",
          "position": {
            "x": 2171700,
            "y": 6340961,
            "w": 8326382,
            "h": 369332
          },
          "paragraphs": [
            {
              "text": "https://teachingow.github.io/DBMS-SQL-Labs/labs/set-nested/set-nested-queries.html",
              "level": 0,
              "bullet": false
            }
          ]
        }
      ]
    },
    "64": {
      "number": 64,
      "title": "INTERSECT: Remember the semantics!",
      "elements": [
        {
          "kind": "text",
          "name": "TextBox 3",
          "placeholder": "",
          "position": {
            "x": 4960396,
            "y": 1409035,
            "w": 4834721,
            "h": 461665
          },
          "paragraphs": [
            {
              "text": "Example:  C  JOIN  P on maker = name",
              "level": 0,
              "bullet": false
            }
          ]
        },
        {
          "kind": "text",
          "name": "Rectangle 8",
          "placeholder": "",
          "position": {
            "x": 468985,
            "y": 1589048,
            "w": 3975693,
            "h": 923330
          },
          "paragraphs": [
            {
              "text": "Company(name, hq_city) AS C",
              "level": 0,
              "bullet": false
            },
            {
              "text": "Product(pname, maker, factory_loc) AS P",
              "level": 0,
              "bullet": false
            }
          ]
        },
        {
          "kind": "table",
          "name": "Table 5",
          "position": {
            "x": 4960396,
            "y": 1870700,
            "w": 6753185,
            "h": 1112520
          },
          "rows": [
            [
              "C.name",
              "C.hq_city",
              "P.pname",
              "P.maker",
              "P.factory_loc"
            ],
            [
              "X Co.",
              "Seattle",
              "X",
              "X Co.",
              "U.S."
            ],
            [
              "Y Inc.",
              "Seattle",
              "X",
              "Y Inc.",
              "China"
            ]
          ]
        },
        {
          "kind": "code",
          "name": "TextBox 9",
          "placeholder": "",
          "position": {
            "x": 468986,
            "y": 2755572,
            "w": 3547430,
            "h": 2585323
          },
          "paragraphs": [
            {
              "text": "SELECT hq_city",
              "level": 0,
              "bullet": false
            },
            {
              "text": "FROM   Company, Product",
              "level": 0,
              "bullet": false
            },
            {
              "text": "WHERE  maker = name",
              "level": 0,
              "bullet": false
            },
            {
              "text": "AND factory_loc=‘US’",
              "level": 0,
              "bullet": false
            },
            {
              "text": "INTERSECT",
              "level": 0,
              "bullet": false
            },
            {
              "text": "SELECT hq_city",
              "level": 0,
              "bullet": false
            },
            {
              "text": "FROM   Company, Product",
              "level": 0,
              "bullet": false
            },
            {
              "text": "WHERE  maker = name",
              "level": 0,
              "bullet": false
            },
            {
              "text": "AND factory_loc=‘China’",
              "level": 0,
              "bullet": false
            }
          ]
        }
      ]
    },
    "65": {
      "number": 65,
      "title": "INTERSECT: Remember the semantics!",
      "elements": [
        {
          "kind": "text",
          "name": "TextBox 3",
          "placeholder": "",
          "position": {
            "x": 4960396,
            "y": 1409035,
            "w": 4995022,
            "h": 461665
          },
          "paragraphs": [
            {
              "text": "Example:  C  JOIN  P on maker = name",
              "level": 0,
              "bullet": false
            }
          ]
        },
        {
          "kind": "text",
          "name": "Rectangle 8",
          "placeholder": "",
          "position": {
            "x": 468985,
            "y": 1589048,
            "w": 3975693,
            "h": 923330
          },
          "paragraphs": [
            {
              "text": "Company(name, hq_city) AS C",
              "level": 0,
              "bullet": false
            },
            {
              "text": "Product(pname, maker, factory_loc) AS P",
              "level": 0,
              "bullet": false
            }
          ]
        },
        {
          "kind": "table",
          "name": "Table 5",
          "position": {
            "x": 4960396,
            "y": 1870700,
            "w": 6753185,
            "h": 1112520
          },
          "rows": [
            [
              "C.name",
              "C.hq_city",
              "P.pname",
              "P.maker",
              "P.factory_loc"
            ],
            [
              "X Co.",
              "Seattle",
              "X",
              "X Co.",
              "U.S."
            ],
            [
              "Y Inc.",
              "Seattle",
              "X",
              "Y Inc.",
              "China"
            ]
          ]
        },
        {
          "kind": "code",
          "name": "TextBox 9",
          "placeholder": "",
          "position": {
            "x": 468986,
            "y": 2755572,
            "w": 3547430,
            "h": 2585323
          },
          "paragraphs": [
            {
              "text": "SELECT hq_city",
              "level": 0,
              "bullet": false
            },
            {
              "text": "FROM   Company, Product",
              "level": 0,
              "bullet": false
            },
            {
              "text": "WHERE  maker = name",
              "level": 0,
              "bullet": false
            },
            {
              "text": "AND factory_loc=‘US’",
              "level": 0,
              "bullet": false
            },
            {
              "text": "INTERSECT",
              "level": 0,
              "bullet": false
            },
            {
              "text": "SELECT hq_city",
              "level": 0,
              "bullet": false
            },
            {
              "text": "FROM   Company, Product",
              "level": 0,
              "bullet": false
            },
            {
              "text": "WHERE  maker = name",
              "level": 0,
              "bullet": false
            },
            {
              "text": "AND factory_loc=‘China’",
              "level": 0,
              "bullet": false
            }
          ]
        },
        {
          "kind": "text",
          "name": "TextBox 23",
          "placeholder": "",
          "position": {
            "x": 5249763,
            "y": 3661844,
            "w": 6174449,
            "h": 1569660
          },
          "paragraphs": [
            {
              "text": "X Co has a factory in the US (but not China)",
              "level": 0,
              "bullet": false
            },
            {
              "text": "Y Inc. has a factory in China (but not US)",
              "level": 0,
              "bullet": false
            },
            {
              "text": "But Seattle is returned by the query!",
              "level": 0,
              "bullet": false
            }
          ]
        },
        {
          "kind": "text",
          "name": "TextBox 24",
          "placeholder": "",
          "position": {
            "x": 2950369,
            "y": 5647750,
            "w": 3727048,
            "h": 954107
          },
          "paragraphs": [
            {
              "text": "We did the INTERSECT on the wrong attributes!",
              "level": 0,
              "bullet": false
            }
          ]
        }
      ]
    },
    "66": {
      "number": 66,
      "title": "One Solution: Nested Queries",
      "elements": [
        {
          "kind": "text",
          "name": "Rectangle 8",
          "placeholder": "",
          "position": {
            "x": 1676400,
            "y": 1589048,
            "w": 5416868,
            "h": 707886
          },
          "paragraphs": [
            {
              "text": "Company(name, hq_city)",
              "level": 0,
              "bullet": false
            },
            {
              "text": "Product(pname, maker, factory_loc)",
              "level": 0,
              "bullet": false
            }
          ]
        },
        {
          "kind": "text",
          "name": "TextBox 12",
          "placeholder": "",
          "position": {
            "x": 8610600,
            "y": 1770546,
            "w": 3009900,
            "h": 1815882
          },
          "paragraphs": [
            {
              "text": "“Headquarters of companies which make gizmos in US AND China”",
              "level": 0,
              "bullet": false
            }
          ]
        },
        {
          "kind": "code",
          "name": "TextBox 9",
          "placeholder": "",
          "position": {
            "x": 1676400,
            "y": 2592358,
            "w": 6540500,
            "h": 3477875
          },
          "paragraphs": [
            {
              "text": "SELECT DISTINCT hq_city",
              "level": 0,
              "bullet": false
            },
            {
              "text": "FROM   Company",
              "level": 0,
              "bullet": false
            },
            {
              "text": "WHERE  name IN (",
              "level": 0,
              "bullet": false
            },
            {
              "text": "SELECT maker",
              "level": 0,
              "bullet": false
            },
            {
              "text": "FROM   Product",
              "level": 0,
              "bullet": false
            },
            {
              "text": "WHERE  factory_loc = ‘US’)",
              "level": 0,
              "bullet": false
            },
            {
              "text": "AND name IN (",
              "level": 0,
              "bullet": false
            },
            {
              "text": "SELECT maker",
              "level": 0,
              "bullet": false
            },
            {
              "text": "FROM   Product",
              "level": 0,
              "bullet": false
            },
            {
              "text": "WHERE  factory_loc = ‘China’)",
              "level": 0,
              "bullet": false
            }
          ]
        },
        {
          "kind": "text",
          "name": "TextBox 3",
          "placeholder": "",
          "position": {
            "x": 8727311,
            "y": 3946967,
            "w": 2893189,
            "h": 1938992
          },
          "paragraphs": [
            {
              "text": "Note: If we hadn’t used DISTINCT here, how many copies of each hq_city would have been returned?",
              "level": 0,
              "bullet": false
            }
          ]
        }
      ]
    },
    "67": {
      "number": 67,
      "title": "High-level note on nested queries",
      "elements": [
        {
          "kind": "text",
          "name": "Content Placeholder 2",
          "placeholder": "body",
          "position": {
            "x": 0,
            "y": 0,
            "w": 0,
            "h": 0
          },
          "paragraphs": [
            {
              "text": "We can do nested queries because SQL is compositional:",
              "level": 0,
              "bullet": true
            },
            {
              "text": "Everything (inputs / outputs) is represented as multisets- the output of one query can thus be used as the input to another (nesting)!",
              "level": 1,
              "bullet": true
            },
            {
              "text": "This is extremely powerful!",
              "level": 0,
              "bullet": true
            }
          ]
        }
      ]
    },
    "68": {
      "number": 68,
      "title": "Nested queries: Sub-queries Return Relations",
      "elements": [
        {
          "kind": "text",
          "name": "TextBox 2",
          "placeholder": "",
          "position": {
            "x": 533400,
            "y": 1823413,
            "w": 1155699,
            "h": 707886
          },
          "paragraphs": [
            {
              "text": "Another example:",
              "level": 0,
              "bullet": false
            }
          ]
        },
        {
          "kind": "text",
          "name": "Rectangle 6",
          "placeholder": "",
          "position": {
            "x": 1981201,
            "y": 1823413,
            "w": 4493538,
            "h": 1015663
          },
          "paragraphs": [
            {
              "text": "Company(name, city)\nProduct(name, maker)\nPurchase(id, product, buyer)",
              "level": 0,
              "bullet": false
            }
          ]
        },
        {
          "kind": "code",
          "name": "Text Box 3",
          "placeholder": "",
          "position": {
            "x": 1281570,
            "y": 3436008,
            "w": 6756400,
            "h": 2677656
          },
          "paragraphs": [
            {
              "text": "SELECT c.city",
              "level": 0,
              "bullet": false
            },
            {
              "text": "FROM   Company c",
              "level": 0,
              "bullet": false
            },
            {
              "text": "WHERE  c.name  IN (",
              "level": 0,
              "bullet": false
            },
            {
              "text": "SELECT pr.maker",
              "level": 0,
              "bullet": false
            },
            {
              "text": "FROM   Purchase p, Product pr",
              "level": 0,
              "bullet": false
            },
            {
              "text": "WHERE  p.product = pr.name",
              "level": 0,
              "bullet": false
            },
            {
              "text": "AND p.buyer = ‘Joe Blow‘)",
              "level": 0,
              "bullet": false
            }
          ]
        },
        {
          "kind": "text",
          "name": "Text Box 4",
          "placeholder": "",
          "position": {
            "x": 8901570,
            "y": 3436008,
            "w": 2452230,
            "h": 2380592
          },
          "paragraphs": [
            {
              "text": "“Cities where one   can find companies that manufacture products bought by Joe Blow”",
              "level": 0,
              "bullet": false
            }
          ]
        }
      ]
    },
    "69": {
      "number": 69,
      "title": "Nested Queries",
      "elements": [
        {
          "kind": "text",
          "name": "Text Box 4",
          "placeholder": "",
          "position": {
            "x": 3620384,
            "y": 1770546,
            "w": 4472315,
            "h": 523220
          },
          "paragraphs": [
            {
              "text": "Are these queries equivalent?",
              "level": 0,
              "bullet": false
            }
          ]
        },
        {
          "kind": "code",
          "name": "Text Box 3",
          "placeholder": "",
          "position": {
            "x": 6366067,
            "y": 2453921,
            "w": 5391219,
            "h": 2677656
          },
          "paragraphs": [
            {
              "text": "SELECT c.city",
              "level": 0,
              "bullet": false
            },
            {
              "text": "FROM   Company c,",
              "level": 0,
              "bullet": false
            },
            {
              "text": "Product pr,",
              "level": 0,
              "bullet": false
            },
            {
              "text": "Purchase p",
              "level": 0,
              "bullet": false
            },
            {
              "text": "WHERE  c.name = pr.maker",
              "level": 0,
              "bullet": false
            },
            {
              "text": "AND  pr.name = p.product",
              "level": 0,
              "bullet": false
            },
            {
              "text": "AND  p.buyer = ‘Joe Blow’",
              "level": 0,
              "bullet": false
            }
          ]
        },
        {
          "kind": "code",
          "name": "Text Box 3",
          "placeholder": "",
          "position": {
            "x": 352180,
            "y": 2457803,
            "w": 5553945,
            "h": 2677656
          },
          "paragraphs": [
            {
              "text": "SELECT c.city",
              "level": 0,
              "bullet": false
            },
            {
              "text": "FROM   Company c",
              "level": 0,
              "bullet": false
            },
            {
              "text": "WHERE  c.name  IN (",
              "level": 0,
              "bullet": false
            },
            {
              "text": "SELECT pr.maker",
              "level": 0,
              "bullet": false
            },
            {
              "text": "FROM   Purchase p, Product pr",
              "level": 0,
              "bullet": false
            },
            {
              "text": "WHERE  p.name = pr.product",
              "level": 0,
              "bullet": false
            },
            {
              "text": "AND p.buyer = ‘Joe Blow‘)",
              "level": 0,
              "bullet": false
            }
          ]
        },
        {
          "kind": "text",
          "name": "Rectangle 6",
          "placeholder": "",
          "position": {
            "x": 4099298,
            "y": 5884287,
            "w": 3993401,
            "h": 584775
          },
          "paragraphs": [
            {
              "text": "Beware of duplicates!",
              "level": 0,
              "bullet": false
            }
          ]
        }
      ]
    },
    "70": {
      "number": 70,
      "title": "Nested Queries",
      "elements": [
        {
          "kind": "code",
          "name": "Text Box 3",
          "placeholder": "",
          "position": {
            "x": 5489609,
            "y": 2232097,
            "w": 6059030,
            "h": 2246769
          },
          "paragraphs": [
            {
              "text": "SELECT DISTINCT c.city",
              "level": 0,
              "bullet": false
            },
            {
              "text": "FROM   Company c",
              "level": 0,
              "bullet": false
            },
            {
              "text": "WHERE  c.name  IN (",
              "level": 0,
              "bullet": false
            },
            {
              "text": "SELECT pr.maker",
              "level": 0,
              "bullet": false
            },
            {
              "text": "FROM   Purchase p, Product pr",
              "level": 0,
              "bullet": false
            },
            {
              "text": "WHERE  p.product = pr.name",
              "level": 0,
              "bullet": false
            },
            {
              "text": "AND p.buyer = ‘Joe Blow‘)",
              "level": 0,
              "bullet": false
            }
          ]
        },
        {
          "kind": "code",
          "name": "Text Box 3",
          "placeholder": "",
          "position": {
            "x": 428590,
            "y": 2243574,
            "w": 4493538,
            "h": 2246769
          },
          "paragraphs": [
            {
              "text": "SELECT DISTINCT c.city",
              "level": 0,
              "bullet": false
            },
            {
              "text": "FROM   Company c,",
              "level": 0,
              "bullet": false
            },
            {
              "text": "Product pr,",
              "level": 0,
              "bullet": false
            },
            {
              "text": "Purchase p",
              "level": 0,
              "bullet": false
            },
            {
              "text": "WHERE  c.name = pr.maker",
              "level": 0,
              "bullet": false
            },
            {
              "text": "AND  pr.name = p.product",
              "level": 0,
              "bullet": false
            },
            {
              "text": "AND  p.buyer = ‘Joe Blow’",
              "level": 0,
              "bullet": false
            }
          ]
        },
        {
          "kind": "text",
          "name": "Rectangle 6",
          "placeholder": "",
          "position": {
            "x": 1928809,
            "y": 5125220,
            "w": 8334397,
            "h": 584775
          },
          "paragraphs": [
            {
              "text": "Now they are equivalent (both use set semantics)",
              "level": 0,
              "bullet": false
            }
          ]
        }
      ]
    },
    "71": {
      "number": 71,
      "title": "Subqueries Return Relations",
      "elements": [
        {
          "kind": "text",
          "name": "Rectangle 11",
          "placeholder": "",
          "position": {
            "x": 7227803,
            "y": 1538419,
            "w": 4125997,
            "h": 830997
          },
          "paragraphs": [
            {
              "text": "ANY and ALL not supported by SQLite.",
              "level": 0,
              "bullet": false
            }
          ]
        },
        {
          "kind": "text",
          "name": "Text Box 5",
          "placeholder": "",
          "position": {
            "x": 838200,
            "y": 1596919,
            "w": 5234576,
            "h": 1569660
          },
          "paragraphs": [
            {
              "text": "You can also use operations of the form:",
              "level": 0,
              "bullet": false
            },
            {
              "text": "s > ALL R",
              "level": 1,
              "bullet": true
            },
            {
              "text": "s < ANY R",
              "level": 1,
              "bullet": true
            },
            {
              "text": "EXISTS R",
              "level": 1,
              "bullet": true
            }
          ]
        },
        {
          "kind": "text",
          "name": "Rectangle 10",
          "placeholder": "",
          "position": {
            "x": 838200,
            "y": 3482089,
            "w": 2697327,
            "h": 461665
          },
          "paragraphs": [
            {
              "text": "Ex:",
              "level": 0,
              "bullet": false
            }
          ]
        },
        {
          "kind": "text",
          "name": "Text Box 4",
          "placeholder": "",
          "position": {
            "x": 1531259,
            "y": 3482089,
            "w": 5878532,
            "h": 400110
          },
          "paragraphs": [
            {
              "text": "Product(name, price, category, maker)",
              "level": 0,
              "bullet": false
            }
          ]
        },
        {
          "kind": "code",
          "name": "Text Box 3",
          "placeholder": "",
          "position": {
            "x": 1531259,
            "y": 4197709,
            "w": 6506909,
            "h": 2308324
          },
          "paragraphs": [
            {
              "text": "SELECT name",
              "level": 0,
              "bullet": false
            },
            {
              "text": "FROM   Product",
              "level": 0,
              "bullet": false
            },
            {
              "text": "WHERE  price > ALL(",
              "level": 0,
              "bullet": false
            },
            {
              "text": "SELECT price",
              "level": 0,
              "bullet": false
            },
            {
              "text": "FROM   Product",
              "level": 0,
              "bullet": false
            },
            {
              "text": "WHERE  maker = ‘Gizmo-Works’)",
              "level": 0,
              "bullet": false
            }
          ]
        },
        {
          "kind": "text",
          "name": "Rectangle 1",
          "placeholder": "",
          "position": {
            "x": 8633536,
            "y": 4232567,
            "w": 2697327,
            "h": 1938992
          },
          "paragraphs": [
            {
              "text": "Find products that are more expensive than all those produced by “Gizmo-Works”",
              "level": 0,
              "bullet": false
            }
          ]
        }
      ]
    },
    "72": {
      "number": 72,
      "title": "Subqueries Returning Relations",
      "elements": [
        {
          "kind": "text",
          "name": "Text Box 5",
          "placeholder": "",
          "position": {
            "x": 838200,
            "y": 1596919,
            "w": 5467972,
            "h": 1569660
          },
          "paragraphs": [
            {
              "text": "You can also use operations of the form:",
              "level": 0,
              "bullet": false
            },
            {
              "text": "s > ALL R",
              "level": 1,
              "bullet": true
            },
            {
              "text": "s < ANY R",
              "level": 1,
              "bullet": true
            },
            {
              "text": "EXISTS R",
              "level": 1,
              "bullet": true
            }
          ]
        },
        {
          "kind": "text",
          "name": "Rectangle 10",
          "placeholder": "",
          "position": {
            "x": 487864,
            "y": 3416395,
            "w": 2697327,
            "h": 461665
          },
          "paragraphs": [
            {
              "text": "Ex:",
              "level": 0,
              "bullet": false
            }
          ]
        },
        {
          "kind": "text",
          "name": "Text Box 4",
          "placeholder": "",
          "position": {
            "x": 1180923,
            "y": 3416395,
            "w": 5878532,
            "h": 400110
          },
          "paragraphs": [
            {
              "text": "Product(name, price, category, maker)",
              "level": 0,
              "bullet": false
            }
          ]
        },
        {
          "kind": "text",
          "name": "Rectangle 1",
          "placeholder": "",
          "position": {
            "x": 8950737,
            "y": 3968931,
            "w": 2697327,
            "h": 2677656
          },
          "paragraphs": [
            {
              "text": "Find ‘copycat’ products, i.e. products made by competitors with the same names as products made by “Gizmo-Works”",
              "level": 0,
              "bullet": false
            }
          ]
        },
        {
          "kind": "code",
          "name": "Text Box 3",
          "placeholder": "",
          "position": {
            "x": 1180923,
            "y": 4132015,
            "w": 6032421,
            "h": 2554545
          },
          "paragraphs": [
            {
              "text": "SELECT p1.name",
              "level": 0,
              "bullet": false
            },
            {
              "text": "FROM   Product p1",
              "level": 0,
              "bullet": false
            },
            {
              "text": "WHERE  p1.maker = ‘Gizmo-Works’",
              "level": 0,
              "bullet": false
            },
            {
              "text": "AND EXISTS(",
              "level": 0,
              "bullet": false
            },
            {
              "text": "SELECT p2.name",
              "level": 0,
              "bullet": false
            },
            {
              "text": "FROM   Product p2",
              "level": 0,
              "bullet": false
            },
            {
              "text": "WHERE  p2.maker <> ‘Gizmo-Works’",
              "level": 0,
              "bullet": false
            },
            {
              "text": "AND p1.name = p2.name)",
              "level": 0,
              "bullet": false
            }
          ]
        },
        {
          "kind": "text",
          "name": "Rectangle 11",
          "placeholder": "",
          "position": {
            "x": 7397280,
            "y": 5858392,
            "w": 1370067,
            "h": 369332
          },
          "paragraphs": [
            {
              "text": "<> means !=",
              "level": 0,
              "bullet": false
            }
          ]
        }
      ]
    },
    "73": {
      "number": 73,
      "title": "Nested queries as alternatives to INTERSECT and EXCEPT",
      "elements": [
        {
          "kind": "code",
          "name": "Rectangle 2",
          "placeholder": "",
          "position": {
            "x": 7227803,
            "y": 1538419,
            "w": 4125997,
            "h": 830997
          },
          "paragraphs": [
            {
              "text": "INTERSECT and EXCEPT not in some DBMSs!",
              "level": 0,
              "bullet": false
            }
          ]
        },
        {
          "kind": "code",
          "name": "Rectangle 1027",
          "placeholder": "",
          "position": {
            "x": 838200,
            "y": 2594508,
            "w": 2416046,
            "h": 1338828
          },
          "paragraphs": [
            {
              "text": "(SELECT R.A, R.B",
              "level": 0,
              "bullet": false
            },
            {
              "text": "FROM   R)\nINTERSECT",
              "level": 0,
              "bullet": false
            },
            {
              "text": "(SELECT S.A, S.B",
              "level": 0,
              "bullet": false
            },
            {
              "text": "FROM   S)",
              "level": 0,
              "bullet": false
            }
          ]
        },
        {
          "kind": "code",
          "name": "Rectangle 1028",
          "placeholder": "",
          "position": {
            "x": 4343399,
            "y": 2594508,
            "w": 4786888,
            "h": 1588127
          },
          "paragraphs": [
            {
              "text": "SELECT R.A, R.B",
              "level": 0,
              "bullet": false
            },
            {
              "text": "FROM   R\nWHERE EXISTS(",
              "level": 0,
              "bullet": false
            },
            {
              "text": "SELECT *\n \tFROM S\n       WHERE R.A=S.A AND R.B=S.B)",
              "level": 0,
              "bullet": false
            }
          ]
        },
        {
          "kind": "text",
          "name": "Rectangle 3",
          "placeholder": "",
          "position": {
            "x": 9664700,
            "y": 3688104,
            "w": 1955800,
            "h": 1477328
          },
          "paragraphs": [
            {
              "text": "If R, S have no duplicates, then can write without sub-queries (HOW?)",
              "level": 0,
              "bullet": false
            }
          ]
        },
        {
          "kind": "code",
          "name": "Rectangle 1027",
          "placeholder": "",
          "position": {
            "x": 838200,
            "y": 4804308,
            "w": 2416046,
            "h": 1338828
          },
          "paragraphs": [
            {
              "text": "(SELECT R.A, R.B",
              "level": 0,
              "bullet": false
            },
            {
              "text": "FROM   R)\nEXCEPT",
              "level": 0,
              "bullet": false
            },
            {
              "text": "(SELECT S.A, S.B",
              "level": 0,
              "bullet": false
            },
            {
              "text": "FROM   S)",
              "level": 0,
              "bullet": false
            }
          ]
        },
        {
          "kind": "code",
          "name": "Rectangle 1031",
          "placeholder": "",
          "position": {
            "x": 4419599,
            "y": 4804308,
            "w": 4786888,
            "h": 1588127
          },
          "paragraphs": [
            {
              "text": "SELECT R.A, R.B",
              "level": 0,
              "bullet": false
            },
            {
              "text": "FROM   R\nWHERE NOT EXISTS(",
              "level": 0,
              "bullet": false
            },
            {
              "text": "SELECT *\n       FROM S\n       WHERE R.A=S.A AND R.B=S.B)",
              "level": 0,
              "bullet": false
            }
          ]
        }
      ]
    },
    "74": {
      "number": 74,
      "title": "Nested queries as alternatives to INTERSECT and EXCEPT",
      "elements": [
        {
          "kind": "code",
          "name": "Rectangle 2",
          "placeholder": "",
          "position": {
            "x": 7227803,
            "y": 1538419,
            "w": 4125997,
            "h": 830997
          },
          "paragraphs": [
            {
              "text": "INTERSECT and EXCEPT not in some DBMSs!",
              "level": 0,
              "bullet": false
            }
          ]
        },
        {
          "kind": "code",
          "name": "Rectangle 1027",
          "placeholder": "",
          "position": {
            "x": 838200,
            "y": 2594508,
            "w": 2416046,
            "h": 1338828
          },
          "paragraphs": [
            {
              "text": "(SELECT R.A, R.B",
              "level": 0,
              "bullet": false
            },
            {
              "text": "FROM   R)\nINTERSECT",
              "level": 0,
              "bullet": false
            },
            {
              "text": "(SELECT S.A, S.B",
              "level": 0,
              "bullet": false
            },
            {
              "text": "FROM   S)",
              "level": 0,
              "bullet": false
            }
          ]
        },
        {
          "kind": "code",
          "name": "Rectangle 1028",
          "placeholder": "",
          "position": {
            "x": 4343399,
            "y": 2594508,
            "w": 3199915,
            "h": 1338828
          },
          "paragraphs": [
            {
              "text": "SELECT R.A, R.B",
              "level": 0,
              "bullet": false
            },
            {
              "text": "FROM   R\nWHERE (A,B) IN (",
              "level": 0,
              "bullet": false
            },
            {
              "text": "SELECT S.A, S,B\n \tFROM S)",
              "level": 0,
              "bullet": false
            }
          ]
        },
        {
          "kind": "text",
          "name": "Rectangle 3",
          "placeholder": "",
          "position": {
            "x": 9664700,
            "y": 3688104,
            "w": 1955800,
            "h": 1477328
          },
          "paragraphs": [
            {
              "text": "If R, S have no duplicates, then can write without sub-queries (HOW?)",
              "level": 0,
              "bullet": false
            }
          ]
        },
        {
          "kind": "code",
          "name": "Rectangle 1027",
          "placeholder": "",
          "position": {
            "x": 838200,
            "y": 4804308,
            "w": 2416046,
            "h": 1338828
          },
          "paragraphs": [
            {
              "text": "(SELECT R.A, R.B",
              "level": 0,
              "bullet": false
            },
            {
              "text": "FROM   R)\nEXCEPT",
              "level": 0,
              "bullet": false
            },
            {
              "text": "(SELECT S.A, S.B",
              "level": 0,
              "bullet": false
            },
            {
              "text": "FROM   S)",
              "level": 0,
              "bullet": false
            }
          ]
        },
        {
          "kind": "code",
          "name": "Rectangle 1031",
          "placeholder": "",
          "position": {
            "x": 4419599,
            "y": 4804308,
            "w": 2834430,
            "h": 1338828
          },
          "paragraphs": [
            {
              "text": "SELECT R.A, R.B",
              "level": 0,
              "bullet": false
            },
            {
              "text": "FROM   R\nWHERE (A,B) NOT IN(",
              "level": 0,
              "bullet": false
            },
            {
              "text": "SELECT A,B\n       FROM S)",
              "level": 0,
              "bullet": false
            }
          ]
        }
      ]
    },
    "75": {
      "number": 75,
      "title": "Correlated Queries Using External Vars in Internal Subquery",
      "elements": [
        {
          "kind": "text",
          "name": "Text Box 4",
          "placeholder": "",
          "position": {
            "x": 838200,
            "y": 1716236,
            "w": 6878806,
            "h": 461665
          },
          "paragraphs": [
            {
              "text": "Movie(title, year, director, length)",
              "level": 0,
              "bullet": false
            }
          ]
        },
        {
          "kind": "text",
          "name": "Rectangle 1",
          "placeholder": "",
          "position": {
            "x": 8390587,
            "y": 2177901,
            "w": 2721913,
            "h": 1200329
          },
          "paragraphs": [
            {
              "text": "Find movies whose title appears more than once.",
              "level": 0,
              "bullet": false
            }
          ]
        },
        {
          "kind": "code",
          "name": "Text Box 3",
          "placeholder": "",
          "position": {
            "x": 834172,
            "y": 2624882,
            "w": 6882834,
            "h": 2308324
          },
          "paragraphs": [
            {
              "text": "SELECT DISTINCT title",
              "level": 0,
              "bullet": false
            },
            {
              "text": "FROM   Movie AS m",
              "level": 0,
              "bullet": false
            },
            {
              "text": "WHERE  year <> ANY(",
              "level": 0,
              "bullet": false
            },
            {
              "text": "SELECT  year",
              "level": 0,
              "bullet": false
            },
            {
              "text": "FROM    Movie",
              "level": 0,
              "bullet": false
            },
            {
              "text": "WHERE  title =  m.title)",
              "level": 0,
              "bullet": false
            }
          ]
        },
        {
          "kind": "text",
          "name": "TextBox 2",
          "placeholder": "",
          "position": {
            "x": 8390587,
            "y": 3865443,
            "w": 2370446,
            "h": 830997
          },
          "paragraphs": [
            {
              "text": "Note the scoping of the variables!",
              "level": 0,
              "bullet": false
            }
          ]
        },
        {
          "kind": "text",
          "name": "Text Box 5",
          "placeholder": "",
          "position": {
            "x": 3038368,
            "y": 5380187,
            "w": 6115264,
            "h": 400110
          },
          "paragraphs": [
            {
              "text": "Note also: this can still be expressed as single SFW query…",
              "level": 0,
              "bullet": false
            }
          ]
        }
      ]
    },
    "76": {
      "number": 76,
      "title": "Complex Correlated Query",
      "elements": [
        {
          "kind": "text",
          "name": "Rectangle 2",
          "placeholder": "",
          "position": {
            "x": 838200,
            "y": 1632929,
            "w": 6801862,
            "h": 369332
          },
          "paragraphs": [
            {
              "text": "Product(name, price, category, maker, year)",
              "level": 0,
              "bullet": false
            }
          ]
        },
        {
          "kind": "code",
          "name": "Rectangle 4",
          "placeholder": "",
          "position": {
            "x": 838200,
            "y": 2544279,
            "w": 6692858,
            "h": 2419124
          },
          "paragraphs": [
            {
              "text": "SELECT DISTINCT  x.name, x.maker",
              "level": 0,
              "bullet": false
            },
            {
              "text": "FROM   Product AS x",
              "level": 0,
              "bullet": false
            },
            {
              "text": "WHERE  x.price > ALL(",
              "level": 0,
              "bullet": false
            },
            {
              "text": "SELECT y.price",
              "level": 0,
              "bullet": false
            },
            {
              "text": "FROM   Product AS y",
              "level": 0,
              "bullet": false
            },
            {
              "text": "WHERE  x.maker = y.maker",
              "level": 0,
              "bullet": false
            },
            {
              "text": "AND y.year < 1972)",
              "level": 0,
              "bullet": false
            }
          ]
        },
        {
          "kind": "text",
          "name": "Rectangle 1",
          "placeholder": "",
          "position": {
            "x": 8267658,
            "y": 2544279,
            "w": 3200442,
            "h": 2086725
          },
          "paragraphs": [
            {
              "text": "Find products (and their manufacturers) that are more expensive than all products made by the same manufacturer before 1972",
              "level": 0,
              "bullet": false
            }
          ]
        },
        {
          "kind": "text",
          "name": "TextBox 3",
          "placeholder": "",
          "position": {
            "x": 2718504,
            "y": 5790006,
            "w": 6754991,
            "h": 461665
          },
          "paragraphs": [
            {
              "text": "Can be very powerful (also much harder to optimize)",
              "level": 0,
              "bullet": false
            }
          ]
        }
      ]
    },
    "77": {
      "number": 77,
      "title": "Basic SQL Summary",
      "elements": [
        {
          "kind": "text",
          "name": "Content Placeholder 2",
          "placeholder": "body",
          "position": {
            "x": 0,
            "y": 0,
            "w": 0,
            "h": 0
          },
          "paragraphs": [
            {
              "text": "SQL provides a high-level declarative language for manipulating data (DML)",
              "level": 0,
              "bullet": true
            },
            {
              "text": "The workhorse is the SFW block",
              "level": 0,
              "bullet": true
            },
            {
              "text": "Set operators are powerful but have some subtleties",
              "level": 0,
              "bullet": true
            },
            {
              "text": "Powerful, nested queries also allowed.",
              "level": 0,
              "bullet": true
            }
          ]
        }
      ]
    },
    "78": {
      "number": 78,
      "title": "Query rewrite checkpoint",
      "elements": [
        {
          "kind": "code",
          "name": "Content Placeholder 2",
          "placeholder": "body",
          "position": {
            "x": 838199,
            "y": 1825625,
            "w": 7239000,
            "h": 3660775
          },
          "paragraphs": [
            {
              "text": "Use a join when you need columns from matching rows.",
              "level": 0,
              "bullet": true
            },
            {
              "text": "Use EXISTS when the question is only whether a match exists.",
              "level": 0,
              "bullet": true
            },
            {
              "text": "Use NOT EXISTS for 'none' or 'for every' patterns.",
              "level": 0,
              "bullet": true
            },
            {
              "text": "Check duplicates before claiming two rewrites are equivalent.",
              "level": 0,
              "bullet": true
            }
          ]
        },
        {
          "kind": "text",
          "name": "TextBox 6",
          "placeholder": "",
          "position": {
            "x": 8395447,
            "y": 2457637,
            "w": 3572966,
            "h": 830997
          },
          "paragraphs": [
            {
              "text": "Equivalent syntax",
              "level": 0,
              "bullet": false
            },
            {
              "text": "can differ on bags",
              "level": 0,
              "bullet": false
            }
          ]
        },
        {
          "kind": "text",
          "name": "TextBox 5",
          "placeholder": "",
          "position": {
            "x": 1766047,
            "y": 5699909,
            "w": 8659906,
            "h": 954107
          },
          "paragraphs": [
            {
              "text": "Choose the construct that states the intent most directly.",
              "level": 0,
              "bullet": false
            }
          ]
        }
      ]
    },
    "79": {
      "number": 79,
      "title": "2. Aggregation & GROUP BY",
      "elements": []
    },
    "80": {
      "number": 80,
      "title": "What you will learn about in this section",
      "elements": [
        {
          "kind": "code",
          "name": "Content Placeholder 2",
          "placeholder": "body",
          "position": {
            "x": 838200,
            "y": 1825624,
            "w": 10515600,
            "h": 4175783
          },
          "paragraphs": [
            {
              "text": "Aggregation operators",
              "level": 0,
              "bullet": true
            },
            {
              "text": "GROUP BY",
              "level": 0,
              "bullet": true
            },
            {
              "text": "GROUP BY: with HAVING, semantics",
              "level": 0,
              "bullet": true
            }
          ]
        }
      ]
    },
    "81": {
      "number": 81,
      "title": "Aggregation",
      "elements": [
        {
          "kind": "text",
          "name": "Rectangle 5",
          "placeholder": "",
          "position": {
            "x": 5576047,
            "y": 415784,
            "w": 5199529,
            "h": 369332
          },
          "paragraphs": [
            {
              "text": "https://teachingow.github.io/DBMS-SQL-Labs/Lab2_3",
              "level": 0,
              "bullet": false
            }
          ]
        },
        {
          "kind": "code",
          "name": "Text Box 5",
          "placeholder": "",
          "position": {
            "x": 838200,
            "y": 1904999,
            "w": 4461478,
            "h": 1200329
          },
          "paragraphs": [
            {
              "text": "SELECT AVG(price)",
              "level": 0,
              "bullet": false
            },
            {
              "text": "FROM   Product",
              "level": 0,
              "bullet": false
            },
            {
              "text": "WHERE  maker = “Toyota”",
              "level": 0,
              "bullet": false
            }
          ]
        },
        {
          "kind": "code",
          "name": "Text Box 3",
          "placeholder": "",
          "position": {
            "x": 6084982,
            "y": 1904999,
            "w": 3531736,
            "h": 1200329
          },
          "paragraphs": [
            {
              "text": "SELECT COUNT(*)",
              "level": 0,
              "bullet": false
            },
            {
              "text": "FROM   Product",
              "level": 0,
              "bullet": false
            },
            {
              "text": "WHERE  year > 1995",
              "level": 0,
              "bullet": false
            }
          ]
        },
        {
          "kind": "text",
          "name": "Text Box 6",
          "placeholder": "",
          "position": {
            "x": 838200,
            "y": 3657601,
            "w": 8161064,
            "h": 1231106
          },
          "paragraphs": [
            {
              "text": "SQL supports several aggregation operations:",
              "level": 0,
              "bullet": true
            },
            {
              "text": "SUM, COUNT, MIN, MAX, AVG",
              "level": 1,
              "bullet": true
            }
          ]
        },
        {
          "kind": "text",
          "name": "Rectangle 4",
          "placeholder": "",
          "position": {
            "x": 6578601,
            "y": 4572971,
            "w": 4419599,
            "h": 830997
          },
          "paragraphs": [
            {
              "text": "Except COUNT, all aggregations apply to a single attribute",
              "level": 0,
              "bullet": false
            }
          ]
        }
      ]
    },
    "82": {
      "number": 82,
      "title": "Aggregation: COUNT",
      "elements": [
        {
          "kind": "text",
          "name": "Text Box 3",
          "placeholder": "",
          "position": {
            "x": 825500,
            "y": 1941733,
            "w": 8432800,
            "h": 523220
          },
          "paragraphs": [
            {
              "text": "COUNT applies to duplicates, unless otherwise stated",
              "level": 0,
              "bullet": true
            }
          ]
        },
        {
          "kind": "code",
          "name": "Text Box 4",
          "placeholder": "",
          "position": {
            "x": 854988,
            "y": 2823189,
            "w": 4461478,
            "h": 1200329
          },
          "paragraphs": [
            {
              "text": "SELECT COUNT(category)",
              "level": 0,
              "bullet": false
            },
            {
              "text": "FROM   Product",
              "level": 0,
              "bullet": false
            },
            {
              "text": "WHERE  year > 1995",
              "level": 0,
              "bullet": false
            }
          ]
        },
        {
          "kind": "text",
          "name": "Rectangle 5",
          "placeholder": "",
          "position": {
            "x": 5906593,
            "y": 2823189,
            "w": 2704007,
            "h": 646331
          },
          "paragraphs": [
            {
              "text": "Note: Same as COUNT(*).  Why?",
              "level": 0,
              "bullet": false
            }
          ]
        },
        {
          "kind": "text",
          "name": "Rectangle 6",
          "placeholder": "",
          "position": {
            "x": 838200,
            "y": 4343400,
            "w": 3148170,
            "h": 553998
          },
          "paragraphs": [
            {
              "text": "We probably want:",
              "level": 0,
              "bullet": false
            }
          ]
        },
        {
          "kind": "code",
          "name": "Text Box 7",
          "placeholder": "",
          "position": {
            "x": 838200,
            "y": 5169932,
            "w": 5949064,
            "h": 1200329
          },
          "paragraphs": [
            {
              "text": "SELECT COUNT(DISTINCT category)",
              "level": 0,
              "bullet": false
            },
            {
              "text": "FROM   Product",
              "level": 0,
              "bullet": false
            },
            {
              "text": "WHERE  year > 1995",
              "level": 0,
              "bullet": false
            }
          ]
        }
      ]
    },
    "83": {
      "number": 83,
      "title": "More Examples",
      "elements": [
        {
          "kind": "text",
          "name": "Text Box 3",
          "placeholder": "",
          "position": {
            "x": 838200,
            "y": 1891736,
            "w": 7622600,
            "h": 461665
          },
          "paragraphs": [
            {
              "text": "Purchase(product, date, price, quantity)",
              "level": 0,
              "bullet": false
            }
          ]
        },
        {
          "kind": "code",
          "name": "Text Box 5",
          "placeholder": "",
          "position": {
            "x": 838200,
            "y": 3060701,
            "w": 5391219,
            "h": 830997
          },
          "paragraphs": [
            {
              "text": "SELECT SUM(price * quantity)",
              "level": 0,
              "bullet": false
            },
            {
              "text": "FROM   Purchase",
              "level": 0,
              "bullet": false
            }
          ]
        },
        {
          "kind": "text",
          "name": "TextBox 1",
          "placeholder": "",
          "position": {
            "x": 7251700,
            "y": 4046324,
            "w": 3371436,
            "h": 523220
          },
          "paragraphs": [
            {
              "text": "What do these mean?",
              "level": 0,
              "bullet": false
            }
          ]
        },
        {
          "kind": "code",
          "name": "Text Box 6",
          "placeholder": "",
          "position": {
            "x": 838200,
            "y": 4737100,
            "w": 5391219,
            "h": 1200329
          },
          "paragraphs": [
            {
              "text": "SELECT SUM(price * quantity)",
              "level": 0,
              "bullet": false
            },
            {
              "text": "FROM   Purchase",
              "level": 0,
              "bullet": false
            },
            {
              "text": "WHERE  product = ‘bagel’",
              "level": 0,
              "bullet": false
            }
          ]
        }
      ]
    },
    "84": {
      "number": 84,
      "title": "Simple Aggregations",
      "elements": [
        {
          "kind": "text",
          "name": "Rectangle 12",
          "placeholder": "",
          "position": {
            "x": 3084472,
            "y": 1546840,
            "w": 1700145,
            "h": 584775
          },
          "paragraphs": [
            {
              "text": "Purchase",
              "level": 0,
              "bullet": false
            }
          ]
        },
        {
          "kind": "table",
          "name": "Group 47",
          "position": {
            "x": 3155950,
            "y": 2191544,
            "w": 5880100,
            "h": 2489200
          },
          "rows": [
            [
              "Product",
              "Date",
              "Price",
              "Quantity"
            ],
            [
              "bagel",
              "10/21",
              "1",
              "20"
            ],
            [
              "banana",
              "10/3",
              "0.5",
              "10"
            ],
            [
              "banana",
              "10/10",
              "1",
              "10"
            ],
            [
              "bagel",
              "10/25",
              "1.50",
              "20"
            ]
          ]
        },
        {
          "kind": "code",
          "name": "Text Box 48",
          "placeholder": "",
          "position": {
            "x": 838200,
            "y": 5105341,
            "w": 5372099,
            "h": 1200329
          },
          "paragraphs": [
            {
              "text": "SELECT SUM(price * quantity)",
              "level": 0,
              "bullet": false
            },
            {
              "text": "FROM   Purchase",
              "level": 0,
              "bullet": false
            },
            {
              "text": "WHERE  product = ‘bagel’",
              "level": 0,
              "bullet": false
            }
          ]
        },
        {
          "kind": "text",
          "name": "Rectangle 50",
          "placeholder": "",
          "position": {
            "x": 7883992,
            "y": 5418239,
            "w": 3508893,
            "h": 523220
          },
          "paragraphs": [
            {
              "text": "50  (= 1*20 + 1.50*20)",
              "level": 0,
              "bullet": false
            }
          ]
        }
      ]
    },
    "85": {
      "number": 85,
      "title": "Grouping and Aggregation",
      "elements": [
        {
          "kind": "text",
          "name": "Text Box 3",
          "placeholder": "",
          "position": {
            "x": 838200,
            "y": 1770546,
            "w": 7622600,
            "h": 461665
          },
          "paragraphs": [
            {
              "text": "Purchase(product, date, price, quantity)",
              "level": 0,
              "bullet": false
            }
          ]
        },
        {
          "kind": "code",
          "name": "Rectangle 4",
          "placeholder": "",
          "position": {
            "x": 838200,
            "y": 3007611,
            "w": 8334583,
            "h": 1938992
          },
          "paragraphs": [
            {
              "text": "SELECT   product,",
              "level": 0,
              "bullet": false
            },
            {
              "text": "SUM(price * quantity) AS TotalSales",
              "level": 0,
              "bullet": false
            },
            {
              "text": "FROM     Purchase",
              "level": 0,
              "bullet": false
            },
            {
              "text": "WHERE    date > ‘10/1/2005’",
              "level": 0,
              "bullet": false
            },
            {
              "text": "GROUP BY product",
              "level": 0,
              "bullet": false
            }
          ]
        },
        {
          "kind": "text",
          "name": "Rectangle 6",
          "placeholder": "",
          "position": {
            "x": 9438481,
            "y": 3007611,
            "w": 2433638,
            "h": 1200329
          },
          "paragraphs": [
            {
              "text": "Find total sales after 10/1/2005 per product.",
              "level": 0,
              "bullet": false
            }
          ]
        },
        {
          "kind": "text",
          "name": "Text Box 5",
          "placeholder": "",
          "position": {
            "x": 4038609,
            "y": 5722003,
            "w": 4114781,
            "h": 523220
          },
          "paragraphs": [
            {
              "text": "Let’s see what this means…",
              "level": 0,
              "bullet": false
            }
          ]
        }
      ]
    },
    "86": {
      "number": 86,
      "title": "Grouping and Aggregation",
      "elements": [
        {
          "kind": "text",
          "name": "TextBox 1",
          "placeholder": "",
          "position": {
            "x": 838200,
            "y": 1690688,
            "w": 4092339,
            "h": 584775
          },
          "paragraphs": [
            {
              "text": "Semantics of the query:",
              "level": 0,
              "bullet": false
            }
          ]
        },
        {
          "kind": "code",
          "name": "Text Box 3",
          "placeholder": "",
          "position": {
            "x": 838200,
            "y": 2654300,
            "w": 10515600,
            "h": 3108543
          },
          "paragraphs": [
            {
              "text": "1. Compute the FROM and WHERE clauses",
              "level": 0,
              "bullet": false
            },
            {
              "text": "2. Group by the attributes in the GROUP BY",
              "level": 0,
              "bullet": false
            },
            {
              "text": "3. Compute the SELECT clause: grouped attributes and aggregates",
              "level": 0,
              "bullet": false
            }
          ]
        }
      ]
    },
    "87": {
      "number": 87,
      "title": "1. Compute the FROM and WHERE clauses",
      "elements": [
        {
          "kind": "code",
          "name": "Rectangle 4",
          "placeholder": "",
          "position": {
            "x": 806451,
            "y": 1760656,
            "w": 7326894,
            "h": 1200329
          },
          "paragraphs": [
            {
              "text": "SELECT   product, SUM(price*quantity) AS TotalSales",
              "level": 0,
              "bullet": false
            },
            {
              "text": "FROM     Purchase",
              "level": 0,
              "bullet": false
            },
            {
              "text": "WHERE    date > ‘10/1/2005’",
              "level": 0,
              "bullet": false
            },
            {
              "text": "GROUP BY product",
              "level": 0,
              "bullet": false
            }
          ]
        },
        {
          "kind": "table",
          "name": "Group 58",
          "position": {
            "x": 3638550,
            "y": 3807618,
            "w": 4381500,
            "h": 1981200
          },
          "rows": [
            [
              "Product",
              "Date",
              "Price",
              "Quantity"
            ],
            [
              "Bagel",
              "10/21",
              "1",
              "20"
            ],
            [
              "Bagel",
              "10/25",
              "1.50",
              "20"
            ],
            [
              "Banana",
              "10/3",
              "0.5",
              "10"
            ],
            [
              "Banana",
              "10/10",
              "1",
              "10"
            ]
          ]
        },
        {
          "kind": "text",
          "name": "Rectangle 1",
          "placeholder": "",
          "position": {
            "x": 2095500,
            "y": 4062054,
            "w": 740557,
            "h": 369332
          },
          "paragraphs": [
            {
              "text": "FROM",
              "level": 0,
              "bullet": false
            }
          ]
        }
      ]
    },
    "88": {
      "number": 88,
      "title": "2. Group by the attributes in the GROUP BY",
      "elements": [
        {
          "kind": "code",
          "name": "Rectangle 4",
          "placeholder": "",
          "position": {
            "x": 806450,
            "y": 2094051,
            "w": 7288409,
            "h": 1200329
          },
          "paragraphs": [
            {
              "text": "SELECT   product, SUM(price*quantity) AS TotalSales",
              "level": 0,
              "bullet": false
            },
            {
              "text": "FROM     Purchase",
              "level": 0,
              "bullet": false
            },
            {
              "text": "WHERE    date > ‘10/1/2005’",
              "level": 0,
              "bullet": false
            },
            {
              "text": "GROUP BY product",
              "level": 0,
              "bullet": false
            }
          ]
        },
        {
          "kind": "table",
          "name": "Group 58",
          "position": {
            "x": 240440,
            "y": 3939002,
            "w": 4381500,
            "h": 1981200
          },
          "rows": [
            [
              "Product",
              "Date",
              "Price",
              "Quantity"
            ],
            [
              "Bagel",
              "10/21",
              "1",
              "20"
            ],
            [
              "Bagel",
              "10/25",
              "1.50",
              "20"
            ],
            [
              "Banana",
              "10/3",
              "0.5",
              "10"
            ],
            [
              "Banana",
              "10/10",
              "1",
              "10"
            ]
          ]
        },
        {
          "kind": "table",
          "name": "Group 58",
          "position": {
            "x": 6096000,
            "y": 3939002,
            "w": 4381500,
            "h": 1981200
          },
          "rows": [
            [
              "Product",
              "Date",
              "Price",
              "Quantity"
            ],
            [
              "Bagel",
              "10/21",
              "1",
              "20"
            ],
            [
              "",
              "10/25",
              "1.50",
              "20"
            ],
            [
              "Banana",
              "10/3",
              "0.5",
              "10"
            ],
            [
              "",
              "10/10",
              "1",
              "10"
            ]
          ]
        },
        {
          "kind": "text",
          "name": "Rectangle 1",
          "placeholder": "",
          "position": {
            "x": 4709524,
            "y": 4073486,
            "w": 1300356,
            "h": 369332
          },
          "paragraphs": [
            {
              "text": "GROUP BY",
              "level": 0,
              "bullet": false
            }
          ]
        }
      ]
    },
    "89": {
      "number": 89,
      "title": "3. Compute the SELECT clause: grouped attributes and aggregates",
      "elements": [
        {
          "kind": "code",
          "name": "Rectangle 4",
          "placeholder": "",
          "position": {
            "x": 806450,
            "y": 1986284,
            "w": 7272281,
            "h": 1200329
          },
          "paragraphs": [
            {
              "text": "SELECT   product, SUM(price*quantity) AS TotalSales",
              "level": 0,
              "bullet": false
            },
            {
              "text": "FROM     Purchase",
              "level": 0,
              "bullet": false
            },
            {
              "text": "WHERE    date > ‘10/1/2005’",
              "level": 0,
              "bullet": false
            },
            {
              "text": "GROUP BY product",
              "level": 0,
              "bullet": false
            }
          ]
        },
        {
          "kind": "table",
          "name": "Group 58",
          "position": {
            "x": 806450,
            "y": 3776079,
            "w": 4381500,
            "h": 1981200
          },
          "rows": [
            [
              "Product",
              "Date",
              "Price",
              "Quantity"
            ],
            [
              "Bagel",
              "10/21",
              "1",
              "20"
            ],
            [
              "",
              "10/25",
              "1.50",
              "20"
            ],
            [
              "Banana",
              "10/3",
              "0.5",
              "10"
            ],
            [
              "",
              "10/10",
              "1",
              "10"
            ]
          ]
        },
        {
          "kind": "table",
          "name": "Group 74",
          "position": {
            "x": 7771442,
            "y": 3776079,
            "w": 3429000,
            "h": 1803401
          },
          "rows": [
            [
              "Product",
              "TotalSales"
            ],
            [
              "Bagel",
              "50"
            ],
            [
              "Banana",
              "15"
            ]
          ]
        },
        {
          "kind": "code",
          "name": "Rectangle 1",
          "placeholder": "",
          "position": {
            "x": 6340981,
            "y": 3930668,
            "w": 1018503,
            "h": 369332
          },
          "paragraphs": [
            {
              "text": "SELECT",
              "level": 0,
              "bullet": false
            }
          ]
        }
      ]
    },
    "90": {
      "number": 90,
      "title": "GROUP BY v.s. Nested Quereis",
      "elements": [
        {
          "kind": "code",
          "name": "Text Box 1032",
          "placeholder": "",
          "position": {
            "x": 1008382,
            "y": 1685919,
            "w": 9668031,
            "h": 1569660
          },
          "paragraphs": [
            {
              "text": "SELECT   product, Sum(price*quantity) AS TotalSales",
              "level": 0,
              "bullet": false
            },
            {
              "text": "FROM     Purchase",
              "level": 0,
              "bullet": false
            },
            {
              "text": "WHERE    date > ‘10/1/2005’",
              "level": 0,
              "bullet": false
            },
            {
              "text": "GROUP BY product",
              "level": 0,
              "bullet": false
            }
          ]
        },
        {
          "kind": "code",
          "name": "Text Box 1034",
          "placeholder": "",
          "position": {
            "x": 1008382,
            "y": 3673781,
            "w": 9668031,
            "h": 2677656
          },
          "paragraphs": [
            {
              "text": "SELECT DISTINCT x.product,",
              "level": 0,
              "bullet": false
            },
            {
              "text": "(SELECT Sum(y.price*y.quantity)\n        FROM   Purchase y\n        WHERE  x.product = y.product \n           AND y.date > ‘10/1/2005’) AS TotalSales",
              "level": 0,
              "bullet": false
            },
            {
              "text": "FROM   Purchase x",
              "level": 0,
              "bullet": false
            },
            {
              "text": "WHERE  x.date > ‘10/1/2005’",
              "level": 0,
              "bullet": false
            }
          ]
        }
      ]
    },
    "91": {
      "number": 91,
      "title": "HAVING Clause",
      "elements": [
        {
          "kind": "text",
          "name": "Text Box 4",
          "placeholder": "",
          "position": {
            "x": 8305800,
            "y": 2360063,
            "w": 2933700,
            "h": 2677656
          },
          "paragraphs": [
            {
              "text": "Same query as before, except that we consider only products that have more than",
              "level": 0,
              "bullet": false
            },
            {
              "text": "20 items",
              "level": 0,
              "bullet": false
            }
          ]
        },
        {
          "kind": "code",
          "name": "Text Box 1032",
          "placeholder": "",
          "position": {
            "x": 838200,
            "y": 2381482,
            "w": 7064755,
            "h": 1938992
          },
          "paragraphs": [
            {
              "text": "SELECT   product, SUM(price*quantity)",
              "level": 0,
              "bullet": false
            },
            {
              "text": "FROM     Purchase",
              "level": 0,
              "bullet": false
            },
            {
              "text": "WHERE    date > ‘10/1/2005’",
              "level": 0,
              "bullet": false
            },
            {
              "text": "GROUP BY product",
              "level": 0,
              "bullet": false
            },
            {
              "text": "HAVING   SUM(quantity) > 20",
              "level": 0,
              "bullet": false
            }
          ]
        },
        {
          "kind": "text",
          "name": "Text Box 5",
          "placeholder": "",
          "position": {
            "x": 838200,
            "y": 4809119,
            "w": 6576289,
            "h": 461665
          },
          "paragraphs": [
            {
              "text": "HAVING clauses contains conditions on aggregates",
              "level": 0,
              "bullet": false
            }
          ]
        },
        {
          "kind": "text",
          "name": "Text Box 5",
          "placeholder": "",
          "position": {
            "x": 838200,
            "y": 5759429,
            "w": 7104253,
            "h": 461665
          },
          "paragraphs": [
            {
              "text": "Whereas WHERE clauses condition on individual tuples…",
              "level": 0,
              "bullet": false
            }
          ]
        }
      ]
    },
    "92": {
      "number": 92,
      "title": "SELECT   product, SUM(price*quantity) FROM     Purchase WHERE    date > ‘10/1/2005’ GROUP BY product HAVING   SUM(quantity) > 30",
      "elements": [
        {
          "kind": "table",
          "name": "Group 58",
          "position": {
            "x": 806450,
            "y": 3776079,
            "w": 4381500,
            "h": 1981200
          },
          "rows": [
            [
              "Product",
              "Date",
              "Price",
              "Quantity"
            ],
            [
              "Bagel",
              "10/21",
              "1",
              "20"
            ],
            [
              "",
              "10/25",
              "1.50",
              "20"
            ],
            [
              "Banana",
              "10/3",
              "0.5",
              "10"
            ],
            [
              "",
              "10/10",
              "1",
              "10"
            ]
          ]
        },
        {
          "kind": "table",
          "name": "Group 74",
          "position": {
            "x": 7771442,
            "y": 3776079,
            "w": 3429000,
            "h": 1201738
          },
          "rows": [
            [
              "Product",
              "TotalSales"
            ],
            [
              "Bagel",
              "50"
            ]
          ]
        }
      ]
    },
    "93": {
      "number": 93,
      "title": "General form of Grouping and Aggregation",
      "elements": [
        {
          "kind": "code",
          "name": "Rectangle 1",
          "placeholder": "",
          "position": {
            "x": 3956050,
            "y": 2002685,
            "w": 4279900,
            "h": 2031325
          },
          "paragraphs": [
            {
              "text": "SELECT     S",
              "level": 0,
              "bullet": false
            },
            {
              "text": "FROM       R1,…,Rn",
              "level": 0,
              "bullet": false
            },
            {
              "text": "WHERE      C1",
              "level": 0,
              "bullet": false
            },
            {
              "text": "GROUP BY   a1,…,ak",
              "level": 0,
              "bullet": false
            },
            {
              "text": "HAVING     C2",
              "level": 0,
              "bullet": false
            }
          ]
        },
        {
          "kind": "text",
          "name": "TextBox 2",
          "placeholder": "",
          "position": {
            "x": 10986817,
            "y": 4264842,
            "w": 892488,
            "h": 461665
          },
          "paragraphs": [
            {
              "text": "Why?",
              "level": 0,
              "bullet": false
            }
          ]
        },
        {
          "kind": "text",
          "name": "Rectangle 3",
          "placeholder": "body",
          "position": {
            "x": 838200,
            "y": 4637361,
            "w": 10515600,
            "h": 1228131
          },
          "paragraphs": [
            {
              "text": "S = Can ONLY contain attributes a1,…,ak and/or aggregates over other attributes",
              "level": 0,
              "bullet": true
            },
            {
              "text": "C1 = is any condition on the attributes in R1,…,Rn",
              "level": 0,
              "bullet": true
            },
            {
              "text": "C2 = is any condition on the aggregate expressions",
              "level": 0,
              "bullet": true
            }
          ]
        }
      ]
    },
    "94": {
      "number": 94,
      "title": "General form of Grouping and Aggregation",
      "elements": [
        {
          "kind": "code",
          "name": "Rectangle 1",
          "placeholder": "",
          "position": {
            "x": 3956050,
            "y": 1790217,
            "w": 4279900,
            "h": 1754326
          },
          "paragraphs": [
            {
              "text": "SELECT     S",
              "level": 0,
              "bullet": false
            },
            {
              "text": "FROM       R1,…,Rn",
              "level": 0,
              "bullet": false
            },
            {
              "text": "WHERE      C1",
              "level": 0,
              "bullet": false
            },
            {
              "text": "GROUP BY   a1,…,ak",
              "level": 0,
              "bullet": false
            },
            {
              "text": "HAVING     C2",
              "level": 0,
              "bullet": false
            }
          ]
        },
        {
          "kind": "code",
          "name": "Rectangle 3",
          "placeholder": "",
          "position": {
            "x": 2133601,
            "y": 3809998,
            "w": 8240486,
            "h": 2605842
          },
          "paragraphs": [
            {
              "text": "Evaluation steps:",
              "level": 0,
              "bullet": false
            },
            {
              "text": "Evaluate FROM-WHERE: apply condition C1 on the  attributes in R1,…,Rn",
              "level": 0,
              "bullet": true
            },
            {
              "text": "GROUP BY the attributes a1,…,ak",
              "level": 0,
              "bullet": true
            },
            {
              "text": "Apply condition C2 to each group (may have aggregates)",
              "level": 0,
              "bullet": true
            },
            {
              "text": "Compute aggregates in S and return the result",
              "level": 0,
              "bullet": true
            }
          ]
        }
      ]
    },
    "95": {
      "number": 95,
      "title": "Debug GROUP BY in four passes",
      "elements": [
        {
          "kind": "code",
          "name": "Content Placeholder 2",
          "placeholder": "body",
          "position": {
            "x": 838199,
            "y": 1825625,
            "w": 7239000,
            "h": 3660775
          },
          "paragraphs": [
            {
              "text": "1. Rows: evaluate FROM and WHERE.",
              "level": 0,
              "bullet": true
            },
            {
              "text": "2. Groups: partition by the GROUP BY attributes.",
              "level": 0,
              "bullet": true
            },
            {
              "text": "3. Group filter: apply HAVING to aggregate results.",
              "level": 0,
              "bullet": true
            },
            {
              "text": "4. Output: return grouped attributes and aggregates only.",
              "level": 0,
              "bullet": true
            }
          ]
        },
        {
          "kind": "code",
          "name": "TextBox 6",
          "placeholder": "",
          "position": {
            "x": 8395447,
            "y": 2457637,
            "w": 3572966,
            "h": 830997
          },
          "paragraphs": [
            {
              "text": "WHERE filters rows",
              "level": 0,
              "bullet": false
            },
            {
              "text": "HAVING filters groups",
              "level": 0,
              "bullet": false
            }
          ]
        },
        {
          "kind": "text",
          "name": "TextBox 5",
          "placeholder": "",
          "position": {
            "x": 1766047,
            "y": 5699909,
            "w": 8659906,
            "h": 954107
          },
          "paragraphs": [
            {
              "text": "If a SELECT expression is neither grouped nor aggregated, question it.",
              "level": 0,
              "bullet": false
            }
          ]
        }
      ]
    },
    "96": {
      "number": 96,
      "title": "Group-by v.s. Nested Query",
      "elements": [
        {
          "kind": "text",
          "name": "Rectangle 9",
          "placeholder": "",
          "position": {
            "x": 838200,
            "y": 1668629,
            "w": 3717684,
            "h": 904863
          },
          "paragraphs": [
            {
              "text": "Author(login, name)",
              "level": 0,
              "bullet": false
            },
            {
              "text": "Wrote(login, url)",
              "level": 0,
              "bullet": false
            }
          ]
        },
        {
          "kind": "text",
          "name": "Rectangle 3",
          "placeholder": "body",
          "position": {
            "x": 838200,
            "y": 2842614,
            "w": 7772400,
            "h": 2209800
          },
          "paragraphs": [
            {
              "text": "Find authors who wrote ³ 10 documents:",
              "level": 0,
              "bullet": true
            },
            {
              "text": "Attempt 1: with nested queries",
              "level": 0,
              "bullet": true
            }
          ]
        },
        {
          "kind": "code",
          "name": "Text Box 5",
          "placeholder": "",
          "position": {
            "x": 838200,
            "y": 4048026,
            "w": 8366393,
            "h": 2308324
          },
          "paragraphs": [
            {
              "text": "SELECT DISTINCT Author.name",
              "level": 0,
              "bullet": false
            },
            {
              "text": "FROM   Author",
              "level": 0,
              "bullet": false
            },
            {
              "text": "WHERE  COUNT(",
              "level": 0,
              "bullet": false
            },
            {
              "text": "SELECT Wrote.url\n     FROM   Wrote\n     WHERE  Author.login = Wrote.login) > 10",
              "level": 0,
              "bullet": false
            }
          ]
        },
        {
          "kind": "text",
          "name": "Rectangle 1",
          "placeholder": "",
          "position": {
            "x": 9893300,
            "y": 4129084,
            "w": 1079500,
            "h": 923330
          },
          "paragraphs": [
            {
              "text": "This is\nSQL by\na novice",
              "level": 0,
              "bullet": false
            }
          ]
        }
      ]
    },
    "97": {
      "number": 97,
      "title": "Group-by v.s. Nested Query",
      "elements": [
        {
          "kind": "code",
          "name": "Rectangle 3",
          "placeholder": "body",
          "position": {
            "x": 0,
            "y": 0,
            "w": 0,
            "h": 0
          },
          "paragraphs": [
            {
              "text": "Find all authors who wrote at least 10 documents:",
              "level": 0,
              "bullet": true
            },
            {
              "text": "Attempt 2: SQL style (with GROUP BY)",
              "level": 0,
              "bullet": true
            }
          ]
        },
        {
          "kind": "code",
          "name": "Text Box 4",
          "placeholder": "",
          "position": {
            "x": 838200,
            "y": 3161320,
            "w": 6692858,
            "h": 1938992
          },
          "paragraphs": [
            {
              "text": "SELECT   Author.name",
              "level": 0,
              "bullet": false
            },
            {
              "text": "FROM     Author, Wrote",
              "level": 0,
              "bullet": false
            },
            {
              "text": "WHERE    Author.login = Wrote.login",
              "level": 0,
              "bullet": false
            },
            {
              "text": "GROUP BY Author.name",
              "level": 0,
              "bullet": false
            },
            {
              "text": "HAVING   COUNT(Wrote.url) > 10",
              "level": 0,
              "bullet": false
            }
          ]
        },
        {
          "kind": "text",
          "name": "Rectangle 1",
          "placeholder": "",
          "position": {
            "x": 8674079,
            "y": 3190036,
            "w": 1536700,
            "h": 923330
          },
          "paragraphs": [
            {
              "text": "This is\nSQL  by\nan expert",
              "level": 0,
              "bullet": false
            }
          ]
        },
        {
          "kind": "code",
          "name": "Text Box 6",
          "placeholder": "",
          "position": {
            "x": 784788,
            "y": 5509071,
            "w": 6746270,
            "h": 461665
          },
          "paragraphs": [
            {
              "text": "No need for DISTINCT: automatically from GROUP BY",
              "level": 0,
              "bullet": false
            }
          ]
        }
      ]
    },
    "98": {
      "number": 98,
      "title": "Group-by v.s. Nested Query",
      "elements": [
        {
          "kind": "code",
          "name": "Rectangle 3",
          "placeholder": "body",
          "position": {
            "x": 0,
            "y": 0,
            "w": 0,
            "h": 0
          },
          "paragraphs": [
            {
              "text": "Find all authors who wrote at least 10 documents:",
              "level": 0,
              "bullet": true
            },
            {
              "text": "Attempt 2: SQL style (with GROUP BY)",
              "level": 0,
              "bullet": true
            }
          ]
        },
        {
          "kind": "code",
          "name": "Text Box 4",
          "placeholder": "",
          "position": {
            "x": 838200,
            "y": 3161320,
            "w": 9834744,
            "h": 1569660
          },
          "paragraphs": [
            {
              "text": "SELECT   Author.name",
              "level": 0,
              "bullet": false
            },
            {
              "text": "FROM     Author",
              "level": 0,
              "bullet": false
            },
            {
              "text": "WHERE   login in (SELECT login FROM wrote",
              "level": 0,
              "bullet": false
            },
            {
              "text": "GROUP BY login HAVING count(*)>10)",
              "level": 0,
              "bullet": false
            }
          ]
        }
      ]
    },
    "99": {
      "number": 99,
      "title": "Group-by vs. Nested Query",
      "elements": [
        {
          "kind": "code",
          "name": "Content Placeholder 2",
          "placeholder": "body",
          "position": {
            "x": 0,
            "y": 0,
            "w": 0,
            "h": 0
          },
          "paragraphs": [
            {
              "text": "Which way is more efficient?",
              "level": 0,
              "bullet": true
            },
            {
              "text": "Attempt #1- With nested: How many times do we do a SFW query over all of the Wrote relations?",
              "level": 0,
              "bullet": true
            },
            {
              "text": "Attempt #2- With group-by: How about when written this way?",
              "level": 0,
              "bullet": true
            }
          ]
        },
        {
          "kind": "code",
          "name": "TextBox 3",
          "placeholder": "",
          "position": {
            "x": 3121275,
            "y": 5801380,
            "w": 6600525,
            "h": 523220
          },
          "paragraphs": [
            {
              "text": "With GROUP BY can be much more efficient!",
              "level": 0,
              "bullet": false
            }
          ]
        }
      ]
    },
    "100": {
      "number": 100,
      "title": "3. Advanced SQL-izing",
      "elements": []
    },
    "101": {
      "number": 101,
      "title": "Quantifiers",
      "elements": [
        {
          "kind": "text",
          "name": "Rectangle 3",
          "placeholder": "",
          "position": {
            "x": 838200,
            "y": 1688069,
            "w": 5577168,
            "h": 830997
          },
          "paragraphs": [
            {
              "text": "Product(name, price, company)",
              "level": 0,
              "bullet": false
            },
            {
              "text": "Company(name, city)",
              "level": 0,
              "bullet": false
            }
          ]
        },
        {
          "kind": "text",
          "name": "Text Box 4",
          "placeholder": "",
          "position": {
            "x": 8610026,
            "y": 3054200,
            "w": 2743774,
            "h": 1575620
          },
          "paragraphs": [
            {
              "text": "Find all companies that make some products with price < 100",
              "level": 0,
              "bullet": false
            }
          ]
        },
        {
          "kind": "code",
          "name": "Rectangle 5",
          "placeholder": "",
          "position": {
            "x": 838200,
            "y": 3131046,
            "w": 7149985,
            "h": 1421928
          },
          "paragraphs": [
            {
              "text": "SELECT DISTINCT Company.name",
              "level": 0,
              "bullet": false
            },
            {
              "text": "FROM   Company, Product",
              "level": 0,
              "bullet": false
            },
            {
              "text": "WHERE  Company.name = Product.company",
              "level": 0,
              "bullet": false
            },
            {
              "text": "AND Product.price < 100",
              "level": 0,
              "bullet": false
            }
          ]
        },
        {
          "kind": "text",
          "name": "TextBox 1",
          "placeholder": "",
          "position": {
            "x": 838200,
            "y": 5050654,
            "w": 3695700,
            "h": 1200329
          },
          "paragraphs": [
            {
              "text": "An existential quantifier is a logical quantifier (roughly) of the form “there exists”",
              "level": 0,
              "bullet": false
            }
          ]
        },
        {
          "kind": "text",
          "name": "Text Box 6",
          "placeholder": "",
          "position": {
            "x": 6511926,
            "y": 5419985,
            "w": 2747417,
            "h": 461665
          },
          "paragraphs": [
            {
              "text": "Existential: easy  ! ",
              "level": 0,
              "bullet": false
            }
          ]
        }
      ]
    },
    "102": {
      "number": 102,
      "title": "Quantifiers",
      "elements": [
        {
          "kind": "code",
          "name": "Text Box 4",
          "placeholder": "",
          "position": {
            "x": 8610026,
            "y": 1454717,
            "w": 2743774,
            "h": 1200329
          },
          "paragraphs": [
            {
              "text": "Find all companies with products all having price < 100",
              "level": 0,
              "bullet": false
            }
          ]
        },
        {
          "kind": "text",
          "name": "Rectangle 3",
          "placeholder": "",
          "position": {
            "x": 838200,
            "y": 1688069,
            "w": 5577168,
            "h": 830997
          },
          "paragraphs": [
            {
              "text": "Product(name, price, company)",
              "level": 0,
              "bullet": false
            },
            {
              "text": "Company(name, city)",
              "level": 0,
              "bullet": false
            }
          ]
        },
        {
          "kind": "text",
          "name": "TextBox 3",
          "placeholder": "",
          "position": {
            "x": 10210010,
            "y": 3056015,
            "w": 1166858,
            "h": 369332
          },
          "paragraphs": [
            {
              "text": "Equivalent",
              "level": 0,
              "bullet": false
            }
          ]
        },
        {
          "kind": "code",
          "name": "Rectangle 5",
          "placeholder": "",
          "position": {
            "x": 838200,
            "y": 3155025,
            "w": 7149985,
            "h": 1754326
          },
          "paragraphs": [
            {
              "text": "SELECT DISTINCT Company.cname",
              "level": 0,
              "bullet": false
            },
            {
              "text": "FROM   Company",
              "level": 0,
              "bullet": false
            },
            {
              "text": "WHERE  Company.name NOT IN(",
              "level": 0,
              "bullet": false
            },
            {
              "text": "SELECT Product.company",
              "level": 0,
              "bullet": false
            },
            {
              "text": "FROM Product.price >= 100)",
              "level": 0,
              "bullet": false
            }
          ]
        },
        {
          "kind": "text",
          "name": "Text Box 4",
          "placeholder": "",
          "position": {
            "x": 8610026,
            "y": 3669194,
            "w": 2743774,
            "h": 1569660
          },
          "paragraphs": [
            {
              "text": "Find all companies that make only products with price < 100",
              "level": 0,
              "bullet": false
            }
          ]
        },
        {
          "kind": "text",
          "name": "TextBox 1",
          "placeholder": "",
          "position": {
            "x": 838200,
            "y": 5309307,
            "w": 3695700,
            "h": 830997
          },
          "paragraphs": [
            {
              "text": "A universal quantifier is of the form “for all”",
              "level": 0,
              "bullet": false
            }
          ]
        },
        {
          "kind": "text",
          "name": "Text Box 5",
          "placeholder": "",
          "position": {
            "x": 6339053,
            "y": 5652838,
            "w": 2650936,
            "h": 461665
          },
          "paragraphs": [
            {
              "text": "Universal: hard !  ",
              "level": 0,
              "bullet": false
            }
          ]
        }
      ]
    },
    "103": {
      "number": 103,
      "title": "NULLS in SQL",
      "elements": [
        {
          "kind": "code",
          "name": "Rectangle 3",
          "placeholder": "body",
          "position": {
            "x": 838200,
            "y": 1600200,
            "w": 10515600,
            "h": 5003800
          },
          "paragraphs": [
            {
              "text": "Whenever we don’t have a value, we can put a NULL",
              "level": 0,
              "bullet": true
            },
            {
              "text": "Can mean many things:",
              "level": 0,
              "bullet": true
            },
            {
              "text": "Value does not exists",
              "level": 1,
              "bullet": true
            },
            {
              "text": "Value exists but is unknown",
              "level": 1,
              "bullet": true
            },
            {
              "text": "Value not applicable",
              "level": 1,
              "bullet": true
            },
            {
              "text": "Etc.",
              "level": 1,
              "bullet": true
            },
            {
              "text": "The schema specifies for each attribute if can be null (nullable attribute) or not",
              "level": 0,
              "bullet": true
            },
            {
              "text": "How does SQL cope with tables that have NULLs?",
              "level": 0,
              "bullet": true
            }
          ]
        }
      ]
    },
    "104": {
      "number": 104,
      "title": "Null Values",
      "elements": [
        {
          "kind": "text",
          "name": "Rectangle 3",
          "placeholder": "body",
          "position": {
            "x": 0,
            "y": 0,
            "w": 0,
            "h": 0
          },
          "paragraphs": [
            {
              "text": "For numerical operations, NULL -> NULL:",
              "level": 0,
              "bullet": true
            },
            {
              "text": "If x = NULL then 4*(3-x)/7 is still NULL",
              "level": 1,
              "bullet": true
            },
            {
              "text": "For boolean operations, in SQL there are three values:",
              "level": 0,
              "bullet": true
            },
            {
              "text": "FALSE             = \t0",
              "level": 1,
              "bullet": true
            },
            {
              "text": "UNKNOWN    = \t0.5",
              "level": 1,
              "bullet": true
            },
            {
              "text": "TRUE               = \t1",
              "level": 1,
              "bullet": true
            },
            {
              "text": "If x= NULL then x=“Joe” is UNKNOWN",
              "level": 1,
              "bullet": true
            }
          ]
        }
      ]
    },
    "105": {
      "number": 105,
      "title": "Null Values",
      "elements": [
        {
          "kind": "text",
          "name": "Rectangle 3",
          "placeholder": "body",
          "position": {
            "x": 838200,
            "y": 1793054,
            "w": 7772400,
            "h": 3327400
          },
          "paragraphs": [
            {
              "text": "C1 AND C2   =  min(C1, C2)",
              "level": 0,
              "bullet": true
            },
            {
              "text": "C1  OR   C2   =  max(C1, C2)",
              "level": 0,
              "bullet": true
            },
            {
              "text": "NOT C1         =  1 – C1",
              "level": 0,
              "bullet": true
            }
          ]
        },
        {
          "kind": "code",
          "name": "Rectangle 4",
          "placeholder": "",
          "position": {
            "x": 2286000,
            "y": 3581401,
            "w": 6692858,
            "h": 1421928
          },
          "paragraphs": [
            {
              "text": "SELECT *",
              "level": 0,
              "bullet": false
            },
            {
              "text": "FROM   Person",
              "level": 0,
              "bullet": false
            },
            {
              "text": "WHERE (age < 25)",
              "level": 0,
              "bullet": false
            },
            {
              "text": "AND (height > 6 AND weight > 190)",
              "level": 0,
              "bullet": false
            }
          ]
        },
        {
          "kind": "text",
          "name": "Text Box 5",
          "placeholder": "",
          "position": {
            "x": 9299538,
            "y": 3679890,
            "w": 1975477,
            "h": 1323439
          },
          "paragraphs": [
            {
              "text": "Won’t return e.g.\n(age=20\nheight=NULL\nweight=200)!",
              "level": 0,
              "bullet": false
            }
          ]
        },
        {
          "kind": "text",
          "name": "Rectangle 1",
          "placeholder": "",
          "position": {
            "x": 2544660,
            "y": 5708134,
            "w": 6625981,
            "h": 461665
          },
          "paragraphs": [
            {
              "text": "Rule in SQL: include only tuples that yield TRUE (1.0)",
              "level": 0,
              "bullet": false
            }
          ]
        }
      ]
    },
    "106": {
      "number": 106,
      "title": "Null Values",
      "elements": [
        {
          "kind": "text",
          "name": "Rectangle 3",
          "placeholder": "body",
          "position": {
            "x": 838200,
            "y": 1793054,
            "w": 7772400,
            "h": 2463800
          },
          "paragraphs": [
            {
              "text": "Unexpected behavior:",
              "level": 0,
              "bullet": true
            }
          ]
        },
        {
          "kind": "code",
          "name": "Rectangle 4",
          "placeholder": "",
          "position": {
            "x": 2209800,
            "y": 2823189,
            "w": 5391219,
            "h": 1200329
          },
          "paragraphs": [
            {
              "text": "SELECT *",
              "level": 0,
              "bullet": false
            },
            {
              "text": "FROM   Person",
              "level": 0,
              "bullet": false
            },
            {
              "text": "WHERE  age < 25 OR age >= 25",
              "level": 0,
              "bullet": false
            }
          ]
        },
        {
          "kind": "text",
          "name": "Rectangle 1",
          "placeholder": "",
          "position": {
            "x": 2822434,
            "y": 4591988,
            "w": 4165949,
            "h": 461665
          },
          "paragraphs": [
            {
              "text": "Some Persons are not included !",
              "level": 0,
              "bullet": false
            }
          ]
        }
      ]
    },
    "107": {
      "number": 107,
      "title": "Null Values",
      "elements": [
        {
          "kind": "text",
          "name": "Rectangle 3",
          "placeholder": "body",
          "position": {
            "x": 838200,
            "y": 1793054,
            "w": 8229600,
            "h": 2575746
          },
          "paragraphs": [
            {
              "text": "Can test for NULL explicitly:",
              "level": 0,
              "bullet": true
            },
            {
              "text": "x IS NULL",
              "level": 1,
              "bullet": true
            },
            {
              "text": "x IS NOT NULL",
              "level": 1,
              "bullet": true
            }
          ]
        },
        {
          "kind": "code",
          "name": "Rectangle 4",
          "placeholder": "",
          "position": {
            "x": 2133600,
            "y": 3505201,
            "w": 5577168,
            "h": 1421928
          },
          "paragraphs": [
            {
              "text": "SELECT *",
              "level": 0,
              "bullet": false
            },
            {
              "text": "FROM   Person",
              "level": 0,
              "bullet": false
            },
            {
              "text": "WHERE  age < 25 OR age >= 25",
              "level": 0,
              "bullet": false
            },
            {
              "text": "OR age IS NULL",
              "level": 0,
              "bullet": false
            }
          ]
        },
        {
          "kind": "text",
          "name": "Rectangle 1",
          "placeholder": "",
          "position": {
            "x": 3143043,
            "y": 5656215,
            "w": 3558282,
            "h": 424732
          },
          "paragraphs": [
            {
              "text": "Now it includes all Persons!",
              "level": 0,
              "bullet": false
            }
          ]
        }
      ]
    },
    "108": {
      "number": 108,
      "title": "NULL safety checklist",
      "elements": [
        {
          "kind": "code",
          "name": "Content Placeholder 2",
          "placeholder": "body",
          "position": {
            "x": 838199,
            "y": 1825625,
            "w": 7239000,
            "h": 3660775
          },
          "paragraphs": [
            {
              "text": "Compare with IS NULL or IS NOT NULL - never = NULL.",
              "level": 0,
              "bullet": true
            },
            {
              "text": "Remember UNKNOWN: WHERE retains only rows whose predicate is TRUE.",
              "level": 0,
              "bullet": true
            },
            {
              "text": "Audit NOT IN: one NULL in the subquery can make every comparison UNKNOWN.",
              "level": 0,
              "bullet": true
            },
            {
              "text": "Expect NULLs from the unmatched side of an outer join.",
              "level": 0,
              "bullet": true
            }
          ]
        },
        {
          "kind": "text",
          "name": "TextBox 6",
          "placeholder": "",
          "position": {
            "x": 8395447,
            "y": 2457637,
            "w": 3572966,
            "h": 830997
          },
          "paragraphs": [
            {
              "text": "TRUE / FALSE",
              "level": 0,
              "bullet": false
            },
            {
              "text": "/ UNKNOWN",
              "level": 0,
              "bullet": false
            }
          ]
        },
        {
          "kind": "text",
          "name": "TextBox 5",
          "placeholder": "",
          "position": {
            "x": 1766047,
            "y": 5699909,
            "w": 8659906,
            "h": 954107
          },
          "paragraphs": [
            {
              "text": "When NULL is possible, write the three-valued logic explicitly.",
              "level": 0,
              "bullet": false
            }
          ]
        }
      ]
    },
    "109": {
      "number": 109,
      "title": "RECAP: Inner Joins",
      "elements": [
        {
          "kind": "text",
          "name": "Rectangle 3",
          "placeholder": "body",
          "position": {
            "x": 838200,
            "y": 1666876,
            "w": 8686800,
            "h": 4114800
          },
          "paragraphs": [
            {
              "text": "By default, joins in SQL are “inner joins”:",
              "level": 0,
              "bullet": true
            }
          ]
        },
        {
          "kind": "text",
          "name": "Rectangle 1",
          "placeholder": "",
          "position": {
            "x": 838200,
            "y": 2245855,
            "w": 4073294,
            "h": 646331
          },
          "paragraphs": [
            {
              "text": "Product(name, category)",
              "level": 0,
              "bullet": false
            },
            {
              "text": "Purchase(prodName, store)",
              "level": 0,
              "bullet": false
            }
          ]
        },
        {
          "kind": "code",
          "name": "Rectangle 4",
          "placeholder": "",
          "position": {
            "x": 838200,
            "y": 3166591,
            "w": 8032968,
            "h": 1046440
          },
          "paragraphs": [
            {
              "text": "SELECT Product.name, Purchase.store",
              "level": 0,
              "bullet": false
            },
            {
              "text": "FROM   Product",
              "level": 0,
              "bullet": false
            },
            {
              "text": "JOIN Purchase ON Product.name = Purchase.prodName",
              "level": 0,
              "bullet": false
            }
          ]
        },
        {
          "kind": "text",
          "name": "TextBox 3",
          "placeholder": "",
          "position": {
            "x": 9726791,
            "y": 4237484,
            "w": 1943161,
            "h": 646331
          },
          "paragraphs": [
            {
              "text": "Both equivalent:",
              "level": 0,
              "bullet": false
            },
            {
              "text": "Both INNER JOINS!",
              "level": 0,
              "bullet": false
            }
          ]
        },
        {
          "kind": "code",
          "name": "Rectangle 5",
          "placeholder": "",
          "position": {
            "x": 838200,
            "y": 4539602,
            "w": 6186309,
            "h": 1046440
          },
          "paragraphs": [
            {
              "text": "SELECT Product.name, Purchase.store",
              "level": 0,
              "bullet": false
            },
            {
              "text": "FROM   Product, Purchase",
              "level": 0,
              "bullet": false
            },
            {
              "text": "WHERE  Product.name = Purchase.prodName",
              "level": 0,
              "bullet": false
            }
          ]
        }
      ]
    },
    "110": {
      "number": 110,
      "title": "Inner Joins + NULLS = Lost data?",
      "elements": [
        {
          "kind": "text",
          "name": "Rectangle 3",
          "placeholder": "body",
          "position": {
            "x": 838200,
            "y": 1666876,
            "w": 8686800,
            "h": 4114800
          },
          "paragraphs": [
            {
              "text": "By default, joins in SQL are “inner joins”:",
              "level": 0,
              "bullet": true
            }
          ]
        },
        {
          "kind": "text",
          "name": "Rectangle 14",
          "placeholder": "",
          "position": {
            "x": 838200,
            "y": 2245855,
            "w": 4073294,
            "h": 646331
          },
          "paragraphs": [
            {
              "text": "Product(name, category)",
              "level": 0,
              "bullet": false
            },
            {
              "text": "Purchase(prodName, store)",
              "level": 0,
              "bullet": false
            }
          ]
        },
        {
          "kind": "code",
          "name": "Rectangle 4",
          "placeholder": "",
          "position": {
            "x": 838200,
            "y": 3166591,
            "w": 8032968,
            "h": 1046440
          },
          "paragraphs": [
            {
              "text": "SELECT Product.name, Purchase.store",
              "level": 0,
              "bullet": false
            },
            {
              "text": "FROM   Product",
              "level": 0,
              "bullet": false
            },
            {
              "text": "JOIN Purchase ON Product.name = Purchase.prodName",
              "level": 0,
              "bullet": false
            }
          ]
        },
        {
          "kind": "code",
          "name": "Rectangle 5",
          "placeholder": "",
          "position": {
            "x": 838200,
            "y": 4539602,
            "w": 6186309,
            "h": 1046440
          },
          "paragraphs": [
            {
              "text": "SELECT Product.name, Purchase.store",
              "level": 0,
              "bullet": false
            },
            {
              "text": "FROM   Product, Purchase",
              "level": 0,
              "bullet": false
            },
            {
              "text": "WHERE  Product.name = Purchase.prodName",
              "level": 0,
              "bullet": false
            }
          ]
        },
        {
          "kind": "text",
          "name": "Rectangle 7",
          "placeholder": "",
          "position": {
            "x": 1527794,
            "y": 5910103,
            "w": 9024225,
            "h": 430887
          },
          "paragraphs": [
            {
              "text": "However: Products that never sold (with no Purchase tuple) will be lost!",
              "level": 0,
              "bullet": false
            }
          ]
        }
      ]
    },
    "111": {
      "number": 111,
      "title": "Outer Joins",
      "elements": [
        {
          "kind": "text",
          "name": "Rectangle 7",
          "placeholder": "",
          "position": {
            "x": 4369810,
            "y": 323971,
            "w": 7632089,
            "h": 313932
          },
          "paragraphs": [
            {
              "text": "https://teachingow.github.io/DBMS-SQL-Labs/labs/aggregation/aggregation-grouping.html",
              "level": 0,
              "bullet": false
            }
          ]
        },
        {
          "kind": "code",
          "name": "Rectangle 3",
          "placeholder": "body",
          "position": {
            "x": 838200,
            "y": 1828800,
            "w": 9601200,
            "h": 4114800
          },
          "paragraphs": [
            {
              "text": "An outer join returns tuples from the joined relations that don’t have a corresponding tuple in the other relations",
              "level": 0,
              "bullet": true
            },
            {
              "text": "I.e. If we join relations A and B on a.X = b.X, and there is an entry in A with X=5, but none in B with X=5…",
              "level": 1,
              "bullet": true
            },
            {
              "text": "A LEFT OUTER JOIN will return a tuple (a, NULL)!",
              "level": 2,
              "bullet": true
            },
            {
              "text": "Left outer joins in SQL:",
              "level": 0,
              "bullet": true
            }
          ]
        },
        {
          "kind": "code",
          "name": "Rectangle 4",
          "placeholder": "",
          "position": {
            "x": 4851400,
            "y": 4072483,
            "w": 6032421,
            "h": 1384995
          },
          "paragraphs": [
            {
              "text": "SELECT Product.name, Purchase.store",
              "level": 0,
              "bullet": false
            },
            {
              "text": "FROM   Product",
              "level": 0,
              "bullet": false
            },
            {
              "text": "LEFT OUTER JOIN Purchase ON",
              "level": 0,
              "bullet": false
            },
            {
              "text": "Product.name = Purchase.prodName",
              "level": 0,
              "bullet": false
            }
          ]
        },
        {
          "kind": "text",
          "name": "Rectangle 7",
          "placeholder": "",
          "position": {
            "x": 3210017,
            "y": 5937609,
            "w": 5771965,
            "h": 424732
          },
          "paragraphs": [
            {
              "text": "Now we’ll get products even if they didn’t sell",
              "level": 0,
              "bullet": false
            }
          ]
        }
      ]
    },
    "112": {
      "number": 112,
      "title": "INNER JOIN:",
      "elements": [
        {
          "kind": "text",
          "name": "Rectangle 56",
          "placeholder": "",
          "position": {
            "x": 1981201,
            "y": 1295401,
            "w": 1163973,
            "h": 461665
          },
          "paragraphs": [
            {
              "text": "Product",
              "level": 0,
              "bullet": false
            }
          ]
        },
        {
          "kind": "text",
          "name": "Rectangle 57",
          "placeholder": "",
          "position": {
            "x": 6553200,
            "y": 1295401,
            "w": 1321708,
            "h": 461665
          },
          "paragraphs": [
            {
              "text": "Purchase",
              "level": 0,
              "bullet": false
            }
          ]
        },
        {
          "kind": "table",
          "name": "Group 2",
          "position": {
            "x": 1981200,
            "y": 1828800,
            "w": 3048000,
            "h": 2032000
          },
          "rows": [
            [
              "name",
              "category"
            ],
            [
              "Gizmo",
              "gadget"
            ],
            [
              "Camera",
              "Photo"
            ],
            [
              "OneClick",
              "Photo"
            ]
          ]
        },
        {
          "kind": "table",
          "name": "Group 19",
          "position": {
            "x": 6553200,
            "y": 1828800,
            "w": 3048000,
            "h": 2032000
          },
          "rows": [
            [
              "prodName",
              "store"
            ],
            [
              "Gizmo",
              "Wiz"
            ],
            [
              "Camera",
              "Ritz"
            ],
            [
              "Camera",
              "Wiz"
            ]
          ]
        },
        {
          "kind": "table",
          "name": "Group 36",
          "position": {
            "x": 7620000,
            "y": 4181475,
            "w": 3048000,
            "h": 2032000
          },
          "rows": [
            [
              "name",
              "store"
            ],
            [
              "Gizmo",
              "Wiz"
            ],
            [
              "Camera",
              "Ritz"
            ],
            [
              "Camera",
              "Wiz"
            ]
          ]
        },
        {
          "kind": "code",
          "name": "Rectangle 4",
          "placeholder": "",
          "position": {
            "x": 564060,
            "y": 4478277,
            "w": 5989140,
            "h": 1255728
          },
          "paragraphs": [
            {
              "text": "SELECT Product.name, Purchase.store",
              "level": 0,
              "bullet": false
            },
            {
              "text": "FROM   Product",
              "level": 0,
              "bullet": false
            },
            {
              "text": "INNER JOIN Purchase",
              "level": 0,
              "bullet": false
            },
            {
              "text": "ON Product.name = Purchase.prodName",
              "level": 0,
              "bullet": false
            }
          ]
        },
        {
          "kind": "text",
          "name": "TextBox 1",
          "placeholder": "",
          "position": {
            "x": 564060,
            "y": 5929458,
            "w": 4122240,
            "h": 584775
          },
          "paragraphs": [
            {
              "text": "Note: another equivalent way to write an INNER JOIN!",
              "level": 0,
              "bullet": false
            }
          ]
        }
      ]
    },
    "113": {
      "number": 113,
      "title": "LEFT OUTER JOIN:",
      "elements": [
        {
          "kind": "text",
          "name": "Rectangle 56",
          "placeholder": "",
          "position": {
            "x": 1981201,
            "y": 1295401,
            "w": 1163973,
            "h": 461665
          },
          "paragraphs": [
            {
              "text": "Product",
              "level": 0,
              "bullet": false
            }
          ]
        },
        {
          "kind": "text",
          "name": "Rectangle 57",
          "placeholder": "",
          "position": {
            "x": 6553200,
            "y": 1295401,
            "w": 1321708,
            "h": 461665
          },
          "paragraphs": [
            {
              "text": "Purchase",
              "level": 0,
              "bullet": false
            }
          ]
        },
        {
          "kind": "table",
          "name": "Group 2",
          "position": {
            "x": 1981200,
            "y": 1828800,
            "w": 3048000,
            "h": 2032000
          },
          "rows": [
            [
              "name",
              "category"
            ],
            [
              "Gizmo",
              "gadget"
            ],
            [
              "Camera",
              "Photo"
            ],
            [
              "OneClick",
              "Photo"
            ]
          ]
        },
        {
          "kind": "table",
          "name": "Group 19",
          "position": {
            "x": 6553200,
            "y": 1828800,
            "w": 3048000,
            "h": 2032000
          },
          "rows": [
            [
              "prodName",
              "store"
            ],
            [
              "Gizmo",
              "Wiz"
            ],
            [
              "Camera",
              "Ritz"
            ],
            [
              "Camera",
              "Wiz"
            ]
          ]
        },
        {
          "kind": "table",
          "name": "Group 36",
          "position": {
            "x": 7620000,
            "y": 4181475,
            "w": 3048000,
            "h": 2540000
          },
          "rows": [
            [
              "name",
              "store"
            ],
            [
              "Gizmo",
              "Wiz"
            ],
            [
              "Camera",
              "Ritz"
            ],
            [
              "Camera",
              "Wiz"
            ],
            [
              "OneClick",
              "NULL"
            ]
          ]
        },
        {
          "kind": "code",
          "name": "Rectangle 4",
          "placeholder": "",
          "position": {
            "x": 564060,
            "y": 4798977,
            "w": 5989140,
            "h": 1255728
          },
          "paragraphs": [
            {
              "text": "SELECT Product.name, Purchase.store",
              "level": 0,
              "bullet": false
            },
            {
              "text": "FROM   Product",
              "level": 0,
              "bullet": false
            },
            {
              "text": "LEFT OUTER JOIN Purchase",
              "level": 0,
              "bullet": false
            },
            {
              "text": "ON Product.name = Purchase.prodName",
              "level": 0,
              "bullet": false
            }
          ]
        }
      ]
    },
    "114": {
      "number": 114,
      "title": "Other Outer Joins",
      "elements": [
        {
          "kind": "code",
          "name": "Rectangle 3",
          "placeholder": "body",
          "position": {
            "x": 0,
            "y": 0,
            "w": 0,
            "h": 0
          },
          "paragraphs": [
            {
              "text": "Left outer join:",
              "level": 0,
              "bullet": true
            },
            {
              "text": "Include the left tuple even if there’s no match",
              "level": 1,
              "bullet": true
            },
            {
              "text": "Right outer join:",
              "level": 0,
              "bullet": true
            },
            {
              "text": "Include the right tuple even if there’s no match",
              "level": 1,
              "bullet": true
            },
            {
              "text": "Full outer join:",
              "level": 0,
              "bullet": true
            },
            {
              "text": "Include the both left and right tuples even if there’s no match",
              "level": 1,
              "bullet": true
            }
          ]
        }
      ]
    },
    "115": {
      "number": 115,
      "title": "An Unintuitive Query",
      "elements": [
        {
          "kind": "code",
          "name": "Text Box 3",
          "placeholder": "",
          "position": {
            "x": 3606432,
            "y": 1935869,
            "w": 4833374,
            "h": 1200329
          },
          "paragraphs": [
            {
              "text": "SELECT DISTINCT R.A",
              "level": 0,
              "bullet": false
            },
            {
              "text": "FROM   R, S, T",
              "level": 0,
              "bullet": false
            },
            {
              "text": "WHERE  R.A=S.A OR R.A=T.A",
              "level": 0,
              "bullet": false
            }
          ]
        },
        {
          "kind": "text",
          "name": "Rectangle 10",
          "placeholder": "",
          "position": {
            "x": 4437063,
            "y": 3655425,
            "w": 3172112,
            "h": 461665
          },
          "paragraphs": [
            {
              "text": "What does it compute?",
              "level": 0,
              "bullet": false
            }
          ]
        }
      ]
    },
    "116": {
      "number": 116,
      "title": "An Unintuitive Query",
      "elements": [
        {
          "kind": "text",
          "name": "TextBox 7",
          "placeholder": "",
          "position": {
            "x": 3248526,
            "y": 301063,
            "w": 8258351,
            "h": 369332
          },
          "paragraphs": [
            {
              "text": "https://teachingow.github.io/DBMS-SQL-Labs/labs/joins-foreign-keys/joins-part1.html",
              "level": 0,
              "bullet": false
            }
          ]
        },
        {
          "kind": "code",
          "name": "Text Box 3",
          "placeholder": "",
          "position": {
            "x": 3606432,
            "y": 1935869,
            "w": 4833374,
            "h": 1200329
          },
          "paragraphs": [
            {
              "text": "SELECT DISTINCT R.A",
              "level": 0,
              "bullet": false
            },
            {
              "text": "FROM   R, S, T",
              "level": 0,
              "bullet": false
            },
            {
              "text": "WHERE  R.A=S.A OR R.A=T.A",
              "level": 0,
              "bullet": false
            }
          ]
        },
        {
          "kind": "text",
          "name": "Oval 13",
          "placeholder": "",
          "position": {
            "x": 4870312,
            "y": 3636168,
            "w": 1381688,
            "h": 1381688
          },
          "paragraphs": [
            {
              "text": "S",
              "level": 0,
              "bullet": false
            }
          ]
        },
        {
          "kind": "text",
          "name": "Oval 14",
          "placeholder": "",
          "position": {
            "x": 5794238,
            "y": 3636168,
            "w": 1381688,
            "h": 1381688
          },
          "paragraphs": [
            {
              "text": "T",
              "level": 0,
              "bullet": false
            }
          ]
        },
        {
          "kind": "text",
          "name": "Oval 16",
          "placeholder": "",
          "position": {
            "x": 5332275,
            "y": 4382617,
            "w": 1381688,
            "h": 1381688
          },
          "paragraphs": [
            {
              "text": "R",
              "level": 0,
              "bullet": false
            }
          ]
        },
        {
          "kind": "text",
          "name": "Rectangle 8",
          "placeholder": "",
          "position": {
            "x": 7629402,
            "y": 4729648,
            "w": 2359240,
            "h": 461665
          },
          "paragraphs": [
            {
              "text": "But what if S = f?",
              "level": 0,
              "bullet": false
            }
          ]
        },
        {
          "kind": "text",
          "name": "Rectangle 7",
          "placeholder": "",
          "position": {
            "x": 1841362,
            "y": 5517826,
            "w": 3028950,
            "h": 457200
          },
          "paragraphs": [
            {
              "text": "Computes R Ç (S È T)",
              "level": 0,
              "bullet": false
            }
          ]
        },
        {
          "kind": "text",
          "name": "TextBox 18",
          "placeholder": "",
          "position": {
            "x": 7629402,
            "y": 5517826,
            "w": 2858668,
            "h": 400110
          },
          "paragraphs": [
            {
              "text": "Go back to the semantics!",
              "level": 0,
              "bullet": false
            }
          ]
        }
      ]
    },
    "117": {
      "number": 117,
      "title": "An Unintuitive Query",
      "elements": [
        {
          "kind": "code",
          "name": "Text Box 3",
          "placeholder": "",
          "position": {
            "x": 3606432,
            "y": 1935869,
            "w": 4833374,
            "h": 1200329
          },
          "paragraphs": [
            {
              "text": "SELECT DISTINCT R.A",
              "level": 0,
              "bullet": false
            },
            {
              "text": "FROM   R, S, T",
              "level": 0,
              "bullet": false
            },
            {
              "text": "WHERE  R.A=S.A OR R.A=T.A",
              "level": 0,
              "bullet": false
            }
          ]
        },
        {
          "kind": "text",
          "name": "Content Placeholder 2",
          "placeholder": "",
          "position": {
            "x": 838200,
            "y": 3381379,
            "w": 10782300,
            "h": 2079621
          },
          "paragraphs": [
            {
              "text": "Recall the semantics!",
              "level": 0,
              "bullet": false
            },
            {
              "text": "Take cross-product",
              "level": 1,
              "bullet": true
            },
            {
              "text": "Apply selections / conditions",
              "level": 1,
              "bullet": true
            },
            {
              "text": "Apply projection",
              "level": 1,
              "bullet": true
            },
            {
              "text": "If S = {}, then the cross product of R, S, T = {}, and the query result = {}!",
              "level": 0,
              "bullet": false
            }
          ]
        },
        {
          "kind": "text",
          "name": "TextBox 5",
          "placeholder": "",
          "position": {
            "x": 2181779,
            "y": 5758715,
            "w": 7682680,
            "h": 830997
          },
          "paragraphs": [
            {
              "text": "Must consider semantics here.",
              "level": 0,
              "bullet": false
            },
            {
              "text": "Are there more explicit way to do set operations like this?",
              "level": 0,
              "bullet": false
            }
          ]
        }
      ]
    },
    "118": {
      "number": 118,
      "title": "What does this look like in Python?",
      "elements": [
        {
          "kind": "text",
          "name": "Oval 15",
          "placeholder": "",
          "position": {
            "x": 9314886,
            "y": 1023698,
            "w": 1381688,
            "h": 1381688
          },
          "paragraphs": [
            {
              "text": "S",
              "level": 0,
              "bullet": false
            }
          ]
        },
        {
          "kind": "text",
          "name": "Oval 16",
          "placeholder": "",
          "position": {
            "x": 10238812,
            "y": 1023698,
            "w": 1381688,
            "h": 1381688
          },
          "paragraphs": [
            {
              "text": "T",
              "level": 0,
              "bullet": false
            }
          ]
        },
        {
          "kind": "text",
          "name": "Oval 18",
          "placeholder": "",
          "position": {
            "x": 9776849,
            "y": 1770147,
            "w": 1381688,
            "h": 1381688
          },
          "paragraphs": [
            {
              "text": "R",
              "level": 0,
              "bullet": false
            }
          ]
        },
        {
          "kind": "code",
          "name": "Text Box 3",
          "placeholder": "",
          "position": {
            "x": 760732,
            "y": 1883335,
            "w": 4833374,
            "h": 1200329
          },
          "paragraphs": [
            {
              "text": "SELECT DISTINCT R.A",
              "level": 0,
              "bullet": false
            },
            {
              "text": "FROM   R, S, T",
              "level": 0,
              "bullet": false
            },
            {
              "text": "WHERE  R.A=S.A OR R.A=T.A",
              "level": 0,
              "bullet": false
            }
          ]
        },
        {
          "kind": "text",
          "name": "Rectangle 7",
          "placeholder": "",
          "position": {
            "x": 7447783,
            "y": 2421569,
            "w": 1576072,
            "h": 461665
          },
          "paragraphs": [
            {
              "text": "R Ç (S È T)",
              "level": 0,
              "bullet": false
            }
          ]
        },
        {
          "kind": "text",
          "name": "Content Placeholder 2",
          "placeholder": "",
          "position": {
            "x": 838200,
            "y": 3381379,
            "w": 5408364,
            "h": 3195691
          },
          "paragraphs": [
            {
              "text": "Semantics:",
              "level": 0,
              "bullet": false
            },
            {
              "text": "Take cross-product",
              "level": 1,
              "bullet": true
            },
            {
              "text": "Apply selections / conditions",
              "level": 1,
              "bullet": true
            },
            {
              "text": "Apply projection",
              "level": 1,
              "bullet": true
            }
          ]
        },
        {
          "kind": "text",
          "name": "Rectangle 2",
          "placeholder": "",
          "position": {
            "x": 6023119,
            "y": 3608020,
            "w": 5597381,
            "h": 830997
          },
          "paragraphs": [
            {
              "text": "Joins / cross-products are just nested for loops (in simplest implementation)!",
              "level": 0,
              "bullet": false
            }
          ]
        },
        {
          "kind": "text",
          "name": "Rectangle 12",
          "placeholder": "",
          "position": {
            "x": 6023119,
            "y": 4982316,
            "w": 2587481,
            "h": 461665
          },
          "paragraphs": [
            {
              "text": "If-then statements!",
              "level": 0,
              "bullet": false
            }
          ]
        }
      ]
    },
    "119": {
      "number": 119,
      "title": "What does this look like in Python?",
      "elements": [
        {
          "kind": "text",
          "name": "Oval 15",
          "placeholder": "",
          "position": {
            "x": 9314886,
            "y": 1023698,
            "w": 1381688,
            "h": 1381688
          },
          "paragraphs": [
            {
              "text": "S",
              "level": 0,
              "bullet": false
            }
          ]
        },
        {
          "kind": "text",
          "name": "Oval 16",
          "placeholder": "",
          "position": {
            "x": 10238812,
            "y": 1023698,
            "w": 1381688,
            "h": 1381688
          },
          "paragraphs": [
            {
              "text": "T",
              "level": 0,
              "bullet": false
            }
          ]
        },
        {
          "kind": "text",
          "name": "Oval 18",
          "placeholder": "",
          "position": {
            "x": 9776849,
            "y": 1770147,
            "w": 1381688,
            "h": 1381688
          },
          "paragraphs": [
            {
              "text": "R",
              "level": 0,
              "bullet": false
            }
          ]
        },
        {
          "kind": "code",
          "name": "Text Box 3",
          "placeholder": "",
          "position": {
            "x": 760732,
            "y": 1883335,
            "w": 4833374,
            "h": 1200329
          },
          "paragraphs": [
            {
              "text": "SELECT DISTINCT R.A",
              "level": 0,
              "bullet": false
            },
            {
              "text": "FROM   R, S, T",
              "level": 0,
              "bullet": false
            },
            {
              "text": "WHERE  R.A=S.A OR R.A=T.A",
              "level": 0,
              "bullet": false
            }
          ]
        },
        {
          "kind": "text",
          "name": "Rectangle 7",
          "placeholder": "",
          "position": {
            "x": 7447783,
            "y": 2421569,
            "w": 1576072,
            "h": 461665
          },
          "paragraphs": [
            {
              "text": "R Ç (S È T)",
              "level": 0,
              "bullet": false
            }
          ]
        },
        {
          "kind": "text",
          "name": "Rectangle 21",
          "placeholder": "",
          "position": {
            "x": 838200,
            "y": 3404459,
            "w": 10782300,
            "h": 2554545
          },
          "paragraphs": [
            {
              "text": "output = {}",
              "level": 0,
              "bullet": false
            },
            {
              "text": "for r in R:",
              "level": 0,
              "bullet": false
            },
            {
              "text": "for s in S:",
              "level": 0,
              "bullet": false
            },
            {
              "text": "for t in T:",
              "level": 0,
              "bullet": false
            },
            {
              "text": "if r[‘A’] == s[‘A’] or r[‘A’] == t[‘A’]:",
              "level": 0,
              "bullet": false
            },
            {
              "text": "output.add(r[‘A’])",
              "level": 0,
              "bullet": false
            },
            {
              "text": "return list(output)",
              "level": 0,
              "bullet": false
            }
          ]
        },
        {
          "kind": "text",
          "name": "TextBox 1",
          "placeholder": "",
          "position": {
            "x": 1683099,
            "y": 6279799,
            "w": 5198218,
            "h": 461665
          },
          "paragraphs": [
            {
              "text": "Can you see now what happens if S = []?",
              "level": 0,
              "bullet": false
            }
          ]
        },
        {
          "kind": "text",
          "name": "TextBox 17",
          "placeholder": "",
          "position": {
            "x": 7771557,
            "y": 6279799,
            "w": 2997744,
            "h": 369332
          },
          "paragraphs": [
            {
              "text": "See bonus activity on website!",
              "level": 0,
              "bullet": false
            }
          ]
        }
      ]
    },
    "120": {
      "number": 120,
      "title": "Summary",
      "elements": [
        {
          "kind": "text",
          "name": "Content Placeholder 2",
          "placeholder": "body",
          "position": {
            "x": 1981200,
            "y": 3191070,
            "w": 8229600,
            "h": 1436915
          },
          "paragraphs": [
            {
              "text": "SQL is a rich programming language that handles the way data is processed declaratively",
              "level": 0,
              "bullet": true
            }
          ]
        }
      ]
    },
    "121": {
      "number": 121,
      "title": "Exit ticket: predict before you run",
      "elements": [
        {
          "kind": "text",
          "name": "Content Placeholder 2",
          "placeholder": "body",
          "position": {
            "x": 838199,
            "y": 1825625,
            "w": 7239000,
            "h": 3660775
          },
          "paragraphs": [
            {
              "text": "Predict the output schema.",
              "level": 0,
              "bullet": true
            },
            {
              "text": "Predict the row count, including duplicates.",
              "level": 0,
              "bullet": true
            },
            {
              "text": "Mark where NULL or UNKNOWN can appear.",
              "level": 0,
              "bullet": true
            },
            {
              "text": "Then run the query and explain every difference.",
              "level": 0,
              "bullet": true
            }
          ]
        },
        {
          "kind": "text",
          "name": "TextBox 6",
          "placeholder": "",
          "position": {
            "x": 8395447,
            "y": 2457637,
            "w": 3572966,
            "h": 830997
          },
          "paragraphs": [
            {
              "text": "Schema + rows",
              "level": 0,
              "bullet": false
            },
            {
              "text": "+ multiplicity",
              "level": 0,
              "bullet": false
            }
          ]
        },
        {
          "kind": "text",
          "name": "TextBox 5",
          "placeholder": "",
          "position": {
            "x": 1766047,
            "y": 5699909,
            "w": 8659906,
            "h": 954107
          },
          "paragraphs": [
            {
              "text": "A good SQL habit is to make a falsifiable prediction first.",
              "level": 0,
              "bullet": false
            }
          ]
        }
      ]
    },
    "122": {
      "number": 122,
      "title": "Choose types from the operations you need",
      "elements": [
        {
          "kind": "text",
          "name": "Content Placeholder 2",
          "placeholder": "body",
          "position": {
            "x": 838199,
            "y": 1825625,
            "w": 7239000,
            "h": 3660775
          },
          "paragraphs": [
            {
              "text": "Exact arithmetic: use DECIMAL or NUMERIC for money and fixed-scale quantities.",
              "level": 0,
              "bullet": true
            },
            {
              "text": "Whole-number counting: use INTEGER or BIGINT when values are quantities and arithmetic is meaningful.",
              "level": 0,
              "bullet": true
            },
            {
              "text": "Approximate measurement: use REAL or DOUBLE PRECISION for sensor and scientific values that tolerate rounding.",
              "level": 0,
              "bullet": true
            },
            {
              "text": "Human-readable text: use VARCHAR(n) for a meaningful limit or TEXT for open-ended content.",
              "level": 0,
              "bullet": true
            }
          ]
        },
        {
          "kind": "text",
          "name": "TextBox 6",
          "placeholder": "",
          "position": {
            "x": 8395447,
            "y": 2457637,
            "w": 3572966,
            "h": 830997
          },
          "paragraphs": [
            {
              "text": "Exact, whole,",
              "level": 0,
              "bullet": false
            },
            {
              "text": "approximate, text",
              "level": 0,
              "bullet": false
            }
          ]
        },
        {
          "kind": "text",
          "name": "TextBox 5",
          "placeholder": "",
          "position": {
            "x": 1766047,
            "y": 5699909,
            "w": 8659906,
            "h": 954107
          },
          "paragraphs": [
            {
              "text": "The best type protects the operations that must stay correct.",
              "level": 0,
              "bullet": false
            }
          ]
        }
      ]
    },
    "123": {
      "number": 123,
      "title": "Some numbers are identifiers, not quantities",
      "elements": [
        {
          "kind": "text",
          "name": "Content Placeholder 2",
          "placeholder": "body",
          "position": {
            "x": 838199,
            "y": 1825625,
            "w": 7239000,
            "h": 3660775
          },
          "paragraphs": [
            {
              "text": "Store as text: ZIP codes, phone numbers, SKUs, and student IDs may need leading zeros or formatting.",
              "level": 0,
              "bullet": true
            },
            {
              "text": "Use BOOLEAN for two states: active/inactive or passed/failed; allow NULL only when unknown is a real third state.",
              "level": 0,
              "bullet": true
            },
            {
              "text": "Use DATE for calendar dates: birthdays and due dates do not require a time of day.",
              "level": 0,
              "bullet": true
            },
            {
              "text": "Use TIMESTAMP for instants: decide whether time-zone interpretation must be preserved.",
              "level": 0,
              "bullet": true
            }
          ]
        },
        {
          "kind": "text",
          "name": "TextBox 6",
          "placeholder": "",
          "position": {
            "x": 8395447,
            "y": 2457637,
            "w": 3572966,
            "h": 830997
          },
          "paragraphs": [
            {
              "text": "Meaning determines",
              "level": 0,
              "bullet": false
            },
            {
              "text": "representation",
              "level": 0,
              "bullet": false
            }
          ]
        },
        {
          "kind": "text",
          "name": "TextBox 5",
          "placeholder": "",
          "position": {
            "x": 1766047,
            "y": 5699909,
            "w": 8659906,
            "h": 954107
          },
          "paragraphs": [
            {
              "text": "Ask: will we calculate with it, format it, or place it on a timeline?",
              "level": 0,
              "bullet": false
            }
          ]
        }
      ]
    },
    "124": {
      "number": 124,
      "title": "Checkpoint: defend each type choice",
      "elements": [
        {
          "kind": "text",
          "name": "Content Placeholder 2",
          "placeholder": "body",
          "position": {
            "x": 838199,
            "y": 1825625,
            "w": 7239000,
            "h": 3660775
          },
          "paragraphs": [
            {
              "text": "price = 19.99: DECIMAL(8,2), because totals and tax calculations must be exact.",
              "level": 0,
              "bullet": true
            },
            {
              "text": "zip_code = 00501: VARCHAR(5), because leading zeros matter and arithmetic does not.",
              "level": 0,
              "bullet": true
            },
            {
              "text": "created_at: TIMESTAMP, because events must be sorted and elapsed time may be computed.",
              "level": 0,
              "bullet": true
            },
            {
              "text": "temperature_c = 21.8734: DOUBLE PRECISION, because this is an approximate measurement.",
              "level": 0,
              "bullet": true
            }
          ]
        },
        {
          "kind": "text",
          "name": "TextBox 6",
          "placeholder": "",
          "position": {
            "x": 8395447,
            "y": 2457637,
            "w": 3572966,
            "h": 830997
          },
          "paragraphs": [
            {
              "text": "Type + reason",
              "level": 0,
              "bullet": false
            },
            {
              "text": "+ boundary test",
              "level": 0,
              "bullet": false
            }
          ]
        },
        {
          "kind": "text",
          "name": "TextBox 5",
          "placeholder": "",
          "position": {
            "x": 1766047,
            "y": 5699909,
            "w": 8659906,
            "h": 954107
          },
          "paragraphs": [
            {
              "text": "A defensible answer names the required operation and the failure it prevents.",
              "level": 0,
              "bullet": false
            }
          ]
        }
      ]
    },
    "125": {
      "number": 125,
      "title": "Lab: build an event registration table",
      "elements": [
        {
          "kind": "text",
          "name": "Content Placeholder 2",
          "placeholder": "body",
          "position": {
            "x": 838199,
            "y": 1825625,
            "w": 7239000,
            "h": 3660775
          },
          "paragraphs": [
            {
              "text": "Required fields: registration ID, student ID, ticket price, registration time, accessibility flag, and notes.",
              "level": 0,
              "bullet": true
            },
            {
              "text": "Choose and justify: a type, length or precision, nullability, and useful default for every field.",
              "level": 0,
              "bullet": true
            },
            {
              "text": "Add constraints: primary key, positive-or-zero price, required identifiers, and a defensible rule for the flag.",
              "level": 0,
              "bullet": true
            },
            {
              "text": "Create evidence: insert three rows that test leading zeros, monetary scale, missing values, and date/time validation.",
              "level": 0,
              "bullet": true
            }
          ]
        },
        {
          "kind": "text",
          "name": "TextBox 6",
          "placeholder": "",
          "position": {
            "x": 8395447,
            "y": 2457637,
            "w": 3572966,
            "h": 830997
          },
          "paragraphs": [
            {
              "text": "Scenario is complete",
              "level": 0,
              "bullet": false
            },
            {
              "text": "on this slide",
              "level": 0,
              "bullet": false
            }
          ]
        },
        {
          "kind": "text",
          "name": "TextBox 5",
          "placeholder": "",
          "position": {
            "x": 1766047,
            "y": 5699909,
            "w": 8659906,
            "h": 954107
          },
          "paragraphs": [
            {
              "text": "Do not copy a type list—connect every choice to a use case.",
              "level": 0,
              "bullet": false
            }
          ]
        }
      ]
    },
    "126": {
      "number": 126,
      "title": "Lab workflow and submission checklist",
      "elements": [
        {
          "kind": "text",
          "name": "Content Placeholder 2",
          "placeholder": "body",
          "position": {
            "x": 838199,
            "y": 1825625,
            "w": 7239000,
            "h": 3660775
          },
          "paragraphs": [
            {
              "text": "1. Predict: write the CREATE TABLE statement and predict which boundary tests should pass or fail.",
              "level": 0,
              "bullet": true
            },
            {
              "text": "2. Run: execute the DDL and inserts; capture the successful rows and error messages.",
              "level": 0,
              "bullet": true
            },
            {
              "text": "3. Query: sort by time, total ticket prices, filter the Boolean flag, and search one identifier prefix.",
              "level": 0,
              "bullet": true
            },
            {
              "text": "4. Explain: submit SQL plus a short defense of each type and one revision made after testing.",
              "level": 0,
              "bullet": true
            }
          ]
        },
        {
          "kind": "text",
          "name": "TextBox 6",
          "placeholder": "",
          "position": {
            "x": 8395447,
            "y": 2457637,
            "w": 3572966,
            "h": 830997
          },
          "paragraphs": [
            {
              "text": "Predict → run",
              "level": 0,
              "bullet": false
            },
            {
              "text": "→ explain",
              "level": 0,
              "bullet": false
            }
          ]
        },
        {
          "kind": "text",
          "name": "TextBox 5",
          "placeholder": "",
          "position": {
            "x": 1766047,
            "y": 5699909,
            "w": 8659906,
            "h": 954107
          },
          "paragraphs": [
            {
              "text": "Your evidence is the schema, tests, query results, and reasoning.",
              "level": 0,
              "bullet": false
            }
          ]
        }
      ]
    }
  }
} };
