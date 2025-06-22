'use client';

interface ScorecardProps {
  coherence: number;
  promptCoverage: number;
  hallucination: number;
  visualQuality: number;
  className?: string;
}

export default function Scorecard({ 
  coherence, 
  promptCoverage, 
  hallucination, 
  visualQuality, 
  className = "" 
}: ScorecardProps) {
  const getScoreColor = (score: number) => {
    if (score >= 80) return 'text-green-500';
    if (score >= 60) return 'text-yellow-500';
    return 'text-red-500';
  };

  const getScoreBarColor = (score: number) => {
    if (score >= 80) return 'bg-green-500';
    if (score >= 60) return 'bg-yellow-500';
    return 'bg-red-500';
  };

  const metrics = [
    { name: 'Coherence', score: coherence, description: 'How well the video flows together' },
    { name: 'Prompt Coverage', score: promptCoverage, description: 'How well the AI followed your prompt' },
    { name: 'Hallucination', score: hallucination, description: 'AI-generated content accuracy' },
    { name: 'Visual Quality', score: visualQuality, description: 'Overall visual appeal and quality' },
  ];

  const averageScore = Math.round((coherence + promptCoverage + hallucination + visualQuality) / 4);

  return (
    <div className={`bg-gray-900/80 rounded-2xl shadow-2xl border border-gray-800 backdrop-blur-xl p-6 animate-fade-in ${className}`}>
      <div className="flex items-center justify-between mb-6">
        <h3 className="text-2xl font-bold text-white">AI Evaluation Scorecard</h3>
        <div className="text-right">
          <div className={`text-3xl font-bold ${getScoreColor(averageScore)}`}>
            {averageScore}/100
          </div>
          <div className="text-sm text-gray-400">Overall Score</div>
        </div>
      </div>

      <div className="space-y-4">
        {metrics.map((metric) => (
          <div key={metric.name} className="space-y-2">
            <div className="flex justify-between items-center">
              <div>
                <div className="font-semibold text-gray-200">{metric.name}</div>
                <div className="text-sm text-gray-400">{metric.description}</div>
              </div>
              <div className={`font-bold text-lg ${getScoreColor(metric.score)}`}>
                {metric.score}/100
              </div>
            </div>
            <div className="w-full bg-gray-800 rounded-full h-2">
              <div 
                className={`h-2 rounded-full ${getScoreBarColor(metric.score)}`}
                style={{ width: `${metric.score}%` }}
              ></div>
            </div>
          </div>
        ))}
      </div>

      <div className="mt-6 p-4 bg-gray-800 rounded-lg">
        <h4 className="font-semibold text-gray-200 mb-2">Recommendations</h4>
        <ul className="text-sm text-gray-400 space-y-1">
          {coherence < 70 && <li>• Consider improving video flow and transitions</li>}
          {promptCoverage < 70 && <li>• Try a more specific prompt for better results</li>}
          {hallucination < 70 && <li>• Review AI-generated content for accuracy</li>}
          {visualQuality < 70 && <li>• Enhance visual effects and composition</li>}
          {averageScore >= 80 && <li>• Great job! Your video is ready for minting</li>}
        </ul>
      </div>
    </div>
  );
} 