/**
 * World Anvil Manuscript Service
 * Service for interacting with World Anvil manuscript endpoints
 * Based on Boromir API docs: https://www.worldanvil.com/api/external/boromir/documentation
 */

import { WorldAnvilApiClient } from '../clients/WorldAnvilApiClient';
import { getWorldAnvilConfig } from '../configs';
import {
  ManuscriptRef,
  ManuscriptResponse,
  ManuscriptInput,
  ManuscriptUpdateInput,
  WorldManuscriptsResponse,
  ManuscriptListOptions,
  // Manuscript Beat types
  ManuscriptBeatRef, ManuscriptBeatResponse, ManuscriptBeatInput, ManuscriptBeatUpdateInput, ManuscriptBeatsResponse,
  // Manuscript Part types
  ManuscriptPartRef, ManuscriptPartResponse, ManuscriptPartInput, ManuscriptPartUpdateInput, ManuscriptPartsResponse,
  // Manuscript Version types
  ManuscriptVersionRef, ManuscriptVersionResponse, ManuscriptVersionInput, ManuscriptVersionUpdateInput, ManuscriptVersionsResponse,
  // Manuscript Bookmark types
  ManuscriptBookmarkRef, ManuscriptBookmarkResponse, ManuscriptBookmarkInput, ManuscriptBookmarkUpdateInput, ManuscriptBookmarksResponse,
  // Manuscript Tag types
  ManuscriptTagRef, ManuscriptTagResponse, ManuscriptTagInput, ManuscriptTagUpdateInput, ManuscriptTagsResponse,
  // Manuscript Plot types
  ManuscriptPlotRef, ManuscriptPlotResponse, ManuscriptPlotInput, ManuscriptPlotUpdateInput, ManuscriptPlotsResponse,
  // Manuscript Label types
  ManuscriptLabelRef, ManuscriptLabelResponse, ManuscriptLabelInput, ManuscriptLabelUpdateInput, ManuscriptLabelsResponse,
  // Manuscript Stat types
  ManuscriptStatRef, ManuscriptStatResponse, ManuscriptStatInput, ManuscriptStatUpdateInput, ManuscriptStatsResponse,
  // Common types
  ManuscriptSubResourceListOptions
} from '../../models/WorldAnvilManuscript';

/**
 * Service for World Anvil manuscript operations
 */
export class WorldAnvilManuscriptService {
  private apiClient: WorldAnvilApiClient;
  
  /**
   * Creates a new WorldAnvilManuscriptService
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
   * Get a manuscript by ID
   * @param manuscriptId The ID of the manuscript to get
   * @param granularity The level of detail to return (-1 to 2)
   * @returns Manuscript data at specified granularity
   */
  async getManuscriptById(manuscriptId: string, granularity: '-1' | '0' | '1' | '2' = '0'): Promise<ManuscriptResponse> {
    return this.apiClient.get<ManuscriptResponse>('/manuscript', {
      params: {
        id: manuscriptId,
        granularity
      }
    });
  }

  /**
   * Create a new manuscript
   * @param manuscriptData The manuscript data to create (requires title and world.id)
   * @returns Created manuscript reference
   */
  async createManuscript(manuscriptData: ManuscriptInput): Promise<ManuscriptRef> {
    return this.apiClient.put<ManuscriptRef>('/manuscript', manuscriptData);
  }

  /**
   * Update an existing manuscript
   * @param manuscriptId The ID of the manuscript to update
   * @param manuscriptData The updated manuscript data
   * @returns Updated manuscript reference
   */
  async updateManuscript(manuscriptId: string, manuscriptData: ManuscriptUpdateInput): Promise<ManuscriptRef> {
    return this.apiClient.patch<ManuscriptRef>('/manuscript', manuscriptData, {
      params: {
        id: manuscriptId
      }
    });
  }

  /**
   * Delete a manuscript
   * @param manuscriptId The ID of the manuscript to delete
   * @returns Success response
   */
  async deleteManuscript(manuscriptId: string): Promise<{ success: boolean }> {
    return this.apiClient.delete<{ success: boolean }>('/manuscript', {
      params: {
        id: manuscriptId
      }
    });
  }

