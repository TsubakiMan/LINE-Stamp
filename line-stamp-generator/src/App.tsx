import React, { useState, useEffect } from 'react';
import { Copy, Check, Sparkles, Palette, MessageCircle, PenTool, Edit3, Type, Layers } from 'lucide-react';

// --- データ定義 ---

// 1. セリフの種類（キャラクター設定）
const dialogueTypes = [
  {
    id: 'standard',
    label: '標準・日常',
    desc: '誰にでも使える定番',
    prompt: 'かわいくてシンプルなキャラクター、親しみやすい笑顔、日常会話の雰囲気、ニュートラルな服装',
    sampleText: 'OK / ありがとう'
  },
  {
    id: 'polite',
    label: '丁寧・敬語',
    desc: '先輩や上司にも安心',
    prompt: '礼儀正しいキャラクター、軽くお辞儀をしている、ビジネスカジュアルな服装、敬意のこもった表情、柔らかい雰囲気',
    sampleText: 'お疲れ様です / ありがとうございます'
  },
  {
    id: 'kansai',
    label: '関西弁',
    desc: '親しみやすさNo.1',
    prompt: 'エネルギッシュなキャラクター、お笑い芸人の雰囲気、トラ柄の小物、表現豊かなハンドジェスチャー、大きな笑い声',
    sampleText: 'なんでやねん / ほんまに'
  },
  {
    id: 'hakata',
    label: '博多弁',
    desc: '可愛さ重視の方言',
    prompt: 'チャーミングなキャラクター、頬を赤らめている、柔らかくてかわいい雰囲気、少し照れ屋だがフレンドリー',
    sampleText: 'すいとーよ / よかよ'
  },
  {
    id: 'otaku',
    label: '推し活・オタク',
    desc: '語彙力消失気味',
    prompt: 'オタクなキャラクター、ペンライトを持っている、目が輝いている、激しい興奮、感情過多',
    sampleText: '尊い / 神'
  },
  {
    id: 'gal',
    label: 'ギャル・若者',
    desc: 'バイブス高め',
    prompt: 'ギャルファッション、カラフルな髪、濃いメイク、長いネイル、ルーズソックス、ピースサイン、ハイテンションな雰囲気',
    sampleText: 'バイブス / ぴえん'
  },
  {
    id: 'muscle',
    label: '筋肉・熱血',
    desc: 'すべてを筋肉で解決',
    prompt: 'マッチョなボディビルダー、巨大な筋肉、真剣な顔、燃える背景オーラ、力こぶを強調、飛び散る汗',
    sampleText: 'パワー！ / マッスル！'
  },
  {
    id: 'surreal',
    label: 'シュール・真顔',
    desc: '感情を殺した表現',
    prompt: 'シュールなキャラクター、真顔、感情のない目、謎のポーズ、奇妙なプロポーション、説明のつかない状況',
    sampleText: '（無言） / スンッ...'
  },
  {
    id: 'showa',
    label: '昭和・死語',
    desc: 'ナウいヤングに',
    prompt: '80年代バブル時代のファッション、肩パッド、レトロアニメスタイル、ノスタルジックな雰囲気、古き良きカッコよさ',
    sampleText: 'バッチグー / マンモスうれぴー'
  },
  {
    id: 'love',
    label: '恋人・デレ',
    desc: '甘えたい時に',
    prompt: '恋するキャラクター、周りにハートが飛んでいる、甘い雰囲気、上目遣い、抱きつく動作',
    sampleText: '大好き / チュッ'
  }
];

