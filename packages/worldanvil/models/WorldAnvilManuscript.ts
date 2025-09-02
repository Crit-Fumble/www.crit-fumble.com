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
