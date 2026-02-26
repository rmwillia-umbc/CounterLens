import React, { useState, useEffect, useMemo, useCallback } from 'react';
import './index.css';
import {
  BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer,
  Cell, ScatterChart, Scatter, ReferenceLine, LabelList
} from 'recharts';
import {
  Settings, GraduationCap, Target, RefreshCw, Fingerprint, ShieldAlert,
  HelpCircle, Info, Globe, User, ExternalLink, X, ChevronRight, School, Database, BookOpen, BarChart3, Activity, Scale,
  Sparkles, Layout
} from 'lucide-react';

/**
 * AI/ML Ethics Lab - Berkeley Admission Simulator V2.2
 * * Final Polish:
 * 1. Fixed rendering bug (ensured default export).
 * 2. Pixel-Perfect Horizon Alignment: Footers (Lab Guide, Results, Ethics Alert) aligned at h-24.
 * 3. Enhanced Breathing Room: Clear separation between input features and output results.
 * 4. Academic Integrity: Credits update and dataset reference included.
 */

const DEFAULT_WEIGHTS = { gpa: 40, sat: 30, athlete: 10, firstGen: 10, gender: 5, resident: 5 };

const COLORS = {
  admit: '#10b981', reject: '#ef4444', accent: '#3b82f6', slate: '#475569',
  emerald: '#10b981', amber: '#f59e0b', rose: '#ef4444', indigo: '#6366f1',
  barDefault: '#6366f1'
};

const TRANSLATIONS = {
  en: {
    title: "What-If Lab",
    accuracy: "Model Accuracy",
    params: "Parameters",
    threshold: "Threshold",
    weights: "Weights (%)",
    gpa: "GPA", sat: "SAT", athlete: "ATHLETE", firstGen: "1ST-GEN", gender: "GENDER (FAVOR FEMALE)", resident: "RESIDENT",
    visualizer: "Counterfactual Visualizer",
    inspector: "Feature Inspector",
    editor: "Counterfactual Editor",
    slices: "Dataset Slices",
    axesInfo: "X: GPA | Y: SAT",
    admit: "ADMIT", reject: "REJECT",
    original: "Original Profile", whatif: "What-If Editor",
    score: "Score", fate: "Result",
    metrics: "Fairness & Metrics", groupRate: "Admission Rate (%)",
    confusion: "Confusion Matrix", tp: "True Positive", fp: "False Positive", tn: "True Negative", fn: "False Negative",
    labGuide: "Lab Guide", nextTip: "Next Task",
    normalize: "Normalize", random: "Random", reset: "Zero", default: "Default",
    creditsTitle: "Project Team & Institution",
    leadTitle: "Principal Investigator",
    contributorTitle: "Researcher & Developer",
    projectLead: "Prof. Rebecca Williams",
    contributor: "Eric Yang",
    datasetTribute: "Dataset Reference",
    datasetDesc: "Inspired by the UC Berkeley 1973 Admissions Dataset (Bickel et al., 1975). Used for exploring Simpson's Paradox and algorithmic bias.",
    department: "Dept. of Computer Science and Electrical Engineering (CSEE)",
    college: "College of Engineering and Information Technology",
    university: "University of Maryland, Baltimore County (UMBC)",
    visitLab: "Visit Lab Site", visitDept: "Department Website",
    aboutBtn: "Credits", decisionBoundary: "Decision Boundary",
    ethicsAlert: "Ethics Scanner",
    ethicsDesc: "High accuracy can sometimes mask systematic exclusion of minorities.",
    ethAccuracy: "Accuracy Paradox: High precision might be codifying historical biases.",
    ethBalance: "Weight Imbalance: Over-reliance on a single metric ignores holistic potential.",
    ethDisparity: "Disparity Detected: Current weights create significant group inequality.",
    ethGenderBias: "Gender Bias: High SAT weights are causing a significant disparity.",
    ethThreshold: "Extreme Standard: This cutoff may lead to mass exclusion or zero selection.",
    ethNeutral: "Balance Mode: Model appears stable, but always watch the 'False Negatives'.",
    disparityMeter: "Disparity Meter",
    genderGap: "Gender Gap",
    yes: "YES", no: "NO", male: "MALE", female: "FEMALE", nonbinary: "NON-BINARY",
    thresholdWiki: "https://en.wikipedia.org/wiki/Threshold",
    confusionWiki: "https://en.wikipedia.org/wiki/Confusion_matrix",
    thresholdExplainer: "The threshold is the policy cutoff. A student's score is a weighted sum of attributes. Adjusting this represents changing admission standards.",
    confusionExplainer: "Compares decisions with 'hidden potential'. identifies successes and failures like 'False Negatives' (unfairly rejected).",
    scannerExplainer: "The Scanner continuously audits your model for algorithmic bias and systemic risks. It monitors the 'Accuracy Paradox', weight imbalances, and demographic disparities to ensure fairness.",
    scannerWiki: "https://en.wikipedia.org/wiki/Algorithmic_bias",
    learnMore: "Wikipedia",
    axisSwap: "Swap Axes",
    margin: "Decision Margin (L2)",
    marginWiki: "https://en.wikipedia.org/wiki/Euclidean_distance",
    marginExplainer: "The Decision Margin (L2) represents the shortest distance from a student's profile to the admission boundary in a normalized feature space. A smaller margin indicates a 'fragile' decision where minor profile changes could flip the result.",
    weightsWiki: "https://en.wikipedia.org/wiki/Coefficient",
    weightsExplainer: "Weights define the relative importance of each feature. A high GPA weight means the model prioritizes academic history over other attributes like SAT or residency.",
    inspectorWiki: "https://en.wikipedia.org/wiki/Feature_selection",
    inspectorExplainer: "The Inspector allows you to examine a specific data point's attributes and see how they contribute to the final decision. It provides granular detail for individual audit.",
    editorWiki: "https://en.wikipedia.org/wiki/Counterfactual_conditional",
    editorExplainer: "The Editor enables you to manipulate features to see 'what if' the inputs were different. This helps in understanding the model's decision boundaries and sensitivity."
  },
  zh: {
    title: "What-If Lab",
    accuracy: "模型准确度",
    params: "模型参数调节",
    threshold: "录取门槛",
    weights: "特征权重 (%)",
    gpa: "GPA", sat: "SAT", athlete: "运动员", firstGen: "一代生", gender: "性别权重 (偏向女性)", resident: "本州居民",
    visualizer: "反事实可视化 (Visualizer)",
    inspector: "特征审查 (Inspector)",
    editor: "反事实编辑 (Editor)",
    slices: "数据集切片 (Slices)",
    axesInfo: "横轴: GPA | 纵轴: SAT",
    admit: "录取", reject: "拒绝",
    original: "原始档案", whatif: "反事实编辑器",
    score: "得分", fate: "判定结果",
    metrics: "评估指标", groupRate: "群体录取率 (%)",
    confusion: "混淆矩阵", tp: "正确通过 (TP)", fp: "误判录取 (FP)", tn: "正确拒绝 (TN)", fn: "误判拒绝 (FN)",
    labGuide: "探究任务", nextTip: "下一项任务",
    normalize: "归一化", random: "随机", reset: "清零", default: "恢复默认",
    creditsTitle: "项目团队与机构",
    leadTitle: "首席研究员 (PI)",
    contributorTitle: "研究员与开发者",
    projectLead: "Prof. Rebecca Williams",
    contributor: "Eric Yang",
    datasetTribute: "数据集引用",
    datasetDesc: "受 1973 年加州大学伯克利分校录取数据集启发，用于探讨辛普森悖论与算法偏见。",
    department: "计算机科学与电气工程系 (CSEE)",
    college: "工程与信息技术学院",
    university: "马里兰大学巴尔的摩郡分校 (UMBC)",
    visitLab: "访问实验室主页", visitDept: "访问系部官网",
    aboutBtn: "关于项目", decisionBoundary: "录取分界线",
    ethicsAlert: "伦理诊断扫描仪",
    ethicsDesc: "高准确度有时会以牺牲少数群体的代表性为代价。",
    ethAccuracy: "准确度悖论：过高的准确度可能正在固化历史上的系统性偏见。",
    ethBalance: "权重失衡：过度依赖单一指标会忽略对学生全方位潜能的评估。",
    ethDisparity: "监测到录取不公：当前的权重配置导致了明显的群体间不平等。",
    ethGenderBias: "检测到性别偏见：由于 SAT 权重过高，导致了明显的性别倾向差距。",
    ethThreshold: "极端录取标准：当前的门槛可能导致大规模人才排斥或盲目准入。",
    ethNeutral: "平衡观察中：当前模型相对稳定，但请持续关注‘误判拒绝’案例。",
    disparityMeter: "公平性仪表盘",
    genderGap: "性别录取差距",
    yes: "是", no: "否", male: "男性", female: "女性", nonbinary: "非二元",
    thresholdWiki: "https://zh.wikipedia.org/wiki/%E9%98%88%E5%80%BC",
    confusionWiki: "https://zh.wikipedia.org/wiki/%E6%B7%B7%E6%B7%86%E7%9F%A9%E9%98%B5",
    thresholdExplainer: "录取门槛是及格线。系统计算加权总分，达到门槛则录取。调高门槛代表录取标准变严。",
    confusionExplainer: "混淆矩阵对比判定结果与真实潜质。它揭示了误判录取（错误选拔）和误判拒绝（排斥人才）。",
    scannerExplainer: "伦理扫描仪实时审计模型的算法偏见与系统性风险。它会持续监控‘准确度悖论’、‘权重失衡’、‘群体不公’等核心指标，并提供实时诊断反馈。",
    scannerWiki: "https://zh.wikipedia.org/wiki/%E7%AE%97%E6%B3%95%E5%81%8F%E8%A7%81",
    learnMore: "维基百科",
    axisSwap: "轴向切换",
    margin: "决策余量 (L2 距离)",
    marginWiki: "https://zh.wikipedia.org/wiki/%E6%AC%A7%E5%87%A0%E9%87%8C%E5%BE%97%E8%B7%9D%E7%A6%BB",
    marginExplainer: "决策余量（L2 距离）代表了学生在标准化特征空间中距离录取边界线的最短距离。余量越小，说明该判定越‘脆弱’，微小的档案改动（如 SAT 波动）就可能逆转录取结果。",
    weightsWiki: "https://zh.wikipedia.org/wiki/%E7%B3%BB%E6%95%B0",
    weightsExplainer: "权重定义了每个特征的相对重要性。设置较高的 GPA 权重意味着模型在评估时会优先考虑学术历史，而非 SAT 或身份背景等其他指标。",
    inspectorWiki: "https://zh.wikipedia.org/wiki/%E7%89%B9%E5%BE%81%E9%80%89%E6%8B%A9",
    inspectorExplainer: "特征审查面板允许你深入检查特定数据点的各项属性，并观察它们如何共同决定最终的录取逻辑。这是对个体判定的精确审计。",
    editorWiki: "https://zh.wikipedia.org/wiki/%E5%8F%8D%E4%BA%8B%E5%AE%9E%E6%9D%A1%E4%BB%B6",
    editorExplainer: "反事实编辑器允许你模拟改变输入特征，观察‘如果当初不同’会如何影响判定。这能帮助你理解模型判定的敏感度和界限。"
  },
  es: {
    title: "What-If Lab",
    accuracy: "Precisión",
    params: "Parámetros",
    threshold: "Umbral",
    weights: "Pesos (%)",
    gpa: "GPA", sat: "SAT", athlete: "ATLETA", firstGen: "1RA-GEN", gender: "GÉNERO (FAVOR FEM)", resident: "RESIDENTE",
    visualizer: "Visualizador What-If",
    inspector: "Inspector de Perfil",
    editor: "Editor What-If",
    slices: "Dataset Slices",
    axesInfo: "X: GPA | Y: SAT",
    admit: "ADMITIR", reject: "RECHAZAR",
    original: "Original", whatif: "Editor What-If",
    score: "Puntaje", fate: "Resultado",
    metrics: "Métricas", groupRate: "Tasa por Grupo (%)",
    confusion: "Matriz", tp: "Real Pos", fp: "Falso Pos", tn: "Real Neg", fn: "Falso Neg",
    labGuide: "Guía Lab", nextTip: "Siguiente",
    normalize: "Normalizar", random: "Azar", reset: "Cero", default: "Defecto",
    creditsTitle: "Equipo e Institución",
    leadTitle: "Investigador Principal",
    contributorTitle: "Investigador y Desarrollador",
    projectLead: "Prof. Rebecca Williams",
    contributor: "Eric Yang",
    datasetTribute: "Referencia de Datos",
    datasetDesc: "Inspirado en el conjunto de datos de admisiones de UC Berkeley 1973.",
    department: "Depto. de Ciencias (CSEE)",
    college: "Facultad de Ingeniería",
    university: "UMBC",
    visitLab: "Visitar Lab", visitDept: "Visitar Depto.",
    aboutBtn: "Créditos", decisionBoundary: "Límite",
    ethicsAlert: "Escáner Ético",
    ethicsDesc: "La alta precisión puede ocultar la exclusión de minorías.",
    ethAccuracy: "Paradoja de Precisión: La alta fidelidad puede estar codificando sesgos.",
    ethBalance: "Desequilibrio: La dependencia de una métrica ignora el potencial holístico.",
    ethDisparity: "Desigualdad Detectada: Los pesos crean una brecha grupal significativa.",
    ethGenderBias: "Sesgo de Género: Los altos pesos del SAT están causando una brecha significativa.",
    ethThreshold: "Estándar Extremo: Este límite puede causar una exclusión masiva.",
    ethNeutral: "Modo de Equilibrio: Modelo estable, pero vigile los 'Falsos Negativos'.",
    disparityMeter: "Medidor de Disparidad",
    genderGap: "Brecha de Género",
    yes: "SÍ", no: "NO", male: "MASC", female: "FEM", nonbinary: "NO-BIN",
    thresholdWiki: "https://es.wikipedia.org/wiki/Umbral",
    confusionWiki: "https://es.wikipedia.org/wiki/Matriz_de_confusi%C3%B3n",
    thresholdExplainer: "El umbral es el punto de corte. El puntaje se calcula sumando atributos por sus pesos.",
    confusionExplainer: "Compara decisiones con el potencial real. Identifica aciertos y errores injustos.",
    scannerExplainer: "El Escáner audita continuamente el modelo en busca de sesgos algorítmicos. Monitorea paradojas de precisión, desequilibrio de pesos y desigualdades demográficas para garantizar la equidad.",
    scannerWiki: "https://es.wikipedia.org/wiki/Sesgo_algor%C3%ADtmico",
    learnMore: "Wikipedia",
    axisSwap: "Cambiar Ejes"
  }
};

