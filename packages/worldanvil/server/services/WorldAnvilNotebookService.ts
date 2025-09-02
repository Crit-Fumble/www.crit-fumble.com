/**
 * World Anvil Notebook Service
 * Service for interacting with World Anvil notebook endpoints
 * Based on Boromir API docs: https://www.worldanvil.com/api/external/boromir/documentation
 * 
 * NOTE: According to the API docs, this endpoint will be replaced with a /user/notebooks endpoint in the future
 * and currently does not work.
 */

import { WorldAnvilApiClient } from '../clients/WorldAnvilApiClient';
import { getWorldAnvilConfig } from '../configs';
import {
  NotebookRef,
  NotebookResponse,
  NotebookInput,
  NotebookUpdateInput,
  WorldNotebooksResponse,
  NotebookListOptions,
  // Note interfaces
  NoteRef,
  NoteResponse,
  NoteInput,
  NoteUpdateInput,
  // NoteSection interfaces
  NoteSectionRef,
  NoteSectionResponse,
  NoteSectionInput,
  NoteSectionUpdateInput,
  NotebookNoteSectionsResponse,
  NoteSectionNotesResponse
} from '../../models/WorldAnvilNotebook';

/**
 * Service for World Anvil notebook operations
 */
export class WorldAnvilNotebookService {
  private apiClient: WorldAnvilApiClient;
  
  /**
   * Creates a new WorldAnvilNotebookService
   * @param customClient Optional client for testing/dependency injection
   */
  constructor(customClient?: WorldAnvilApiClient) {
    if (customClient) {
      this.apiClient = customClient;
    } else {
      const config = getWorldAnvilConfig();
      this.apiClient = new WorldAnvilApiClient({
        apiUrl: config.apiUrl,
        apiKey: config.apiKey,
        accessToken: config.accessToken
      });
    }
  }

  /**
   * Get a notebook by ID
   * @param notebookId The ID of the notebook to get
   * @param granularity The level of detail to return (-1, 0, or 2)
   * @returns Notebook data at specified granularity
   */
  async getNotebookById(notebookId: string, granularity: '-1' | '0' | '2' = '0'): Promise<NotebookResponse> {
    return this.apiClient.get<NotebookResponse>('/notebook', {
      params: {
        id: notebookId,
        granularity
      }
    });
  }

  /**
   * Create a new notebook
   * @param notebookData The notebook data to create (requires title and world.id)
   * @returns Created notebook reference
   */
  async createNotebook(notebookData: NotebookInput): Promise<NotebookRef> {
    return this.apiClient.put<NotebookRef>('/notebook', notebookData);
  }

  /**
   * Update an existing notebook
   * @param notebookId The ID of the notebook to update
   * @param notebookData The updated notebook data
   * @returns Updated notebook reference
   */
  async updateNotebook(notebookId: string, notebookData: NotebookUpdateInput): Promise<NotebookRef> {
    return this.apiClient.patch<NotebookRef>('/notebook', notebookData, {
      params: {
        id: notebookId
      }
    });
  }

  /**
   * Delete a notebook
   * @param notebookId The ID of the notebook to delete
   * @returns Success response
   */
  async deleteNotebook(notebookId: string): Promise<{ success: boolean }> {
    return this.apiClient.delete<{ success: boolean }>('/notebook', {
      params: {
        id: notebookId
      }
    });
  }

  /**
   * Get a list of notebooks in a world
   * Based on world-notebooks.yml POST endpoint
   * 
   * NOTE: According to API docs, this endpoint will be replaced with /user/notebooks
   * in the future and may not currently work.
   * 
   * @param worldId The ID of the world
   * @param options Options for pagination
   */
  async getNotebooksByWorld(worldId: string, options: NotebookListOptions = {}): Promise<WorldNotebooksResponse> {
    // Using POST as specified in the world-notebooks.yml specification
    return this.apiClient.post<WorldNotebooksResponse>('/world-notebooks', {
      offset: options.offset || 0,
      limit: options.limit || 50
    }, {
      params: { id: worldId }
    });
  }
  
