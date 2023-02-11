export enum RelationType {
  Relation = 'https://w3id.org/tree#Relation', // ns.tree("Relation"),
  PrefixRelation = 'https://w3id.org/tree#PrefixRelation', // ns.tree("PrefixRelation"),
  SubstringRelation = 'https://w3id.org/tree#SubstringRelation', // ns.tree("SubstringRelation"),
  GreaterThanRelation = 'https://w3id.org/tree#GreaterThanRelation', // ns.tree("GreaterThanRelation"),
  GreaterThanOrEqualToRelation = 'https://w3id.org/tree#GreaterThanOrEqualToRelation', // ns.tree("GreaterThanOrEqualToRelation"),
  LessThanRelation = 'https://w3id.org/tree#LessThanRelation', // ns.tree("LessThanRelation"),
  LessThanOrEqualToRelation = 'https://w3id.org/tree#LessThanOrEqualToRelation', // ns.tree("LessThanOrEqualToRelation"),
  EqualThanRelation = 'https://w3id.org/tree#EqualThanRelation', // ns.tree("EqualThanRelation"),
  GeospatiallyContainsRelation = 'https://w3id.org/tree#GeospatiallyContainsRelation', // ns.tree("GeospatiallyContainsRelation"),
  InBetweenRelation = 'https://w3id.org/tree#InBetweenRelation', // ns.tree("InBetweenRelation"),
}

export interface Collection {
  "@context"?: string | object,
  "@id": string,
  "@type"?: string[],
  "view"?: URI[],
  "subset"?: URI[],
  "member"?: Member[],
  "shape"?: Shape[],
  "totalItems"?: Literal[],
  "import"?: URI[],
  "importStream"?: URI[],
  "conditionalImport"?: ConditionalImport[],
  [property: string]: any;
}

export interface Node {
  "@context"?: string | object,
  "@id": string,
  "@type"?: string[],
  "relation"?: URI[], // Note hydra:next / as:next links are added as Relations of type tree:relation with the target node as the target of the next relation
  "search"?: IriTemplate[],
  "retentionPolicy"?: RetentionPolicy[],
  "import"?: URI[],
  "importStream"?: URI[],
  "conditionalImport"?: ConditionalImport[],
  [property: string]: any;

}

export interface Relation {
  "@context": any,
  "@id": string,
  "@type"?: string[],
  "remainingItems"?: Literal[],
  "path"?: any[],
  "value"?: any[],
  "node"?: URI[],
  "import"?: URI[],
  "importStream"?: URI[],
  "conditionalImport"?: ConditionalImport[],
}

export interface Member {
  "@id"?: string,
  [property: string]: any;
}

export interface Shape {
  "@id"?: string,
  [property: string]: any;
}

export interface IriTemplate {
  "@id"?: string,
  [property: string]: any;
}
export interface ConditionalImport {
  "@id"?: string,
  "import"?: any[],
  "importStream"?: any[],
  "conditionalImport"?: any[],
}

export interface RetentionPolicy {
  "@id"?: string,
  "@type"?: string[],
  "amount"?: Literal[],
  "versionKey"?: string[],
  "path"?: any[],
  "value"?: any[],
}

export interface Literal {
  "@value": string,
  "@type"?: string,
  "@language"?: string,
}

export interface URI {
  "@id": string,
}
