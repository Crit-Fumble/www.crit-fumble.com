/**
 * World Anvil Notebook Models
 * Contains interfaces and types related to World Anvil notebooks
 * 
 * NOTE: According to the API docs, this endpoint will be replaced with a /user/notebooks endpoint in the future
 * and currently does not work.
 */

/**
 * Interface for notebook reference
 */
export interface NotebookRef {
  id: string;
  title: string;
  slug: string;
  world_id: string;
  user_id: string;
  [key: string]: any; // For additional properties based on the schema
}

/**
 * Interface for notebook data with varying levels of detail
 */
export interface NotebookResponse {
  id: string;
  title: string;
  slug: string;
  world_id: string;
  user_id: string;
  description?: string;
  created_at?: string;
  updated_at?: string;
  [key: string]: any; // For additional properties based on the schema
}

/**
 * Interface for notebook creation input
 */
export interface NotebookInput {
  title: string;
  world: {
    id: string;
  };
  description?: string;
  [key: string]: any; // For additional properties
}

/**
 * Interface for notebook update input
 */
export interface NotebookUpdateInput {
  title?: string;
  description?: string;
  [key: string]: any; // For additional properties
}

/**
 * Interface for API response from world-notebooks endpoint
 */
export interface WorldNotebooksResponse {
  success: boolean;
  entities: NotebookRef[];
}

/**
 * Interface for request options to get notebooks
 */
export interface NotebookListOptions {
  offset?: number;
  limit?: number;
}