  /**
   * Get a list of manuscripts in a world
   * Based on world-manuscripts.yml POST endpoint
   * @param worldId The ID of the world
   * @param options Options for pagination
   */
  async getManuscriptsByWorld(worldId: string, options: ManuscriptListOptions = {}): Promise<WorldManuscriptsResponse> {
    // Using POST as specified in the world-manuscripts.yml specification
    return this.apiClient.post<WorldManuscriptsResponse>('/world-manuscripts', {
      offset: options.offset || 0,
      limit: options.limit || 50
    }, {
      params: { id: worldId }
    });
  }
  
  // MANUSCRIPT BEAT OPERATIONS

  /**
   * Get a manuscript beat by ID
   * @param beatId The ID of the manuscript beat to get
   * @param granularity The level of detail to return (-1 to 2)
   * @returns Manuscript beat data at specified granularity
   */
  async getManuscriptBeatById(beatId: string, granularity: '-1' | '0' | '2' = '0'): Promise<ManuscriptBeatResponse> {
    return this.apiClient.get<ManuscriptBeatResponse>('/manuscript_beat', {
      params: {
        id: beatId,
        granularity
      }
    });
  }

  /**
   * Create a new manuscript beat
   * @param beatData The manuscript beat data to create (requires content and part.id)
   * @returns Created manuscript beat reference
   */
  async createManuscriptBeat(beatData: ManuscriptBeatInput): Promise<ManuscriptBeatRef> {
    return this.apiClient.put<ManuscriptBeatRef>('/manuscript_beat', beatData);
  }

  /**
   * Update an existing manuscript beat
   * @param beatId The ID of the manuscript beat to update
   * @param beatData The updated manuscript beat data
   * @returns Updated manuscript beat reference
   */
  async updateManuscriptBeat(beatId: string, beatData: ManuscriptBeatUpdateInput): Promise<ManuscriptBeatRef> {
    return this.apiClient.patch<ManuscriptBeatRef>('/manuscript_beat', beatData, {
      params: {
        id: beatId
      }
    });
  }

  /**
   * Delete a manuscript beat
   * @param beatId The ID of the manuscript beat to delete
   * @returns Success response
   */
  async deleteManuscriptBeat(beatId: string): Promise<{ success: boolean }> {
    return this.apiClient.delete<{ success: boolean }>('/manuscript_beat', {
      params: {
        id: beatId
      }
    });
  }

  /**
   * Get a list of beats in a manuscript part
   * @param partId The ID of the manuscript part
   * @param options Options for pagination
   */
  async getBeatsByPart(partId: string, options: ManuscriptSubResourceListOptions = {}): Promise<ManuscriptBeatsResponse> {
    return this.apiClient.post<ManuscriptBeatsResponse>('/manuscript_part/manuscript_beats', {
      offset: options.offset || 0,
      limit: options.limit || 50
    }, {
      params: { id: partId }
    });
  }

  // MANUSCRIPT PART OPERATIONS

  /**
   * Get a manuscript part by ID
   * @param partId The ID of the manuscript part to get
   * @param granularity The level of detail to return (-1 to 2)
   * @returns Manuscript part data at specified granularity
   */
  async getManuscriptPartById(partId: string, granularity: '-1' | '0' | '2' = '0'): Promise<ManuscriptPartResponse> {
    return this.apiClient.get<ManuscriptPartResponse>('/manuscript_part', {
      params: {
        id: partId,
        granularity
      }
    });
  }

  /**
   * Create a new manuscript part
   * @param partData The manuscript part data to create (requires type and version.id)
   * @returns Created manuscript part reference
   */
  async createManuscriptPart(partData: ManuscriptPartInput): Promise<ManuscriptPartRef> {
    return this.apiClient.put<ManuscriptPartRef>('/manuscript_part', partData);
  }

