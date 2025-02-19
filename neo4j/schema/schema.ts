export const SCHEMA = {
  // Humanities and Social Sciences
  Person: {
    required: ["name",'subject'],
    optional: ["bornOn", "diedIn"],
    relationships: [
      "INFLUENCED_BY",
      "WROTE",
      "PART_OF",
      "FRIEND_OF",
      "ENEMY_OF",
    ],
  },
  Event: {
    required: ["name",'subject'],
    optional: ["startedOn", "endedIn"],
    relationships: ["OCCURRED_IN", "LED_TO", "INVOLVED", "CAUSED_BY"],
  },
  Idea: {
    required: ["name"],
    optional: ["summary"],
    relationships: [
      "RELATED_TO",
      "SUPPORTED_BY",
      "DISUPTED_BY",
      "SUPERCEDED_BY",
      "PRECEDED_BY",
      "BRANCH_OF",
    ],
  },
    Artifact: {
    required: ["name",'subject'],
    optional: ["classification"],
    relationships: ["CREATED_BY", "STORED_IN"],
  },
  Institution: {
    required: ["name",'subject'],
    optional: ["foundedIn",'endedIn','activeFrom'],
    relationships: ["GOVERNED_BY", "LOCATED_IN"],
  },
  Text: {
    required: ["name",'subject'],
    optional: ["authoredBy"],
    relationships: ["REFERENCES", "WRITTEN_BY", "COVERS"],
  },
  Culture: {
    required: ["name",'subject'],
    optional: ["foundedIn",'endedIn','location'],
    relationships: ["ASSOCIATED_WITH", "REPRESENTS"],
  },
  // STEM Schema
  Entity: {
    required: ["name", "subject"],
    optional: ["purpose",'inputs','outputs'],
    relationships: ["PART_OF", "INTERACTS_WITH"],
  },
  Process: {
    required: ["name", "subject"],
    optional: ["inputs",'outputs'],
    relationships: ["RESULTS_IN", "INVOLVES"],
  },
  System: {
    required: ["name", "subject"],
    optional: ["summary"],
    relationships: ["COMPOSED_OF", "CONNECTED_TO"],
  },
  Tool: {
    required: ["name", "subject"],
    optional: ["usedBy", "usedFor", "inputs",'outputs'],
    relationships: ["USED_IN", "CREATED_BY"],
  },
  Data: {
    required: ["name", "subject"],
    optional: ["type", "source", "originalPurpose",'modifications','neededModifications','accessedFrom'],
    relationships: ["DERIVED_FROM", "ANALYZED_IN", "CREATED_BY"],
  },
  Source: {
    required: ["name", "author", "subject"],
    optional: ["type", "source", "originalPurpose",'modifications','neededModifications','accessedFrom'],
    relationships: ["DERIVED_FROM", "ANALYZED_IN", "CREATED_BY"],
  },
  Theorem: {
    required: ["name", "subject"],
    optional: ["consequence", "requirements", "usages"],
    relationships: ["BASED_ON", "APPLIES_TO",'CREATED_BY','HELPS_PROVE','DERIVED_BY'],
  },
  // Business and Econ
//   Company: {
//     required: ["name",'subject','industry'],
//     optional: [""],
//     relationships: [""],
//   },
//   Organization: {
//     required: [""],
//     optional: [""],
//     relationships: [""],
//   },
//   Market: {
//     required: [""],
//     optional: [""],
//     relationships: [""],
//   },
//   Transcation: {
//     required: [""],
//     optional: [""],
//     relationships: [""],
//   },
//   Product: {
//     required: [""],
//     optional: [""],
//     relationships: [""],
//   },
//   Trend: {
//     required: [""],
//     optional: [""],
//     relationships: [""],
//   },
//   Strategy: {
//     required: [""],
//     optional: [""],
//     relationships: [""],
//   },
//   Role: {
//     required: [""],
//     optional: [""],
//     relationships: [""],
//   },
  /// all for now...
};

// Define allowed relationship types and their valid connections
const VALID_RELATIONSHIPS = {
  WORKS_WITH: {
    from: ["Person"],
    to: ["Person"],
  },
  MANAGES: {
    from: ["Person"],
    to: ["Person", "Project"],
  },
  BELONGS_TO: {
    from: ["Project"],
    to: ["Organization"],
  },
  // ... add other relationships as needed
};
