import React, { useState, useEffect } from 'react';
import {
  LifeBuoy,
  CheckCircle2,
  AlertTriangle,
  ArrowRight,
  TrendingDown,
  TrendingUp,
  FileText,
  Filter,
  Layers,
  ChevronRight,
  ShieldAlert
} from 'lucide-react';
import Badge from '../components/common/Badge';
import LoadingState from '../components/common/LoadingState';
import decisionSupportApi from '../api/decisionSupportApi';
import { useNotification } from '../context/NotificationContext';
import { useNavigate } from 'react-router-dom';

export const DecisionSupportPage = () => {
  const navigate = useNavigate();
  const { success } = useNotification();
  const [insights, setInsights] = useState([]);
  const [loading, setLoading] = useState(true);
  const [severityFilter, setSeverityFilter] = useState('ALL');

  useEffect(() => {
    const load = async () => {
      setLoading(true);
      try {
        const res = await decisionSupportApi.getInsights({ severity: severityFilter });
        setInsights(res.data);
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    };
    load();
  }, [severityFilter]);

  const handleTakeAction = (item) => {
    if (item.category.includes('Attendance')) {
      navigate('/attendance');
    } else if (item.category.includes('Risk')) {
      navigate('/at-risk');
    } else if (item.category.includes('Curricular')) {
      navigate('/performance');
    } else {
      navigate('/students');
    }
  };

  if (loading) {
    return <LoadingState message="Synthesizing academic decision heuristics..." subtext="Querying correlation matrices, attendance variance, and failure hazard models" />;
  }

  return (
    <div className="space-y-4">
      {/* Top Header */}
      <div className="bg-white p-3 border border-neutral-300 rounded shadow-panel flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3">
        <div>
          <h2 className="text-sm font-bold text-navy-950 uppercase tracking-wide flex items-center gap-2">
            <LifeBuoy className="w-4 h-4 text-teal-700" />
            <span>Institutional Decision Support & Heuristic Directives</span>
          </h2>
          <p className="text-xs text-neutral-500">
            Translating multidimensional educational data into concrete administrative interventions with empirical backing
          </p>
        </div>

        <div className="flex items-center gap-2 text-xs">
          <span className="text-neutral-500 font-medium">Filter Severity:</span>
          <select
            value={severityFilter}
            onChange={(e) => setSeverityFilter(e.target.value)}
            className="py-1 px-2.5 bg-neutral-50 border border-neutral-300 rounded text-xs text-neutral-800 font-medium"
          >
            <option value="ALL">All Severities</option>
            <option value="High">High Severity Only</option>
            <option value="Medium">Medium Severity</option>
            <option value="Low">Low / Positive Observation</option>
          </select>
        </div>
      </div>

      {/* Decision Cards List */}
      <div className="space-y-4">
        {insights.map((item) => {
          const isHigh = item.severity === 'High';
          const isMed = item.severity === 'Medium';
          const borderColor = isHigh ? 'border-l-4 border-l-red-600' : isMed ? 'border-l-4 border-l-amber-500' : 'border-l-4 border-l-teal-600';

          return (
            <div key={item.id} className={`inst-card p-5 bg-white ${borderColor} shadow-panel`}>
              <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-2 pb-3 mb-3 border-b border-neutral-200">
                <div>
                  <div className="flex items-center gap-2">
                    <span className="font-mono text-xs font-bold text-neutral-500">{item.id}</span>
                    <Badge variant={isHigh ? 'danger' : isMed ? 'warning' : 'teal'} size="xs">
                      {item.severity} Priority Directive
                    </Badge>
                    <span className="text-xs font-semibold text-neutral-600 bg-neutral-100 px-2 py-0.5 rounded border border-neutral-200">
                      {item.category}
                    </span>
                  </div>
                  <h3 className="text-base font-bold text-navy-950 mt-1 font-sans">
                    {item.title}
                  </h3>
                </div>

                <div className="text-right text-xs">
                  <div className="text-neutral-500">Affected Scope: <strong className="text-navy-900">{item.affectedCount} Students</strong></div>
                  <div className="text-[11px] text-neutral-400">Target Departments: {item.dept}</div>
                </div>
              </div>

              {/* Three-Box Structure: Insight -> Supporting Data -> Action Area */}
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-xs">
                {/* 1. Analytical Insight */}
                <div className="p-3 bg-neutral-50 border border-neutral-200 rounded">
                  <div className="text-[10px] font-bold uppercase tracking-wider text-neutral-500 mb-1 flex items-center gap-1">
                    <AlertTriangle className="w-3.5 h-3.5 text-navy-800" />
                    <span>Analytical Observation</span>
                  </div>
                  <p className="text-neutral-800 font-medium leading-relaxed">
                    {item.insight}
                  </p>
                </div>

                {/* 2. Empirical Supporting Data */}
                <div className="p-3 bg-navy-50/50 border border-navy-200 rounded">
                  <div className="text-[10px] font-bold uppercase tracking-wider text-navy-700 mb-1 flex items-center gap-1">
                    <CheckCircle2 className="w-3.5 h-3.5 text-teal-700" />
                    <span>Empirical Supporting Data (SciPy / OLS)</span>
                  </div>
                  <p className="text-navy-950 leading-relaxed font-sans text-xs">
                    {item.supportingData}
                  </p>
                </div>

                {/* 3. Action Area */}
                <div className="p-3 bg-teal-50/50 border border-teal-200 rounded flex flex-col justify-between">
                  <div>
                    <div className="text-[10px] font-bold uppercase tracking-wider text-teal-800 mb-1 flex items-center gap-1">
                      <ArrowRight className="w-3.5 h-3.5 text-teal-800" />
                      <span>Institutional Action Directive</span>
                    </div>
                    <p className="text-teal-950 font-medium leading-relaxed">
                      {item.actionArea}
                    </p>
                  </div>

                  <div className="pt-2 mt-2 border-t border-teal-200/60">
                    <button
                      onClick={() => handleTakeAction(item)}
                      className="w-full py-1 px-2.5 bg-navy-800 hover:bg-navy-900 text-white rounded text-xs font-semibold shadow-sm transition-colors text-center flex items-center justify-center gap-1"
                    >
                      <span>Execute Interventional Review</span>
                      <ChevronRight className="w-3 h-3" />
                    </button>
                  </div>
                </div>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};

export default DecisionSupportPage;