const LAB_TIPS = {
  en: [
    "Select a 'Rejected' student and use 'Editor'. Look at the yellow path as they cross the boundary!",
    "Click 'FP' in the matrix. High-accuracy models often hide these unfair admissions.",
    "Enable 'Mine Edge Cases'. Notice how tiny score changes toggle their fate.",
    "Click the '1st-Gen' bar. Are these students closer to the rejection zone?",
    "Increase 'SAT' weight. Watch the pulse of edge-case students shift.",
    "Swap Axes. Does the admission pattern look different from this perspective?",
    "Try to achieve 90% accuracy. Does this configuration harm first-gen students?",
    "Set SAT weight to 0. Is this a more equitable model for lower-income groups?"
  ],
  zh: [
    "选中一名“拒绝”学生并使用编辑器。观察跨越分界线时的金色人生轨迹！",
    "点击矩阵中的'FP'。高准确度的模型往往隐藏了这些不公平的录取。",
    "点击切片中的'一代生'。这些学生是否普遍更接近拒绝区域？",
    "大幅调高 SAT 权重。观察由于权重变化导致的‘疑难案例’脉冲闪烁。",
    "切换 X/Y 轴。从不同的维度看，录取模式是否有显著差异？",
    "尝试达到 90% 的准确度。这个配置是否损害了一代生的利益？",
    "将 SAT 权重设为 0。这对于低收入群体是否是一个更公平的模型？"
  ],
  es: [
    "Selecciona un estudiante rechazado. ¡Mira la trayectoria dorada al cruzar el límite!",
    "Haz clic en 'FP' en la matriz. Los modelos precisos suelen ocultar admisiones injustas.",
    "Activa 'Minería de Casos'. Observa cómo cambios mínimos alteran su destino.",
    "Haz clic en '1ra Gen'. ¿Están estos estudiantes más cerca de la zona de rechazo?",
    "Aumenta el peso del SAT. Observa cómo parpadean los casos críticos al cambiar pesos.",
    "Cambiar Ejes. ¿Se ve diferente el patrón de admisión desde esta perspectiva?",
    "Intenta llegar al 90% de precisión. ¿Afecta a las minorías?",
    "Pon el peso del SAT en 0. ¿Es este un modelo más equitativo?"
  ]
};

const generateData = () => {
  const data = [];
  for (let i = 0; i < 100; i++) {
    const gpa = parseFloat((Math.random() * 1.5 + 2.5).toFixed(2));
    const sat = Math.floor(Math.random() * 400 + 1200);
    const isAthlete = Math.random() > 0.88;
    const isFirstGen = Math.random() > 0.75;
    const isResident = Math.random() > 0.4;
    // Allow natural data imbalance for educational exploration
    const gender = Math.random() > 0.45 ? 'Female' : 'Male';
    const latentPotential = (gpa * 18) + (sat / 1600 * 20) + (Math.random() * 15);
    const actualLabel = latentPotential > 72;
    data.push({ id: i, gpa, sat, isAthlete, isFirstGen, isResident, gender, label: actualLabel, x: gpa, y: sat });
  }
  return data;
};