  /**
   * Update an existing manuscript part
   * @param partId The ID of the manuscript part to update
   * @param partData The updated manuscript part data
   * @returns Updated manuscript part reference
   */
  async updateManuscriptPart(partId: string, partData: ManuscriptPartUpdateInput): Promise<ManuscriptPartRef> {
    return this.apiClient.patch<ManuscriptPartRef>('/manuscript_part', partData, {
      params: {
        id: partId
      }
    });
  }

  /**
   * Delete a manuscript part
   * @param partId The ID of the manuscript part to delete
   * @returns Success response
   */
  async deleteManuscriptPart(partId: string): Promise<{ success: boolean }> {
    return this.apiClient.delete<{ success: boolean }>('/manuscript_part', {
      params: {
        id: partId
      }
    });
  }

  /**
   * Get a list of parts in a manuscript version
   * @param versionId The ID of the manuscript version
   * @param options Options for pagination
   */
  async getPartsByVersion(versionId: string, options: ManuscriptSubResourceListOptions = {}): Promise<ManuscriptPartsResponse> {
    return this.apiClient.post<ManuscriptPartsResponse>('/manuscript_version/manuscript_parts', {
      offset: options.offset || 0,
      limit: options.limit || 50
    }, {
      params: { id: versionId }
    });
  }

  // MANUSCRIPT VERSION OPERATIONS

  /**
   * Get a manuscript version by ID
   * @param versionId The ID of the manuscript version to get
   * @param granularity The level of detail to return (-1 to 2)
   * @returns Manuscript version data at specified granularity
   */
  async getManuscriptVersionById(versionId: string, granularity: '-1' | '0' | '2' = '0'): Promise<ManuscriptVersionResponse> {
    return this.apiClient.get<ManuscriptVersionResponse>('/manuscript_version', {
      params: {
        id: versionId,
        granularity
      }
    });
  }

  /**
   * Create a new manuscript version
   * @param versionData The manuscript version data to create (requires manuscript.id)
   * @returns Created manuscript version reference
   */
  async createManuscriptVersion(versionData: ManuscriptVersionInput): Promise<ManuscriptVersionRef> {
    return this.apiClient.put<ManuscriptVersionRef>('/manuscript_version', versionData);
  }

  /**
   * Update an existing manuscript version
   * @param versionId The ID of the manuscript version to update
   * @param versionData The updated manuscript version data
   * @returns Updated manuscript version reference
   */
  async updateManuscriptVersion(versionId: string, versionData: ManuscriptVersionUpdateInput): Promise<ManuscriptVersionRef> {
    return this.apiClient.patch<ManuscriptVersionRef>('/manuscript_version', versionData, {
      params: {
        id: versionId
      }
    });
  }

  /**
   * Delete a manuscript version
   * @param versionId The ID of the manuscript version to delete
   * @returns Success response
   */
  async deleteManuscriptVersion(versionId: string): Promise<{ success: boolean }> {
    return this.apiClient.delete<{ success: boolean }>('/manuscript_version', {
      params: {
        id: versionId
      }
    });
  }

  /**
   * Get a list of versions in a manuscript
   * @param manuscriptId The ID of the manuscript
   * @param options Options for pagination
   */
  async getVersionsByManuscript(manuscriptId: string, options: ManuscriptSubResourceListOptions = {}): Promise<ManuscriptVersionsResponse> {
    return this.apiClient.post<ManuscriptVersionsResponse>('/manuscript/manuscript_versions', {
      offset: options.offset || 0,
      limit: options.limit || 50
    }, {
      params: { id: manuscriptId }
    });
  }

  // MANUSCRIPT BOOKMARK OPERATIONS

  /**
   * Get a manuscript bookmark by ID
   * @param bookmarkId The ID of the manuscript bookmark to get
   * @param granularity The level of detail to return (-1 to 2)
   * @returns Manuscript bookmark data at specified granularity
   */
  async getManuscriptBookmarkById(bookmarkId: string, granularity: '-1' | '0' | '2' = '0'): Promise<ManuscriptBookmarkResponse> {
    return this.apiClient.get<ManuscriptBookmarkResponse>('/manuscript_bookmark', {
      params: {
        id: bookmarkId,
        granularity
      }
    });
  }