// 2. デザインテイスト
const designCategories = [
  {
    name: 'ベーシック・定番',
    items: [
      { id: 'basic', label: 'ベーシック', prompt: 'きれいな線、ベクターイラスト、フラットカラー、スタンプアートスタイル' },
      { id: 'cute', label: 'かわいい', prompt: 'カワイイスタイル、パステルカラー、丸みを帯びた形状、サンリオ風、柔らかい見た目' },
      { id: 'simple', label: 'シンプル', prompt: 'ミニマリスト、シンプルな線画、少ない色数、十分な余白、アイコンスタイル' },
      { id: 'pastel', label: 'パステル', prompt: 'パステルカラーパレット、夢のような雰囲気、柔らかな照明、優しいテクスチャ' },
      { id: 'lineart', label: 'ゆるかわ線画', prompt: '細い黒の線画、色が少しずれた塗り、ゆるい雰囲気、脱力系、手書きのラフさ' },
    ]
  },
  {
    name: '似顔絵・特徴再現',
    items: [
      { id: 'caricature', label: '誇張似顔絵', prompt: 'caricature style, exaggerated facial features, humorous and distinct likeness, capturing personality, cartoon portrait' },
      { id: 'extreme', label: '激しい誇張', prompt: 'extreme caricature, heavily distorted proportions, massive head, funny and grotesque, emphasizing distinct features to the limit' },
      { id: 'satire', label: '風刺画風', prompt: 'satirical illustration style, newspaper editorial cartoon, witty, ink lines, cross-hatching, humorous exaggeration' },
      { id: 'real_portrait', label: 'リアル似顔絵', prompt: 'semi-realistic portrait, high fidelity to subject, detailed facial features, capturing the exact look, expressive portrait' },
      { id: 'simple_portrait', label: 'シンプル似顔絵', prompt: 'minimalist portrait, iconic likeness, capturing key distinctive traits with few lines, avatar style, recognizable face' },
      { id: 'anime_portrait', label: 'アニメ風似顔絵', prompt: 'anime style portrait, character design based on real person, capturing hairstyle and accessories, 2D avatar likeness' },
      { id: 'feature_focus', label: '特徴強調', prompt: 'focus on distinctive features (glasses, hairstyle, beard, mole), emphasized character traits, high recognizability, stylized likeness' },
    ]
  },
  {
    name: 'デフォルメ・絵画',
    items: [
      { id: 'chibi', label: 'デフォルメ', prompt: 'ちびキャラ風、スーパーデフォルメ、頭が大きく体が小さい、2頭身' },
      { id: 'art', label: 'アート・絵画', prompt: 'アーティスティックなイラスト、筆のタッチ、キャンバスの質感、画廊品質' },
      { id: 'gouache', label: 'アクリルガッシュ', prompt: 'アクリルガッシュ、不透明水彩、マットな質感、鮮やかな発色、フラットでモダンな塗り' },
      { id: 'watercolor', label: '水彩画風', prompt: '水彩画、滲み、色の混ざり合い、芸術的な飛沫、白い画用紙の質感' },
      { id: 'oil', label: '油絵風', prompt: '油絵の厚塗り、厚みのある絵具の質感、表現豊かな筆使い、リッチな色彩' },
      { id: 'stained', label: 'ステンドグラス', prompt: 'ステンドグラス風、光の透過、太い黒の鉛線、鮮やかなガラスの色、モザイクアート' },
      { id: 'nouveau', label: 'アール・ヌーヴォー', prompt: 'アール・ヌーヴォー、ミュシャ風、装飾的な枠、エレガントな曲線、植物のモチーフ' },
    ]
  },
  {
    name: 'アナログ・手書き',
    items: [
      { id: 'crayon', label: 'クレヨン', prompt: 'クレヨン画、粗い質感、子供の落書き風スタイル、温かみのある雰囲気' },
      { id: 'pencil', label: '鉛筆スケッチ', prompt: '鉛筆スケッチ、黒鉛の質感、ハッチング、ラフなスケッチスタイル、モノクロにワンポイントカラー' },
      { id: 'colored_pencil', label: '色鉛筆', prompt: '色鉛筆画、優しいタッチ、紙のきめ、柔らかいグラデーション、手書きの温もり' },
      { id: 'ink', label: 'インク画', prompt: 'インクイラスト、Gペン、強弱のある線、黒と白のコントラスト、コミックアート' },
      { id: 'chalk', label: 'チョークアート', prompt: '黒板アート風、チョークの粉の質感、黒い背景、手書きの温かみ、カフェの看板スタイル' },
      { id: 'ballpoint', label: 'ボールペン画', prompt: 'ボールペン画、インクの溜まり、細かい線、青または黒のインク、ノートの端書き風' },
    ]
  },
  {
    name: 'ポップ・ストリート',
    items: [
      { id: 'pop', label: 'ポップ・派手', prompt: 'ポップアート、鮮やかな色、太い輪郭線、エネルギッシュな構図' },
      { id: 'amecomi', label: 'アメコミ', prompt: 'アメコミ風スタイル、ハーフトーンドット、太い黒い影、吹き出し、ダイナミックなアクション' },
      { id: 'popart', label: 'ポップアート', prompt: 'ウォーホル風ポップアート、繰り返しのパターン、対照的な色、シルクスクリーン効果' },
      { id: 'memphis', label: 'メンフィス', prompt: 'メンフィスデザイン、80年代幾何学パターン、パステルと原色の組み合わせ、抽象的でポップ' },
      { id: 'graffiti', label: 'グラフィティ', prompt: 'ストリートグラフィティ、スプレーペイントの質感、ドリップ効果、アーバンアート、ワイルドなスタイル' },
      { id: 'cyber', label: 'サイバーパンク', prompt: 'サイバーパンク、ネオンカラー、未来的なガジェット、グリッチノイズ、ハイテクな雰囲気' },
      { id: 'psychedelic', label: 'サイケデリック', prompt: 'サイケデリックアート、極彩色、渦巻くパターン、ヒッピーカルチャー、幻覚的なビジュアル' },
    ]
  },
  {
    name: '漫画・コミック',
    items: [
      { id: 'shonen', label: '少年漫画', prompt: '少年漫画スタイル、白黒、スクリーントーン、集中線、ダイナミックなアクション、太いペン入れ、ジャンプスタイル' },
      { id: 'shojo', label: '少女漫画', prompt: '少女漫画スタイル、キラキラした瞳、背景に花、繊細な線、ロマンチックな雰囲気、トーンワーク' },
      { id: 'gag', label: 'ギャグ漫画', prompt: 'ギャグ漫画スタイル、シンプルな線、デフォルメされた表情、コミカルな動き、漫符、白黒' },
      { id: 'webtoon', label: 'ウェブトゥーン', prompt: 'ウェブトゥーンスタイル、フルカラー、デジタルコミック、グラデーション塗り、現代的なアニメスタイル' },
    ]
  },
  {
    name: 'レトロ・和風',
    items: [
      { id: 'retro', label: 'レトロ', prompt: 'ヴィンテージポスタースタイル、色あせた色、劣化した質感、レトロなタイポグラフィ' },
      { id: 'pixel', label: 'ドット絵', prompt: 'ピクセルアート、16ビットゲームのスプライト、ドット絵、レトロゲームスタイル' },
      { id: 'showa_retro', label: '昭和レトロ', prompt: '昭和の看板スタイル、ノスタルジックな色合い、古い日本の広告、レトロな雰囲気' },
      { id: 'ukiyo', label: '浮世絵', prompt: '浮世絵スタイル、木版画の質感、太い輪郭線、和の色使い、葛飾北斎風、日本のアート' },
      { id: 'sumie', label: '水墨画・筆', prompt: '水墨画スタイル、筆の勢い、墨の濃淡、和紙の質感、書道アート、禅の雰囲気' },
      { id: 'taisho', label: '大正ロマン', prompt: '大正ロマン、レトロモダン、ハイカラ、着物パターン、ノスタルジックな和洋折衷' },
    ]
  },
  {
    name: '3D・マテリアル',
    items: [
      { id: '3d', label: '3Dキャラ', prompt: '3Dレンダリング、ピクサースタイル、光沢のある質感、スムーズな照明、CGI、キュートな3Dモデル' },
      { id: 'lowpoly', label: 'ローポリ', prompt: 'ローポリゴン、カクカクした3D、レトロゲーム風、フラットシェーディング、幾何学的な面' },
      { id: 'clay', label: 'クレイアニメ', prompt: 'クレイアニメ、粘土の質感、指紋の跡、ストップモーション風、手作りの人形、遊び心' },
      { id: 'paper', label: 'ペーパークラフト', prompt: '切り絵風、重ねた紙の影、ペーパークラフト、立体的な層、クラフト感、奥行き' },
      { id: 'plush', label: 'ぬいぐるみ', prompt: 'フェルトの質感、縫い目、ぬいぐるみ風、布のテクスチャ、柔らかいおもちゃ、羊毛フェルト' },
      { id: 'glass', label: 'ガラス細工', prompt: 'ガラスアート、透明感、光の屈折、つるつるした質感、繊細なガラス細工' },
      { id: 'embroidery', label: '刺繍・ワッペン', prompt: '刺繍アート、糸の質感、ワッペン風、布地、ステッチ、手芸スタイル' },
    ]
  },
  {
    name: '特殊・ネタ',
    items: [
      { id: 'face', label: '顔芸・圧', prompt: '極端な表情、劇的な陰影、顔のアップ、強烈なインパクト、漫画の集中線' },
      { id: 'gekiga', label: '劇画タッチ', prompt: '劇画スタイル、青年漫画、真剣でリアルな線、劇的な影、シリアスな雰囲気' },
      { id: 'horror', label: 'ホラー・怪奇', prompt: 'ホラー漫画風、伊藤潤二スタイル、不気味な影、詳細な線画、背筋が凍る雰囲気' },
      { id: 'sketch', label: '手抜き・雑', prompt: 'ヘタウマ、下手に描かれた、落書き、ゆるい線、愛嬌のある不格好さ' },
      { id: 'neon', label: 'ネオン', prompt: 'ネオンライト、光る線、暗い背景に明るい光、発光表現' },
      { id: 'blueprint', label: '設計図', prompt: '青写真、設計図スタイル、青い背景に白い線、テクニカルドローイング、建築スケッチ' },
      { id: 'sticker', label: 'ステッカー', prompt: 'ダイカットステッカーデザイン、太い白い縁取り、ビニールの質感、光沢仕上げ' },
      { id: 'stamp', label: 'ハンコ風', prompt: 'ゴム印の質感、インクのかすれ、ざらざらしたエッジ、朱色または黒の単色刷り' },
    ]
  },
  {
    name: 'オリジナル',
    items: [
      { id: 'custom_original', label: 'オリジナル入力', prompt: 'custom' },
    ]
  }
];

