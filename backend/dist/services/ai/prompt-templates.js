"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.generateFewShotPrompt = exports.extractTagsPrompt = exports.analyzeSymptomsPrompt = exports.generateReasonStatementPrompt = exports.SYSTEM_PROMPT = void 0;
exports.SYSTEM_PROMPT = `
あなたは整骨院向けのレセプト理由書作成を支援するAIアシスタントです。
提供された患者情報、症状、施術内容、および過去の承認事例や返戻事例の情報を元に、
保険者に対して傷病の発生原因、症状の経過、施術の必要性などを明確かつ論理的に説明する理由書を作成してください。
出力は日本語で、専門用語は正確に使用しつつ、保険者が理解しやすいように記述してください。
不必要な情報は含めず、簡潔かつ説得力のある文章を心がけてください。
出力形式はプレーンテキストまたは指定された構造に従ってください。
`;
const generateReasonStatementPrompt = (patientInfo, injuryDetails, treatmentDetails, relevantCases) => {
    return `
${exports.SYSTEM_PROMPT}

以下の情報に基づいて、レセプト理由書を作成してください。

---
患者情報:
${patientInfo}

傷病の詳細:
${injuryDetails}

施術内容と経過:
${treatmentDetails}

参考事例（過去の承認・返戻事例）:
${relevantCases}

---

上記の情報を踏まえ、保険者向けに、傷病の発生原因、現在の症状、施術の必要性、今後の見通しなどを論理的に記述した理由書を作成してください。
特に、参考事例で承認されたポイントや、返戻された原因を踏まえ、説得力のある内容にしてください。
`;
};
exports.generateReasonStatementPrompt = generateReasonStatementPrompt;
const analyzeSymptomsPrompt = (symptomDescription) => {
    return `
${exports.SYSTEM_PROMPT}

以下の症状記述を分析し、考えられる傷病名、発生原因、関連する身体部位を特定してください。
分析結果は以下の形式で出力してください。

傷病名: [傷病名]
発生原因: [原因]
関連部位: [部位]
その他特記事項: [特記事項があれば]

---
症状記述:
${symptomDescription}
`;
};
exports.analyzeSymptomsPrompt = analyzeSymptomsPrompt;
const extractTagsPrompt = (text) => {
    return `
${exports.SYSTEM_PROMPT}

以下のテキストから、レセプト理由書に関連する重要なキーワードやカテゴリをタグとして抽出してください。
抽出するタグの例: 傷病部位（例: 腰部、頸部、膝関節）、発生原因（例: 転倒、スポーツ、交通事故）、施術内容（例: 手技療法、電気療法）、結果（例: 承認、返戻）。
抽出したタグはカンマ区切りでリスト形式で出力してください。

---
テキスト:
${text}
`;
};
exports.extractTagsPrompt = extractTagsPrompt;
const generateFewShotPrompt = (examples, currentInput) => {
    let prompt = exports.SYSTEM_PROMPT + "\n\n";
    examples.forEach(example => {
        prompt += `Input: ${example.input}\nOutput: ${example.output}\n\n`;
    });
    prompt += `Input: ${currentInput}\nOutput:`;
    return prompt;
};
exports.generateFewShotPrompt = generateFewShotPrompt;
//# sourceMappingURL=prompt-templates.js.map