  /**
   * Create a new manuscript bookmark
   * @param bookmarkData The manuscript bookmark data to create (requires title and manuscript.id)
   * @returns Created manuscript bookmark reference
   */
  async createManuscriptBookmark(bookmarkData: ManuscriptBookmarkInput): Promise<ManuscriptBookmarkRef> {
    return this.apiClient.put<ManuscriptBookmarkRef>('/manuscript_bookmark', bookmarkData);
  }

  /**
   * Update an existing manuscript bookmark
   * @param bookmarkId The ID of the manuscript bookmark to update
   * @param bookmarkData The updated manuscript bookmark data
   * @returns Updated manuscript bookmark reference
   */
  async updateManuscriptBookmark(bookmarkId: string, bookmarkData: ManuscriptBookmarkUpdateInput): Promise<ManuscriptBookmarkRef> {
    return this.apiClient.patch<ManuscriptBookmarkRef>('/manuscript_bookmark', bookmarkData, {
      params: {
        id: bookmarkId
      }
    });
  }

  /**
   * Delete a manuscript bookmark
   * @param bookmarkId The ID of the manuscript bookmark to delete
   * @returns Success response
   */
  async deleteManuscriptBookmark(bookmarkId: string): Promise<{ success: boolean }> {
    return this.apiClient.delete<{ success: boolean }>('/manuscript_bookmark', {
      params: {
        id: bookmarkId
      }
    });
  }

  /**
   * Get a list of bookmarks in a manuscript
   * @param manuscriptId The ID of the manuscript
   * @param options Options for pagination
   */
  async getBookmarksByManuscript(manuscriptId: string, options: ManuscriptSubResourceListOptions = {}): Promise<ManuscriptBookmarksResponse> {
    return this.apiClient.post<ManuscriptBookmarksResponse>('/manuscript/manuscript_bookmarks', {
      offset: options.offset || 0,
      limit: options.limit || 50
    }, {
      params: { id: manuscriptId }
    });
  }

  // MANUSCRIPT TAG OPERATIONS

  /**
   * Get a manuscript tag by ID
   * @param tagId The ID of the manuscript tag to get
   * @param granularity The level of detail to return (-1 to 2)
   * @returns Manuscript tag data at specified granularity
   * @see manuscript-tag.yml GET endpoint
   */
  async getManuscriptTagById(tagId: string, granularity: '-1' | '0' | '2' = '0'): Promise<ManuscriptTagResponse> {
    return this.apiClient.get<ManuscriptTagResponse>('/manuscript_tag', {
      params: {
        id: tagId,
        granularity
      }
    });
  }

  /**
   * Create a new manuscript tag
   * @param tagData The manuscript tag data to create (requires title and manuscript.id)
   * @returns Created manuscript tag reference
   * @see manuscript-tag.yml PUT endpoint
   */
  async createManuscriptTag(tagData: ManuscriptTagInput): Promise<ManuscriptTagRef> {
    return this.apiClient.put<ManuscriptTagRef>('/manuscript_tag', tagData);
  }

  /**
   * Update an existing manuscript tag
   * @param tagId The ID of the manuscript tag to update
   * @param tagData The updated manuscript tag data
   * @returns Updated manuscript tag reference
   * @see manuscript-tag.yml PATCH endpoint
   */
  async updateManuscriptTag(tagId: string, tagData: ManuscriptTagUpdateInput): Promise<ManuscriptTagRef> {
    return this.apiClient.patch<ManuscriptTagRef>('/manuscript_tag', tagData, {
      params: {
        id: tagId
      }
    });
  }

  /**
   * Delete a manuscript tag
   * @param tagId The ID of the manuscript tag to delete
   * @returns Success response
   * @see manuscript-tag.yml DELETE endpoint
   */
  async deleteManuscriptTag(tagId: string): Promise<{ success: boolean }> {
    return this.apiClient.delete<{ success: boolean }>('/manuscript_tag', {
      params: {
        id: tagId
      }
    });
  }

