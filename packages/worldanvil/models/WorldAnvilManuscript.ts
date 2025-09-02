/**
 * World Anvil Manuscript Models
 * Contains interfaces and types related to World Anvil manuscripts
 */

/**
 * Interface for manuscript reference
 */
export interface ManuscriptRef {
  id: string;
  title: string;
  slug: string;
  world_id: string;
  user_id: string;
  [key: string]: any; // For additional properties based on the schema
}

/**
 * Interface for manuscript data with varying levels of detail
 */
export interface ManuscriptResponse {
  id: string;
  title: string;
  slug: string;
  world_id: string;
  user_id: string;
  state?: string;
  created_at?: string;
  updated_at?: string;
  [key: string]: any; // For additional properties based on the schema
}

/**
 * Interface for manuscript creation input
 */
export interface ManuscriptInput {
  title: string;
  world: {
    id: string;
  };
  [key: string]: any; // For additional properties
}

/**
 * Interface for manuscript update input
 */
export interface ManuscriptUpdateInput {
  title?: string;
  state?: string;
  [key: string]: any; // For additional properties
}

/**
 * Interface for API response from world-manuscripts endpoint
 */
export interface WorldManuscriptsResponse {
  success: boolean;
  entities: ManuscriptRef[];
}

/**
 * Interface for request options to get manuscripts
 */
export interface ManuscriptListOptions {
  offset?: number;
  limit?: number;
}

/**
 * World Anvil Manuscript Sub-Resources Models
 * Contains interfaces and types related to World Anvil manuscript sub-resources like beats, parts, versions, etc.
 */

/**
 * Base interface for common fields across manuscript sub-resources
 */
interface ManuscriptSubResourceBase {
  id: string;
  title?: string;
  [key: string]: any;
}

/**
 * Interface for manuscript beat reference
 */
export interface ManuscriptBeatRef extends ManuscriptSubResourceBase {
  content?: string;
  part_id: string;
  position?: number;
}

/**
 * Interface for manuscript beat response
 */
export interface ManuscriptBeatResponse extends ManuscriptBeatRef {
  created_at?: string;
  updated_at?: string;
}

/**
 * Interface for manuscript beat input
 */
export interface ManuscriptBeatInput {
  content: string;
  part: {
    id: string;
  };
  position?: number;
}

/**
 * Interface for manuscript beat update input
 */
export interface ManuscriptBeatUpdateInput {
  content?: string;
  position?: number;
  [key: string]: any;
}

/**
 * Interface for manuscript part reference
 */
export interface ManuscriptPartRef extends ManuscriptSubResourceBase {
  synopsis?: string;
  type?: string;
  version_id: string;
}

/**
 * Interface for manuscript part response
 */
export interface ManuscriptPartResponse extends ManuscriptPartRef {
  created_at?: string;
  updated_at?: string;
}

/**
 * Interface for manuscript part input
 */
export interface ManuscriptPartInput {
  title?: string;
  type: string;
  version: {
    id: string;
  };
  synopsis?: string;
  image?: {
    id: string;
  };
}

/**
 * Interface for manuscript part update input
 */
export interface ManuscriptPartUpdateInput {
  title?: string;
  synopsis?: string;
  type?: string;
  image?: {
    id: string;
  };
}

/**
 * Interface for manuscript version reference
 */
export interface ManuscriptVersionRef extends ManuscriptSubResourceBase {
  manuscript_id: string;
  name?: string;
}

/**
 * Interface for manuscript version response
 */
export interface ManuscriptVersionResponse extends ManuscriptVersionRef {
  created_at?: string;
  updated_at?: string;
}

/**
 * Interface for manuscript version input
 */
export interface ManuscriptVersionInput {
  name?: string;
  manuscript: {
    id: string;
  };
}

/**
 * Interface for manuscript version update input
 */
export interface ManuscriptVersionUpdateInput {
  name?: string;
}

/**
 * Interface for manuscript bookmark reference
 */
export interface ManuscriptBookmarkRef extends ManuscriptSubResourceBase {
  manuscript_id: string;
  note?: string;
}

/**
 * Interface for manuscript bookmark response
 */
export interface ManuscriptBookmarkResponse extends ManuscriptBookmarkRef {
  created_at?: string;
  updated_at?: string;
}

/**
 * Interface for manuscript bookmark input
 */
export interface ManuscriptBookmarkInput {
  title: string;
  manuscript: {
    id: string;
  };
  note?: string;
}

/**
 * Interface for manuscript bookmark update input
 */
export interface ManuscriptBookmarkUpdateInput {
  title?: string;
  note?: string;
}

/**
 * Interface for API response from manuscript beats listing endpoint
 */
export interface ManuscriptBeatsResponse {
  success: boolean;
  entities: ManuscriptBeatRef[];
}

/**
 * Interface for API response from manuscript parts listing endpoint
 */
export interface ManuscriptPartsResponse {
  success: boolean;
  entities: ManuscriptPartRef[];
}

/**
 * Interface for API response from manuscript versions listing endpoint
 */
export interface ManuscriptVersionsResponse {
  success: boolean;
  entities: ManuscriptVersionRef[];
}

/**
 * Interface for API response from manuscript bookmarks listing endpoint
 */
export interface ManuscriptBookmarksResponse {
  success: boolean;
  entities: ManuscriptBookmarkRef[];
}

/**
 * Interface for request options for pagination
 */
export interface ManuscriptSubResourceListOptions {
  offset?: number;
  limit?: number;
}