  // Note endpoints (from note.yml)

  /**
   * Get a note by ID
   * @param noteId The ID of the note
   * @param granularity The level of detail to return (-1, 0, or 2)
   * @returns Note data at specified granularity
   */
  async getNoteById(noteId: string, granularity: '-1' | '0' | '2' = '0'): Promise<NoteResponse> {
    return this.apiClient.get<NoteResponse>('/note', {
      params: {
        id: noteId,
        granularity
      }
    });
  }

  /**
   * Create a new note
   * @param noteData The note data to create (requires title and notesection.id)
   * @returns Created note reference
   */
  async createNote(noteData: NoteInput): Promise<NoteRef> {
    return this.apiClient.put<NoteRef>('/note', noteData);
  }

  /**
   * Update an existing note
   * @param noteId The ID of the note to update
   * @param noteData The updated note data
   * @returns Updated note reference
   */
  async updateNote(noteId: string, noteData: NoteUpdateInput): Promise<NoteRef> {
    return this.apiClient.patch<NoteRef>('/note', noteData, {
      params: {
        id: noteId
      }
    });
  }

  /**
   * Delete a note
   * @param noteId The ID of the note to delete
   * @returns Success response
   */
  async deleteNote(noteId: string): Promise<{ success: boolean }> {
    return this.apiClient.delete<{ success: boolean }>('/note', {
      params: {
        id: noteId
      }
    });
  }

  // NoteSection endpoints (from notesection.yml)

  /**
   * Get a note section by ID
   * @param noteSectionId The ID of the note section
   * @param granularity The level of detail to return (-1, 0, or 2)
   * @returns NoteSection data at specified granularity
   */
  async getNoteSectionById(noteSectionId: string, granularity: '-1' | '0' | '2' = '0'): Promise<NoteSectionResponse> {
    return this.apiClient.get<NoteSectionResponse>('/notesection', {
      params: {
        id: noteSectionId,
        granularity
      }
    });
  }

  /**
   * Create a new note section
   * @param sectionData The note section data to create (requires title and notebook.id)
   * @returns Created note section reference
   */
  async createNoteSection(sectionData: NoteSectionInput): Promise<NoteSectionRef> {
    return this.apiClient.put<NoteSectionRef>('/notesection', sectionData);
  }

  /**
   * Update an existing note section
   * @param sectionId The ID of the note section to update
   * @param sectionData The updated note section data
   * @returns Updated note section reference
   */
  async updateNoteSection(sectionId: string, sectionData: NoteSectionUpdateInput): Promise<NoteSectionRef> {
    return this.apiClient.patch<NoteSectionRef>('/notesection', sectionData, {
      params: {
        id: sectionId
      }
    });
  }

  /**
   * Delete a note section
   * @param sectionId The ID of the note section to delete
   * @returns Success response
   */
  async deleteNoteSection(sectionId: string): Promise<{ success: boolean }> {
    return this.apiClient.delete<{ success: boolean }>('/notesection', {
      params: {
        id: sectionId
      }
    });
  }

  /**
   * Get note sections in a notebook
   * @param notebookId The ID of the notebook
   * @param options Options for pagination
   * @returns List of note sections in the notebook
   */
  async getNoteSectionsByNotebook(notebookId: string, options: { offset?: number; limit?: number } = {}): Promise<NotebookNoteSectionsResponse> {
    return this.apiClient.post<NotebookNoteSectionsResponse>('/notebook-notesections', {
      offset: options.offset || 0,
      limit: options.limit || 50
    }, {
      params: { id: notebookId }
    });
  }

  /**
   * Get notes in a note section
   * @param sectionId The ID of the note section
   * @param options Options for pagination
   * @returns List of notes in the note section
   */
  async getNotesByNoteSection(sectionId: string, options: { offset?: number; limit?: number } = {}): Promise<NoteSectionNotesResponse> {
    return this.apiClient.post<NoteSectionNotesResponse>('/notesection-notes', {
      offset: options.offset || 0,
      limit: options.limit || 50
    }, {
      params: { id: sectionId }
    });
  }
}