  /**
   * Get a list of tags in a manuscript
   * @param manuscriptId The ID of the manuscript
   * @param options Options for pagination
   * @see manuscript-tags-by-manuscript.yml POST endpoint
   */
  async getTagsByManuscript(manuscriptId: string, options: ManuscriptSubResourceListOptions = {}): Promise<ManuscriptTagsResponse> {
    return this.apiClient.post<ManuscriptTagsResponse>('/manuscript/manuscript_tags', {
      offset: options.offset || 0,
      limit: options.limit || 50
    }, {
      params: { id: manuscriptId }
    });
  }

  // MANUSCRIPT PLOT OPERATIONS

  /**
   * Get a manuscript plot by ID
   * @param plotId The ID of the manuscript plot to get
   * @param granularity The level of detail to return (-1 to 2)
   * @returns Manuscript plot data at specified granularity
   * @see manuscript-plot.yml GET endpoint
   */
  async getManuscriptPlotById(plotId: string, granularity: '-1' | '0' | '2' = '0'): Promise<ManuscriptPlotResponse> {
    return this.apiClient.get<ManuscriptPlotResponse>('/manuscript_plot', {
      params: {
        id: plotId,
        granularity
      }
    });
  }

  /**
   * Create a new manuscript plot
   * @param plotData The manuscript plot data to create (requires title and version.id)
   * @returns Created manuscript plot reference
   * @see manuscript-plot.yml PUT endpoint
   */
  async createManuscriptPlot(plotData: ManuscriptPlotInput): Promise<ManuscriptPlotRef> {
    return this.apiClient.put<ManuscriptPlotRef>('/manuscript_plot', plotData);
  }

  /**
   * Update an existing manuscript plot
   * @param plotId The ID of the manuscript plot to update
   * @param plotData The updated manuscript plot data
   * @returns Updated manuscript plot reference
   * @see manuscript-plot.yml PATCH endpoint
   */
  async updateManuscriptPlot(plotId: string, plotData: ManuscriptPlotUpdateInput): Promise<ManuscriptPlotRef> {
    return this.apiClient.patch<ManuscriptPlotRef>('/manuscript_plot', plotData, {
      params: {
        id: plotId
      }
    });
  }

  /**
   * Delete a manuscript plot
   * @param plotId The ID of the manuscript plot to delete
   * @returns Success response
   * @see manuscript-plot.yml DELETE endpoint
   */
  async deleteManuscriptPlot(plotId: string): Promise<{ success: boolean }> {
    return this.apiClient.delete<{ success: boolean }>('/manuscript_plot', {
      params: {
        id: plotId
      }
    });
  }

  /**
   * Get a list of plots in a manuscript version
   * @param versionId The ID of the manuscript version
   * @param options Options for pagination
   * @see manuscript-plots-by-manuscript-version.yml POST endpoint
   */
  async getPlotsByVersion(versionId: string, options: ManuscriptSubResourceListOptions = {}): Promise<ManuscriptPlotsResponse> {
    return this.apiClient.post<ManuscriptPlotsResponse>('/manuscript_version/manuscript_plots', {
      offset: options.offset || 0,
      limit: options.limit || 50
    }, {
      params: { id: versionId }
    });
  }

  // MANUSCRIPT LABEL OPERATIONS

  /**
   * Get a manuscript label by ID
   * @param labelId The ID of the manuscript label to get
   * @param granularity The level of detail to return (-1 to 2)
   * @returns Manuscript label data at specified granularity
   * @see manuscript-label.yml GET endpoint
   */
  async getManuscriptLabelById(labelId: string, granularity: '-1' | '0' | '2' = '0'): Promise<ManuscriptLabelResponse> {
    return this.apiClient.get<ManuscriptLabelResponse>('/manuscript_label', {
      params: {
        id: labelId,
        granularity
      }
    });
  }

  /**
   * Create a new manuscript label
   * @param labelData The manuscript label data to create (requires color and manuscript.id)
   * @returns Created manuscript label reference
   * @see manuscript-label.yml PUT endpoint
   */
  async createManuscriptLabel(labelData: ManuscriptLabelInput): Promise<ManuscriptLabelRef> {
    return this.apiClient.put<ManuscriptLabelRef>('/manuscript_label', labelData);
  }

