// Decision Support API Service
import apiClient from './apiClient';
import { DECISION_INSIGHTS } from '../data/mockData';

export const decisionSupportApi = {
  async getInsights(params = {}) {
    const { category = 'ALL', severity = 'ALL' } = params;
    try {
      const res = await apiClient.get('/decision-support/insights');
      if (res && res.data) return res;
    } catch {
      // Fallback
    }

    let records = [...DECISION_INSIGHTS];
    if (category && category !== 'ALL') {
      records = records.filter(r => r.category.toLowerCase().includes(category.toLowerCase()));
    }
    if (severity && severity !== 'ALL') {
      records = records.filter(r => r.severity.toLowerCase() === severity.toLowerCase());
    }

    return {
      success: true,
      data: records,
      total: records.length
    };
  }
};

export default decisionSupportApi;
