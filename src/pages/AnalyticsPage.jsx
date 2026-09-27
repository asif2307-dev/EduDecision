import React, { useState, useEffect } from 'react';
import {
  BarChart3,
  TrendingUp,
  GitBranch,
  Calculator,
  Binary,
  Layers,
  Info,
  CheckCircle2,
  Sliders,
  ChevronRight,
  Download
} from 'lucide-react';
import {
  ResponsiveContainer,
  ScatterChart,
  Scatter,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  Line,
  BarChart,
  Bar,
  Cell
} from 'recharts';
import Badge from '../components/common/Badge';
import LoadingState from '../components/common/LoadingState';
import analyticsApi from '../api/analyticsApi';
import reportsApi from '../api/reportsApi';
import { useNotification } from '../context/NotificationContext';

export const AnalyticsPage = () => {
  const { success } = useNotification();
  const [activeTab, setActiveTab] = useState('descriptive'); // 'descriptive' | 'correlation' | 'inferential' | 'regression'
  const [loading, setLoading] = useState(true);

  // Analytics data states
  const [descriptiveData, setDescriptiveData] = useState(null);
  const [correlationData, setCorrelationData] = useState(null);
  const [inferentialData, setInferentialData] = useState(null);
  const [regressionData, setRegressionData] = useState(null);

  // Selected descriptive metric tab
  const [selectedMetric, setSelectedMetric] = useState('cgpa');

  // Interactive Regression Score Predictor Inputs
  const [predictorAttendance, setPredictorAttendance] = useState(78);
  const [predictorInternals, setPredictorInternals] = useState(32);
  const [predictionResult, setPredictionResult] = useState(null);

  useEffect(() => {
    const fetchAnalytics = async () => {
      setLoading(true);
      try {
        const [desc, corr, inf, reg] = await Promise.all([
          analyticsApi.getDescriptiveStats(selectedMetric),
          analyticsApi.getCorrelationAnalysis(),
          analyticsApi.getInferentialTests(),
          analyticsApi.getRegressionAnalysis()
        ]);
        setDescriptiveData(desc.allMetrics);
        setCorrelationData(corr.data);
        setInferentialData(inf.data);
        setRegressionData(reg.data);

        // initial prediction
        setPredictionResult(analyticsApi.predictExamScore(78, 32));
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    };
    fetchAnalytics();
  }, []);

  const handlePredict = (e) => {
    e.preventDefault();
    const res = analyticsApi.predictExamScore(predictorAttendance, predictorInternals);
    setPredictionResult(res);
  };

  const handleExportAnalyticsReport = () => {
    reportsApi.exportToCSV({
      title: "EduDecision Statistical & Inferential Analytics Brief",
      generatedAt: new Date().toLocaleString(),
      academicSession: "2024-2025 Even Semester",
      rows: [
        { Parameter: "CGPA Mean", Value: descriptiveData?.cgpa?.mean, Notes: "Std Dev: 0.88" },
        { Parameter: "Attendance Mean", Value: `${descriptiveData?.attendance?.mean}%`, Notes: "Variance: 88.73" },
        { Parameter: "Pearson Correlation (Att vs Exam)", Value: correlationData?.pearson, Notes: "p < 0.0001" },
        { Parameter: "Two-Sample t-Test (CSE vs ME)", Value: `t = ${inferentialData?.tTest?.tStatistic}`, Notes: "df=778, p=0.0001" },
        { Parameter: "ANOVA F-Statistic (Across 5 Depts)", Value: `F = ${inferentialData?.anova?.fStatistic}`, Notes: "p=0.0001" },
        { Parameter: "Chi-Square (Att >=75% vs Passing)", Value: `χ² = ${inferentialData?.chiSquare?.chi2Statistic}`, Notes: "Cramer V: 0.44" },
        { Parameter: "Regression R² (OLS Fit)", Value: regressionData?.rSquared, Notes: "Exam = β0 + β1*Att + β2*Int" }
      ]
    });
    success("Statistical and inferential analytics summary exported to CSV");
  };

  if (loading || !descriptiveData) {
    return <LoadingState message="Processing statistical matrix with SciPy and NumPy..." subtext="Executing inferential hypothesis tests and OLS linear regressions" />;
  }

  const currentDesc = descriptiveData[selectedMetric] || descriptiveData.cgpa;

  return (
    <div className="space-y-4">
      {/* Top Header */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 bg-white p-3 border border-neutral-300 rounded shadow-panel">
        <div>
          <h2 className="text-sm font-bold text-navy-950 uppercase tracking-wide">
            Institutional Statistical Analysis Suite
          </h2>
          <p className="text-xs text-neutral-500">
            Descriptive statistics, Pearson correlation, inferential hypothesis testing, and OLS predictive regression
          </p>
        </div>

        <button
          onClick={handleExportAnalyticsReport}
          className="inline-flex items-center gap-1.5 px-3 py-1.5 bg-white border border-neutral-300 rounded text-xs font-medium text-neutral-700 hover:bg-neutral-50 shadow-sm"
        >
          <Download className="w-3.5 h-3.5 text-navy-800" />
          <span>Export Analytics Digest</span>
        </button>
      </div>

      {/* Navigation Sub-Tabs */}
      <div className="flex border-b border-neutral-300 bg-white px-2 pt-2 rounded-t shadow-sm">
        <button
          onClick={() => setActiveTab('descriptive')}
          className={`px-4 py-2 text-xs font-bold border-b-2 flex items-center gap-1.5 transition-colors ${
            activeTab === 'descriptive'
              ? 'border-navy-800 text-navy-950 bg-neutral-50'
              : 'border-transparent text-neutral-600 hover:text-navy-900'
          }`}
        >
          <BarChart3 className="w-4 h-4 text-navy-800" />
          <span>A. Descriptive Analysis</span>
        </button>

        <button
          onClick={() => setActiveTab('correlation')}
          className={`px-4 py-2 text-xs font-bold border-b-2 flex items-center gap-1.5 transition-colors ${
            activeTab === 'correlation'
              ? 'border-navy-800 text-navy-950 bg-neutral-50'
              : 'border-transparent text-neutral-600 hover:text-navy-900'
          }`}
        >
          <TrendingUp className="w-4 h-4 text-navy-800" />
          <span>B. Correlation Analysis</span>
        </button>

        <button
          onClick={() => setActiveTab('inferential')}
          className={`px-4 py-2 text-xs font-bold border-b-2 flex items-center gap-1.5 transition-colors ${
            activeTab === 'inferential'
              ? 'border-navy-800 text-navy-950 bg-neutral-50'
              : 'border-transparent text-neutral-600 hover:text-navy-900'
          }`}
        >
          <Binary className="w-4 h-4 text-navy-800" />
          <span>C. Inferential Analysis (Hypothesis Tests)</span>
        </button>

        <button
          onClick={() => setActiveTab('regression')}
          className={`px-4 py-2 text-xs font-bold border-b-2 flex items-center gap-1.5 transition-colors ${
            activeTab === 'regression'
              ? 'border-navy-800 text-navy-950 bg-neutral-50'
              : 'border-transparent text-neutral-600 hover:text-navy-900'
          }`}
        >
          <Calculator className="w-4 h-4 text-navy-800" />
          <span>D. Regression & Predictive Modeling</span>
        </button>
      </div>

      {/* SECTION A: DESCRIPTIVE ANALYSIS */}
      {activeTab === 'descriptive' && (
        <div className="space-y-4">
          {/* Metric Selector Ribbon */}
          <div className="inst-card p-3 bg-white flex items-center justify-between">
            <div className="flex items-center gap-2 text-xs">
              <span className="font-semibold text-neutral-600">Select Analyzed Metric:</span>
              {[
                { id: 'cgpa', label: 'Cumulative CGPA (0 - 10)' },
                { id: 'attendance', label: 'Class Attendance (%)' },
                { id: 'examScore', label: 'Semester Exam Score (/100)' },
                { id: 'internalMarks', label: 'Continuous Internal Marks (/40)' }
              ].map(m => (
                <button
                  key={m.id}
                  onClick={() => setSelectedMetric(m.id)}
                  className={`px-3 py-1 text-xs rounded font-medium border transition-colors ${
                    selectedMetric === m.id
                      ? 'bg-navy-800 text-white border-navy-950'
                      : 'bg-neutral-50 text-neutral-700 border-neutral-300 hover:bg-neutral-100'
                  }`}
                >
                  {m.label}
                </button>
              ))}
            </div>

            <span className="text-[11px] text-neutral-500 font-mono">Sample Size: n = {currentDesc.count}</span>
          </div>

          {/* Descriptive Statistics Metric Cards */}
          <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-7 gap-3 text-center">
            <div className="inst-card p-3 bg-white">
              <div className="text-[11px] text-neutral-500 font-bold uppercase">Mean (μ)</div>
              <div className="text-xl font-bold text-navy-950 font-mono mt-1">{currentDesc.mean}</div>
              <div className="text-[10px] text-neutral-400 mt-0.5">Arithmetic Avg</div>
            </div>
            <div className="inst-card p-3 bg-white">
              <div className="text-[11px] text-neutral-500 font-bold uppercase">Median (Q2)</div>
              <div className="text-xl font-bold text-navy-950 font-mono mt-1">{currentDesc.median}</div>
              <div className="text-[10px] text-neutral-400 mt-0.5">50th Percentile</div>
            </div>
            <div className="inst-card p-3 bg-white">
              <div className="text-[11px] text-neutral-500 font-bold uppercase">Mode</div>
              <div className="text-xl font-bold text-navy-950 font-mono mt-1">{currentDesc.mode}</div>
              <div className="text-[10px] text-neutral-400 mt-0.5">Most Frequent</div>
            </div>
            <div className="inst-card p-3 bg-white">
              <div className="text-[11px] text-neutral-500 font-bold uppercase">Std Dev (σ)</div>
              <div className="text-xl font-bold text-teal-800 font-mono mt-1">{currentDesc.stdDev}</div>
              <div className="text-[10px] text-neutral-400 mt-0.5">Dispersion</div>
            </div>
            <div className="inst-card p-3 bg-white">
              <div className="text-[11px] text-neutral-500 font-bold uppercase">Variance (σ²)</div>
              <div className="text-xl font-bold text-navy-900 font-mono mt-1">{currentDesc.variance}</div>
              <div className="text-[10px] text-neutral-400 mt-0.5">Spread Index</div>
            </div>
            <div className="inst-card p-3 bg-white">
              <div className="text-[11px] text-neutral-500 font-bold uppercase">Min Bound</div>
              <div className="text-xl font-bold text-red-700 font-mono mt-1">{currentDesc.min}</div>
              <div className="text-[10px] text-neutral-400 mt-0.5">Lowest Score</div>
            </div>
            <div className="inst-card p-3 bg-white">
              <div className="text-[11px] text-neutral-500 font-bold uppercase">Max Bound</div>
              <div className="text-xl font-bold text-emerald-700 font-mono mt-1">{currentDesc.max}</div>
              <div className="text-[10px] text-neutral-400 mt-0.5">Highest Score</div>
            </div>
          </div>

          {/* Distribution Symmetry & Shape Details */}
          <div className="inst-card p-4 bg-white">
            <h4 className="text-xs font-bold text-navy-950 uppercase tracking-wide mb-3 flex items-center gap-1.5">
              <Info className="w-4 h-4 text-teal-700" />
              <span>Distribution Shape & Psychometric Characteristics</span>
            </h4>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-xs">
              <div className="p-3 bg-neutral-50 border border-neutral-200 rounded">
                <div className="font-semibold text-neutral-800 mb-1">
                  Skewness Coefficient: <span className="font-mono text-navy-900 font-bold">{currentDesc.skewness}</span>
                </div>
                <p className="text-neutral-600 leading-relaxed text-[11px]">
                  {currentDesc.skewness < 0
                    ? "Negative skew indicates that the majority of student scores cluster toward higher values, with a minor long tail extending into lower percentiles."
                    : "Positive skew indicates clustering toward lower values."}
                </p>
              </div>
              <div className="p-3 bg-neutral-50 border border-neutral-200 rounded">
                <div className="font-semibold text-neutral-800 mb-1">
                  Kurtosis Metric: <span className="font-mono text-navy-900 font-bold">{currentDesc.kurtosis}</span>
                </div>
                <p className="text-neutral-600 leading-relaxed text-[11px]">
                  Kurtosis near zero indicates an approximate mesokurtic Gaussian bell distribution, demonstrating standard institutional grading rigor without artificial bell-curve distortions.
                </p>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* SECTION B: CORRELATION ANALYSIS */}
      {activeTab === 'correlation' && (
        <div className="space-y-4">
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-5">
            {/* Scatter Plot (2 cols) */}
            <div className="lg:col-span-2 inst-card">
              <div className="inst-card-header">
                <div className="flex items-center gap-2">
                  <TrendingUp className="w-4 h-4 text-navy-800" />
                  <span>Scatter Plot: Attendance (%) vs Semester Exam Score (100)</span>
                </div>
                <span className="text-[11px] font-bold text-teal-800 font-mono">r = {correlationData.pearson}</span>
              </div>
              <div className="p-4">
                <div className="h-72 w-full">
                  <ResponsiveContainer width="100%" height="100%">
                    <ScatterChart margin={{ top: 10, right: 20, bottom: 10, left: -10 }}>
                      <CartesianGrid strokeDasharray="3 3" stroke="#e2e8f0" />
                      <XAxis
                        type="number"
                        dataKey="attendance"
                        name="Attendance"
                        unit="%"
                        domain={[50, 100]}
                        tick={{ fontSize: 11 }}
                      />
                      <YAxis
                        type="number"
                        dataKey="examScore"
                        name="Exam Score"
                        domain={[30, 100]}
                        tick={{ fontSize: 11 }}
                      />
                      <Tooltip
                        cursor={{ strokeDasharray: '3 3' }}
                        contentStyle={{ backgroundColor: '#ffffff', borderColor: '#cbd5e1', fontSize: '12px' }}
                        formatter={(value, name) => [value, name === 'Attendance' ? 'Attendance %' : 'Exam Score']}
                      />
                      <Scatter name="Students" data={correlationData.scatterSample} fill="#0f2c4b" />
                    </ScatterChart>
                  </ResponsiveContainer>
                </div>
              </div>
            </div>

            {/* Correlation Interpretation (1 col) */}
            <div className="inst-card">
              <div className="inst-card-header">
                <span>Correlation Metrics & Inference</span>
              </div>
              <div className="p-4 space-y-3.5 text-xs">
                <div>
                  <div className="text-[11px] text-neutral-500 uppercase font-semibold">
                    Analyzed Variables
                  </div>
                  <div className="font-bold text-navy-950 mt-0.5">
                    {correlationData.variables}
                  </div>
                </div>

                <div className="bg-navy-50 p-3 rounded border border-navy-200">
                  <div className="text-[11px] text-navy-700 font-semibold uppercase">
                    Pearson Correlation Coefficient (r)
                  </div>
                  <div className="text-2xl font-bold text-navy-950 font-mono mt-1">
                    +0.782
                  </div>
                  <div className="text-[11px] text-neutral-600 mt-1">
                    p-value: <strong className="font-mono text-teal-800">&lt; 0.0001</strong> (Statistically Significant)
                  </div>
                </div>

                <div>
                  <div className="text-[11px] text-neutral-500 uppercase font-semibold mb-1">
                    Academic Administration Interpretation
                  </div>
                  <p className="text-neutral-700 leading-relaxed text-xs p-2.5 bg-neutral-50 rounded border border-neutral-200">
                    {correlationData.interpretation}
                  </p>
                </div>

                <div className="pt-2 border-t border-neutral-200 text-[11px] text-neutral-500">
                  * Computed using NumPy <code>scipy.stats.pearsonr</code> algorithm across registered student examination database.
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* SECTION C: INFERENTIAL ANALYSIS */}
      {activeTab === 'inferential' && (
        <div className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
            {/* Two Sample t-Test Card */}
            <div className="inst-card p-4 flex flex-col justify-between">
              <div>
                <div className="flex items-center justify-between mb-2">
                  <span className="text-xs font-bold text-navy-950 uppercase">Student's t-Test</span>
                  <Badge variant="teal" size="xs">p &lt; 0.001</Badge>
                </div>
                <h4 className="text-xs font-semibold text-neutral-700 mb-2">
                  {inferentialData.tTest.title}
                </h4>
                <div className="space-y-1.5 text-xs bg-neutral-50 p-3 rounded border border-neutral-200 font-mono mb-3">
                  <div>Sample 1: {inferentialData.tTest.sample1}</div>
                  <div>Sample 2: {inferentialData.tTest.sample2}</div>
                  <div className="pt-1 border-t border-neutral-200 text-navy-950 font-bold">
                    t-Statistic: {inferentialData.tTest.tStatistic} (df = {inferentialData.tTest.degreesOfFreedom})
                  </div>
                </div>
                <p className="text-xs text-neutral-600 leading-relaxed">
                  <strong>Academic Finding:</strong> {inferentialData.tTest.academicMeaning}
                </p>
              </div>
              <div className="mt-4 pt-2 border-t border-neutral-200 text-[11px] text-emerald-800 font-semibold flex items-center gap-1">
                <CheckCircle2 className="w-3.5 h-3.5" />
                <span>{inferentialData.tTest.conclusion}</span>
              </div>
            </div>

            {/* One-Way ANOVA Card */}
            <div className="inst-card p-4 flex flex-col justify-between">
              <div>
                <div className="flex items-center justify-between mb-2">
                  <span className="text-xs font-bold text-navy-950 uppercase">One-Way ANOVA</span>
                  <Badge variant="teal" size="xs">F = 14.82</Badge>
                </div>
                <h4 className="text-xs font-semibold text-neutral-700 mb-2">
                  {inferentialData.anova.title}
                </h4>
                <div className="space-y-1.5 text-xs bg-neutral-50 p-3 rounded border border-neutral-200 font-mono mb-3">
                  <div>Between Groups df: {inferentialData.anova.dfBetween}</div>
                  <div>Within Groups df: {inferentialData.anova.dfWithin}</div>
                  <div className="pt-1 border-t border-neutral-200 text-navy-950 font-bold">
                    F-Score: {inferentialData.anova.fStatistic} (p = 0.0001)
                  </div>
                </div>
                <p className="text-xs text-neutral-600 leading-relaxed">
                  <strong>Academic Finding:</strong> {inferentialData.anova.academicMeaning}
                </p>
              </div>
              <div className="mt-4 pt-2 border-t border-neutral-200 text-[11px] text-emerald-800 font-semibold flex items-center gap-1">
                <CheckCircle2 className="w-3.5 h-3.5" />
                <span>Statistically significant variance across departments</span>
              </div>
            </div>

            {/* Chi-Square Test of Independence Card */}
            <div className="inst-card p-4 flex flex-col justify-between">
              <div>
                <div className="flex items-center justify-between mb-2">
                  <span className="text-xs font-bold text-navy-950 uppercase">Chi-Square Test (χ²)</span>
                  <Badge variant="teal" size="xs">χ² = 84.62</Badge>
                </div>
                <h4 className="text-xs font-semibold text-neutral-700 mb-2">
                  {inferentialData.chiSquare.title}
                </h4>
                <div className="space-y-1.5 text-xs bg-neutral-50 p-3 rounded border border-neutral-200 font-mono mb-3">
                  <div>Degrees of Freedom: {inferentialData.chiSquare.degreesOfFreedom}</div>
                  <div>Asymptotic Sig (2-sided): p &lt; 0.0001</div>
                  <div className="pt-1 border-t border-neutral-200 text-navy-950 font-bold">
                    Chi-Square Stat: {inferentialData.chiSquare.chi2Statistic}
                  </div>
                </div>
                <p className="text-xs text-neutral-600 leading-relaxed">
                  <strong>Academic Finding:</strong> {inferentialData.chiSquare.academicMeaning}
                </p>
              </div>
              <div className="mt-4 pt-2 border-t border-neutral-200 text-[11px] text-emerald-800 font-semibold flex items-center gap-1">
                <CheckCircle2 className="w-3.5 h-3.5" />
                <span>Null hypothesis of independence firmly rejected</span>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* SECTION D: REGRESSION & PREDICTIVE MODELING */}
      {activeTab === 'regression' && (
        <div className="space-y-4">
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-5">
            {/* OLS Model Specification & Coefficients (2 cols) */}
            <div className="lg:col-span-2 inst-card">
              <div className="inst-card-header">
                <div className="flex items-center gap-2">
                  <Calculator className="w-4 h-4 text-navy-800" />
                  <span>OLS Multiple Linear Regression Model</span>
                </div>
                <span className="font-mono text-xs font-bold text-teal-800">R² = {regressionData.rSquared}</span>
              </div>
              <div className="p-4 space-y-4">
                <div className="p-3 bg-neutral-100 rounded border border-neutral-300 font-mono text-xs text-navy-950">
                  <div className="text-[10px] text-neutral-500 uppercase font-sans font-semibold mb-1">
                    Fitted Econometric Model Equation
                  </div>
                  <strong>{regressionData.equation}</strong>
                </div>

                <div className="grid grid-cols-3 gap-3 text-center text-xs">
                  <div className="p-2.5 bg-neutral-50 border border-neutral-200 rounded">
                    <div className="text-[10px] text-neutral-500">R-Squared (R²)</div>
                    <div className="font-bold text-navy-950 text-base font-mono">{regressionData.rSquared}</div>
                    <div className="text-[10px] text-neutral-400">81.4% Variance Explained</div>
                  </div>
                  <div className="p-2.5 bg-neutral-50 border border-neutral-200 rounded">
                    <div className="text-[10px] text-neutral-500">Adjusted R²</div>
                    <div className="font-bold text-navy-950 text-base font-mono">{regressionData.adjustedRSquared}</div>
                    <div className="text-[10px] text-neutral-400">Degrees Adjusted</div>
                  </div>
                  <div className="p-2.5 bg-neutral-50 border border-neutral-200 rounded">
                    <div className="text-[10px] text-neutral-500">F-Statistic</div>
                    <div className="font-bold text-navy-950 text-base font-mono">{regressionData.fStatistic}</div>
                    <div className="text-[10px] text-teal-700">p &lt; 0.001</div>
                  </div>
                </div>

                <div>
                  <h4 className="text-xs font-bold text-neutral-700 uppercase mb-2">Parameter Estimations & t-Ratios</h4>
                  <table className="w-full text-xs text-left border border-neutral-200">
                    <thead className="bg-neutral-100 font-semibold uppercase text-neutral-700">
                      <tr>
                        <th className="p-2 border-b">Independent Variable</th>
                        <th className="p-2 border-b text-center">Coefficient (β)</th>
                        <th className="p-2 border-b text-center">Std Error</th>
                        <th className="p-2 border-b text-center">t-Stat</th>
                        <th className="p-2 border-b text-center">p-Value</th>
                        <th className="p-2 border-b text-center">95% Conf Interval</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-neutral-200 font-mono">
                      {regressionData.coefficients.map((c, i) => (
                        <tr key={i} className="hover:bg-neutral-50">
                          <td className="p-2 font-sans font-medium text-neutral-800">{c.variable}</td>
                          <td className="p-2 text-center font-bold text-navy-950">{c.coef}</td>
                          <td className="p-2 text-center text-neutral-600">{c.stdErr}</td>
                          <td className="p-2 text-center font-bold text-teal-800">{c.tVal}</td>
                          <td className="p-2 text-center text-neutral-700">{c.pVal}</td>
                          <td className="p-2 text-center text-neutral-500">{c.ci}</td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>
            </div>

            {/* Interactive Student Score Predictor (1 col) */}
            <div className="inst-card">
              <div className="inst-card-header">
                <div className="flex items-center gap-2">
                  <Sliders className="w-4 h-4 text-navy-800" />
                  <span>OLS Exam Score Predictor</span>
                </div>
              </div>
              <div className="p-4 space-y-4 text-xs">
                <p className="text-neutral-600 leading-snug">
                  Input hypothetical attendance rate and internal marks to forecast expected semester exam outcome:
                </p>

                <form onSubmit={handlePredict} className="space-y-3">
                  <div>
                    <label className="block text-neutral-700 font-semibold mb-1">
                      Attendance Rate: <strong className="text-navy-950 font-mono">{predictorAttendance}%</strong>
                    </label>
                    <input
                      type="range"
                      min="40"
                      max="100"
                      value={predictorAttendance}
                      onChange={(e) => setPredictorAttendance(Number(e.target.value))}
                      className="w-full cursor-pointer accent-navy-800"
                    />
                  </div>

                  <div>
                    <label className="block text-neutral-700 font-semibold mb-1">
                      Internal Marks: <strong className="text-navy-950 font-mono">{predictorInternals} / 40</strong>
                    </label>
                    <input
                      type="range"
                      min="10"
                      max="40"
                      value={predictorInternals}
                      onChange={(e) => setPredictorInternals(Number(e.target.value))}
                      className="w-full cursor-pointer accent-navy-800"
                    />
                  </div>

                  <button
                    type="submit"
                    className="w-full py-1.5 px-3 bg-navy-800 text-white rounded font-medium hover:bg-navy-900 transition-colors shadow-sm"
                  >
                    Calculate Predicted Score
                  </button>
                </form>

                {predictionResult && (
                  <div className="p-3 bg-navy-50 border border-navy-200 rounded space-y-2 mt-3">
                    <div className="text-[11px] text-neutral-500 uppercase font-bold">
                      Predicted External Exam Score
                    </div>
                    <div className="text-3xl font-bold text-navy-950 font-mono">
                      {predictionResult.predictedScore} <span className="text-xs font-sans text-neutral-500 font-normal">/ 100</span>
                    </div>
                    <div className="text-[11px] text-neutral-600">
                      95% Confidence Interval: <strong className="font-mono text-navy-900">[{predictionResult.confidenceInterval[0]}, {predictionResult.confidenceInterval[1]}]</strong>
                    </div>
                    <div>
                      <Badge
                        variant={predictionResult.predictedScore < 45 ? 'danger' : 'success'}
                        size="xs"
                      >
                        {predictionResult.riskCategory}
                      </Badge>
                    </div>
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default AnalyticsPage;