  /**
   * Update an existing manuscript label
   * @param labelId The ID of the manuscript label to update
   * @param labelData The updated manuscript label data
   * @returns Updated manuscript label reference
   * @see manuscript-label.yml PATCH endpoint
   */
  async updateManuscriptLabel(labelId: string, labelData: ManuscriptLabelUpdateInput): Promise<ManuscriptLabelRef> {
    return this.apiClient.patch<ManuscriptLabelRef>('/manuscript_label', labelData, {
      params: {
        id: labelId
      }
    });
  }

  /**
   * Delete a manuscript label
   * @param labelId The ID of the manuscript label to delete
   * @returns Success response
   * @see manuscript-label.yml DELETE endpoint
   */
  async deleteManuscriptLabel(labelId: string): Promise<{ success: boolean }> {
    return this.apiClient.delete<{ success: boolean }>('/manuscript_label', {
      params: {
        id: labelId
      }
    });
  }

  /**
   * Get a list of labels in a manuscript
   * @param manuscriptId The ID of the manuscript
   * @param options Options for pagination
   * @see manuscript-labels-by-manuscript.yml POST endpoint
   */
  async getLabelsByManuscript(manuscriptId: string, options: ManuscriptSubResourceListOptions = {}): Promise<ManuscriptLabelsResponse> {
    return this.apiClient.post<ManuscriptLabelsResponse>('/manuscript/manuscript_labels', {
      offset: options.offset || 0,
      limit: options.limit || 50
    }, {
      params: { id: manuscriptId }
    });
  }

  // MANUSCRIPT STAT OPERATIONS

  /**
   * Get a manuscript stat by ID
   * @param statId The ID of the manuscript stat to get
   * @param granularity The level of detail to return (-1 to 2)
   * @returns Manuscript stat data at specified granularity
   * @see manuscript-stat.yml GET endpoint
   */
  async getManuscriptStatById(statId: string, granularity: '-1' | '0' | '2' = '0'): Promise<ManuscriptStatResponse> {
    return this.apiClient.get<ManuscriptStatResponse>('/manuscript_stat', {
      params: {
        id: statId,
        granularity
      }
    });
  }

  /**
   * Create a new manuscript stat
   * @param statData The manuscript stat data to create (requires notes and version.id)
   * @returns Created manuscript stat reference
   * @see manuscript-stat.yml PUT endpoint
   */
  async createManuscriptStat(statData: ManuscriptStatInput): Promise<ManuscriptStatRef> {
    return this.apiClient.put<ManuscriptStatRef>('/manuscript_stat', statData);
  }

  /**
   * Update an existing manuscript stat
   * @param statId The ID of the manuscript stat to update
   * @param statData The updated manuscript stat data
   * @returns Updated manuscript stat reference
   * @see manuscript-stat.yml PATCH endpoint
   */
  async updateManuscriptStat(statId: string, statData: ManuscriptStatUpdateInput): Promise<ManuscriptStatRef> {
    return this.apiClient.patch<ManuscriptStatRef>('/manuscript_stat', statData, {
      params: {
        id: statId
      }
    });
  }

  /**
   * Delete a manuscript stat
   * @param statId The ID of the manuscript stat to delete
   * @returns Success response
   * @see manuscript-stat.yml DELETE endpoint
   */
  async deleteManuscriptStat(statId: string): Promise<{ success: boolean }> {
    return this.apiClient.delete<{ success: boolean }>('/manuscript_stat', {
      params: {
        id: statId
      }
    });
  }

  /**
   * Get a list of stats in a manuscript version
   * @param versionId The ID of the manuscript version
   * @param options Options for pagination
   * @see manuscript-stats-by-manuscript-version.yml POST endpoint
   */
  async getStatsByVersion(versionId: string, options: ManuscriptSubResourceListOptions = {}): Promise<ManuscriptStatsResponse> {
    return this.apiClient.post<ManuscriptStatsResponse>('/manuscript_version/manuscript_stats', {
      offset: options.offset || 0,
      limit: options.limit || 50
    }, {
      params: { id: versionId }
    });
  }
}