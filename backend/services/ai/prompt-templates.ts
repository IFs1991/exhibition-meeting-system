/**
 * AIプロンプトテンプレートを管理するモジュール
 *
 * このファイルでは、Google Gemini AIに渡すための様々なプロンプトテンプレートを定義します。
 * これらのテンプレートは、理由書生成、症状分析、タグ抽出などのタスクに使用されます。
 */

/**
 * システムプロンプト
 * AIの役割、トーン、出力形式などを定義します。
 */
export const SYSTEM_PROMPT = `
あなたは整骨院向けのレセプト理由書作成を支援するAIアシスタントです。
提供された患者情報、症状、施術内容、および過去の承認事例や返戻事例の情報を元に、
保険者に対して傷病の発生原因、症状の経過、施術の必要性などを明確かつ論理的に説明する理由書を作成してください。
出力は日本語で、専門用語は正確に使用しつつ、保険者が理解しやすいように記述してください。
不必要な情報は含めず、簡潔かつ説得力のある文章を心がけてください。
出力形式はプレーンテキストまたは指定された構造に従ってください。
`;

/**
 * 事例ベースの理由書生成プロンプトテンプレートを生成する関数
 * 過去事例と患者情報を元に理由書を生成するためのテンプレートです。
 * @param patientInfo 患者情報（年齢、性別、職業など）
 * @param injuryDetails 傷病の詳細（発生日時、原因、部位、症状など）
 * @param treatmentDetails 施術内容の詳細（施術日、内容、経過など）
 * @param relevantCases 類似性の高い過去の承認・返戻事例の要約
 * @returns 生成されたプロンプト文字列
 */
export const generateReasonStatementPrompt = (
  patientInfo: string,
  injuryDetails: string,
  treatmentDetails: string,
  relevantCases: string
): string => {
  return `
${SYSTEM_PROMPT}

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

/**
 * 症状分析プロンプトテンプレートを生成する関数
 * 患者の症状記述から、傷病名、原因、部位などを分析するためのテンプレートです。
 * @param symptomDescription 患者または施術者による症状の記述
 * @returns 生成されたプロンプト文字列
 */
export const analyzeSymptomsPrompt = (symptomDescription: string): string => {
  return `
${SYSTEM_PROMPT}

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

/**
 * タグ抽出プロンプトテンプレートを生成する関数
 * 理由書や事例テキストから、関連するタグ（傷病部位、原因、施術内容、結果など）を抽出するためのテンプレートです。
 * @param text タグを抽出したいテキスト（理由書、事例詳細など）
 * @returns 生成されたプロンプト文字列
 */
export const extractTagsPrompt = (text: string): string => {
  return `
${SYSTEM_PROMPT}

以下のテキストから、レセプト理由書に関連する重要なキーワードやカテゴリをタグとして抽出してください。
抽出するタグの例: 傷病部位（例: 腰部、頸部、膝関節）、発生原因（例: 転倒、スポーツ、交通事故）、施術内容（例: 手技療法、電気療法）、結果（例: 承認、返戻）。
抽出したタグはカンマ区切りでリスト形式で出力してください。

---
テキスト:
${text}
`;
};

/**
 * フューショット学習用プロンプトテンプレートの構造例を生成する関数
 * 実際のfew-shotプロンプトは、このテンプレート構造に具体的な入出力例を複数追加して構成されます。
 * @param examples 具体的な入出力例の配列
 * @param currentInput 現在の入力
 * @returns 生成されたプロンプト文字列
 */
export const generateFewShotPrompt = (examples: { input: string; output: string }[], currentInput: string): string => {
  let prompt = SYSTEM_PROMPT + "\n\n";
  examples.forEach(example => {
    prompt += `Input: ${example.input}\nOutput: ${example.output}\n\n`;
  });
  prompt += `Input: ${currentInput}\nOutput:`;
  return prompt;
};

// 必要に応じて、特定のプロンプトタイプごとに具体的なfew-shotテンプレート関数を定義することも可能
// 例:
// export const generateFewShotReasonStatementPrompt = (
//   patientInfo: string,
//   injuryDetails: string,
//   treatmentDetails: string,
//   relevantCases: string
// ): string => {
//   const examples = [
//     {
//       input: `患者情報: 30代男性、会社員\n傷病の詳細: 〇月〇日、通勤中に階段で転倒し右足首を捻挫\n施術内容と経過: 〇月〇日より施術開始、アイシング、固定、手技療法。腫脹軽減傾向。\n参考事例: 事例A（承認）：通勤中の転倒による足首捻挫、初期固定と手技療法で承認。`,
//       output: `[理由書本文例] 傷病名：右足関節捻挫。〇月〇日、通勤中に階段で転倒し受傷。右足関節部に腫脹、疼痛、熱感を認め、歩行困難な状態でした。初期はアイシングと固定を行い、腫脹軽減後に手技療法を開始。施術により疼痛、腫脹は軽減傾向にあり、歩行も改善が見られます。通勤中の災害であり、早期回復のため継続的な施術が必要です。`
//     },
//     // 他の例...
//   ];
//
//   const currentInput = `患者情報: ${patientInfo}\n傷病の詳細: ${injuryDetails}\n施術内容と経過: ${treatmentDetails}\n参考事例: ${relevantCases}`;
//
//   return generateFewShotPrompt(examples, currentInput);
// };