export default function StickerPromptGen() {
  const [selectedDialogue, setSelectedDialogue] = useState<string>('standard');
  const [selectedDesigns, setSelectedDesigns] = useState<string[]>(['basic']);
  const [generatedPrompt, setGeneratedPrompt] = useState<string>('');
  const [copied, setCopied] = useState(false);

  // 編集機能用のState
  const [isTextEditable, setIsTextEditable] = useState(false);
  const [customText, setCustomText] = useState('OK / ありがとう');
  const [customDesignPrompt, setCustomDesignPrompt] = useState('');

  // 選択が変わるたびにプロンプトを再生成
  useEffect(() => {
    generatePrompt();
  }, [selectedDialogue, selectedDesigns, isTextEditable, customText, customDesignPrompt]);

  // セリフ変更時のハンドラ（サンプルテキストをセットする）
  const handleDialogueChange = (typeId: string) => {
    setSelectedDialogue(typeId);
    const dialogue = dialogueTypes.find(d => d.id === typeId);
    if (dialogue) {
      setCustomText(dialogue.sampleText);
    }
  };

  // デザイン選択のトグル処理
  const handleDesignToggle = (id: string) => {
    setSelectedDesigns(prev => {
      if (prev.includes(id)) {
        const newSelection = prev.filter(item => item !== id);
        return newSelection;
      } else {
        return [...prev, id];
      }
    });
  };

  const generatePrompt = () => {
    const dialogue = dialogueTypes.find(d => d.id === selectedDialogue);
    
    const basePrompt = `(主題): LINEスタンプセット、${dialogue ? dialogue.prompt : ''}`;
    
    let designPrompts: string[] = [];
    let hasCustom = false;

    for (const cat of designCategories) {
      for (const item of cat.items) {
        if (selectedDesigns.includes(item.id)) {
          if (item.id === 'custom_original') {
             hasCustom = true;
             const userInput = customDesignPrompt.trim();
             if (userInput) {
                designPrompts.push(`${userInput}`);
             }
          } else {
             designPrompts.push(item.prompt);
          }
        }
      }
    }

    let stylePromptContent = designPrompts.join(', ');
    if (hasCustom) {
      stylePromptContent += ', distinct visual style, detailed artistic rendering, style focused';
    }

    const stylePrompt = `(スタイル): ${stylePromptContent}`;

    const sheetPrompt = `(構成): 1枚の画像に16個の独立したスタンプデザイン、正確な4x4グリッド配列、各スタンプはマス目の完全な中央に配置、十分な余白を確保、互いに重ならない、ノリングスタイル（整列）、全てのスタンプでポーズと構図を完全に区別する、全身・バストアップ・横顔など多様なアングル、喜怒哀楽の激しい変化、アクションの重複なし、動的な動きと静的な感情表現のミックス`;
    
    const techPrompt = `(品質): ダイカット、太い白い縁取り、白背景で分離、ベクタースタイル、2D、高品質、表現力豊か、解像度3546x3546ピクセル、8k、超高解像度、高精細、非常に詳細`;
    
    const textContent = isTextEditable ? customText : (dialogue ? dialogue.sampleText : '');
    const textHint = `(テキストの雰囲気): 吹き出しに「${textContent}」のようなセリフが入るイメージ`;

    const fullPrompt = `${basePrompt}, ${stylePrompt}, ${sheetPrompt}, ${techPrompt}, ${textHint}, --ar 1:1`;
    setGeneratedPrompt(fullPrompt);
    setCopied(false);
  };

  const handleCopy = () => {
    const textArea = document.createElement("textarea");
    textArea.value = generatedPrompt;
    textArea.style.position = "fixed";
    textArea.style.left = "-9999px";
    textArea.style.top = "0";
    document.body.appendChild(textArea);
    textArea.focus();
    textArea.select();
    try {
      const successful = document.execCommand('copy');
      if (successful) {
        setCopied(true);
        setTimeout(() => setCopied(false), 2000);
      }
    } catch (err) {
      console.error('Unable to copy', err);
    }
    document.body.removeChild(textArea);
  };

  const getDialogueLabel = () => dialogueTypes.find(d => d.id === selectedDialogue)?.label;
  
  const getDesignLabels = () => {
    const labels: string[] = [];
    for (const cat of designCategories) {
      for (const item of cat.items) {
        if (selectedDesigns.includes(item.id)) {
          labels.push(item.label);
        }
      }
    }
    if (labels.length === 0) return '未選択';
    if (labels.length <= 2) return labels.join(' × ');
    return `${labels.slice(0, 2).join(' × ')} ほか${labels.length - 2}件`;
  };

  return (
    <div className="min-h-screen bg-slate-50 text-slate-800 font-sans pb-12">
      {/* Header */}
      <header className="bg-green-600 text-white p-4 shadow-md sticky top-0 z-10">
        <div className="max-w-4xl mx-auto flex items-center justify-between">
          <h1 className="text-xl font-bold flex items-center gap-2">
            <MessageCircle className="w-6 h-6" />
            LINEスタンプ プロンプト工房
          </h1>
          <span className="text-xs bg-green-700 px-2 py-1 rounded-full">AI画像生成用</span>
        </div>
      </header>

      <main className="max-w-4xl mx-auto p-4 space-y-8">
        
        {/* Step 1: セリフの種類 */}
        <section className="bg-white rounded-xl shadow-sm border border-slate-200 overflow-hidden">
          <div className="bg-slate-100 p-4 border-b border-slate-200 flex flex-col md:flex-row md:items-center justify-between gap-4">
            <div className="flex items-center gap-2">
              <span className="bg-green-600 text-white w-6 h-6 rounded-full flex items-center justify-center text-sm font-bold">1</span>
              <h2 className="font-bold text-lg">セリフ・キャラクター設定</h2>
            </div>
            
            <div className="flex items-center gap-3 bg-white px-3 py-1.5 rounded-lg border border-slate-200">
              <span className="text-xs font-bold text-slate-500 flex items-center gap-1">
                <Type className="w-3 h-3" />
                セリフ編集
              </span>
              <button 
                onClick={() => setIsTextEditable(!isTextEditable)}
                className={`relative inline-flex h-5 w-9 items-center rounded-full transition-colors focus:outline-none focus:ring-2 focus:ring-green-500 focus:ring-offset-2 ${isTextEditable ? 'bg-green-500' : 'bg-slate-300'}`}
              >
                <span className={`inline-block h-3 w-3 transform rounded-full bg-white transition-transform ${isTextEditable ? 'translate-x-5' : 'translate-x-1'}`} />
              </button>
            </div>
          </div>

          <div className="p-4 space-y-4">
            <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-3">
              {dialogueTypes.map((type) => (
                <button
                  key={type.id}
                  onClick={() => handleDialogueChange(type.id)}
                  className={`flex flex-col items-center justify-center p-3 rounded-lg border-2 transition-all duration-200 h-full ${
                    selectedDialogue === type.id
                      ? 'border-green-500 bg-green-50 text-green-700'
                      : 'border-slate-100 hover:border-green-200 hover:bg-slate-50'
                  }`}
                >
                  <span className="font-bold text-sm mb-1">{type.label}</span>
                  <span className="text-[10px] text-slate-500 text-center leading-tight">{type.desc}</span>
                </button>
              ))}
            </div>

            {isTextEditable && (
              <div className="mt-4 bg-green-50 p-4 rounded-lg border border-green-200">
                <label className="block text-xs font-bold text-green-800 mb-2 flex items-center gap-1">
                  <Edit3 className="w-3 h-3" />
                  生成に使用するセリフ（サンプル）を入力
                </label>
                <input
                  type="text"
                  value={customText}
                  onChange={(e) => setCustomText(e.target.value)}
                  placeholder="例：おはよう / おやすみ"
                  className="w-full px-3 py-2 border border-green-300 rounded focus:outline-none focus:ring-2 focus:ring-green-500 bg-white"
                />
                <p className="text-[10px] text-green-600 mt-1">※このテキストがプロンプトの「吹き出し」部分に反映されます。</p>
              </div>
            )}
          </div>
        </section>

        {/* Step 2: デザインテイスト */}
        <section className="bg-white rounded-xl shadow-sm border border-slate-200 overflow-hidden">
          <div className="bg-slate-100 p-4 border-b border-slate-200 flex items-center justify-between gap-2">
            <div className="flex items-center gap-2">
              <span className="bg-blue-600 text-white w-6 h-6 rounded-full flex items-center justify-center text-sm font-bold">2</span>
              <h2 className="font-bold text-lg">デザインテイスト</h2>
            </div>
            <span className="text-xs bg-blue-100 text-blue-700 px-2 py-1 rounded flex items-center gap-1">
              <Layers className="w-3 h-3" />
              複数選択可・組み合わせOK
            </span>
          </div>
          
          <div className="p-4 space-y-6">
            {designCategories.map((cat, idx) => (
              <div key={idx}>
                <h3 className="text-xs font-bold text-slate-400 uppercase tracking-wider mb-2 flex items-center gap-1">
                  <Palette className="w-3 h-3" />
                  {cat.name}
                </h3>
                <div className="flex flex-wrap gap-2">
                  {cat.items.map((item) => {
                    const isSelected = selectedDesigns.includes(item.id);
                    return (
                      <button
                        key={item.id}
                        onClick={() => handleDesignToggle(item.id)}
                        className={`px-4 py-2 rounded-full text-sm font-medium border transition-all ${
                          isSelected
                            ? 'bg-blue-600 text-white border-blue-600 shadow-md transform scale-105'
                            : 'bg-white text-slate-600 border-slate-200 hover:border-blue-300 hover:text-blue-600'
                        }`}
                      >
                        {item.label}
                        {isSelected && <Check className="inline-block w-3 h-3 ml-1" />}
                      </button>
                    );
                  })}
                </div>
              </div>
            ))}

            {selectedDesigns.includes('custom_original') && (
              <div className="bg-blue-50 p-4 rounded-lg border border-blue-200">
                <label className="block text-xs font-bold text-blue-800 mb-2 flex items-center gap-1">
                  <PenTool className="w-3 h-3" />
                  オリジナルデザインの詳細を入力
                </label>
                <textarea
                  value={customDesignPrompt}
                  onChange={(e) => setCustomDesignPrompt(e.target.value)}
                  placeholder="例：水彩画風で、全体的に青っぽい色使い、キラキラしたエフェクト多め (Watercolor style, blue color palette, lots of sparkle effects)"
                  className="w-full px-3 py-2 border border-blue-300 rounded focus:outline-none focus:ring-2 focus:ring-blue-500 bg-white h-24 text-sm"
                />
                <p className="text-[10px] text-blue-600 mt-1">
                  ※画材（水彩、油絵）、色使い（パステル、モノクロ）、雰囲気（レトロ、未来）などを詳しく入力してください。英語での入力がより精度が高くなります。
                </p>
              </div>
            )}
          </div>
        </section>

        {/* Step 3: 結果出力 */}
        <section className="bg-slate-800 text-slate-100 rounded-xl shadow-lg overflow-hidden border border-slate-700">
           <div className="p-4 bg-slate-900 border-b border-slate-700 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
            <div className="flex items-center gap-3">
              <Sparkles className="text-yellow-400 w-5 h-5" />
              <div>
                <h2 className="font-bold">生成されたプロンプト（日本語版）</h2>
                <p className="text-xs text-slate-400 mt-0.5">
                  選択中: <span className="text-green-400">{getDialogueLabel()}</span> × <span className="text-blue-400">{getDesignLabels()}</span>
                </p>
              </div>
            </div>
            <button
              onClick={handleCopy}
              className={`flex items-center gap-2 px-4 py-2 rounded font-bold transition-all ${
                copied
                  ? 'bg-green-500 text-white'
                  : 'bg-white text-slate-900 hover:bg-slate-200'
              }`}
            >
              {copied ? <Check className="w-4 h-4" /> : <Copy className="w-4 h-4" />}
              {copied ? 'コピーしました！' : 'コピーする'}
            </button>
          </div>
          
          <div className="p-6">
            <div className="bg-slate-950 p-4 rounded-lg font-mono text-sm leading-relaxed text-slate-300 border border-slate-800 break-all whitespace-pre-wrap">
              {generatedPrompt}
            </div>
            
            <div className="mt-4 flex flex-col gap-2 text-xs text-slate-400">
              <p className="flex items-center gap-2">
                <PenTool className="w-3 h-3" />
                <span>ヒント: 画像生成AI（DALL-E 3, Midjourneyなど）に入力してください。</span>
              </p>
              <p className="pl-5">
                ※「16種類の異なるスタンプデザイン、ステッカーシート形式」という指示が含まれています。1枚の画像に複数のバリエーションが生成されます。
              </p>
            </div>
          </div>
        </section>

      </main>
    </div>
  );
}