const INITIAL_POOL = generateData();

const App = () => {
  const [lang, setLang] = useState('en');
  const t = TRANSLATIONS[lang] || TRANSLATIONS.en;
  const [showCredits, setShowCredits] = useState(false);
  const [explainer, setExplainer] = useState(null);
  const [tipIndex, setTipIndex] = useState(0);

  const [data] = useState(INITIAL_POOL);
  const [threshold, setThreshold] = useState(65);
  const [weights, setWeights] = useState({ ...DEFAULT_WEIGHTS });
  const [selectedId, setSelectedId] = useState(0);
  const [cfProfile, setCfProfile] = useState({ ...INITIAL_POOL[0] });
  const [swapAxes, setSwapAxes] = useState(false);
  const [filterMode, setFilterMode] = useState(null); // { type: 'confusion'|'slice', value: string }
  const [isMining, setIsMining] = useState(false);
  const [glassMode, setGlassMode] = useState(true);

  const originalStudent = useMemo(() => data.find(s => s.id === selectedId) || data[0], [data, selectedId]);

  useEffect(() => { if (originalStudent) setCfProfile({ ...originalStudent }); }, [originalStudent]);

  const formatVal = (val, type) => {
    if (type === 'gender') return t[val.toLowerCase()] || val;
    if (type === 'boolean') return val ? t.yes : t.no;
    return val;
  };

  const calcScore = (p, w) => {
    if (!p) return 0;
    // Normalize GPA (2.5-4.0) and SAT (1200-1600) to 0-100 range for proper weighting
    const normalizedGpa = (p.gpa - 2.5) / 1.5 * 100;
    const normalizedSat = (p.sat - 1200) / 400 * 100;

    const sGpa = (normalizedGpa * w.gpa) / 100;
    const sSat = (normalizedSat * w.sat) / 100;
    const sAth = p.isAthlete ? w.athlete : 0;
    const sFst = p.isFirstGen ? w.firstGen : 0;
    const sGen = p.gender === 'Female' ? w.gender : 0;
    const sRes = p.isResident ? w.resident : 0;
    return Math.min(100, Math.max(0, sGpa + sSat + sAth + sFst + sGen + sRes));
  };

  const isAdmitted = (p) => calcScore(p, weights) >= threshold;

  const boundaryVal = useMemo(() => {
    const p = cfProfile;
    if (!swapAxes) {
      if (weights.sat === 0) return null;
      const normalizedGpa = (p.gpa - 2.5) / 1.5 * 100;
      const otherScores = (normalizedGpa * weights.gpa) / 100 + (p.isAthlete ? weights.athlete : 0) + (p.isFirstGen ? weights.firstGen : 0) + (p.gender === 'Female' ? weights.gender : 0) + (p.isResident ? weights.resident : 0);
      const neededSatNorm = (threshold - otherScores) / weights.sat * 100;
      const val = (neededSatNorm / 100 * 400) + 1200;
      return val >= 800 && val <= 1600 ? val : null;
    } else {
      if (weights.gpa === 0) return null;
      const normalizedSat = (p.sat - 1200) / 400 * 100;
      const otherScores = (normalizedSat * weights.sat) / 100 + (p.isAthlete ? weights.athlete : 0) + (p.isFirstGen ? weights.firstGen : 0) + (p.gender === 'Female' ? weights.gender : 0) + (p.isResident ? weights.resident : 0);
      const neededGpaNorm = (threshold - otherScores) / weights.gpa * 100;
      const val = (neededGpaNorm / 100 * 1.5) + 2.5;
      return val >= 2.0 && val <= 4.0 ? val : null;
    }
  }, [cfProfile, weights, threshold, swapAxes]);

  const stats = useMemo(() => {
    let tp = 0, fp = 0, tn = 0, fn = 0;
    const groups = { athlete: { c: 0, a: 0 }, firstGen: { c: 0, a: 0 }, female: { c: 0, a: 0 }, male: { c: 0, a: 0 }, resident: { c: 0, a: 0 } };
    data.forEach(s => {
      const pred = isAdmitted(s);
      if (pred && s.label) tp++; else if (pred && !s.label) fp++; else if (!pred && !s.label) tn++; else if (!pred && s.label) fn++;
      if (s.isAthlete) { groups.athlete.c++; if (pred) groups.athlete.a++; }
      if (s.isFirstGen) { groups.firstGen.c++; if (pred) groups.firstGen.a++; }
      if (s.gender === 'Female') { groups.female.c++; if (pred) groups.female.a++; }
      if (s.gender === 'Male') { groups.male.c++; if (pred) groups.male.a++; }
      if (s.isResident) { groups.resident.c++; if (pred) groups.resident.a++; }
    });
    const total = data.length || 1;
    const femaleRate = Math.round(groups.female.a / groups.female.c * 100) || 0;
    const maleRate = Math.round(groups.male.a / groups.male.c * 100) || 0;
    const genderGap = Math.abs(femaleRate - maleRate);

    const allRates = [
      Math.round(groups.athlete.a / groups.athlete.c * 100) || 0,
      Math.round(groups.firstGen.a / groups.firstGen.c * 100) || 0,
      femaleRate,
      maleRate,
      Math.round(groups.resident.a / groups.resident.c * 100) || 0
    ];
    const maxGap = Math.max(...allRates) - Math.min(...allRates);

    return {
      tp, fp, tn, fn,
      accuracy: (((tp + tn) / total) * 100).toFixed(1),
      tpRate: Math.round((tp / total) * 100),
      fpRate: Math.round((fp / total) * 100),
      fnRate: Math.round((fn / total) * 100),
      tnRate: Math.round((tn / total) * 100),
      genderGap,
      maxGap,
      groupStats: [
        { name: t.athlete, rate: Math.round(groups.athlete.a / groups.athlete.c * 100) || 0, count: groups.athlete.c, admitted: groups.athlete.a },
        { name: t.firstGen, rate: Math.round(groups.firstGen.a / groups.firstGen.c * 100) || 0, count: groups.firstGen.c, admitted: groups.firstGen.a },
        { name: t.female, rate: femaleRate, count: groups.female.c, admitted: groups.female.a },
        { name: t.male, rate: maleRate, count: groups.male.c, admitted: groups.male.a },
        { name: t.resident, rate: Math.round(groups.resident.a / groups.resident.c * 100) || 0, count: groups.resident.c, admitted: groups.resident.a }
      ]
    };
  }, [data, weights, threshold, t, lang]);

  const trajectoryData = useMemo(() => {
    if (!originalStudent || !cfProfile) return [];
    // Ensure we provide keys matching the chart's dataKey logic
    return [
      { id: 'orig', gpa: originalStudent.gpa, sat: originalStudent.sat, isOrig: true },
      { id: 'cf', gpa: cfProfile.gpa, sat: cfProfile.sat, isOrig: false }
    ];
  }, [originalStudent, cfProfile]);

  const isCrossed = useMemo(() => {
    return isAdmitted(originalStudent) !== isAdmitted(cfProfile);
  }, [originalStudent, cfProfile, weights, threshold]);

  const checkMatch = useCallback((entry) => {
    if (!filterMode) return true;
    const pred = isAdmitted(entry);
    if (filterMode.type === 'confusion') {
      const status = (pred && entry.label) ? 'TP' : (pred && !entry.label) ? 'FP' : (!pred && entry.label) ? 'FN' : 'TN';
      return status === filterMode.value;
    } else if (filterMode.type === 'slice') {
      if (filterMode.value === t.athlete) return entry.isAthlete;
      if (filterMode.value === t.firstGen) return entry.isFirstGen;
      if (filterMode.value === t.resident) return entry.isResident;
      if (filterMode.value === (lang === 'zh' ? '女性' : (lang === 'es' ? 'FEM' : 'Female'))) return entry.gender === 'Female';
      if (filterMode.value === (lang === 'zh' ? '男性' : (lang === 'es' ? 'MASC' : 'Male'))) return entry.gender === 'Male';
    }
    return true;
  }, [filterMode, weights, threshold, t, lang]);

  const getMargin = useCallback((p) => {
    if (!p) return null;
    const s = calcScore(p, weights);
    const diff = s - threshold;

    const g1 = weights.gpa / 100;
    const g2 = weights.sat / 100;
    const denomNorm = g1 * g1 + g2 * g2;

    if (denomNorm === 0) return { margin: "0.00", projection: { gpa: p.gpa, sat: p.sat } };

    const dist = Math.abs(diff) / Math.sqrt(denomNorm);

    const A = weights.gpa / 1.5;
    const B = weights.sat / 400;
    const dRaw = A * A + B * B;
    const xp = p.gpa - (A * diff) / dRaw;
    const yp = p.sat - (B * diff) / dRaw;

    return {
      margin: dist.toFixed(2),
      rawMargin: dist,
      projection: { gpa: xp, sat: yp }
    };
  }, [weights, threshold]);

  const marginStats = useMemo(() => getMargin(originalStudent), [originalStudent, getMargin]);
  const cfMarginStats = useMemo(() => getMargin(cfProfile), [cfProfile, getMargin]);

  const hardSamples = useMemo(() => {
    if (!isMining) return [];
    return data
      .map(s => ({ ...s, dist: Math.abs(calcScore(s, weights) - threshold) }))
      .sort((a, b) => a.dist - b.dist)
      .slice(0, 8);
  }, [data, weights, threshold, isMining]);

  const handleCfChange = (f, v) => setCfProfile(p => ({ ...p, [f]: v }));

  const dynamicAlert = useMemo(() => {
    // 1. Gender Gap Alert (Highest Priority as requested)
    if (stats.genderGap > 20 && weights.sat > 40) return t.ethGenderBias;

    // 2. Accuracy Check
    if (stats.accuracy > 85) return t.ethAccuracy;

    // 3. Disparity Check (Max vs Min rate difference)
    if (stats.maxGap > 25) return t.ethDisparity;

    // 4. Weight Concentration Check
    const maxWeight = Math.max(...Object.values(weights));
    if (maxWeight > 60) return t.ethBalance;

    // 5. Threshold Extremes
    if (threshold > 85 || threshold < 35) return t.ethThreshold;

    return t.ethNeutral;
  }, [stats, weights, threshold, t]);

  const handleWeights = (action) => {
    let newWeights = { ...weights };
    const keys = Object.keys(weights);
    if (action === 'normalize' || action === 'random') {
      const vals = action === 'normalize' ? Object.values(weights) : keys.map(() => Math.random());
      const sum = vals.reduce((a, b) => a + b, 0);
      if (sum === 0) return;
      let runningSum = 0;
      keys.forEach((k, i) => {
        if (i === keys.length - 1) newWeights[k] = 100 - runningSum;
        else { newWeights[k] = Math.round((vals[i] / sum) * 100); runningSum += newWeights[k]; }
      });
    } else if (action === 'reset') {
      keys.forEach(k => newWeights[k] = 0);
    } else if (action === 'default') {
      newWeights = { ...DEFAULT_WEIGHTS };
    }
    setWeights(newWeights);
  };

  return (
    <div className={`h-screen ${glassMode ? 'glass-active' : 'bg-[#0d1117]'} text-slate-300 font-sans p-3 overflow-hidden flex flex-col relative selection:bg-blue-500/30 transition-colors duration-700`}>
      {glassMode && (
        <div className="mesh-bg">
          <div className="mesh-circle w-[600px] h-[600px] bg-blue-600/10 -top-[20%] -left-[10%]"></div>
          <div className="mesh-circle w-[500px] h-[500px] bg-purple-600/10 top-[40%] -right-[5%]"></div>
          <div className="mesh-circle w-[400px] h-[400px] bg-pink-600/10 -bottom-[10%] left-[20%]"></div>
        </div>
      )}

      {/* Overlay Modals */}
      {(showCredits || explainer) && (
        <div className="absolute inset-0 z-50 flex items-center justify-center p-6 bg-black/80 backdrop-blur-md animate-in fade-in duration-300">
          <div className={`bg-[#161b22] border border-slate-700 w-full max-w-xl rounded-3xl pt-6 px-8 pb-8 shadow-2xl relative ${glassMode ? 'glass-card' : ''}`}>

            {showCredits && (
              <div className="flex flex-col items-center text-center space-y-6">
                <div className="p-4 bg-blue-600 rounded-2xl shadow-lg shadow-blue-500/20"><GraduationCap className="w-10 h-10 text-white" /></div>
                <h2 className="text-2xl font-black text-white uppercase tracking-tight">{t.creditsTitle}</h2>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-3 w-full">
                  <div className="p-4 bg-slate-800/40 rounded-2xl border border-slate-700/50 flex items-center gap-3">
                    <User className="w-5 h-5 text-blue-400" />
                    <div className="text-left">
                      <p className="text-xs text-slate-500 font-bold uppercase tracking-widest leading-none mb-1">{t.leadTitle}</p>
                      <p className="text-sm font-bold text-slate-200">{t.projectLead}</p>
                    </div>
                  </div>
                  <div className="p-4 bg-slate-800/40 rounded-2xl border border-slate-700/50 flex items-center gap-3">
                    <ShieldAlert className="w-5 h-5 text-purple-400" />
                    <div className="text-left">
                      <p className="text-xs text-slate-500 font-bold uppercase tracking-widest leading-none mb-1">{t.contributorTitle}</p>
                      <p className="text-sm font-bold text-slate-200">{t.contributor}</p>
                    </div>
                  </div>
                </div>
                <div className="w-full p-5 bg-slate-900/50 rounded-2xl border border-slate-800 space-y-4 text-left">
                  <div className="flex items-center gap-3">
                    <School className="w-5 h-5 text-slate-400 flex-shrink-0" />
                    <div className="flex-1 min-w-0">
                      <p className="text-[11px] text-slate-400 font-bold uppercase leading-tight mb-1">{t.department}</p>
                      <p className="text-[11px] text-slate-400 font-bold uppercase leading-tight mb-1">{t.college}</p>
                      <p className="text-xs font-bold text-slate-200 truncate">{t.university}</p>
                    </div>
                  </div>
                  <div className="border-t border-slate-800 pt-3">
                    <div className="flex items-center gap-2 mb-1"><Database className="w-3.5 h-3.5 text-blue-400" /><p className="text-xs text-slate-400 font-black uppercase tracking-widest">{t.datasetTribute}</p></div>
                    <p className="text-[13px] text-slate-500 leading-snug">{t.datasetDesc}</p>
                  </div>
                  <div className="flex gap-2 pt-2">
                    <a href="https://sites.google.com/umbc.edu/prof-rebecca-williams/" target="_blank" className="flex-1 flex items-center justify-center gap-2 px-4 py-2 bg-blue-600 hover:bg-blue-500 text-white rounded-xl text-[13px] font-bold transition-all"><ExternalLink className="w-3 h-3" /> {t.visitLab}</a>
                    <a href="https://www.csee.umbc.edu/" target="_blank" className="flex-1 flex items-center justify-center gap-2 px-4 py-2 bg-slate-700 hover:bg-slate-600 text-white rounded-xl text-[13px] font-bold transition-all"><Globe className="w-3 h-3" /> {t.visitDept}</a>
                  </div>
                  <div className="pt-2 flex justify-end">
                    <button onClick={() => setShowCredits(false)} className="px-8 py-2 bg-blue-600 hover:bg-blue-500 text-white rounded-lg text-xs font-black uppercase transition-all btn-tactile btn-primary-tactile">OK</button>
                  </div>
                </div>
              </div>
            )}

            {explainer && (
              <div className="flex flex-col space-y-4">
                <div className="flex items-center gap-3">
                  <div className="p-3 bg-blue-500/10 rounded-xl text-blue-400"><BookOpen className="w-6 h-6" /></div>
                  <h3 className="text-xl font-black text-white uppercase tracking-tight">
                    {explainer === 'threshold' ? t.threshold :
                      explainer === 'confusion' ? t.confusion :
                        explainer === 'margin' ? t.margin :
                          explainer === 'weights' ? t.weights :
                            explainer === 'inspector' ? t.inspector :
                              explainer === 'editor' ? t.editor :
                                t.ethicsAlert}
                  </h3>
                </div>
                <div className="bg-slate-900/50 p-6 rounded-2xl border border-slate-800">
                  <p className="text-slate-300 text-sm font-medium leading-relaxed">
                    {explainer === 'threshold' ? t.thresholdExplainer :
                      explainer === 'confusion' ? t.confusionExplainer :
                        explainer === 'margin' ? t.marginExplainer :
                          explainer === 'weights' ? t.weightsExplainer :
                            explainer === 'inspector' ? t.inspectorExplainer :
                              explainer === 'editor' ? t.editorExplainer :
                                t.scannerExplainer}
                  </p>
                </div>
                <div className="pt-2 flex justify-between items-center">
                  <a href={explainer === 'threshold' ? t.thresholdWiki :
                    explainer === 'confusion' ? t.confusionWiki :
                      explainer === 'margin' ? t.marginWiki :
                        explainer === 'weights' ? t.weightsWiki :
                          explainer === 'inspector' ? t.inspectorWiki :
                            explainer === 'editor' ? t.editorWiki :
                              t.scannerWiki} target="_blank" className="flex items-center gap-2 text-xs font-bold text-blue-400 hover:underline"><ExternalLink className="w-4 h-4" /> {t.learnMore}</a>
                  <button onClick={() => setExplainer(null)} className="px-8 py-2 bg-blue-600 hover:bg-blue-500 text-white rounded-lg text-xs font-black uppercase transition-all btn-tactile btn-primary-tactile">OK</button>
                </div>
              </div>
            )}
          </div>
        </div>
      )}

      {/* Header */}
      <header className={`flex items-center justify-between mb-3 border-b ${glassMode ? 'border-white/5' : 'border-slate-800/40'} pb-2 flex-shrink-0 z-10 transition-colors ${glassMode ? 'glass-header' : ''}`}>
        <div className="flex items-center gap-4">
          <div className="relative flex items-center justify-center">
            <div className="absolute inset-0 bg-amber-500/20 blur-lg rounded-full"></div>
            <Scale className="w-7 h-7 text-amber-500 relative z-10 drop-shadow-[0_0_8px_rgba(245,158,11,0.5)]" />
          </div>
          <div className="flex flex-col">
            <h1 className="text-lg font-black text-white uppercase tracking-tighter leading-none">{t.title}</h1>
            <div className="flex items-center gap-2 mt-0.5">
              <span className="text-[10px] text-amber-500/80 font-black uppercase tracking-[0.2em] leading-none">Powered by UMBC</span>
              <span className="text-[10px] text-slate-400 font-bold border-l border-slate-800 pl-2 uppercase tracking-widest leading-none">V2.2</span>
            </div>
          </div>
        </div>
        <div className="flex items-center gap-3">
          <button
            onClick={() => setGlassMode(!glassMode)}
            className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-[10px] font-black uppercase transition-all duration-500 btn-tactile ${glassMode ? 'bg-gradient-to-r from-blue-600 to-indigo-600 text-white shadow-[0_0_20px_rgba(37,99,235,0.4)] border-transparent' : 'bg-[#161b22] border border-slate-800 text-slate-400 hover:text-indigo-400'}`}
          >
            <Sparkles className={`w-3 h-3 ${glassMode ? 'animate-pulse' : ''}`} />
            {lang === 'zh' ? '毛玻璃' : (lang === 'es' ? 'CRISTAL' : 'GLASS')}
          </button>
          <button onClick={() => setShowCredits(true)} className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-black uppercase bg-[#161b22] border border-slate-800 text-slate-400 hover:text-blue-400 transition-all btn-tactile"><Info className="w-3.5 h-3.5" /> {t.aboutBtn}</button>
          <div className="flex bg-[#161b22] rounded-lg p-0.5 border border-slate-800">
            {['en', 'zh', 'es'].map(l => (
              <button key={l} onClick={() => setLang(l)} className={`px-2 py-1 rounded text-xs font-black uppercase transition-all btn-tactile ${lang === l ? 'bg-blue-600 text-white shadow-lg shadow-blue-500/20' : 'text-slate-500 hover:text-white'}`}>
                {l}
              </button>
            ))}
          </div>
          <div className={`${glassMode ? 'bg-white/5 border-white/10' : 'bg-slate-900 border-slate-800'} px-4 py-1 rounded-xl border flex items-center gap-3 transition-colors`}>
            <p className="text-xs text-slate-400 font-black uppercase">{t.accuracy}</p>
            <p className="text-lg font-black text-blue-500">{stats.accuracy}%</p>
          </div>
        </div>
      </header>

      {/* Main Grid: Precision balanced to 20% : 60% : 20% ratio */}
      <div className="flex-1 grid grid-cols-[20%_1fr_20%] gap-3 min-h-0">

        {/* LEFT Column (20%) */}
        <section className="flex flex-col gap-3 min-h-0">
          <div className="bg-[#161b22] border border-slate-800 rounded-2xl glass-card p-4 flex-1 flex flex-col gap-4 shadow-xl aurora-border overflow-hidden">
            <div className="flex justify-between items-center border-b border-slate-800 pb-2 flex-shrink-0">
              <h2 className="text-[13px] font-black uppercase text-slate-400 tracking-widest flex items-center gap-2"><Settings className="w-3 h-3 text-blue-500" /> {t.params}</h2>
              <div className={`text-[11px] font-mono font-black px-1.5 py-0.5 rounded border ${Object.values(weights).reduce((a, b) => a + b, 0) === 100 ? 'border-emerald-500 text-emerald-500' : 'border-amber-500 text-amber-500'}`}>Σ={Object.values(weights).reduce((a, b) => a + b, 0)}%</div>
            </div>

            <div className="flex-1 flex flex-col gap-4 overflow-hidden">
              {/* Threshold: The Decision Gateway (Emphasized) */}
              <div className="bg-rose-500/[0.03] border border-rose-500/10 rounded-xl p-3 relative overflow-hidden group">
                <div className="absolute left-0 top-0 bottom-0 w-1 bg-rose-500/40"></div>
                <div className="space-y-2 relative z-10">
                  <div className="flex justify-between items-start">
                    <div className="flex flex-col">
                      <div className="flex items-center gap-1.5 text-[11px] font-black text-rose-400 uppercase tracking-widest mb-0.5">
                        <GraduationCap className="w-3.5 h-3.5" /> {t.threshold}
                        <button onClick={() => setExplainer('threshold')} className="text-slate-600 hover:text-blue-400 transition-colors btn-tactile p-0.5"><HelpCircle className="w-2.5 h-2.5" /></button>
                      </div>
                      <span className="text-[8px] font-black text-rose-500/60 uppercase tracking-tighter">Master Policy Gateway</span>
                    </div>
                    <div className="text-right flex flex-col">
                      <span className="text-rose-400 font-mono text-xl font-black leading-none drop-shadow-[0_0_8px_rgba(244,63,94,0.4)]">{threshold}</span>
                      <span className="text-[8px] font-bold text-slate-600 uppercase">Percentile</span>
                    </div>
                  </div>
                  <input type="range" min="0" max="100" value={threshold} onChange={(e) => setThreshold(parseInt(e.target.value))} className="w-full accent-rose-500 h-1" />
                </div>
              </div>

              <div className="flex flex-col gap-2 min-h-0 flex-1">
                <div className="flex flex-col gap-1.5">
                  <h3 className="text-xs font-black text-slate-400 uppercase tracking-widest flex items-center gap-1">
                    {t.weights}
                    <button onClick={() => setExplainer('weights')} className="text-slate-600 hover:text-blue-400 transition-colors btn-tactile p-0.5"><HelpCircle className="w-[11px] h-[11px]" /></button>
                  </h3>
                  <div className="grid grid-cols-2 gap-1 px-0.5">
                    <button onClick={() => handleWeights('normalize')} className="text-[10px] bg-blue-500/10 hover:bg-blue-500/20 text-blue-400 border border-blue-500/20 py-0.5 rounded uppercase font-bold transition-all active:scale-95 btn-tactile btn-primary-tactile">{t.normalize}</button>
                    <button onClick={() => handleWeights('default')} className="text-[10px] bg-indigo-500/10 hover:bg-indigo-500/20 text-indigo-400 border border-indigo-500/20 py-0.5 rounded uppercase font-bold transition-all active:scale-95 btn-tactile">{t.default}</button>
                    <button onClick={() => handleWeights('random')} className="text-[10px] bg-slate-800 hover:bg-slate-700 text-slate-300 border border-slate-700 py-0.5 rounded uppercase font-bold transition-all active:scale-95 btn-tactile">{t.random}</button>
                    <button onClick={() => handleWeights('reset')} className="text-[10px] bg-rose-500/10 hover:bg-rose-500/20 text-rose-400 border border-rose-500/20 py-0.5 rounded uppercase font-bold transition-all active:scale-95 btn-tactile">{t.reset}</button>
                  </div>
                </div>
                <div className="flex-1 space-y-1.5 pr-0.5 overflow-hidden">
                  {Object.keys(weights).map(k => (
                    <div key={k} className="space-y-0 relative group">
                      <div className="flex justify-between text-[10px] font-bold leading-none mb-0.5">
                        <span className="text-slate-400 capitalize truncate max-w-[120px]">{t[k] || k}</span>
                        <span className="text-blue-400 font-mono">{weights[k]}%</span>
                      </div>
                      <input type="range" min="0" max="100" value={weights[k]} onChange={(e) => setWeights(p => ({ ...p, [k]: parseInt(e.target.value) }))} className="w-full h-1" />
                      <div className="absolute -left-1.5 top-0 bottom-0 w-0.5 bg-blue-500/40 rounded opacity-0 group-hover:opacity-100 transition-opacity" />
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
          {/* Lab Guide fixed height h-24 */}
          <div className={`bg-[#161b22] border border-slate-800 rounded-2xl p-3 shadow-xl relative overflow-hidden h-24 flex-shrink-0 flex flex-col active:scale-[0.98] transition-all cursor-pointer aurora-border ${glassMode ? 'glass-card' : ''}`}>
            <div className="flex justify-between items-center mb-2">
              <p className="font-black text-xs tracking-widest uppercase text-slate-400 flex items-center gap-2"><BookOpen className="w-3 h-3 text-blue-500" /> {t.labGuide}</p>
              <button onClick={(e) => { e.stopPropagation(); setTipIndex((tipIndex + 1) % LAB_TIPS[lang].length); }} className="p-1 hover:bg-slate-800 rounded-lg flex items-center gap-0.5 text-[11px] font-black uppercase text-blue-400 transition-colors btn-tactile">
                {t.nextTip} <ChevronRight className="w-3 h-3" />
              </button>
            </div>
            <p className="text-[13px] leading-tight italic font-medium text-slate-300">"{LAB_TIPS[lang][tipIndex]}"</p>
            <div className="absolute -bottom-2 -right-2 w-10 h-10 opacity-[0.05] text-blue-500"><Info className="w-full h-full" /></div>
          </div>
        </section>

        {/* MIDDLE Column (60%) */}
        <section className="flex flex-col gap-3 min-h-0">
          <div className="bg-[#161b22] border border-slate-800 rounded-2xl glass-card p-4 h-[53%] relative shadow-inner aurora-border">
            <div className="flex flex-col mb-1">
              <div className="flex justify-between items-center">
                <div className="flex items-center gap-3">
                  <h3 className="text-[13px] font-black text-slate-500 uppercase tracking-widest flex items-center gap-2"><Activity className="w-3 h-3" /> {t.visualizer}</h3>
                  <button onClick={() => setSwapAxes(!swapAxes)} className="flex items-center gap-1.5 px-2 py-0.5 rounded bg-blue-500/10 border border-blue-500/20 text-blue-400 text-[10px] font-black uppercase hover:bg-blue-500/20 transition-all active:scale-95 btn-tactile btn-primary-tactile">
                    <RefreshCw className={`w-2.5 h-2.5 ${swapAxes ? 'rotate-180' : ''} transition-transform`} /> {t.axisSwap}
                  </button>
                  <button onClick={() => setIsMining(!isMining)} className={`flex items-center gap-1.5 px-2 py-0.5 rounded border text-[10px] font-black uppercase transition-all active:scale-95 btn-tactile ${isMining ? 'bg-amber-500 border-amber-400 text-white shadow-lg shadow-amber-500/20' : 'bg-slate-800 border-slate-700 text-slate-400 hover:border-slate-500'}`}>
                    <Target className={`w-2.5 h-2.5 ${isMining ? 'animate-spin-slow' : ''}`} /> {lang === 'zh' ? '挖掘疑难样本' : (lang === 'es' ? 'Minería' : 'Mine Edge Cases')}
                  </button>
                </div>
                <div className="flex gap-3 text-[11px] font-black uppercase tracking-wider">
                  <span className="flex items-center gap-1"><div className="w-1.5 h-1.5 rounded-full bg-emerald-500" /> {t.admit}</span>
                  <span className="flex items-center gap-1"><div className="w-1.5 h-1.5 rounded-full bg-rose-500" /> {t.reject}</span>
                </div>
              </div>
            </div>
            <div className="h-[calc(100%-20px)] w-full relative group">
              {/* Physical Truncation Marks (Standard Scientific Notation) */}
              <div className="absolute bottom-[28px] left-[34px] flex flex-col gap-0.5 rotate-[-20deg] pointer-events-none select-none opacity-50 z-10">
                <div className="w-3.5 h-[1.5px] bg-slate-500 rounded-full shadow-[0_0_5px_rgba(0,0,0,0.5)]"></div>
                <div className="w-3.5 h-[1.5px] bg-slate-500 rounded-full shadow-[0_0_5px_rgba(0,0,0,0.5)]"></div>
              </div>
              <ResponsiveContainer>
                <ScatterChart margin={{ top: 20, right: 40, bottom: 20, left: 10 }}>

                  <CartesianGrid strokeDasharray="3 3" stroke={glassMode ? "rgba(255,255,255,0.03)" : "#21262d"} vertical={false} />
                  <XAxis type="number" dataKey={!swapAxes ? "gpa" : "sat"} domain={!swapAxes ? [2.5, 4.0] : [1200, 1600]} stroke="#484f58" fontSize={10} tick={{ fontFamily: 'JetBrains Mono' }} allowDataOverflow={true} label={{ value: !swapAxes ? 'GPA' : 'SAT', position: 'insideBottomRight', offset: -10, fill: '#64748b', fontSize: 10, fontFamily: 'JetBrains Mono', fontWeight: '900' }} />
                  <YAxis type="number" dataKey={!swapAxes ? "sat" : "gpa"} domain={!swapAxes ? [1200, 1600] : [2.5, 4.0]} stroke="#484f58" fontSize={10} tick={{ fontFamily: 'JetBrains Mono' }} allowDataOverflow={true} label={{ value: !swapAxes ? 'SAT' : 'GPA', angle: -90, position: 'insideLeft', offset: 10, fill: '#64748b', fontSize: 10, fontFamily: 'JetBrains Mono', fontWeight: '900' }} />
                  {boundaryVal !== null && (
                    <ReferenceLine y={boundaryVal} stroke="#3b82f6" strokeDasharray="4 4" strokeWidth={1.5} label={{ position: 'right', value: t.decisionBoundary, fill: '#3b82f6', fontSize: 9, fontWeight: '900', letterSpacing: '0.1em' }} />
                  )}

                  {/* Scientific Projections */}
                  {selectedId !== null && originalStudent && (
                    <>
                      <ReferenceLine
                        x={!swapAxes ? originalStudent.gpa : originalStudent.sat}
                        stroke="#3b82f6"
                        strokeDasharray="3 3"
                        opacity={0.3}
                        label={{
                          position: 'top',
                          value: !swapAxes ? originalStudent.gpa.toFixed(2) : Math.round(originalStudent.sat),
                          fill: '#3b82f6',
                          fontSize: 8,
                          fontFamily: 'JetBrains Mono',
                          fontWeight: 'bold'
                        }}
                      />
                      <ReferenceLine
                        y={!swapAxes ? originalStudent.sat : originalStudent.gpa}
                        stroke="#3b82f6"
                        strokeDasharray="3 3"
                        opacity={0.3}
                        label={{
                          position: 'right',
                          value: !swapAxes ? Math.round(originalStudent.sat) : originalStudent.gpa.toFixed(2),
                          fill: '#3b82f6',
                          fontSize: 8,
                          fontFamily: 'JetBrains Mono',
                          fontWeight: 'bold'
                        }}
                      />
                    </>
                  )}

                  <Scatter
                    data={data}
                    onClick={(e) => e && e.id !== undefined && setSelectedId(e.id)}
                  >
                    {data.map((entry, index) => {
                      const pred = isAdmitted(entry);
                      const isMatch = checkMatch(entry);
                      const isHard = isMatch && hardSamples.some(h => h.id === entry.id);
                      const isSelected = isMatch && selectedId === entry.id;

                      return (
                        <Cell
                          key={index}
                          fill={pred ? COLORS.admit : COLORS.reject}
                          stroke={isSelected ? 'white' : (isHard ? '#fbbf24' : 'transparent')}
                          strokeWidth={isHard || isSelected ? 2 : 1}
                          opacity={isMatch ? 1 : 0.15}
                          className={isHard ? 'animate-pulse' : ''}
                          style={{
                            cursor: 'pointer',
                            transition: 'all 0.3s ease',
                            filter: isHard ? 'drop-shadow(0 0 4px rgba(251, 191, 36, 0.8))' : 'none'
                          }}
                        />
                      );
                    })}
                  </Scatter>

                  {/* Trajectory Line */}
                  <Scatter
                    data={trajectoryData}
                    line={{
                      stroke: isCrossed ? '#fbbf24' : '#3b82f6',
                      strokeWidth: 2,
                      strokeDasharray: '5 5',
                      filter: isCrossed ? 'drop-shadow(0 0 8px rgba(251, 191, 36, 0.6))' : 'none'
                    }}
                    shape={() => null}
                    opacity={checkMatch(originalStudent) ? 1 : 0.15}
                  />

                  {/* Current What-If Point (Larger/Glowing) */}
                  <Scatter data={[trajectoryData[1]]}>
                    <Cell
                      fill={isAdmitted(cfProfile) ? COLORS.admit : COLORS.reject}
                      stroke="white"
                      strokeWidth={3}
                      className={checkMatch(originalStudent) && isCrossed ? 'animate-pulse' : ''}
                      opacity={checkMatch(originalStudent) ? 1 : 0.15}
                      style={{ filter: checkMatch(originalStudent) ? 'drop-shadow(0 0 10px rgba(255,255,255,0.4))' : 'none' }}
                    />
                  </Scatter>

                  {/* Margin Shortest Path Line (Original) */}
                  {selectedId !== null && originalStudent && marginStats && (
                    <Scatter
                      data={[
                        { gpa: originalStudent.gpa, sat: originalStudent.sat },
                        marginStats.projection
                      ]}
                      line={{ stroke: '#3b82f6', strokeWidth: 1, strokeDasharray: '3 3', opacity: 0.4 }}
                      shape={() => null}
                      opacity={checkMatch(originalStudent) ? 1 : 0.15}
                    />
                  )}

                  {/* Margin Shortest Path Line (Counterfactual) */}
                  {cfProfile && cfMarginStats && (
                    <Scatter
                      data={[
                        { gpa: cfProfile.gpa, sat: cfProfile.sat },
                        cfMarginStats.projection
                      ]}
                      line={{ stroke: '#fbbf24', strokeWidth: 1, strokeDasharray: '2 2', opacity: 0.6 }}
                      shape={() => null}
                      opacity={checkMatch(originalStudent) ? 1 : 0.15}
                    />
                  )}
                </ScatterChart>
              </ResponsiveContainer>
            </div>
          </div>

          <div className={`bg-[#161b22] border-2 border-blue-500/30 rounded-3xl overflow-hidden grid grid-cols-2 flex-1 divide-x divide-slate-800 shadow-xl min-h-0 aurora-border ${glassMode ? 'glass-card border-none' : ''}`}>

            {/* FEATURE INSPECTOR */}
            <div className="p-3 flex flex-col min-h-0 bg-[#0d1117]/20 h-full overflow-hidden">
              <div className="flex items-center justify-between border-b border-slate-800 pb-1.5 flex-shrink-0">
                <div className="flex items-center gap-2 text-[11px] font-black text-slate-400 uppercase tracking-widest"><Fingerprint className="w-3.5 h-3.5" /> {t.inspector}</div>
                <button onClick={() => setExplainer('inspector')} className="text-slate-700 hover:text-blue-400 transition-colors btn-tactile p-0.5"><HelpCircle className="w-[11px] h-[11px]" /></button>
              </div>

              <div className="flex-1 flex flex-col justify-start min-h-0 gap-2.5 pt-2.5">
                <div className="space-y-2">
                  <div className="space-y-0 opacity-70">
                    <div className="flex justify-between text-[10px] font-bold text-slate-400 tracking-wider uppercase leading-none"><span>GPA</span><span className="font-mono">{originalStudent.gpa.toFixed(2)}</span></div>
                    <input type="range" min="2.0" max="4.0" step="0.01" value={originalStudent.gpa} disabled className="w-full h-1 bg-slate-800 rounded-full accent-slate-600 opacity-50 pointer-events-none" />
                  </div>
                  <div className="space-y-0 opacity-70">
                    <div className="flex justify-between text-[10px] font-bold text-slate-400 tracking-wider uppercase leading-none"><span>SAT</span><span className="font-mono">{originalStudent.sat}</span></div>
                    <input type="range" min="800" max="1600" step="10" value={originalStudent.sat} disabled className="w-full h-1 bg-slate-800 rounded-full accent-slate-600 opacity-50 pointer-events-none" />
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-1.5">
                  {[
                    { label: t.athlete, active: originalStudent.isAthlete, isBool: true },
                    { label: t.firstGen, active: originalStudent.isFirstGen, isBool: true },
                    { label: formatVal(originalStudent.gender, 'gender'), active: true, isBool: false },
                    { label: t.resident, active: originalStudent.isResident, isBool: true }
                  ].map((btn, idx) => (
                    <div key={idx} className={`h-9 flex items-center justify-center rounded-xl border text-[9px] font-black uppercase tracking-tight transition-all duration-300 ${btn.active ? 'bg-indigo-500/10 border-indigo-500/20 text-indigo-400 shadow-[0_0_15px_rgba(99,102,241,0.05)]' : 'bg-slate-800/20 border-slate-700/30 text-slate-600'}`}>
                      {btn.isBool ? `${btn.label}: ${btn.active ? t.yes : t.no}` : btn.label}
                    </div>
                  ))}
                </div>

                <div className="flex items-center justify-between px-3 bg-slate-800/20 border border-slate-700/30 rounded-xl h-[60px] shadow-inner relative group btn-tactile cursor-default !justify-between">
                  <div className="flex flex-col">
                    <div className="flex items-center gap-2 mb-0.5">
                      <span className="text-[9px] font-black text-slate-400 uppercase tracking-widest leading-none">{t.margin}</span>
                      <button onClick={() => setExplainer('margin')} className="p-0.5 text-slate-600 hover:text-blue-400 transition-colors btn-tactile">
                        <HelpCircle className="w-[9px] h-[9px]" />
                      </button>
                    </div>
                    <span className="text-[7px] text-slate-500 font-bold uppercase tracking-tighter leading-none">Standardized L2 Norm</span>
                  </div>
                  <span className="text-sm font-mono font-black text-blue-500 drop-shadow-[0_0_10_rgba(59,130,246,0.4)]">{marginStats?.margin || "0.00"}</span>
                </div>

                <div className={`mt-auto result-indicator ${isAdmitted(originalStudent) ? 'status-admit' : 'status-reject'}`}>
                  <div className="status-label">{t.fate}</div>
                  <div className="status-value">{isAdmitted(originalStudent) ? t.admit : t.reject}</div>
                  <div className="status-score">
                    SCORE: <span>{calcScore(originalStudent, weights).toFixed(1)}</span>
                  </div>
                </div>
              </div>
            </div>


            {/* COUNTERFACTUAL EDITOR */}
            <div className="p-3 flex flex-col min-h-0 bg-blue-500/[0.03] h-full overflow-hidden">
              <div className="flex items-center justify-between border-b border-blue-500/20 pb-1.5 flex-shrink-0">
                <div className="flex items-center gap-2 text-[11px] font-black text-blue-400 uppercase tracking-widest"><Target className="w-3.5 h-3.5" /> {t.editor}</div>
                <button onClick={() => setExplainer('editor')} className="text-slate-700 hover:text-blue-400 transition-colors btn-tactile p-0.5"><HelpCircle className="w-[11px] h-[11px]" /></button>
              </div>

              <div className="flex-1 flex flex-col justify-start min-h-0 gap-2.5 pt-2.5">
                <div className="space-y-2">
                  <div className="space-y-0">
                    <div className="flex justify-between text-[10px] font-bold text-blue-400 tracking-wider uppercase leading-none"><span>GPA</span><span className="font-mono">{cfProfile.gpa.toFixed(2)}</span></div>
                    <input type="range" min="2.0" max="4.0" step="0.01" value={cfProfile.gpa} onChange={(e) => handleCfChange('gpa', parseFloat(e.target.value))} className="w-full h-1 bg-slate-800 rounded-full accent-blue-600" />
                  </div>
                  <div className="space-y-0">
                    <div className="flex justify-between text-[10px] font-bold text-blue-400 tracking-wider uppercase leading-none"><span>SAT</span><span className="font-mono">{cfProfile.sat}</span></div>
                    <input type="range" min="800" max="1600" step="10" value={cfProfile.sat} onChange={(e) => handleCfChange('sat', parseInt(e.target.value))} className="w-full h-1 bg-slate-800 rounded-full accent-blue-600" />
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-1.5">
                  {[
                    { key: 'isAthlete', label: t.athlete, isBool: true },
                    { key: 'isFirstGen', label: t.firstGen, isBool: true },
                    { key: 'gender', label: formatVal(cfProfile.gender, 'gender'), isGender: true },
                    { key: 'isResident', label: t.resident, isBool: true }
                  ].map((btn) => {
                    const isDirty = cfProfile[btn.key] !== originalStudent[btn.key];
                    const labelText = btn.isBool ? `${btn.label}: ${cfProfile[btn.key] ? t.yes : t.no}` : btn.label;

                    let colorClass = 'bg-slate-800/40 border-slate-700/30 text-slate-500 hover:border-slate-500';
                    if (isDirty) {
                      const isGain = cfProfile[btn.key] === true || (btn.isGender && cfProfile.gender === 'Female');
                      colorClass = isGain
                        ? 'bg-emerald-600/90 border-emerald-500 text-white shadow-lg shadow-emerald-500/30'
                        : 'bg-rose-600/90 border-rose-500 text-white shadow-lg shadow-rose-500/30';
                    }

                    return (
                      <button
                        key={btn.key}
                        onClick={() => {
                          if (btn.isGender) {
                            handleCfChange('gender', cfProfile.gender === 'Male' ? 'Female' : 'Male');
                          } else {
                            handleCfChange(btn.key, !cfProfile[btn.key]);
                          }
                        }}
                        className={`h-9 flex items-center justify-center rounded-xl text-[9px] font-black border transition-all active:scale-95 uppercase tracking-tight btn-tactile ${colorClass}`}
                      >
                        {labelText}
                      </button>
                    );
                  })}
                </div>

                <div className="flex items-center justify-between px-3 bg-indigo-500/5 border border-indigo-500/10 rounded-xl h-[60px] shadow-inner relative group btn-tactile cursor-default !justify-between text-indigo-500">
                  <div className="flex flex-col">
                    <div className="flex items-center gap-2 mb-0.5">
                      <span className="text-[9px] font-black text-indigo-400 uppercase tracking-widest leading-none">{t.margin}</span>
                      {cfMarginStats && (
                        <span className={`text-[10px] font-black ${Number(cfMarginStats.margin) >= Number(marginStats?.margin || 0) ? 'text-emerald-400' : 'text-rose-400'}`}>
                          {Number(cfMarginStats.margin) >= Number(marginStats?.margin || 0) ? '↑' : '↓'}
                        </span>
                      )}
                    </div>
                    <span className="text-[7px] text-slate-500 font-bold uppercase tracking-tighter leading-none">Dynamic Delta L2</span>
                  </div>
                  <span className="text-sm font-mono font-black text-indigo-400 drop-shadow-[0_0_8px_rgba(99,102,241,0.3)]">{cfMarginStats?.margin || "0.00"}</span>
                </div>

                <div className={`mt-auto result-indicator ${isAdmitted(cfProfile) ? 'status-admit' : 'status-reject'}`}>
                  <div className="status-label">{t.fate}</div>
                  <div className="status-value">{isAdmitted(cfProfile) ? t.admit : t.reject}</div>
                  <div className="status-score">
                    SCORE: <span>{calcScore(cfProfile, weights).toFixed(1)}</span>
                  </div>
                </div>
              </div>
            </div>

          </div>
        </section>

        {/* RIGHT Column (20%) */}
        <section className="flex flex-col gap-3 min-h-0">
          <div className="bg-[#161b22] border border-slate-800 rounded-2xl glass-card p-4 flex-1 flex flex-col gap-4 shadow-xl aurora-border overflow-hidden">
            <div className="flex justify-between items-center border-b border-slate-800 pb-2 flex-shrink-0">
              <h2 className="text-[13px] font-black uppercase text-slate-400 tracking-widest flex items-center justify-between w-full whitespace-nowrap overflow-hidden">
                <div className="flex items-center gap-2 min-w-0">
                  <BarChart3 className="w-3 h-3 text-purple-500 flex-shrink-0" />
                  <span className="truncate">{t.slices}</span>
                </div>
                <div className="flex items-center gap-1.5 ml-2">
                  <span className="px-1.5 py-0.5 rounded bg-slate-800 text-[10px] text-slate-400 font-mono font-black border border-slate-700">N={data.length}</span>
                </div>
              </h2>
            </div>
            <div className="flex-1 min-h-0 relative">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart
                  data={stats.groupStats}
                  layout="vertical"
                  margin={{ left: 5, right: 65, top: 10, bottom: 10 }}
                  onClick={(e) => {
                    if (e && e.activeLabel) {
                      const val = e.activeLabel;
                      setFilterMode(prev => (prev?.type === 'slice' && prev?.value === val) ? null : { type: 'slice', value: val });
                    }
                  }}
                >
                  <XAxis type="number" hide domain={[0, 100]} />
                  <YAxis dataKey="name" type="category" stroke="#484f58" fontSize={10} width={65} tick={{ fontFamily: 'JetBrains Mono', fontWeight: 'bold' }} />
                  <Bar dataKey="rate" radius={[0, 2, 2, 0]} fill={COLORS.barDefault} style={{ cursor: 'pointer' }}>
                    {stats.groupStats.map((entry, index) => (
                      <Cell
                        key={`cell-${index}`}
                        fill={filterMode?.type === 'slice' && filterMode?.value === entry.name ? '#3b82f6' : COLORS.barDefault}
                        opacity={filterMode?.type === 'slice' && filterMode?.value !== entry.name ? 0.3 : 1}
                      />
                    ))}
                    <LabelList
                      dataKey="rate"
                      position="right"
                      content={(props) => {
                        const { x, y, width, height, value, index } = props;
                        const item = stats.groupStats[index];
                        return (
                          <text
                            x={x + width + 8}
                            y={y + height / 2 + 4}
                            className="font-mono font-black uppercase"
                          >
                            <tspan fill="#60a5fa" fontSize="10">{value}%</tspan>
                            <tspan fill="#475569" fontSize="8" fontWeight="bold"> ({item.admitted}/{item.count})</tspan>
                          </text>
                        );
                      }}
                    />
                  </Bar>
                  <Tooltip
                    cursor={{ fill: 'rgba(255,255,255,0.05)' }}
                    content={({ active, payload }) => {
                      if (active && payload && payload.length) {
                        const { name, count, admitted } = payload[0].payload;
                        return (
                          <div className="bg-[#1c2128] border border-slate-700 p-2 rounded shadow-xl text-[10px] font-bold font-mono">
                            <p className="text-slate-200 border-b border-slate-800 mb-1.5 pb-1 uppercase tracking-widest">{name}</p>
                            <p className="text-blue-400 mb-0.5">RATE: {payload[0].value}%</p>
                            <p className="text-emerald-500/80 mb-0.5 uppercase">Admitted: {admitted}</p>
                            <p className="text-slate-500 uppercase">Total: {count}</p>
                          </div>
                        );
                      }
                      return null;
                    }}
                  />
                </BarChart>
              </ResponsiveContainer>
            </div>


            <div className="pt-3 border-t border-slate-800">
              <div className="flex justify-between items-center mb-2">
                <p className="text-[11px] font-black text-slate-400 uppercase tracking-widest leading-none flex items-center gap-2"><Target className="w-3 h-3 text-emerald-500" /> {t.confusion}</p>
                <button onClick={() => setExplainer('confusion')} className="text-slate-600 hover:text-blue-400 transition-colors btn-tactile p-0.5"><HelpCircle className="w-[11px] h-[11px]" /></button>
              </div>
              <div className="grid grid-cols-2 gap-1.5 text-center font-mono">
                {[
                  { l: 'TP', v: stats.tp, r: stats.tpRate, c: 'emerald', rgb: '16, 185, 129' },
                  { l: 'FP', v: stats.fp, r: stats.fpRate, c: 'amber', rgb: '245, 158, 11' },
                  { l: 'FN', v: stats.fn, r: stats.fnRate, c: 'rose', rgb: '239, 68, 68' },
                  { l: 'TN', v: stats.tn, r: stats.tnRate, c: 'slate', rgb: '71, 85, 105' }
                ].map(m => {
                  const isActive = filterMode?.type === 'confusion' && filterMode?.value === m.l;
                  return (
                    <button
                      key={m.l}
                      onClick={() => setFilterMode(prev => (prev?.type === 'confusion' && prev?.value === m.l) ? null : { type: 'confusion', value: m.l })}
                      className={`p-1.5 rounded border shadow-sm transition-all duration-300 cursor-pointer flex-col btn-tactile ${isActive ? `border-${m.c}-400 ring-4 ring-${m.c}-500/20 scale-[1.03]` : `border-${m.c}-500/10 hover:border-${m.c}-500/30`}`}
                      style={{ backgroundColor: isActive ? `rgba(${m.rgb}, 0.5)` : `rgba(${m.rgb}, ${Math.max(0.05, m.r / 150)})`, color: isActive ? 'white' : `rgba(${m.rgb}, 1)` }}
                    >
                      <p className={`text-[9px] uppercase font-black leading-none mb-1.5 tracking-tighter`}>{m.l}</p>
                      <div className="flex flex-col gap-0.5">
                        <p className={`text-sm font-black ${isActive ? 'text-white' : 'text-slate-200'} leading-none`}>{m.v}</p>
                        <p className={`text-[9px] font-bold ${isActive ? 'text-white/80' : `text-slate-200/60`} leading-none`}>{m.r}%</p>
                      </div>
                    </button>
                  );
                })}
              </div>
            </div>
          </div>
          {/* Ethics Scanner fixed height h-24 */}
          <div className={`bg-[#161b22] border border-slate-800 rounded-2xl p-3 shadow-xl h-24 flex-shrink-0 flex flex-col transition-all duration-500 aurora-border ${glassMode ? 'glass-card' : ''}`}>
            <div className={`flex items-center justify-between mb-2`}>
              <div className={`flex items-center gap-2 ${dynamicAlert === t.ethNeutral ? 'text-blue-400' : 'text-amber-500'}`}>
                <ShieldAlert className="w-3.5 h-3.5" />
                <p className="text-xs font-black uppercase tracking-widest leading-none">{t.ethicsAlert}</p>
              </div>
              <button onClick={() => setExplainer('scanner')} className="text-slate-600 hover:text-blue-400 transition-colors btn-tactile p-0.5"><HelpCircle className="w-[11px] h-[11px]" /></button>
            </div>
            <p className={`text-[13px] leading-tight italic font-medium transition-colors duration-500 ${dynamicAlert === t.ethNeutral ? 'text-slate-400' : 'text-slate-200'}`}>{dynamicAlert}</p>
          </div>
        </section>

      </div >
    </div >
  );
};

export default App;