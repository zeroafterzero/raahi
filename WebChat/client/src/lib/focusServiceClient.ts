import { apiRequest } from "./queryClient";

interface StartSessionRequest {
  userId: string;
  sessionType: string;
  durationRequested: number;
  startedAt: Date;
}

interface EndSessionRequest {
  endedAt: Date;
  durationActual: number;
  completed: boolean;
}

interface StartSessionResponse {
  sessionId: string;
}

class FocusServiceClient {
  async startSession(data: StartSessionRequest): Promise<string> {
    const response = await apiRequest('POST', '/api/focus/start', data);
    const result: StartSessionResponse = await response.json();
    return result.sessionId;
  }

  async endSession(sessionId: string, data: EndSessionRequest): Promise<void> {
    await apiRequest('POST', '/api/focus/end', {
      sessionId,
      ...data,
    });
  }

  async getStats(range: 'today' | 'week' | 'month' = 'today', userId: string = 'default-user') {
    const response = await apiRequest('GET', `/api/focus/stats?range=${range}&userId=${userId}`, undefined);
    return await response.json();
  }

  async exportData(format: 'csv' | 'pdf', range: 'week' | 'month' = 'month', userId: string = 'default-user') {
    const response = await apiRequest('POST', '/api/focus/export', {
      format,
      range,
      userId,
    });
    
    if (format === 'csv') {
      return await response.text();
    } else {
      return await response.json();
    }
  }
}

export const focusServiceClient = new FocusServiceClient();
