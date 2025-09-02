import { NextRequest, NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { ApiKeyService } from '@crit-fumble/core/server/services/ApiKeyService';
import { ApiProvider } from '@crit-fumble/core/models/auth/ApiKey';
import { authOptions } from '../auth/[...nextauth]/options';

const apiKeyService = new ApiKeyService();

/**
 * API handler for GET /api/api-keys
 * Returns all API keys for the authenticated user
 */
export async function GET(req: NextRequest) {
  try {
    // Get the authenticated session
    const session = await getServerSession(authOptions);
    
    if (!session || !session.user?.id) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }
    
    // Get the provider from the query string
    const { searchParams } = new URL(req.url);
    const provider = searchParams.get('provider') as ApiProvider | null;
    
    // Get all API keys for the user, optionally filtered by provider
    const apiKeys = provider 
      ? await apiKeyService.getForUser(session.user.id, provider)
      : await apiKeyService.getAllForUser(session.user.id);
    
    // Remove sensitive data before returning
    const safeApiKeys = apiKeys.map(key => ({
      ...key,
      key: key.key.substring(0, 4) + '***' // Only show first few chars of the key
    }));
    
    return NextResponse.json({ apiKeys: safeApiKeys });
  } catch (error) {
    console.error('Error fetching API keys:', error);
    return NextResponse.json(
      { error: 'Failed to fetch API keys' }, 
      { status: 500 }
    );
  }
}

/**
 * API handler for POST /api/api-keys
 * Creates a new API key for the authenticated user
 */
export async function POST(req: NextRequest) {
  try {
    // Get the authenticated session
    const session = await getServerSession(authOptions);
    
    if (!session || !session.user?.id) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }
    
    // Get request body
    const body = await req.json();
    
    // Validate required fields
    if (!body.provider || !body.key) {
      return NextResponse.json(
        { error: 'Provider and key are required' },
        { status: 400 }
      );
    }
    
    // Create new API key
    const newApiKey = await apiKeyService.create({
      userId: session.user.id,
      provider: body.provider,
      key: body.key,
      token: body.token || null, // Optional token (e.g., for WorldAnvil)
      name: body.name || null
    });
    
    // Validate the API key if requested
    if (body.validate) {
      const validation = await apiKeyService.validate(newApiKey.id);
      if (!validation.valid) {
        // Delete the invalid key
        await apiKeyService.delete(newApiKey.id);
        return NextResponse.json(
          { error: 'API key validation failed', message: validation.message },
          { status: 400 }
        );
      }
    }
    
    // Return the created API key
    return NextResponse.json({ apiKey: {
      ...newApiKey,
      key: newApiKey.key.substring(0, 4) + '***' // Only show first few chars of the key
    }}, { status: 201 });
  } catch (error) {
    console.error('Error creating API key:', error);
    return NextResponse.json(
      { error: 'Failed to create API key' },
      { status: 500 }
    );
  }
}

/**
 * API handler for PUT /api/api-keys
 * Updates an existing API key
 */
export async function PUT(req: NextRequest) {
  try {
    // Get the authenticated session
    const session = await getServerSession(authOptions);
    
    if (!session || !session.user?.id) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }
    
    // Get request body
    const body = await req.json();
    
    // Validate required fields
    if (!body.id) {
      return NextResponse.json(
        { error: 'API key ID is required' },
        { status: 400 }
      );
    }
    
    // Get the API key to ensure it belongs to the user
    const existingKey = await apiKeyService.getById(body.id);
    if (!existingKey || existingKey.userId !== session.user.id) {
      return NextResponse.json(
        { error: 'API key not found or not owned by user' },
        { status: 404 }
      );
    }
    
    // Update API key
    const updatedApiKey = await apiKeyService.update(body.id, {
      key: body.key,
      token: body.token,
      name: body.name
    });
    
    // Validate the API key if requested
    if (body.validate) {
      const validation = await apiKeyService.validate(updatedApiKey.id);
      if (!validation.valid) {
        return NextResponse.json(
          { error: 'API key validation failed', message: validation.message },
          { status: 400 }
        );
      }
    }
    
    // Return the updated API key
    return NextResponse.json({ apiKey: {
      ...updatedApiKey,
      key: updatedApiKey.key.substring(0, 4) + '***' // Only show first few chars of the key
    }});
  } catch (error) {
    console.error('Error updating API key:', error);
    return NextResponse.json(
      { error: 'Failed to update API key' },
      { status: 500 }
    );
  }
}

/**
 * API handler for DELETE /api/api-keys
 * Deletes an API key
 */
export async function DELETE(req: NextRequest) {
  try {
    // Get the authenticated session
    const session = await getServerSession(authOptions);
    
    if (!session || !session.user?.id) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }
    
    // Get API key ID from the query string
    const { searchParams } = new URL(req.url);
    const id = searchParams.get('id');
    
    if (!id) {
      return NextResponse.json(
        { error: 'API key ID is required' },
        { status: 400 }
      );
    }
    
    // Get the API key to ensure it belongs to the user
    const existingKey = await apiKeyService.getById(id);
    if (!existingKey || existingKey.userId !== session.user.id) {
      return NextResponse.json(
        { error: 'API key not found or not owned by user' },
        { status: 404 }
      );
    }
    
    // Delete the API key
    await apiKeyService.delete(id);
    
    // Return success
    return NextResponse.json({ success: true });
  } catch (error) {
    console.error('Error deleting API key:', error);
    return NextResponse.json(
      { error: 'Failed to delete API key' },
      { status: 500 }
    );
  }
}

/**
 * API handler for POST /api/api-keys/validate
 * Validates an API key
 */
export async function POST_validate(req: NextRequest) {
  try {
    // Get the authenticated session
    const session = await getServerSession(authOptions);
    
    if (!session || !session.user?.id) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }
    
    // Get request body
    const body = await req.json();
    
    // Validate required fields
    if (!body.id) {
      return NextResponse.json(
        { error: 'API key ID is required' },
        { status: 400 }
      );
    }
    
    // Get the API key to ensure it belongs to the user
    const existingKey = await apiKeyService.getById(body.id);
    if (!existingKey || existingKey.userId !== session.user.id) {
      return NextResponse.json(
        { error: 'API key not found or not owned by user' },
        { status: 404 }
      );
    }
    
    // Validate the API key
    const validation = await apiKeyService.validate(body.id);
    
    // Return validation result
    return NextResponse.json(validation);
  } catch (error) {
    console.error('Error validating API key:', error);
    return NextResponse.json(
      { error: 'Failed to validate API key' },
      { status: 500 }
    );
  }
}
