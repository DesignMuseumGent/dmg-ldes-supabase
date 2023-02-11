/**
 * Converts an IRI to a prefixed node using a set of prefixes. By default, the
 * built-in prefixes are used. When the `extraPrefixes` argument is given, uses these prefixes
 * first, and then tries the built-in set
 *
 * @param iri
 * @param [extraPrefixes]
 */
export declare function shrink(iri: string, extraPrefixes?: Record<string, string>): string;
//# sourceMappingURL=shrink.d.ts.map